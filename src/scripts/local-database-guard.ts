const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

// The seed wipes and rewrites rows, and production (Neon) is reached through
// the very same DATABASE_URL variable — so anything that isn't a local
// Postgres is refused outright rather than trusted to a NODE_ENV check.
export function assertLocalDatabaseUrl(databaseUrl: string | undefined): void {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const host = new URL(databaseUrl).hostname;
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Refusing to seed non-local database host "${host}" — dev seed only runs against localhost`,
    );
  }
}
