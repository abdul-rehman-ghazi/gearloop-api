export interface GeoPoint {
  lat: number;
  lng: number;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
}

interface NominatimReverseResult {
  display_name?: string;
}

// Distinguishes "Nominatim couldn't be asked" from "Nominatim had no match",
// so callers don't tell a user their address is wrong when the service is
// rate-limiting or down.
export class GeocodingUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'GeocodingUnavailableError';
  }
}

// Nominatim's public instance: free, no API key, but requires a descriptive
// User-Agent and tolerates only light usage (1 req/sec). Fine here since
// this only runs at profile-save time, never on the booking/pricing hot
// path. See spec's "Out of scope" for why there's no caching here.
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const NOMINATIM_HEADERS = {
  'User-Agent': 'Gearloop/1.0 (rental-marketplace-api)',
};
const NOMINATIM_REQUEST_GAP_MS = 1100;

const MAX_SEARCH_ATTEMPTS = 3;
const MIN_FALLBACK_SEGMENTS = 2;

export async function geocodeAddress(
  address: string,
): Promise<GeoPoint | null> {
  const candidates = addressCandidates(address);
  for (const [attempt, candidate] of candidates.entries()) {
    if (attempt > 0) await waitForRateLimit();
    const point = await searchNominatim(candidate);
    if (point) return point;
  }
  return null;
}

export async function reverseGeocode(point: GeoPoint): Promise<string> {
  const url = `${NOMINATIM_BASE_URL}/reverse?format=json&accept-language=en&lat=${point.lat}&lon=${point.lng}`;
  const result = await fetchNominatim<NominatimReverseResult>(url);
  if (!result.display_name) {
    throw new GeocodingUnavailableError('Nominatim has no label for point');
  }
  return result.display_name;
}

// Nominatim only matches when it recognises every term in the query, so a
// flat or house number missing from OSM ("Flat 4B, Block 7, ...") yields no
// result at all. Dropping leading segments trades precision for a match;
// stopping at two segments keeps a bare city or country from standing in
// for a street address.
function addressCandidates(address: string): string[] {
  const segments = address
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);
  const fallbacks = segments
    .map((_, start) => segments.slice(start))
    .filter(
      (suffix, start) => start > 0 && suffix.length >= MIN_FALLBACK_SEGMENTS,
    )
    .map((suffix) => suffix.join(', '));
  return [address, ...fallbacks].slice(0, MAX_SEARCH_ATTEMPTS);
}

async function searchNominatim(query: string): Promise<GeoPoint | null> {
  const url = `${NOMINATIM_BASE_URL}/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const results = await fetchNominatim<NominatimSearchResult[]>(url);
  const first = results[0];
  if (!first) return null;

  return { lat: Number(first.lat), lng: Number(first.lon) };
}

async function fetchNominatim<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: NOMINATIM_HEADERS }).catch(
    (cause: unknown) => {
      throw new GeocodingUnavailableError('Nominatim unreachable', { cause });
    },
  );
  if (!res.ok) {
    throw new GeocodingUnavailableError(`Nominatim responded ${res.status}`);
  }
  return (await res.json()) as T;
}

function waitForRateLimit(): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, NOMINATIM_REQUEST_GAP_MS),
  );
}
