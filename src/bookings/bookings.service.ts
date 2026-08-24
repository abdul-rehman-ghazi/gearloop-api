import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { calculateBookingPricing } from './booking-pricing.util';
import { calculateRefund } from './booking-cancellation.util';
import { blockingBooking } from './booking-availability.util';
import { NotificationsService } from '../notifications/notifications.service';
import { chargeCurrency } from '../common/country-currency';
import { Prisma } from '../../generated/prisma/client';
import type {
  BookingStatus,
  CancellationPolicy,
} from '../../generated/prisma/enums';

const RENTER_SELECT = { id: true, name: true, initials: true } as const;

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(renterId: string, dto: CreateBookingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });
    if (!listing || listing.deletedAt) {
      throw new NotFoundException('Listing not found');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    // Application-level pre-check against confirmed bookings only, matching
    // the scope of the future btree_gist EXCLUDE constraint. Two overlapping
    // *pending* bookings can coexist until one is accepted — that's
    // intentional, not a bug.
    await this.assertNoActiveOverlap(dto.listingId, start, end);

    const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    const { subtotal, serviceFee, tax, total } = calculateBookingPricing(
      listing.pricePerDay,
      nights,
    );
    const depositAmount = new Prisma.Decimal(listing.depositAmount ?? 0);
    const currency = chargeCurrency(listing.country);

    try {
      const booking = await this.prisma.booking.create({
        data: {
          listingId: dto.listingId,
          renterId,
          pickupMethod: dto.pickupMethod,
          startDate: start,
          endDate: end,
          pricePerDayAtBooking: listing.pricePerDay,
          nights,
          subtotal,
          serviceFee,
          tax,
          total,
          currency,
          depositAmount,
        },
        include: { renter: { select: RENTER_SELECT } },
      });

      await this.notifications.notify(
        listing.ownerId,
        'booking_requested',
        `New booking request for ${listing.title}`,
        `Request ${booking.requestNumber} is awaiting your response.`,
        `/bookings/${booking.id}`,
      );

      return booking;
    } catch (err) {
      // The pre-check above eliminates the vast majority of overlaps, but
      // it can't close the race between two concurrent requests that both
      // pass the check before either insert commits. Once the btree_gist
      // EXCLUDE constraint exists in the DB, Postgres raises a 23P01
      // (exclusion_violation) for the loser of that race — Prisma has no
      // dedicated typed error code for it, so we check defensively across
      // the shapes different Prisma versions surface it in.
      if (this.isExclusionViolation(err)) {
        throw new ConflictException(
          'Listing is not available for the selected dates',
        );
      }
      throw err;
    }
  }

  // `dispute` is here for the deposit-release decision in updateStatus:
  // a clean return releases, a disputed one keeps the money held. Used
  // internally by updateStatus, which needs the raw row, not the
  // presentational refundQuote below.
  private async getBookingOrThrow(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        listing: true,
        renter: { select: RENTER_SELECT },
        dispute: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findById(id: string) {
    const booking = await this.getBookingOrThrow(id);
    return { ...booking, refundQuote: this.quoteRefund(booking) };
  }

  async findByUser(renterId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { renterId },
      include: { listing: true, renter: { select: RENTER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map((b) => ({ ...b, refundQuote: this.quoteRefund(b) }));
  }

  async findByOwner(ownerId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { listing: { ownerId } },
      include: { listing: true, renter: { select: RENTER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map((b) => ({ ...b, refundQuote: this.quoteRefund(b) }));
  }

  // What the renter would get back if they cancelled this booking right
  // now. Quoted from the renter's side since that's the only party the UI
  // shows a "Cancel booking" affordance to; owner cancels always refund in
  // full regardless of this number.
  private quoteRefund(booking: {
    status: BookingStatus;
    total: Prisma.Decimal;
    startDate: Date;
    listing: { cancellationPolicy: CancellationPolicy };
  }): Prisma.Decimal | null {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return null;
    }
    return calculateRefund({
      policy: booking.listing.cancellationPolicy,
      total: booking.total,
      startDate: booking.startDate,
      status: booking.status,
      cancelledBy: 'renter',
    });
  }

  async updateStatus(id: string, userId: string, dto: UpdateBookingStatusDto) {
    const existing = await this.getBookingOrThrow(id);
    if (existing.renterId !== userId && existing.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not a party to this booking');
    }

    // Ruling 6: completing a booking is what releases the deposit, so
    // leaving this open to the renter would let them release their own
    // deposit before the owner has looked at the gear. Money-security
    // boundary, not polish.
    if (dto.status === 'completed' && existing.listing.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can complete a booking');
    }

    // A completed or already-cancelled booking has no further transition —
    // without this, re-cancelling a cancelled row (or cancelling a
    // completed one) would refund/release money a second time.
    if (
      dto.status === 'cancelled' &&
      (existing.status === 'completed' || existing.status === 'cancelled')
    ) {
      throw new ConflictException(
        `Cannot cancel a booking that is already ${existing.status}`,
      );
    }

    if (dto.status === 'confirmed') {
      if (existing.listing.ownerId !== userId) {
        throw new ForbiddenException('Only the owner can accept a booking');
      }
      if (existing.status !== 'pending') {
        throw new ConflictException(
          `Cannot accept a booking that is ${existing.status}`,
        );
      }
      await this.assertNoActiveOverlap(
        existing.listingId,
        existing.startDate,
        existing.endDate,
        id,
      );

      const updated = await this.prisma.booking.update({
        where: { id },
        data: {
          status: 'confirmed',
          ...(existing.depositAmount.gt(0) && {
            depositStatus: 'held' as const,
          }),
        },
      });

      await this.notifications.notify(
        existing.renterId,
        'booking_confirmed',
        `Your booking for ${existing.listing.title} is confirmed`,
        `${existing.listing.title} has been accepted. Booking ${existing.requestNumber} is confirmed.`,
        `/bookings/${id}`,
      );

      return updated;
    }

    const cancelledBy =
      dto.status === 'cancelled'
        ? existing.renterId === userId
          ? ('renter' as const)
          : ('owner' as const)
        : undefined;

    const refundAmount =
      dto.status === 'cancelled'
        ? calculateRefund({
            policy: existing.listing.cancellationPolicy,
            total: existing.total,
            startDate: existing.startDate,
            status: existing.status,
            cancelledBy: cancelledBy!,
          })
        : undefined;

    // Ruling 7: "clean return" == completed with no dispute on the booking.
    // A cancellation always releases. Anything else leaves the deposit
    // alone.
    const releasesDeposit =
      existing.depositStatus === 'held' &&
      (dto.status === 'cancelled' ||
        (dto.status === 'completed' && !existing.dispute));

    try {
      const updated = await this.prisma.booking.update({
        where: { id },
        data: {
          status: dto.status,
          ...(releasesDeposit && { depositStatus: 'released' as const }),
          ...(dto.status === 'cancelled' && {
            cancelledAt: new Date(),
            cancelledBy,
            cancellationReason: dto.reason,
            refundAmount,
          }),
        },
      });

      if (dto.status === 'cancelled') {
        // Notify whichever party didn't cancel — a renter cancelling
        // otherwise never tells the owner their gear is free again.
        const recipientId =
          cancelledBy === 'renter'
            ? existing.listing.ownerId
            : existing.renterId;
        const refundNote =
          cancelledBy === 'owner' && !refundAmount!.isZero()
            ? ` You'll be refunded ${existing.currency} ${refundAmount!.toString()}.`
            : '';
        await this.notifications.notify(
          recipientId,
          'booking_cancelled',
          `Your booking for ${existing.listing.title} was cancelled`,
          `Booking ${existing.requestNumber} was cancelled.${refundNote}`,
          `/bookings/${id}`,
        );
      }

      if (releasesDeposit) {
        await this.notifications.notify(
          existing.renterId,
          'deposit_released',
          `Your security deposit for ${existing.listing.title} was released`,
          `Your deposit for booking ${existing.requestNumber} has been refunded.`,
          `/bookings/${id}`,
        );
      }

      return updated;
    } catch (err) {
      if (this.isExclusionViolation(err)) {
        throw new ConflictException(
          'Listing is not available for the selected dates',
        );
      }
      throw err;
    }
  }

  private async assertNoActiveOverlap(
    listingId: string,
    start: Date,
    end: Date,
    excludeBookingId?: string,
  ) {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        listingId,
        deletedAt: null,
        ...blockingBooking(),
        startDate: { lt: end },
        endDate: { gt: start },
        ...(excludeBookingId && { id: { not: excludeBookingId } }),
      },
    });
    if (conflict) {
      throw new ConflictException(
        'Listing is not available for the selected dates',
      );
    }

    const blackout = await this.prisma.blackout.findFirst({
      where: {
        listingId,
        startDate: { lt: end },
        endDate: { gt: start },
      },
    });
    if (blackout) {
      throw new ConflictException(
        'Listing is not available for the selected dates',
      );
    }
  }

  private isExclusionViolation(err: unknown): boolean {
    const meta = (err as { meta?: Record<string, unknown> })?.meta;
    const code =
      (meta?.code as string | undefined) ?? (err as { code?: string })?.code;
    const message = (err as { message?: string })?.message ?? '';

    return (
      code === '23P01' ||
      message.includes('23P01') ||
      message.toLowerCase().includes('exclusion')
    );
  }
}
