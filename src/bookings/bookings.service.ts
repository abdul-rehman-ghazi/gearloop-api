import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { calculateBookingPricing } from './booking-pricing.util';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(renterId: string, dto: CreateBookingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });
    if (!listing) throw new NotFoundException('Listing not found');

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

    try {
      return await this.prisma.booking.create({
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
        },
      });
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

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  findByUser(renterId: string) {
    return this.prisma.booking.findMany({
      where: { renterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    await this.findById(id);

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
    }

    try {
      return await this.prisma.booking.update({
        where: { id },
        data: { status: dto.status },
      });
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
  }

  private isExclusionViolation(err: unknown): boolean {
    const meta = (err as { meta?: Record<string, unknown> })?.meta;
    const code =
      (meta?.code as string | undefined) ??
      (err as { code?: string })?.code;
    const message = (err as { message?: string })?.message ?? '';

    return (
      code === '23P01' ||
      message.includes('23P01') ||
      message.toLowerCase().includes('exclusion')
    );
  }
}
