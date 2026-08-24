import { Prisma } from '../../generated/prisma/client';
import { calculateRefund } from './booking-cancellation.util';

const NOW = new Date('2026-08-24T00:00:00Z');
const total = new Prisma.Decimal(200);

function hoursFromNow(hours: number): Date {
  return new Date(NOW.getTime() + hours * 60 * 60 * 1000);
}

describe('calculateRefund', () => {
  it('refunds in full when the booking is still pending, regardless of policy', () => {
    const refund = calculateRefund({
      policy: 'strict',
      total,
      startDate: hoursFromNow(1),
      status: 'pending',
      cancelledBy: 'renter',
      now: NOW,
    });
    expect(refund.toString()).toBe('200');
  });

  it('refunds in full when the owner cancels, regardless of policy or timing', () => {
    const refund = calculateRefund({
      policy: 'strict',
      total,
      startDate: hoursFromNow(1),
      status: 'confirmed',
      cancelledBy: 'owner',
      now: NOW,
    });
    expect(refund.toString()).toBe('200');
  });

  describe.each([
    {
      policy: 'flexible' as const,
      cutoffHours: 24,
      beforeRate: '200',
      afterRate: '0',
    },
    {
      policy: 'moderate' as const,
      cutoffHours: 120,
      beforeRate: '200',
      afterRate: '100',
    },
    {
      policy: 'strict' as const,
      cutoffHours: 168,
      beforeRate: '100',
      afterRate: '0',
    },
  ])('$policy policy', ({ policy, cutoffHours, beforeRate, afterRate }) => {
    it(`refunds ${beforeRate} at exactly the cutoff`, () => {
      const refund = calculateRefund({
        policy,
        total,
        startDate: hoursFromNow(cutoffHours),
        status: 'confirmed',
        cancelledBy: 'renter',
        now: NOW,
      });
      expect(refund.toString()).toBe(beforeRate);
    });

    it(`refunds ${afterRate} one hour past the cutoff`, () => {
      const refund = calculateRefund({
        policy,
        total,
        startDate: hoursFromNow(cutoffHours - 1),
        status: 'confirmed',
        cancelledBy: 'renter',
        now: NOW,
      });
      expect(refund.toString()).toBe(afterRate);
    });
  });

  it('rounds to 2 decimal places', () => {
    const refund = calculateRefund({
      policy: 'moderate',
      total: new Prisma.Decimal('99.99'),
      startDate: hoursFromNow(1),
      status: 'confirmed',
      cancelledBy: 'renter',
      now: NOW,
    });
    expect(refund.decimalPlaces()).toBeLessThanOrEqual(2);
  });
});
