import { DisputesService } from './disputes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function makePrisma() {
  return {
    booking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    dispute: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
  } as unknown as PrismaService;
}

function makeNotifications() {
  return {
    notify: jest.fn().mockResolvedValue({ id: 'n1' }),
  } as unknown as NotificationsService;
}

const booking = {
  id: 'b1',
  requestNumber: 'GL-1',
  status: 'confirmed',
  renterId: 'renter-1',
  listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
};

describe('DisputesService.create notifications', () => {
  it('notifies the owner when the renter files', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });

    const service = new DisputesService(prisma, notifications);
    await service.create('renter-1', {
      bookingId: 'b1',
      detail: 'Lens was cracked',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'dispute_filed',
      'A dispute was filed for booking GL-1',
      'Lens was cracked',
      '/disputes/d1',
    );
  });

  it('notifies the renter when the owner files', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });

    const service = new DisputesService(prisma, notifications);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Returned late',
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'dispute_filed',
      'A dispute was filed for booking GL-1',
      'Returned late',
      '/disputes/d1',
    );
  });
});

describe('DisputesService.updateStatus notifications', () => {
  it('notifies both parties when the dispute is resolved', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      bookingId: 'b1',
      booking,
    });
    (prisma.dispute.update as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'resolved',
    });

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(notifications.notify).toHaveBeenCalledTimes(2);
    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'dispute_resolved',
      'The dispute for booking GL-1 was resolved',
      'The dispute for booking GL-1 has been marked resolved.',
      '/disputes/d1',
    );
    expect(notifications.notify).toHaveBeenCalledWith(
      'owner-1',
      'dispute_resolved',
      'The dispute for booking GL-1 was resolved',
      'The dispute for booking GL-1 has been marked resolved.',
      '/disputes/d1',
    );
  });

  it('does not notify when the dispute moves to under_review', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      bookingId: 'b1',
      booking,
    });
    (prisma.dispute.update as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'under_review',
    });

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'under_review' });

    expect(notifications.notify).not.toHaveBeenCalled();
  });
});
