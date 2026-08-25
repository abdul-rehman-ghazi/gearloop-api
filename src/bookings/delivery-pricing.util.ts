export interface GeoPoint {
  lat: number;
  lng: number;
}

// Currency-agnostic plain numbers, same convention as SERVICE_FEE_RATE/
// TAX_RATE in booking-pricing.util.ts — this app does no FX conversion.
export const DELIVERY_BASE_FEE = 5;
export const DELIVERY_RATE_PER_KM = 0.5;
export const DELIVERY_MAX_FEE = 50;

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function deliveryFeeForDistance(km: number): number {
  const fee = DELIVERY_BASE_FEE + DELIVERY_RATE_PER_KM * km;
  return Math.min(fee, DELIVERY_MAX_FEE);
}
