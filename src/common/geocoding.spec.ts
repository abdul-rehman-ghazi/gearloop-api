import {
  geocodeAddress,
  GeocodingUnavailableError,
  reverseGeocode,
} from './geocoding';

function jsonResponse(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) };
}

function errorResponse(status: number) {
  return { ok: false, status, json: () => Promise.resolve({}) };
}

function queriedAddresses(fetchMock: jest.Mock): string[] {
  return fetchMock.mock.calls.map(([url]: [string]) =>
    new URL(url).searchParams.get('q'),
  ) as string[];
}

async function settleWithTimers<T>(pending: Promise<T>): Promise<T> {
  await jest.runAllTimersAsync();
  return pending;
}

describe('geocodeAddress', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('returns coordinates for a successful lookup', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(jsonResponse([{ lat: '-33.9249', lon: '18.4241' }]));

    const point = await geocodeAddress('Cape Town, South Africa');

    expect(point).toEqual({ lat: -33.9249, lng: 18.4241 });
  });

  it('falls back to a shorter address when the full one has no match', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse([{ lat: '24.92', lon: '67.09' }]));
    global.fetch = fetchMock;

    const point = await settleWithTimers(
      geocodeAddress('Flat 4B, Block 7, Gulshan-e-Iqbal, Karachi'),
    );

    expect(point).toEqual({ lat: 24.92, lng: 67.09 });
  });

  it('drops leading address segments one at a time when falling back', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse([]));
    global.fetch = fetchMock;

    await settleWithTimers(
      geocodeAddress('Flat 4B, Block 7, Gulshan-e-Iqbal, Karachi'),
    );

    expect(queriedAddresses(fetchMock)).toEqual([
      'Flat 4B, Block 7, Gulshan-e-Iqbal, Karachi',
      'Block 7, Gulshan-e-Iqbal, Karachi',
      'Gulshan-e-Iqbal, Karachi',
    ]);
  });

  it('never falls back to a single address segment', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse([]));
    global.fetch = fetchMock;

    await settleWithTimers(geocodeAddress('Block 7, Karachi'));

    expect(queriedAddresses(fetchMock)).toEqual(['Block 7, Karachi']);
  });

  it('waits between attempts to respect the Nominatim rate limit', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse([]));
    global.fetch = fetchMock;

    const pending = geocodeAddress('Flat 4B, Block 7, Karachi');
    await jest.advanceTimersByTimeAsync(0);
    const callsBeforeWaiting = fetchMock.mock.calls.length;
    await settleWithTimers(pending);

    expect(callsBeforeWaiting).toBe(1);
  });

  it('returns null when no candidate address has a match', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse([]));

    const point = await settleWithTimers(
      geocodeAddress('asdkfjhaslkdjfh nonsense address'),
    );

    expect(point).toBeNull();
  });

  it('throws GeocodingUnavailableError when Nominatim responds with an error', async () => {
    global.fetch = jest.fn().mockResolvedValue(errorResponse(429));

    await expect(geocodeAddress('Cape Town')).rejects.toThrow(
      GeocodingUnavailableError,
    );
  });

  it('throws GeocodingUnavailableError when Nominatim is unreachable', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('fetch failed'));

    await expect(geocodeAddress('Cape Town')).rejects.toThrow(
      GeocodingUnavailableError,
    );
  });

  it('sends a descriptive User-Agent header, per Nominatim usage policy', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(jsonResponse([{ lat: '0', lon: '0' }]));
    global.fetch = fetchMock;

    await geocodeAddress('Null Island');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['User-Agent']).toContain(
      'Gearloop',
    );
  });
});

describe('reverseGeocode', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns the display name for the coordinates', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        jsonResponse({ display_name: 'Long Street, Cape Town, South Africa' }),
      );

    const label = await reverseGeocode({ lat: -33.9249, lng: 18.4241 });

    expect(label).toBe('Long Street, Cape Town, South Africa');
  });

  it('requests English labels so addresses render in the UI language', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(jsonResponse({ display_name: 'Karachi' }));
    global.fetch = fetchMock;

    await reverseGeocode({ lat: 24.86, lng: 67.01 });

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(new URL(url).searchParams.get('accept-language')).toBe('en');
  });

  it('throws GeocodingUnavailableError when Nominatim has no label for the point', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(jsonResponse({ error: 'Unable to geocode' }));

    await expect(reverseGeocode({ lat: 0, lng: 0 })).rejects.toThrow(
      GeocodingUnavailableError,
    );
  });

  it('throws GeocodingUnavailableError when Nominatim responds with an error', async () => {
    global.fetch = jest.fn().mockResolvedValue(errorResponse(503));

    await expect(reverseGeocode({ lat: 0, lng: 0 })).rejects.toThrow(
      GeocodingUnavailableError,
    );
  });
});
