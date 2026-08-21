import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';

function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    paymentMethod: {
      findUnique: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

function makePayments() {
  return {
    authorize: jest.fn().mockResolvedValue('pi_test_1'),
    capture: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
  } as unknown as PaymentsService;
}

describe('BookingsService.create notifications', () => {
  it('notifies the listing owner of a new booking request', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      pricePerDay: 100,
      deletedAt: null,
    });
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue({
      id: 'pm1',
      userId: 'renter-1',
    });
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications, makePayments());
    await service.create('renter-1', {
      listingId: 'l1',
      paymentMethodId: 'pm1',
      pickupMethod: 'pickup',
      startDate: '2026-09-01',
      endDate: '2026-09-03',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'booking_requested',
      'New booking request for Canon R5',
      'Request GL-1 is awaiting your response.',
      '/bookings/b1',
    );
  });
});

describe('BookingsService.updateStatus notifications', () => {
  const pendingBooking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    paymentIntentId: 'pi_test_1',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
  };

  it('notifies the renter when the booking is confirmed', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(pendingBooking);
    (prisma.booking.findUniqueOrThrow as jest.Mock).mockResolvedValue(
      pendingBooking,
    );
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'confirmed',
    });

    const service = new BookingsService(prisma, notifications, makePayments());
    await service.updateStatus('b1', 'renter-1', { status: 'confirmed' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'booking_confirmed',
      'Your booking for Canon R5 is confirmed',
      'Booking GL-1 is confirmed.',
      '/bookings/b1',
    );
  });

  it('notifies the renter when the booking is cancelled', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(pendingBooking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'cancelled',
    });

    const service = new BookingsService(prisma, notifications, makePayments());
    await service.updateStatus('b1', 'renter-1', { status: 'cancelled' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'booking_cancelled',
      'Your booking for Canon R5 was cancelled',
      'Booking GL-1 was cancelled.',
      '/bookings/b1',
    );
  });

  it('does not notify for a completed booking', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(pendingBooking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'completed',
    });

    const service = new BookingsService(prisma, notifications, makePayments());
    await service.updateStatus('b1', 'renter-1', { status: 'completed' });

    expect(notifications.notify).not.toHaveBeenCalled();
  });
});

describe('BookingsService.create payments', () => {
  const listing = {
    id: 'l1',
    title: 'Canon R5',
    ownerId: 'owner-1',
    pricePerDay: 100,
    deletedAt: null,
  };
  const paymentMethod = {
    id: 'pm1',
    userId: 'renter-1',
    processorPaymentMethodId: 'pm_card_visa',
  };
  const dto = {
    listingId: 'l1',
    paymentMethodId: 'pm1',
    pickupMethod: 'pickup' as const,
    startDate: '2026-09-01',
    endDate: '2026-09-03',
  };

  it('authorizes the card for the booking total and stores the intent id', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (payments.authorize as jest.Mock).mockResolvedValue('pi_created');
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    // 2 nights at 100 => subtotal 200, fee 20, tax 17.60, total 237.60
    expect(payments.authorize).toHaveBeenCalledTimes(1);
    const [processorId, amount] = (payments.authorize as jest.Mock).mock
      .calls[0] as [string, Prisma.Decimal];
    expect(processorId).toBe('pm_card_visa');
    expect(amount.toString()).toBe('237.6');

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ paymentIntentId: 'pi_created' }),
      }),
    );
  });

  it('authorizes before writing the booking row', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    expect(
      (payments.authorize as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(
      (prisma.booking.create as jest.Mock).mock.invocationCallOrder[0],
    );
  });

  it('translates a card decline into BadRequestException and writes nothing', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (payments.authorize as jest.Mock).mockRejectedValue(
      Object.assign(new Error('Your card was declined.'), {
        type: 'StripeCardError',
        code: 'card_declined',
      }),
    );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Card was declined',
    );

    expect(prisma.booking.create).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('lets a non-card Stripe failure propagate untranslated', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (payments.authorize as jest.Mock).mockRejectedValue(
      Object.assign(new Error('Invalid API Key provided'), {
        type: 'StripeAuthenticationError',
      }),
    );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Invalid API Key provided',
    );
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('releases the hold when the booking row fails to write', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (payments.authorize as jest.Mock).mockResolvedValue('pi_orphaned');
    (prisma.booking.create as jest.Mock).mockRejectedValue(
      new Error('database is down'),
    );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'database is down',
    );

    expect(payments.release).toHaveBeenCalledWith('pi_orphaned');
  });
});

describe('BookingsService.updateStatus payments', () => {
  const heldBooking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    paymentIntentId: 'pi_test_1',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
  };

  function arrange() {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(heldBooking);
    (prisma.booking.findUniqueOrThrow as jest.Mock).mockResolvedValue(
      heldBooking,
    );
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'confirmed',
    });
    return { prisma, notifications, payments };
  }

  it('captures the hold when confirming, before updating the row', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'renter-1', { status: 'confirmed' });

    expect(payments.capture).toHaveBeenCalledWith('pi_test_1');
    expect(payments.release).not.toHaveBeenCalled();
    expect(
      (payments.capture as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(
      (prisma.booking.update as jest.Mock).mock.invocationCallOrder[0],
    );
  });

  it('blocks the confirm transition when the capture fails', async () => {
    const { prisma, notifications, payments } = arrange();
    (payments.capture as jest.Mock).mockRejectedValue(
      new Error('intent expired'),
    );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'confirmed' }),
    ).rejects.toThrow(ConflictException);

    expect(prisma.booking.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('reports a capture failure as "Payment could not be captured"', async () => {
    const { prisma, notifications, payments } = arrange();
    (payments.capture as jest.Mock).mockRejectedValue(
      new Error('intent expired'),
    );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'confirmed' }),
    ).rejects.toThrow('Payment could not be captured');
  });

  it('releases the hold when cancelling, before updating the row', async () => {
    const { prisma, notifications, payments } = arrange();
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'cancelled',
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'renter-1', { status: 'cancelled' });

    expect(payments.release).toHaveBeenCalledWith('pi_test_1');
    expect(payments.capture).not.toHaveBeenCalled();
    expect(
      (payments.release as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(
      (prisma.booking.update as jest.Mock).mock.invocationCallOrder[0],
    );
  });

  it('blocks the cancel transition when the release fails', async () => {
    const { prisma, notifications, payments } = arrange();
    (payments.release as jest.Mock).mockRejectedValue(
      new Error('refund failed'),
    );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'cancelled' }),
    ).rejects.toThrow('Payment could not be released');

    expect(prisma.booking.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('blocks the transition when the booking has no payment intent', async () => {
    const { prisma, notifications, payments } = arrange();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...heldBooking,
      paymentIntentId: null,
    });

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'confirmed' }),
    ).rejects.toThrow('Payment could not be captured');

    expect(payments.capture).not.toHaveBeenCalled();
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('touches no payment call when completing a booking', async () => {
    const { prisma, notifications, payments } = arrange();
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'completed',
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'renter-1', { status: 'completed' });

    expect(payments.capture).not.toHaveBeenCalled();
    expect(payments.release).not.toHaveBeenCalled();
    expect(prisma.booking.update).toHaveBeenCalled();
  });
});

describe('BookingsService.updateStatus authorization', () => {
  const booking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    paymentIntentId: 'pi_test_1',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
  };

  it('forbids a caller who is neither the renter nor the listing owner', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'stranger-1', { status: 'cancelled' }),
    ).rejects.toThrow(ForbiddenException);

    expect(payments.release).not.toHaveBeenCalled();
    expect(prisma.booking.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('allows the listing owner to update status, not just the renter', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.findUniqueOrThrow as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'confirmed',
    });

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'owner-1', { status: 'confirmed' }),
    ).resolves.toEqual({ id: 'b1', status: 'confirmed' });
  });
});

describe('BookingsService.create deposit hold', () => {
  const paymentMethod = {
    id: 'pm1',
    userId: 'renter-1',
    processorPaymentMethodId: 'pm_card_visa',
  };
  const dto = {
    listingId: 'l1',
    paymentMethodId: 'pm1',
    pickupMethod: 'pickup' as const,
    startDate: '2026-09-01',
    endDate: '2026-09-03',
  };

  function arrange(depositAmount: number) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      pricePerDay: 100,
      depositAmount: new Prisma.Decimal(depositAmount),
      deletedAt: null,
    });
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });
    return { prisma, notifications, payments };
  }

  it('places a second hold for the deposit and records it on the booking', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockResolvedValueOnce('pi_deposit');

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    expect(payments.authorize).toHaveBeenCalledTimes(2);
    const [, depositArg] = (payments.authorize as jest.Mock).mock.calls[1] as [
      string,
      Prisma.Decimal,
    ];
    expect(depositArg.toString()).toBe('200');

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          paymentIntentId: 'pi_rental',
          depositIntentId: 'pi_deposit',
          depositStatus: 'held',
        }),
      }),
    );
  });

  it('snapshots the deposit amount onto the booking without touching the total', async () => {
    const { prisma, notifications, payments } = arrange(200);

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    const calls = (prisma.booking.create as jest.Mock).mock
      .calls as unknown as Array<
      [{ data: { depositAmount: Prisma.Decimal; total: Prisma.Decimal } }]
    >;
    const { data } = calls[0][0];
    expect(data.depositAmount.toString()).toBe('200');
    // 2 nights at 100 => subtotal 200, fee 20, tax 17.60, total 237.60 —
    // unchanged by the deposit (Ruling 1).
    expect(data.total.toString()).toBe('237.6');
  });

  it('places no deposit hold when the listing has no deposit', async () => {
    const { prisma, notifications, payments } = arrange(0);

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    expect(payments.authorize).toHaveBeenCalledTimes(1);
    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          depositIntentId: null,
          depositStatus: null,
        }),
      }),
    );
  });

  it('releases the rental hold and writes nothing when the deposit hold declines', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockRejectedValueOnce(
        Object.assign(new Error('Your card was declined.'), {
          type: 'StripeCardError',
          code: 'card_declined',
        }),
      );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      BadRequestException,
    );

    expect(payments.release).toHaveBeenCalledWith('pi_rental');
    expect(prisma.booking.create).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('reports a declined deposit hold as a card decline', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockRejectedValueOnce(
        Object.assign(new Error('Your card was declined.'), {
          type: 'StripeCardError',
        }),
      );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Card was declined',
    );
  });

  it('still releases the rental hold when a non-card error fails the deposit', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockRejectedValueOnce(new Error('Stripe is down'));

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Stripe is down',
    );

    expect(payments.release).toHaveBeenCalledWith('pi_rental');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });
});
