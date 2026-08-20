import { PricingController } from './pricing.controller';

describe('PricingController', () => {
  const controller = new PricingController();

  it('matches the API pricing formula for a $200 subtotal', () => {
    // Regression test for the fee mismatch bug: web quoted 12%/8.75%
    // while the API charged 10%/8% on (subtotal + fee).
    const quote = controller.quote({ pricePerDay: 100, nights: 2 });

    expect(quote.subtotal).toBe('200.00');
    expect(quote.serviceFee).toBe('20.00');
    expect(quote.tax).toBe('17.60');
    expect(quote.total).toBe('237.60');
  });
});
