import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Prisma } from '../../generated/prisma/client';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class DisputesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly payments: PaymentsService,
  ) {}

  async create(userId: string, dto: CreateDisputeDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not a party to this booking');
    }

    const existing = await this.prisma.dispute.findUnique({
      where: { bookingId: dto.bookingId },
    });
    if (existing) {
      throw new ConflictException('A dispute already exists for this booking');
    }

    // Ruling 5/6: a claim is the same Dispute row with money attached, and
    // only the owner has damage to claim. A claimless dispute keeps the
    // existing either-party rule untouched.
    if (dto.claimAmount !== undefined) {
      if (booking.listing.ownerId !== userId) {
        throw new ForbiddenException(
          'Only the owner can claim against the deposit',
        );
      }
      // One check covers "no deposit was ever taken", "already released"
      // and "already claimed".
      if (booking.depositStatus !== 'held') {
        throw new ConflictException('No deposit is held for this booking');
      }
      if (new Prisma.Decimal(dto.claimAmount).gt(booking.depositAmount)) {
        throw new BadRequestException('Claim exceeds the deposit held');
      }
    }

    const [dispute] = await this.prisma.$transaction([
      this.prisma.dispute.create({
        data: {
          bookingId: dto.bookingId,
          detail: dto.detail,
          claimAmount: dto.claimAmount,
        },
      }),
      this.prisma.booking.update({
        where: { id: dto.bookingId },
        data: { payoutStatus: 'on_hold' },
      }),
    ]);

    // The other party to the booking — never the filer.
    const recipientId =
      userId === booking.renterId ? booking.listing.ownerId : booking.renterId;
    await this.notifications.notify(
      recipientId,
      'dispute_filed',
      `A dispute was filed for booking ${booking.requestNumber}`,
      dto.claimAmount !== undefined
        ? `A claim of ${dto.claimAmount} against your deposit: ${dto.detail}`
        : dto.detail,
      `/disputes/${dispute.id}`,
    );

    return dispute;
  }

  async findAllForUser(userId: string) {
    return this.prisma.dispute.findMany({
      where: {
        booking: {
          OR: [{ renterId: userId }, { listing: { ownerId: userId } }],
        },
      },
      include: { booking: true },
    });
  }

  async findById(id: string, userId?: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: { booking: { include: { listing: true } } },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (
      userId &&
      dispute.booking.renterId !== userId &&
      dispute.booking.listing.ownerId !== userId
    ) {
      throw new ForbiddenException('You are not a party to this dispute');
    }
    return dispute;
  }

  async updateStatus(id: string, dto: UpdateDisputeStatusDto) {
    const dispute = await this.findById(id);

    // Money moves before the row changes: a Stripe failure must leave the
    // dispute unresolved rather than marked resolved with the funds stuck.
    let depositStatus: 'released' | 'claimed' | 'partially_claimed' | undefined;

    if (dto.status === 'resolved' && dispute.claimAmount != null) {
      const awarded = new Prisma.Decimal(dto.resolvedAmount ?? 0);
      if (awarded.gt(dispute.claimAmount)) {
        throw new BadRequestException('Resolution exceeds the amount claimed');
      }

      try {
        if (!dispute.booking.depositIntentId) {
          throw new Error('booking has no deposit intent to settle');
        }
        if (awarded.gt(0)) {
          // Partial capture: Stripe releases the uncaptured remainder to the
          // renter automatically, which is the partially_claimed semantic.
          await this.payments.capture(dispute.booking.depositIntentId, awarded);
          depositStatus = awarded.equals(dispute.booking.depositAmount)
            ? 'claimed'
            : 'partially_claimed';
        } else {
          // Ruling 8: silence means no damage awarded — the safe default for
          // the party who isn't in the room.
          await this.payments.release(dispute.booking.depositIntentId);
          depositStatus = 'released';
        }
      } catch (err) {
        throw new ConflictException('Deposit could not be claimed', {
          cause: err,
        });
      }
    } else if (
      dto.resolvedAmount !== undefined &&
      dispute.claimAmount == null
    ) {
      throw new BadRequestException('This dispute has no claim to resolve');
    }

    // `payoutStatus: 'pending'` only applies when the booking isn't
    // cancelled (a cancelled booking never pays out); `depositStatus` is
    // written whenever this resolution settled a claim, regardless.
    const bookingWrite = {
      ...(dto.status === 'resolved' &&
        dispute.booking.status !== 'cancelled' && {
          payoutStatus: 'pending' as const,
        }),
      ...(depositStatus && { depositStatus }),
    };

    const updated = await this.prisma.$transaction(async (tx) => {
      const d = await tx.dispute.update({
        where: { id },
        data: { status: dto.status, resolvedAmount: dto.resolvedAmount },
      });
      if (Object.keys(bookingWrite).length > 0) {
        await tx.booking.update({
          where: { id: dispute.bookingId },
          data: bookingWrite,
        });
      }
      return d;
    });

    if (dto.status === 'resolved') {
      await this.notifyResolved(dispute);
    }

    return updated;
  }

  async findAllForAdmin() {
    const disputes = await this.prisma.dispute.findMany({
      include: {
        booking: {
          include: { renter: true, listing: { include: { owner: true } } },
        },
      },
      orderBy: { booking: { createdAt: 'desc' } },
    });
    return disputes.map((d) => this.sanitizeForAdmin(d));
  }

  async findByIdForAdmin(id: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: {
          include: { renter: true, listing: { include: { owner: true } } },
        },
      },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    return this.sanitizeForAdmin(dispute);
  }

  // Both parties get told, since either could have filed it.
  private async notifyResolved(dispute: {
    id: string;
    booking: {
      requestNumber: string;
      renterId: string;
      listing: { ownerId: string };
    };
  }) {
    const title = `The dispute for booking ${dispute.booking.requestNumber} was resolved`;
    const body = `The dispute for booking ${dispute.booking.requestNumber} has been marked resolved.`;
    const link = `/disputes/${dispute.id}`;

    await this.notifications.notify(
      dispute.booking.renterId,
      'dispute_resolved',
      title,
      body,
      link,
    );
    await this.notifications.notify(
      dispute.booking.listing.ownerId,
      'dispute_resolved',
      title,
      body,
      link,
    );
  }

  private sanitizeForAdmin<
    T extends {
      booking: {
        renter: { passwordHash: string; [key: string]: unknown };
        listing: {
          owner: { passwordHash: string; [key: string]: unknown };
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };
      [key: string]: unknown;
    },
  >(dispute: T) {
    const { renter, listing, ...bookingRest } = dispute.booking;
    const { owner, ...listingRest } = listing;
    const { passwordHash: _renterHash, ...renterRest } = renter;
    const { passwordHash: _ownerHash, ...ownerRest } = owner;
    return {
      ...dispute,
      booking: {
        ...bookingRest,
        renter: renterRest,
        listing: { ...listingRest, owner: ownerRest },
      },
    };
  }
}
