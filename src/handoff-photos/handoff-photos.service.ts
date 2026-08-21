import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHandoffPhotoDto } from './dto/create-handoff-photo.dto';

// Enough for an honest four-angle walkaround with room to spare; low enough
// that a party in a fight can't write ten thousand rows against a booking.
const PHOTO_LIMIT = 20;

@Injectable()
export class HandoffPhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, bookingId: string, dto: CreateHandoffPhotoDto) {
    const booking = await this.assertParty(bookingId, userId);

    // There is no picked_up/returned booking state in this schema (that's
    // Tier 3, item 12), so `confirmed` is the whole rental window and both
    // handovers sit at its ends. A pending or cancelled booking has no
    // handover at all.
    if (dto.stage === 'pickup' && booking.status !== 'confirmed') {
      throw new ConflictException(
        'Pickup photos can only be added while the booking is confirmed',
      );
    }

    // Return photos stay open on a completed booking: the owner is the one
    // who marks it completed, usually the moment the gear is back, and a
    // renter who photographs the drop-off must not be locked out by the
    // counterparty's click.
    //
    // ponytail: that window never closes — a party can add "return" photos
    // to a booking completed six months ago. Upgrade path when it matters:
    // an N-hour cutoff after the completion timestamp, or item 12's real
    // returned lifecycle state, which gives an actual event to measure from.
    if (
      dto.stage === 'returned' &&
      booking.status !== 'confirmed' &&
      booking.status !== 'completed'
    ) {
      throw new ConflictException(
        'Return photos can only be added once the booking is confirmed',
      );
    }

    const count = await this.prisma.handoffPhoto.count({
      where: { bookingId, uploaderId: userId, stage: dto.stage },
    });
    if (count >= PHOTO_LIMIT) {
      throw new ConflictException('Photo limit reached for this handoff');
    }

    // uploaderId is the JWT subject, never the body; createdAt is the
    // column default. Both are what make the row evidence rather than a
    // claim about a row.
    return this.prisma.handoffPhoto.create({
      data: {
        bookingId,
        uploaderId: userId,
        stage: dto.stage,
        url: dto.url,
        note: dto.note,
      },
    });
  }

  async findForBooking(bookingId: string, userId: string) {
    const booking = await this.assertParty(bookingId, userId);

    const photos = await this.prisma.handoffPhoto.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });

    // Both parties see everything: a renter who can't see the photos being
    // used to claim against their deposit can't answer them. `role` is
    // derived here, the same way Message derives sender-side from senderId.
    return photos.map((photo) => ({
      ...photo,
      role: photo.uploaderId === booking.renterId ? 'renter' : 'owner',
    }));
  }

  private async assertParty(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not a party to this booking');
    }
    return booking;
  }
}
