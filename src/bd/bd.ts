import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';

export function getDb(env: { TURSO_URL: string; TURSO_AUTH_TOKEN?: string }) {
  const client = createClient({
    url: env.TURSO_URL,
    authToken: env.TURSO_AUTH_TOKEN || undefined,
  });

  const db = drizzle(client);
  return db;
}