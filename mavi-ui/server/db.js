// Postgres access for the serverless functions.
//
// Serverless invocations are short-lived, so we cache the pool on globalThis to
// reuse it across warm invocations instead of opening a new pool every call.
import pg from 'pg';

const { Pool } = pg;

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    // Small cap: each serverless instance keeps only a couple of connections.
    max: 2,
    idleTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_CA_CERT
      ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
      : { rejectUnauthorized: false },
  });
}

export function getPool() {
  if (!globalThis.__maviPool) {
    globalThis.__maviPool = createPool();
  }
  return globalThis.__maviPool;
}

// Create the chat_leads table on first use (cached so it runs once per instance).
export function ensureChatLeadsTable() {
  if (!globalThis.__maviSchemaReady) {
    globalThis.__maviSchemaReady = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS chat_leads (
          id          SERIAL PRIMARY KEY,
          name        TEXT NOT NULL,
          email       TEXT NOT NULL,
          company     TEXT,
          message     TEXT,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      .catch((err) => {
        // Reset so a later request can retry the creation.
        globalThis.__maviSchemaReady = null;
        throw err;
      });
  }
  return globalThis.__maviSchemaReady;
}
