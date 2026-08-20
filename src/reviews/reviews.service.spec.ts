import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    booking: {
      findUnique: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      aggregate: jest.fn(),
    },
  } as unknown as PrismaService;
}

const completedBooking = {
  id: 'b1',
  status: 'completed',
  renterId: 'renter-1',
  listingId: 'l1',
  listing: { id: 'l1', ownerId: 'owner-1' },
};

describe('ReviewsService.create', () => {
  it('records a renter_to_owner review when the caller is the renter', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.review.create as jest.Mock).mockResolvedValue({ id: 'r1' });

    const service = new ReviewsService(prisma);
    const result = await service.create('renter-1', 'b1', {
      rating: 5,
      comment: 'Great gear',
    });

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'b1',
        authorId: 'renter-1',
        revieweeId: 'owner-1',
        direction: 'renter_to_owner',
        rating: 5,
        comment: 'Great gear',
      },
    });
    expect(result).toEqual({ id: 'r1' });
  });

  it('records an owner_to_renter review when the caller is the listing owner', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.review.create as jest.Mock).mockResolvedValue({ id: 'r2' });

    const service = new ReviewsService(prisma);
    await service.create('owner-1', 'b1', { rating: 4 });

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'b1',
        authorId: 'owner-1',
        revieweeId: 'renter-1',
        direction: 'owner_to_renter',
        rating: 4,
        comment: undefined,
      },
    });
  });

  it('404s when the booking does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new ReviewsService(prisma);
    await expect(
      service.create('renter-1', 'nope', { rating: 5 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('409s when the booking is not completed', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...completedBooking,
      status: 'confirmed',
    });

    const service = new ReviewsService(prisma);
    await expect(
      service.create('renter-1', 'b1', { rating: 5 }),
    ).rejects.toThrow(ConflictException);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('403s when the caller is not a party to the booking', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );

    const service = new ReviewsService(prisma);
    await expect(
      service.create('stranger-1', 'b1', { rating: 5 }),
    ).rejects.toThrow(ForbiddenException);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('409s when this side has already reviewed the booking', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findUnique as jest.Mock).mockResolvedValue({ id: 'r1' });

    const service = new ReviewsService(prisma);
    await expect(
      service.create('renter-1', 'b1', { rating: 5 }),
    ).rejects.toThrow(ConflictException);
    expect(prisma.review.findUnique).toHaveBeenCalledWith({
      where: {
        bookingId_direction: {
          bookingId: 'b1',
          direction: 'renter_to_owner',
        },
      },
    });
    expect(prisma.review.create).not.toHaveBeenCalled();
  });
});
