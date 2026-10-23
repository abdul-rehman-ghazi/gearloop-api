import { assertLocalDatabaseUrl } from './local-database-guard';

describe('assertLocalDatabaseUrl', () => {
  it('accepts a localhost database', () => {
    expect(() =>
      assertLocalDatabaseUrl('postgresql://rental:pw@localhost:5432/rental'),
    ).not.toThrow();
  });

  it('accepts a 127.0.0.1 database', () => {
    expect(() =>
      assertLocalDatabaseUrl('postgresql://rental:pw@127.0.0.1:5432/rental'),
    ).not.toThrow();
  });

  it('rejects a remote database host', () => {
    expect(() =>
      assertLocalDatabaseUrl(
        'postgresql://u:pw@ep-cool-name.ap-southeast-1.aws.neon.tech/db',
      ),
    ).toThrow('Refusing to seed non-local database host');
  });

  it('rejects a host that only starts with localhost', () => {
    expect(() =>
      assertLocalDatabaseUrl('postgresql://u:pw@localhost.evil.com/db'),
    ).toThrow('Refusing to seed non-local database host');
  });

  it('rejects a missing url', () => {
    expect(() => assertLocalDatabaseUrl(undefined)).toThrow(
      'DATABASE_URL is not set',
    );
  });
});
