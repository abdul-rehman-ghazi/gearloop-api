const mockStripeClient = {
  paymentIntents: {
    create: jest.fn(),
    capture: jest.fn(),
    retrieve: jest.fn(),
    cancel: jest.fn(),
  },
  refunds: {
    create: jest.fn(),
  },
};

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn(() => mockStripeClient),
}));

import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { Prisma } from '../../generated/prisma/client';

function makeConfig(values: Record<string, string | undefined>) {
  return {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
}

function makeService() {
  return new PaymentsService(makeConfig({ STRIPE_SECRET_KEY: 'sk_test_123' }));
}

// A stand-in for Stripe's own StripeCardError. The SDK marks every error it
// raises with a `type` string; BookingsService keys off that same string.
function cardDeclineError() {
  return Object.assign(new Error('Your card was declined.'), {
    type: 'StripeCardError',
    code: 'card_declined',
  });
}

describe('PaymentsService construction', () => {
  it('does not throw when constructed with an empty STRIPE_SECRET_KEY', () => {
    expect(() => new PaymentsService(makeConfig({}))).not.toThrow();
  });
});

describe('PaymentsService.authorize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a manual-capture PaymentIntent and returns its id', async () => {
    mockStripeClient.paymentIntents.create.mockResolvedValue({
      id: 'pi_test_1',
    });

    const service = makeService();
    const result = await service.authorize(
      'pm_card_visa',
      new Prisma.Decimal('118.80'),
    );

    expect(mockStripeClient.paymentIntents.create).toHaveBeenCalledWith({
      amount: 11880,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      capture_method: 'manual',
      confirm: true,
      off_session: true,
    });
    expect(result).toBe('pi_test_1');
  });

  it('rounds fractional cents rather than truncating them', async () => {
    mockStripeClient.paymentIntents.create.mockResolvedValue({
      id: 'pi_test_2',
    });

    const service = makeService();
    await service.authorize('pm_card_visa', new Prisma.Decimal('10.005'));

    expect(mockStripeClient.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1001 }),
    );
  });

  it('accepts a non-default currency', async () => {
    mockStripeClient.paymentIntents.create.mockResolvedValue({
      id: 'pi_test_3',
    });

    const service = makeService();
    await service.authorize('pm_card_visa', new Prisma.Decimal('20.00'), 'eur');

    expect(mockStripeClient.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({ currency: 'eur' }),
    );
  });

  it('propagates a card decline un-caught', async () => {
    mockStripeClient.paymentIntents.create.mockRejectedValue(
      cardDeclineError(),
    );

    const service = makeService();
    await expect(
      service.authorize('pm_card_declined', new Prisma.Decimal('50.00')),
    ).rejects.toMatchObject({ type: 'StripeCardError' });
  });
});

describe('PaymentsService.capture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('captures the PaymentIntent', async () => {
    mockStripeClient.paymentIntents.capture.mockResolvedValue({
      id: 'pi_test_1',
      status: 'succeeded',
    });

    const service = makeService();
    await expect(service.capture('pi_test_1')).resolves.toBeUndefined();

    expect(mockStripeClient.paymentIntents.capture).toHaveBeenCalledWith(
      'pi_test_1',
    );
  });

  it('propagates a capture failure un-caught', async () => {
    mockStripeClient.paymentIntents.capture.mockRejectedValue(
      new Error('intent already captured'),
    );

    const service = makeService();
    await expect(service.capture('pi_test_1')).rejects.toThrow(
      'intent already captured',
    );
  });
});

describe('PaymentsService.release', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cancels an uncaptured hold', async () => {
    mockStripeClient.paymentIntents.retrieve.mockResolvedValue({
      id: 'pi_test_1',
      status: 'requires_capture',
    });
    mockStripeClient.paymentIntents.cancel.mockResolvedValue({
      id: 'pi_test_1',
      status: 'canceled',
    });

    const service = makeService();
    await service.release('pi_test_1');

    expect(mockStripeClient.paymentIntents.cancel).toHaveBeenCalledWith(
      'pi_test_1',
    );
    expect(mockStripeClient.refunds.create).not.toHaveBeenCalled();
  });

  it('refunds an already-captured intent', async () => {
    mockStripeClient.paymentIntents.retrieve.mockResolvedValue({
      id: 'pi_test_1',
      status: 'succeeded',
    });
    mockStripeClient.refunds.create.mockResolvedValue({ id: 're_test_1' });

    const service = makeService();
    await service.release('pi_test_1');

    expect(mockStripeClient.refunds.create).toHaveBeenCalledWith({
      payment_intent: 'pi_test_1',
    });
    expect(mockStripeClient.paymentIntents.cancel).not.toHaveBeenCalled();
  });

  it('does nothing for an intent that is already canceled', async () => {
    mockStripeClient.paymentIntents.retrieve.mockResolvedValue({
      id: 'pi_test_1',
      status: 'canceled',
    });

    const service = makeService();
    await service.release('pi_test_1');

    expect(mockStripeClient.paymentIntents.cancel).not.toHaveBeenCalled();
    expect(mockStripeClient.refunds.create).not.toHaveBeenCalled();
  });

  it('throws for an intent in an unexpected status instead of silently no-opping', async () => {
    mockStripeClient.paymentIntents.retrieve.mockResolvedValue({
      id: 'pi_test_1',
      status: 'processing',
    });

    const service = makeService();
    await expect(service.release('pi_test_1')).rejects.toThrow(
      'Cannot release PaymentIntent in status "processing"',
    );

    expect(mockStripeClient.paymentIntents.cancel).not.toHaveBeenCalled();
    expect(mockStripeClient.refunds.create).not.toHaveBeenCalled();
  });

  it('propagates a release failure un-caught', async () => {
    mockStripeClient.paymentIntents.retrieve.mockResolvedValue({
      id: 'pi_test_1',
      status: 'requires_capture',
    });
    mockStripeClient.paymentIntents.cancel.mockRejectedValue(
      new Error('Stripe is down'),
    );

    const service = makeService();
    await expect(service.release('pi_test_1')).rejects.toThrow(
      'Stripe is down',
    );
  });
});
