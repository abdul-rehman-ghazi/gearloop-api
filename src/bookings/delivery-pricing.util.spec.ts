import {
  DELIVERY_BASE_FEE,
  DELIVERY_MAX_FEE,
  DELIVERY_RATE_PER_KM,
  deliveryFeeForDistance,
  haversineKm,
} from './delivery-pricing.util';

describe('haversineKm', () => {
  it('returns 0 for identical points', () => {
    const point = { lat: -33.9249, lng: 18.4241 };
    expect(haversineKm(point, point)).toBe(0);
  });

  it('computes the distance between Cape Town and Johannesburg (~1265km)', () => {
    const capeTown = { lat: -33.9249, lng: 18.4241 };
    const johannesburg = { lat: -26.2041, lng: 28.0473 };
    const km = haversineKm(capeTown, johannesburg);
    expect(km).toBeGreaterThan(1200);
    expect(km).toBeLessThan(1350);
  });
});

describe('deliveryFeeForDistance', () => {
  it('returns just the base fee at zero distance', () => {
    expect(deliveryFeeForDistance(0)).toBe(DELIVERY_BASE_FEE);
  });

  it('scales linearly with distance below the cap', () => {
    expect(deliveryFeeForDistance(10)).toBe(
      DELIVERY_BASE_FEE + DELIVERY_RATE_PER_KM * 10,
    );
  });

  it('caps at the max fee for long distances', () => {
    expect(deliveryFeeForDistance(1000)).toBe(DELIVERY_MAX_FEE);
  });
});
