import { DisputesService } from './disputes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
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
      // transaction made. The array form (create) just resolves each op.
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

function makePayments() {
  return {
    authorize: jest.fn().mockResolvedValue('pi_test_1'),
    capture: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
  } as unknown as PaymentsService;
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

    const service = new DisputesService(prisma, notifications, makePayments());
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

    const service = new DisputesService(prisma, notifications, makePayments());
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

    const service = new DisputesService(prisma, notifications, makePayments());
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

    const service = new DisputesService(prisma, notifications, makePayments());
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
  depositIntentId: 'pi_deposit',
  depositStatus: 'held',
  listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
};

describe('DisputesService.create damage claims', () => {
  function arrange(bookingOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...depositBooking,
      ...bookingOverrides,
    });
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });
    return { prisma, notifications, payments };
  }

  it('records the claim amount on the dispute', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
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
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
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
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.create('renter-1', {
      bookingId: 'b1',
      detail: 'Gear was filthy',
    });

    expect(prisma.dispute.create).toHaveBeenCalled();
  });

  it('refuses a claim when no deposit is held', async () => {
    const { prisma, notifications, payments } = arrange({
      depositStatus: null,
      depositIntentId: null,
      depositAmount: new Prisma.Decimal(0),
    });

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Dented',
        claimAmount: 80,
      }),
    ).rejects.toThrow('No deposit is held for this booking');
  });

  it('refuses a claim when the deposit was already released', async () => {
    const { prisma, notifications, payments } = arrange({
      depositStatus: 'released',
    });

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Dented',
        claimAmount: 80,
      }),
    ).rejects.toThrow('No deposit is held for this booking');
  });

  it('refuses a claim larger than the deposit held', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Totalled',
        claimAmount: 500,
      }),
    ).rejects.toThrow('Claim exceeds the deposit held');
  });

  it('allows a claim for exactly the deposit held', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Totalled',
      claimAmount: 200,
    });

    expect(prisma.dispute.create).toHaveBeenCalled();
  });

  it('tells the renter what is being claimed', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
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
    const payments = makePayments();
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
    return { prisma, notifications, payments };
  }

  it('captures a partial award and marks the deposit partially claimed', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', {
      status: 'resolved',
      resolvedAmount: 40,
    });

    const [intentId, amount] = (payments.capture as jest.Mock).mock
      .calls[0] as [string, Prisma.Decimal];
    expect(intentId).toBe('pi_deposit');
    expect(amount.toString()).toBe('40');
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'partially_claimed' }),
      }),
    );
  });

  it('marks the deposit fully claimed when the award equals it', async () => {
    const { prisma, notifications, payments } = arrange({
      claimAmount: new Prisma.Decimal('200.00'),
    });

    const service = new DisputesService(prisma, notifications, payments);
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

  it('releases the whole deposit when the award is zero', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved', resolvedAmount: 0 });

    expect(payments.release).toHaveBeenCalledWith('pi_deposit');
    expect(payments.capture).not.toHaveBeenCalled();
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('releases the whole deposit when no award is given', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(payments.release).toHaveBeenCalledWith('pi_deposit');
    expect(payments.capture).not.toHaveBeenCalled();
  });

  it('records the resolved amount on the dispute', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
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
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 150 }),
    ).rejects.toThrow('Resolution exceeds the amount claimed');

    expect(payments.capture).not.toHaveBeenCalled();
    expect(prisma.dispute.update).not.toHaveBeenCalled();
  });

  it('refuses an award on a dispute with no claim', async () => {
    const { prisma, notifications, payments } = arrange({ claimAmount: null });

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 }),
    ).rejects.toThrow('This dispute has no claim to resolve');
  });

  it('leaves a claimless dispute resolution completely untouched', async () => {
    const { prisma, notifications, payments } = arrange({ claimAmount: null });

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(payments.capture).not.toHaveBeenCalled();
    expect(payments.release).not.toHaveBeenCalled();
    expect(prisma.dispute.update).toHaveBeenCalled();
  });

  it('does not resolve the dispute when the capture fails', async () => {
    const { prisma, notifications, payments } = arrange();
    (payments.capture as jest.Mock).mockRejectedValue(new Error('Stripe down'));

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 }),
    ).rejects.toThrow('Deposit could not be claimed');

    expect(prisma.dispute.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('touches no money when the status is not resolved', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'under_review' });

    expect(payments.capture).not.toHaveBeenCalled();
    expect(payments.release).not.toHaveBeenCalled();
  });
});
