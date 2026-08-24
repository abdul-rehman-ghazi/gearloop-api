import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
    blackout: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

describe('BookingsService.create', () => {
  const listing = {
    id: 'l1',
    title: 'Canon R5',
    ownerId: 'owner-1',
    pricePerDay: 100,
    country: 'ZA',
    depositAmount: new Prisma.Decimal(0),
    deletedAt: null,
  };
  const dto = {
    listingId: 'l1',
    pickupMethod: 'pickup' as const,
    startDate: '2026-09-01',
    endDate: '2026-09-03',
  };

  it('creates a pending booking and notifies the owner', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications);
    await service.create('renter-1', dto);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          currency: 'ZAR',
          depositAmount: expect.anything(),
        }),
      }),
    );
    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'booking_requested',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
      '/bookings/b1',
    );
  });

  it('snapshots pricing and currency', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      ...listing,
      country: 'GB',
      depositAmount: new Prisma.Decimal(50),
    });
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications);
    await service.create('renter-1', dto);

    const [{ data }] = (prisma.booking.create as jest.Mock).mock
      .calls[0] as unknown as [
      {
        data: {
          total: Prisma.Decimal;
          currency: string;
          depositAmount: Prisma.Decimal;
        };
      },
    ];
    // 2 nights at 100 => subtotal 200, fee 20, tax 17.60, total 237.60
    expect(data.total.toString()).toBe('237.6');
    expect(data.currency).toBe('GBP');
    expect(data.depositAmount.toString()).toBe('50');
  });

  it('rejects a new booking that overlaps a blackout', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.blackout.findFirst as jest.Mock).mockResolvedValue({
      id: 'bo1',
      listingId: 'l1',
    });

    const service = new BookingsService(prisma, notifications);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Listing is not available for the selected dates',
    );
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('rejects an overlap against a confirmed booking', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.booking.findFirst as jest.Mock).mockResolvedValue({
      id: 'other',
      status: 'confirmed',
    });

    const service = new BookingsService(prisma, notifications);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      ConflictException,
    );
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });
});

describe('BookingsService.updateStatus: pending -> confirmed', () => {
  const pendingBooking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    status: 'pending',
    depositStatus: null,
    depositAmount: new Prisma.Decimal(0),
    total: new Prisma.Decimal(150),
    currency: 'ZAR',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    dispute: null,
    listing: {
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      cancellationPolicy: 'moderate',
    },
  };

  function arrange(overrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const booking = { ...pendingBooking, ...overrides };
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'confirmed',
    });
    return { prisma, notifications };
  }

  it('lets the owner accept a pending booking, confirming it directly', async () => {
    const { prisma, notifications } = arrange();

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'confirmed' });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'confirmed' }),
      }),
    );
    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'booking_confirmed',
      expect.any(String),
      expect.any(String),
      '/bookings/b1',
    );
  });

  it('holds the deposit when accepting a booking with a deposit', async () => {
    const { prisma, notifications } = arrange({
      depositAmount: new Prisma.Decimal(75),
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'confirmed' });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'held' }),
      }),
    );
  });

  it('refuses the renter accepting their own booking', async () => {
    const { prisma, notifications } = arrange();

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'confirmed' }),
    ).rejects.toThrow(ForbiddenException);
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('rejects accepting a booking that already moved past pending', async () => {
    const { prisma, notifications } = arrange({ status: 'confirmed' });

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'owner-1', { status: 'confirmed' }),
    ).rejects.toThrow(ConflictException);
  });
});

describe('BookingsService.updateStatus cancellation refunds', () => {
  function hoursFromNow(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  function confirmedBooking(overrides: Record<string, unknown> = {}) {
    return {
      id: 'b1',
      requestNumber: 'GL-1',
      listingId: 'l1',
      renterId: 'renter-1',
      status: 'confirmed',
      depositStatus: null,
      depositAmount: new Prisma.Decimal(0),
      currency: 'ZAR',
      total: new Prisma.Decimal(200),
      startDate: hoursFromNow(200),
      endDate: new Date(Date.now() + 210 * 60 * 60 * 1000),
      dispute: null,
      listing: {
        id: 'l1',
        title: 'Canon R5',
        ownerId: 'owner-1',
        cancellationPolicy: 'strict',
      },
      ...overrides,
    };
  }

  function arrange(booking: ReturnType<typeof confirmedBooking>) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.update as jest.Mock).mockImplementation(
      (args: { data: Record<string, unknown> }) => ({
        id: 'b1',
        status: 'cancelled',
        ...args.data,
      }),
    );
    return { prisma, notifications };
  }

  it('snapshots the tiered refund amount on the cancelled row', async () => {
    const booking = confirmedBooking({
      listing: {
        id: 'l1',
        title: 'Canon R5',
        ownerId: 'owner-1',
        cancellationPolicy: 'moderate',
      },
      startDate: hoursFromNow(2), // inside moderate's 120h cutoff -> 50%
    });
    const { prisma, notifications } = arrange(booking);

    const service = new BookingsService(prisma, notifications);
    const updated = await service.updateStatus('b1', 'renter-1', {
      status: 'cancelled',
    });

    expect((updated as { refundAmount: Prisma.Decimal }).refundAmount.toString()).toBe(
      '100',
    );
  });

  it('rejects cancelling a booking that is already completed', async () => {
    const booking = confirmedBooking({ status: 'completed' });
    const { prisma, notifications } = arrange(booking);

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'cancelled' }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects cancelling a booking that is already cancelled', async () => {
    const booking = confirmedBooking({ status: 'cancelled' });
    const { prisma, notifications } = arrange(booking);

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'cancelled' }),
    ).rejects.toThrow(ConflictException);
  });

  it('an owner cancelling always fully refunds, even inside the cutoff', async () => {
    const booking = confirmedBooking({
      listing: {
        id: 'l1',
        title: 'Canon R5',
        ownerId: 'owner-1',
        cancellationPolicy: 'strict',
      },
      startDate: hoursFromNow(1),
    });
    const { prisma, notifications } = arrange(booking);

    const service = new BookingsService(prisma, notifications);
    const updated = await service.updateStatus('b1', 'owner-1', {
      status: 'cancelled',
    });

    expect((updated as { refundAmount: Prisma.Decimal }).refundAmount.toString()).toBe(
      '200',
    );
  });

  it('includes the currency in the refund notification to the renter', async () => {
    const booking = confirmedBooking({
      currency: 'GBP',
      listing: {
        id: 'l1',
        title: 'Canon R5',
        ownerId: 'owner-1',
        cancellationPolicy: 'strict',
      },
      startDate: hoursFromNow(1),
    });
    const { prisma, notifications } = arrange(booking);

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'cancelled' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'booking_cancelled',
      expect.any(String),
      expect.stringContaining("You'll be refunded GBP 200."),
      '/bookings/b1',
    );
  });
});

describe('BookingsService.updateStatus deposit release', () => {
  const heldBooking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    status: 'confirmed',
    depositStatus: 'held',
    depositAmount: new Prisma.Decimal(75),
    currency: 'ZAR',
    total: new Prisma.Decimal(150),
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    listing: {
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      cancellationPolicy: 'moderate',
    },
    dispute: null,
  };

  function arrange(overrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const booking = { ...heldBooking, ...overrides };
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'completed',
    });
    return { prisma, notifications };
  }

  it('releases the deposit when the owner completes a booking with no dispute', async () => {
    const { prisma, notifications } = arrange();

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('notifies the renter that the deposit was released', async () => {
    const { prisma, notifications } = arrange();

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'deposit_released',
      'Your security deposit for Canon R5 was released',
      expect.any(String),
      '/bookings/b1',
    );
  });

  it('keeps the deposit held when the booking has a dispute', async () => {
    const { prisma, notifications } = arrange({
      dispute: { id: 'd1', status: 'flagged' },
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('refuses to let the renter complete a booking', async () => {
    const { prisma, notifications } = arrange();

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'completed' }),
    ).rejects.toThrow('Only the owner can complete a booking');
  });

  it('releases the deposit on cancellation too', async () => {
    const { prisma, notifications } = arrange();
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'cancelled',
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'renter-1', { status: 'cancelled' });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('does nothing deposit-related for a booking with no held deposit', async () => {
    const { prisma, notifications } = arrange({
      depositStatus: null,
      depositAmount: new Prisma.Decimal(0),
    });

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(notifications.notify).not.toHaveBeenCalled();
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });
});

describe('BookingsService.updateStatus authorization', () => {
  const booking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    status: 'confirmed',
    depositStatus: null,
    depositAmount: new Prisma.Decimal(0),
    currency: 'ZAR',
    total: new Prisma.Decimal(150),
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    dispute: null,
    listing: {
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      cancellationPolicy: 'moderate',
    },
  };

  it('forbids a caller who is neither the renter nor the listing owner', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'stranger-1', { status: 'cancelled' }),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.booking.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('allows the listing owner to cancel, not just the renter', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'cancelled',
    });

    const service = new BookingsService(prisma, notifications);
    await expect(
      service.updateStatus('b1', 'owner-1', { status: 'cancelled' }),
    ).resolves.toEqual({ id: 'b1', status: 'cancelled' });
  });
});
