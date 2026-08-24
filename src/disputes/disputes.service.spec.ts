import { DisputesService } from './disputes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Prisma } from '../../generated/prisma/client';

function makePrisma() {
  const self = {
    booking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    dispute: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((arg: unknown) =>
      // The callback form (updateStatus) reuses `self.dispute`/`self.booking`
      // so assertions against the top-level mocks see the calls the
      // transaction made.
      typeof arg === 'function'
        ? (arg as (tx: typeof self) => unknown)(self)
        : Promise.all(arg as unknown[]),
    ),
  };
  return self as unknown as PrismaService;
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

const depositBooking = {
  id: 'b1',
  requestNumber: 'GL-1',
  status: 'completed',
  renterId: 'renter-1',
  depositAmount: new Prisma.Decimal('200.00'),
  depositStatus: 'held',
  listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
};

describe('DisputesService.create damage claims', () => {
  function arrange(bookingOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...depositBooking,
      ...bookingOverrides,
    });
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });
    return { prisma, notifications };
  }

  it('records the claim amount on the dispute', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Lens barrel dented',
      claimAmount: 80,
    });

    expect(prisma.dispute.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ claimAmount: 80 }),
      }),
    );
  });

  it('refuses a claim from the renter', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await expect(
      service.create('renter-1', {
        bookingId: 'b1',
        detail: 'nope',
        claimAmount: 80,
      }),
    ).rejects.toThrow('Only the owner can claim against the deposit');

    expect(prisma.dispute.create).not.toHaveBeenCalled();
  });

  it('still lets the renter file a claimless dispute', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.create('renter-1', {
      bookingId: 'b1',
      detail: 'Gear was filthy',
    });

    expect(prisma.dispute.create).toHaveBeenCalled();
  });

  it('refuses a claim when no deposit is held', async () => {
    const { prisma, notifications } = arrange({
      depositStatus: null,
      depositAmount: new Prisma.Decimal(0),
    });

    const service = new DisputesService(prisma, notifications);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Dented',
        claimAmount: 80,
      }),
    ).rejects.toThrow('No deposit is held for this booking');
  });

  it('refuses a claim when the deposit was already released', async () => {
    const { prisma, notifications } = arrange({
      depositStatus: 'released',
    });

    const service = new DisputesService(prisma, notifications);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Dented',
        claimAmount: 80,
      }),
    ).rejects.toThrow('No deposit is held for this booking');
  });

  it('refuses a claim larger than the deposit held', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Totalled',
        claimAmount: 500,
      }),
    ).rejects.toThrow('Claim exceeds the deposit held');
  });

  it('allows a claim for exactly the deposit held', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Totalled',
      claimAmount: 200,
    });

    expect(prisma.dispute.create).toHaveBeenCalled();
  });

  it('tells the renter what is being claimed', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Lens barrel dented',
      claimAmount: 80,
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'dispute_filed',
      'A dispute was filed for booking GL-1',
      'A claim of 80 against your deposit: Lens barrel dented',
      '/disputes/d1',
    );
  });
});

describe('DisputesService.updateStatus deposit resolution', () => {
  function arrange(disputeOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'under_review',
      bookingId: 'b1',
      claimAmount: new Prisma.Decimal('80.00'),
      booking: depositBooking,
      ...disputeOverrides,
    });
    (prisma.dispute.update as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'resolved',
    });
    return { prisma, notifications };
  }

  it('marks the deposit partially claimed on a partial award', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', {
      status: 'resolved',
      resolvedAmount: 40,
    });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'partially_claimed' }),
      }),
    );
  });

  it('marks the deposit fully claimed when the award equals it', async () => {
    const { prisma, notifications } = arrange({
      claimAmount: new Prisma.Decimal('200.00'),
    });

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', {
      status: 'resolved',
      resolvedAmount: 200,
    });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'claimed' }),
      }),
    );
  });

  it('marks the deposit released when the award is zero', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'resolved', resolvedAmount: 0 });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('marks the deposit released when no award is given', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('records the resolved amount on the dispute', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', {
      status: 'resolved',
      resolvedAmount: 40,
    });

    expect(prisma.dispute.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ resolvedAmount: 40 }),
      }),
    );
  });

  it('refuses an award larger than the amount claimed', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 150 }),
    ).rejects.toThrow('Resolution exceeds the amount claimed');

    expect(prisma.dispute.update).not.toHaveBeenCalled();
  });

  it('refuses an award on a dispute with no claim', async () => {
    const { prisma, notifications } = arrange({ claimAmount: null });

    const service = new DisputesService(prisma, notifications);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 }),
    ).rejects.toThrow('This dispute has no claim to resolve');
  });

  it('leaves a claimless dispute resolution completely untouched', async () => {
    const { prisma, notifications } = arrange({ claimAmount: null });

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(prisma.dispute.update).toHaveBeenCalled();
  });

  it('touches no deposit status when the status is not resolved', async () => {
    const { prisma, notifications } = arrange();

    const service = new DisputesService(prisma, notifications);
    await service.updateStatus('d1', { status: 'under_review' });

    expect(prisma.booking.update).not.toHaveBeenCalled();
  });
});

describe('DisputesService.findByIdForAdmin handoff evidence', () => {
  it('includes the booking handoff photos', async () => {
    const prisma = makePrisma();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'flagged',
      claimAmount: new Prisma.Decimal('80.00'),
      booking: {
        id: 'b1',
        renter: { id: 'renter-1', passwordHash: 'x' },
        listing: { id: 'l1', owner: { id: 'owner-1', passwordHash: 'y' } },
        handoffPhotos: [{ id: 'p1', stage: 'pickup' }],
      },
    });

    const service = new DisputesService(prisma, makeNotifications());
    const result = await service.findByIdForAdmin('d1');

    // The include is what matters: an admin setting resolvedAmount needs the
    // evidence on the same screen as the number.
    const calls = (prisma.dispute.findUnique as jest.Mock).mock
      .calls as unknown as Array<
      [{ include: { booking: { include: { handoffPhotos: boolean } } } }]
    >;
    const { include } = calls[0][0];
    expect(include.booking.include.handoffPhotos).toBe(true);
    expect(
      (result as unknown as { booking: { handoffPhotos: unknown } }).booking
        .handoffPhotos,
    ).toEqual([{ id: 'p1', stage: 'pickup' }]);
  });
});
