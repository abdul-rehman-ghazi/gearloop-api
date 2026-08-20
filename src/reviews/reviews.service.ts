import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import type { ReviewDirection } from '../../generated/prisma/enums';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, bookingId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'completed') {
      throw new ConflictException('Booking is not completed');
    }

    const isRenter = booking.renterId === userId;
    const isOwner = booking.listing.ownerId === userId;
    if (!isRenter && !isOwner) {
      throw new ForbiddenException('You are not a party to this booking');
    }

    // Direction and reviewee are derived here, never taken from the client.
    const direction: ReviewDirection = isRenter
      ? 'renter_to_owner'
      : 'owner_to_renter';
    const revieweeId = isRenter ? booking.listing.ownerId : booking.renterId;

    // Pre-check for a friendly 409; the @@unique([bookingId, direction])
    // constraint is what actually makes it race-proof.
    const existing = await this.prisma.review.findUnique({
      where: { bookingId_direction: { bookingId, direction } },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this booking');
    }

    return this.prisma.review.create({
      data: {
        bookingId,
        authorId: userId,
        revieweeId,
        direction,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async findForBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not a party to this booking');
    }

    return this.prisma.review.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForListing(listingId: string) {
    // Reviews about the gear/owner are exactly the renter_to_owner rows on
    // bookings for this listing.
    const where = {
      direction: 'renter_to_owner' as ReviewDirection,
      booking: { listingId },
    };
    const [reviews, aggregate] = await Promise.all([
      this.prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } }),
      // Averaged live rather than denormalized onto Listing — no write-path
      // recalculation, no drift.
      this.prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      average: aggregate._avg.rating,
      count: aggregate._count.rating,
      reviews,
    };
  }

  async findForUser(revieweeId: string) {
    const where = { revieweeId };
    const [reviews, aggregate] = await Promise.all([
      this.prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      average: aggregate._avg.rating,
      count: aggregate._count.rating,
      reviews,
    };
  }
}
