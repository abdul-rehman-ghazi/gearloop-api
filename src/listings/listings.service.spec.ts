import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    booking: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    blackout: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  } as unknown as PrismaService;
}

const listing = {
  id: 'l1',
  ownerId: 'owner-1',
  deletedAt: null,
};

describe('ListingsService.createBlackout', () => {
  const dto = { startDate: '2026-09-01', endDate: '2026-09-05' };

  it('rejects a non-owner', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);

    const service = new ListingsService(prisma);
    await expect(
      service.createBlackout('l1', 'someone-else', dto),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.blackout.create).not.toHaveBeenCalled();
  });

  it('rejects when endDate is not after startDate', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);

    const service = new ListingsService(prisma);
    await expect(
      service.createBlackout('l1', 'owner-1', {
        startDate: '2026-09-05',
        endDate: '2026-09-01',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects dates that overlap a confirmed booking', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.booking.findFirst as jest.Mock).mockResolvedValue({ id: 'b1' });

    const service = new ListingsService(prisma);
    await expect(service.createBlackout('l1', 'owner-1', dto)).rejects.toThrow(
      ConflictException,
    );

    expect(prisma.blackout.create).not.toHaveBeenCalled();
  });

  it('creates the blackout when the owner and dates are valid', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.blackout.create as jest.Mock).mockResolvedValue({ id: 'bo1' });

    const service = new ListingsService(prisma);
    const result = await service.createBlackout('l1', 'owner-1', dto);

    expect(result).toEqual({ id: 'bo1' });
    expect(prisma.blackout.create).toHaveBeenCalledWith({
      data: {
        listingId: 'l1',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: undefined,
      },
    });
  });
});

describe('ListingsService.removeBlackout', () => {
  it('rejects a non-owner', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);

    const service = new ListingsService(prisma);
    await expect(
      service.removeBlackout('l1', 'bo1', 'someone-else'),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.blackout.deleteMany).not.toHaveBeenCalled();
  });

  it('scopes the delete to the given listing', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);

    const service = new ListingsService(prisma);
    await service.removeBlackout('l1', 'bo1', 'owner-1');

    expect(prisma.blackout.deleteMany).toHaveBeenCalledWith({
      where: { id: 'bo1', listingId: 'l1' },
    });
  });
});

describe('ListingsService.getBookedRanges', () => {
  it('merges confirmed bookings and blackouts', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.booking.findMany as jest.Mock).mockResolvedValue([
      { startDate: new Date('2026-09-01'), endDate: new Date('2026-09-03') },
    ]);
    (prisma.blackout.findMany as jest.Mock).mockResolvedValue([
      { startDate: new Date('2026-10-01'), endDate: new Date('2026-10-05') },
    ]);

    const service = new ListingsService(prisma);
    const ranges = await service.getBookedRanges('l1');

    expect(ranges).toHaveLength(2);
  });

  it('404s for a missing listing', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new ListingsService(prisma);
    await expect(service.getBookedRanges('missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
