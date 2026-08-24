import { chargeCurrency } from './country-currency';

describe('chargeCurrency', () => {
  it('returns the local currency for a country the platform can charge in', () => {
    expect(chargeCurrency('GB')).toBe('GBP');
  });

  it('falls back to ZAR for a country whose currency MCP does not support', () => {
    expect(chargeCurrency('KE')).toBe('ZAR');
  });

  it('falls back to ZAR for an unknown country code', () => {
    expect(chargeCurrency('XX')).toBe('ZAR');
  });
});
