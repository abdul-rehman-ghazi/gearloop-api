import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Prisma } from '../../generated/prisma/client';

// ponytail: no idempotency keys on these calls (Ruling 4). A retry-safe key
// needs to be derivable before the Booking row exists; derive one from
// `${renterId}:${listingId}:${startDate}:${endDate}` if retry-safety is ever
// needed.
@Injectable()
export class PaymentsService {
  private _stripe?: Stripe;

  constructor(private readonly config: ConfigService) {}

  // Ruling 3: no `if (!key)` guard and no fallback branch. `?? ''` is a
  // type coercion only — an empty key is a string Stripe accepts at
  // construction and rejects at the first real API call, which is exactly
  // the "fail at the point of an actual charge, not at boot" behaviour we
  // want. Never swallow or log-and-continue here the way EmailService does.
  // Built lazily so a missing key fails at first use, not at DI boot time.
  private get stripe(): Stripe {
    return (this._stripe ??= new Stripe(
      this.config.get<string>('STRIPE_SECRET_KEY') ?? '',
    ));
  }

  // Places an auth-hold. Stripe errors (StripeCardError included) propagate
  // to the caller untouched; BookingsService owns the HTTP translation.
  async authorize(
    processorPaymentMethodId: string,
    amount: Prisma.Decimal,
    currency = 'usd',
  ): Promise<string> {
    const intent = await this.stripe.paymentIntents.create({
      // The only place in the codebase that knows Stripe's minor-unit
      // convention: Decimal dollars -> integer cents.
      amount: Math.round(amount.toNumber() * 100),
      currency,
      payment_method: processorPaymentMethodId,
      capture_method: 'manual',
      confirm: true,
      // The renter isn't present at booking-request time to complete a 3-D
      // Secure challenge; off_session tells Stripe to use whatever
      // authentication the saved payment method already carries.
      off_session: true,
    });
    return intent.id;
  }

  async capture(paymentIntentId: string): Promise<void> {
    await this.stripe.paymentIntents.capture(paymentIntentId);
  }

  // One method, two Stripe calls depending on state, so callers don't need
  // to know whether the hold was already captured.
  async release(paymentIntentId: string): Promise<void> {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status === 'requires_capture') {
      await this.stripe.paymentIntents.cancel(paymentIntentId);
      return;
    }

    if (intent.status === 'succeeded') {
      await this.stripe.refunds.create({ payment_intent: paymentIntentId });
    }
  }
}
