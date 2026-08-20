import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DisputesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
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

    const [dispute] = await this.prisma.$transaction([
      this.prisma.dispute.create({
        data: { bookingId: dto.bookingId, detail: dto.detail },
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
      dto.detail,
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

    if (dto.status === 'resolved' && dispute.booking.status !== 'cancelled') {
      const [updated] = await this.prisma.$transaction([
        this.prisma.dispute.update({
          where: { id },
          data: { status: dto.status },
        }),
        this.prisma.booking.update({
          where: { id: dispute.bookingId },
          data: { payoutStatus: 'pending' },
        }),
      ]);
      await this.notifyResolved(dispute);
      return updated;
    }

    const updated = await this.prisma.dispute.update({
      where: { id },
      data: { status: dto.status },
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
