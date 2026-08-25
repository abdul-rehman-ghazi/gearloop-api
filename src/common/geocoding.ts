export interface GeoPoint {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

// Nominatim's public instance: free, no API key, but requires a descriptive
// User-Agent and tolerates only light usage (1 req/sec). Fine here since
// this only runs at profile-save time, never on the booking/pricing hot
// path. See spec's "Out of scope" for why there's no caching/retry here.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(address: string): Promise<GeoPoint | null> {
  const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Gearloop/1.0 (rental-marketplace-api)' },
  });
  if (!res.ok) return null;

  const results = (await res.json()) as NominatimResult[];
  const first = results[0];
  if (!first) return null;

  return { lat: Number(first.lat), lng: Number(first.lon) };
}
