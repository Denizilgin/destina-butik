import { createClient, Client } from "@libsql/client";

let client: Client | null = null;

/**
 * Local dev (and any host without Turso env vars) uses a plain SQLite file at
 * data/destina.db. Setting TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (e.g. on Vercel)
 * points the exact same client at a hosted Turso database instead — no code change.
 */
export function getDbClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL ?? "file:./data/destina.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getDbClient();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          slug TEXT PRIMARY KEY,
          name TEXT NOT NULL
        )
      `);
      await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price REAL NOT NULL,
          compareAtPrice REAL,
          images TEXT NOT NULL,
          gallery TEXT NOT NULL,
          sizes TEXT NOT NULL,
          colors TEXT NOT NULL,
          isNew INTEGER NOT NULL DEFAULT 0,
          inStock INTEGER NOT NULL DEFAULT 1,
          fabricCare TEXT NOT NULL,
          deliveryInfo TEXT NOT NULL,
          description TEXT NOT NULL,
          shopierUrl TEXT NOT NULL
        )
      `);
    })();
  }
  return schemaReady;
}
