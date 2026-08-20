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
}
