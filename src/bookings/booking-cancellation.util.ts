import { Prisma } from '../../generated/prisma/client';
import type {
  BookingStatus,
  CancellationPolicy,
  CancelledBy,
} from '../../generated/prisma/enums';

export const POLICY_TIERS: Record<
  CancellationPolicy,
  { cutoffHours: number; beforeRate: string; afterRate: string }
> = {
  flexible: { cutoffHours: 24, beforeRate: '1', afterRate: '0' },
  moderate: { cutoffHours: 120, beforeRate: '1', afterRate: '0.5' },
  strict: { cutoffHours: 168, beforeRate: '0.5', afterRate: '0' },
};

// Refund is always against `total` (fee included) per the "flat percentage,
// no fee retention" decision. `status` is the booking's status *before* this
// cancellation, and `now` defaults to the real clock — overridable for tests.
export function calculateRefund(args: {
  policy: CancellationPolicy;
  total: Prisma.Decimal;
  startDate: Date;
  status: BookingStatus;
  cancelledBy: CancelledBy;
  now?: Date;
}): Prisma.Decimal {
  const {
    policy,
    total,
    startDate,
    status,
    cancelledBy,
    now = new Date(),
  } = args;

  // A pending hold was never captured — cancelling it releases the whole
  // hold, not a "refund" in the Stripe sense, but the same 100% outcome.
  if (status === 'pending') {
    return total;
  }

  // Owner-initiated cancellation never costs the renter.
  if (cancelledBy === 'owner') {
    return total;
  }

  const { cutoffHours, beforeRate, afterRate } = POLICY_TIERS[policy];
  const hoursUntilStart =
    (startDate.getTime() - now.getTime()) / (60 * 60 * 1000);
  const rate = hoursUntilStart >= cutoffHours ? beforeRate : afterRate;

  return total.mul(rate).toDecimalPlaces(2);
}
