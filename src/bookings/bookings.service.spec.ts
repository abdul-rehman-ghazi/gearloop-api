import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

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

    const service = new BookingsService(prisma, notifications);
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

    const service = new BookingsService(prisma, notifications);
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

    const service = new BookingsService(prisma, notifications);
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

    const service = new BookingsService(prisma, notifications);
    await service.updateStatus('b1', { status: 'completed' });

    expect(notifications.notify).not.toHaveBeenCalled();
  });
});
