import { chargeCurrency } from './country-currency';

describe('chargeCurrency', () => {
  it('returns the local currency for a country the platform can charge in', () => {
    expect(chargeCurrency('GB')).toBe('GBP');
  });

  it('returns the local currency for any mapped country', () => {
    expect(chargeCurrency('KE')).toBe('KES');
  });

  it('falls back to ZAR for an unknown country code', () => {
    expect(chargeCurrency('XX')).toBe('ZAR');
  });
});
