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
      create: jest.fn(),
      update: jest.fn(),
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

describe('ListingsService.activate', () => {
  it.each(['pending', 'rejected', 'active'])(
    'rejects_activation_of_a_%s_listing',
    async (status) => {
      const prisma = makePrisma();
      (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
        ...listing,
        status,
      });

      const service = new ListingsService(prisma);

      await expect(service.activate('l1', 'owner-1')).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.listing.update).not.toHaveBeenCalled();
    },
  );

  it('activates_a_paused_listing', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      ...listing,
      status: 'paused',
    });

    const service = new ListingsService(prisma);
    await service.activate('l1', 'owner-1');

    expect(prisma.listing.update).toHaveBeenCalledWith({
      where: { id: 'l1' },
      data: { status: 'active' },
    });
  });
});

describe('ListingsService.pause', () => {
  it.each(['pending', 'rejected', 'paused'])(
    'rejects_pausing_a_%s_listing',
    async (status) => {
      const prisma = makePrisma();
      (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
        ...listing,
        status,
      });

      const service = new ListingsService(prisma);

      await expect(service.pause('l1', 'owner-1')).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.listing.update).not.toHaveBeenCalled();
    },
  );

  it('pauses_an_active_listing', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      ...listing,
      status: 'active',
    });

    const service = new ListingsService(prisma);
    await service.pause('l1', 'owner-1');

    expect(prisma.listing.update).toHaveBeenCalledWith({
      where: { id: 'l1' },
      data: { status: 'paused' },
    });
  });
});

describe('ListingsService deposit cap', () => {
  const createDto = {
    title: 'Sony A7 IV',
    category: 'Cameras' as const,
    country: 'PK',
    pricePerDay: 7_500,
    description: 'Full-frame body',
  };

  it('create_rejects_a_deposit_above_100_times_the_daily_price', async () => {
    const prisma = makePrisma();
    const service = new ListingsService(prisma);

    await expect(
      service.create('owner-1', { ...createDto, depositAmount: 750_001 }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.listing.create).not.toHaveBeenCalled();
  });

  it('update_checks_a_new_deposit_against_the_stored_daily_price', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      ...listing,
      pricePerDay: '25.00',
      depositAmount: '0.00',
    });
    const service = new ListingsService(prisma);

    await expect(
      service.update('l1', 'owner-1', { depositAmount: 2_501 }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.listing.update).not.toHaveBeenCalled();
  });

  it('update_accepts_a_deposit_within_the_cap', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      ...listing,
      pricePerDay: '7500.00',
      depositAmount: '0.00',
    });
    const service = new ListingsService(prisma);

    await service.update('l1', 'owner-1', { depositAmount: 75_000 });

    expect(prisma.listing.update).toHaveBeenCalledWith({
      where: { id: 'l1' },
      data: { depositAmount: 75_000 },
    });
  });
});
