import { BadRequestException } from '@nestjs/common';
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
    await service.updateStatus('b1', { status: 'confirmed' });

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
    await service.updateStatus('b1', { status: 'cancelled' });

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
    await service.updateStatus('b1', { status: 'completed' });

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
      .calls[0];
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
});
