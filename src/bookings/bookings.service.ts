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
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
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
    private readonly payments: PaymentsService,
  ) {}

  async create(renterId: string, dto: CreateBookingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });
    if (!listing || listing.deletedAt) {
      throw new NotFoundException('Listing not found');
    }

    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: dto.paymentMethodId },
    });
    if (!paymentMethod || paymentMethod.userId !== renterId) {
      throw new NotFoundException('Payment method not found');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    // Application-level pre-check against confirmed bookings only, matching
    // the scope of the future btree_gist EXCLUDE constraint (WHERE status =
    // 'confirmed'). Two overlapping *pending* bookings can coexist until one
    // is confirmed — that's intentional, not a bug.
    await this.assertNoConfirmedOverlap(dto.listingId, start, end);

    const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    const { subtotal, serviceFee, tax, total } = calculateBookingPricing(
      listing.pricePerDay,
      nights,
    );

    // Ruling 5: no booking row exists without a successful auth-hold, the
    // same way no booking row exists when the availability check fails.
    let paymentIntentId: string;
    try {
      paymentIntentId = await this.payments.authorize(
        paymentMethod.processorPaymentMethodId,
        total,
      );
    } catch (err) {
      // Stripe tags every error it raises with a `type` string;
      // StripeCardError is the decline/insufficient-funds/SCA-refused family.
      // Checking the string rather than `instanceof Stripe.errors.*` keeps
      // this file free of a `stripe` import and works under jest.mock.
      // Stripe's own message is deliberately not surfaced verbatim, to avoid
      // leaking processor detail to the client.
      if ((err as { type?: string })?.type === 'StripeCardError') {
        throw new BadRequestException('Card was declined');
      }
      // Anything else (network, bad API key, Stripe outage) is not the
      // renter's fault and is not translated — it surfaces as a 500.
      throw err;
    }

    // Ruling 2: snapshot the listing's deposit onto the booking. `?? 0`
    // covers listings written before this column existed.
    const depositAmount = new Prisma.Decimal(listing.depositAmount ?? 0);

    // Ruling 3: the deposit is a SECOND hold, placed here rather than at
    // confirm so there is one card interaction and one failure path. It is
    // never captured on confirm — it stays authorized until the return.
    //
    // ponytail: a Stripe auth-hold lapses after roughly 7 days, so a deposit
    // for a booking that starts three weeks out will have expired before the
    // handover. Upgrade path when this bites: a scheduled job that
    // re-authorizes before the start date, or `extended_authorization` on the
    // card networks that support it. Both need a scheduler this codebase
    // does not have yet.
    let depositIntentId: string | null = null;
    if (depositAmount.gt(0)) {
      try {
        depositIntentId = await this.payments.authorize(
          paymentMethod.processorPaymentMethodId,
          depositAmount,
        );
      } catch (err) {
        // The rental hold succeeded moments ago and this booking is not
        // going to exist. Release it or the renter is left with an orphaned
        // hold. Best-effort: the original error is what the caller needs.
        await this.payments.release(paymentIntentId).catch(() => {});
        if ((err as { type?: string })?.type === 'StripeCardError') {
          throw new BadRequestException('Card was declined');
        }
        throw err;
      }
    }

    try {
      const booking = await this.prisma.booking.create({
        data: {
          listingId: dto.listingId,
          renterId,
          paymentMethodId: dto.paymentMethodId,
          pickupMethod: dto.pickupMethod,
          startDate: start,
          endDate: end,
          pricePerDayAtBooking: listing.pricePerDay,
          nights,
          subtotal,
          serviceFee,
          tax,
          total,
          paymentIntentId,
          depositAmount,
          depositIntentId,
          depositStatus: depositIntentId ? 'held' : null,
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

      // The booking row never got written — release the hold we just placed
      // so the renter's card isn't held against a booking that doesn't exist.
      // Best-effort: if the release itself fails, we still need to report the
      // original error to the caller, not this cleanup failure. Same for the
      // deposit hold, if one was placed.
      await this.payments.release(paymentIntentId).catch(() => {});
      if (depositIntentId) {
        await this.payments.release(depositIntentId).catch(() => {});
      }

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
    // completed one) would release/refund a PaymentIntent a second time.
    if (
      dto.status === 'cancelled' &&
      (existing.status === 'completed' || existing.status === 'cancelled')
    ) {
      throw new ConflictException(
        `Cannot cancel a booking that is already ${existing.status}`,
      );
    }

    if (dto.status === 'confirmed') {
      const booking = await this.prisma.booking.findUniqueOrThrow({
        where: { id },
      });
      await this.assertNoConfirmedOverlap(
        booking.listingId,
        booking.startDate,
        booking.endDate,
        id,
      );

      // Ruling 5: the capture must succeed before the row moves to
      // confirmed. A throw here means no status update and no notification.
      try {
        if (!existing.paymentIntentId) {
          throw new Error('booking has no payment intent to capture');
        }
        await this.payments.capture(existing.paymentIntentId);
      } catch (err) {
        throw new ConflictException('Payment could not be captured', {
          cause: err,
        });
      }
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

    if (dto.status === 'cancelled') {
      // release() figures out cancel-vs-refund from the intent's own status.
      // A zero-refund tier leaves the already-captured funds untouched —
      // no Stripe call at all.
      try {
        if (!existing.paymentIntentId) {
          throw new Error('booking has no payment intent to release');
        }
        if (!refundAmount!.isZero()) {
          if (refundAmount!.equals(existing.total)) {
            await this.payments.release(existing.paymentIntentId);
          } else {
            await this.payments.release(existing.paymentIntentId, refundAmount);
          }
        }
      } catch (err) {
        throw new ConflictException('Payment could not be released', {
          cause: err,
        });
      }
    }

    // Ruling 7: "clean return" == completed with no dispute on the booking.
    // A cancellation always releases. Anything else leaves the hold alone.
    const releasesDeposit =
      existing.depositStatus === 'held' &&
      (dto.status === 'cancelled' ||
        (dto.status === 'completed' && !existing.dispute));

    if (releasesDeposit) {
      try {
        if (!existing.depositIntentId) {
          throw new Error('booking has no deposit intent to release');
        }
        await this.payments.release(existing.depositIntentId);
      } catch (err) {
        throw new ConflictException('Deposit could not be released', {
          cause: err,
        });
      }
    }

    // `paid` is never written here: the capture above moves funds into the
    // platform's Stripe balance, so `pending` truthfully means "captured,
    // awaiting a payout job". The payout job itself is out of scope
    // (Ruling 2) and is what will eventually write `paid`.
    const payoutStatus =
      dto.status === 'confirmed'
        ? 'pending'
        : dto.status === 'cancelled'
          ? null
          : undefined;

    try {
      const updated = await this.prisma.booking.update({
        where: { id },
        data: {
          status: dto.status,
          ...(payoutStatus !== undefined && { payoutStatus }),
          ...(releasesDeposit && { depositStatus: 'released' as const }),
          ...(dto.status === 'cancelled' && {
            cancelledAt: new Date(),
            cancelledBy,
            cancellationReason: dto.reason,
            refundAmount,
          }),
        },
      });

      if (dto.status === 'confirmed') {
        await this.notifications.notify(
          existing.renterId,
          'booking_confirmed',
          `Your booking for ${existing.listing.title} is confirmed`,
          `Booking ${existing.requestNumber} is confirmed.`,
          `/bookings/${id}`,
        );
      }

      if (dto.status === 'cancelled') {
        // Notify whichever party didn't cancel — a renter cancelling
        // otherwise never tells the owner their gear is free again.
        const recipientId =
          cancelledBy === 'renter'
            ? existing.listing.ownerId
            : existing.renterId;
        const refundNote =
          cancelledBy === 'owner'
            ? ` You'll be refunded $${refundAmount!.toString()}.`
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
          `The hold on your card for booking ${existing.requestNumber} has been released.`,
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

  private async assertNoConfirmedOverlap(
    listingId: string,
    start: Date,
    end: Date,
    excludeBookingId?: string,
  ) {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        listingId,
        status: 'confirmed',
        deletedAt: null,
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
