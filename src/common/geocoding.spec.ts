import { geocodeAddress } from './geocoding';

describe('geocodeAddress', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns coordinates for a successful lookup', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ lat: '-33.9249', lon: '18.4241' }]),
    });

    const point = await geocodeAddress('Cape Town, South Africa');

    expect(point).toEqual({ lat: -33.9249, lng: 18.4241 });
  });

  it('returns null when no results are found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const point = await geocodeAddress('asdkfjhaslkdjfh nonsense address');

    expect(point).toBeNull();
  });

  it('returns null when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const point = await geocodeAddress('Cape Town');

    expect(point).toBeNull();
  });

  it('sends a descriptive User-Agent header, per Nominatim usage policy', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ lat: '0', lon: '0' }]),
    });
    global.fetch = fetchMock;

    await geocodeAddress('Null Island');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['User-Agent']).toContain(
      'Gearloop',
    );
  });
});
