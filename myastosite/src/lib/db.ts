import pg from "pg";
import type { PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Lazy-initialized pool so we don't crash at import when env is missing.
let pool: InstanceType<typeof Pool> | null = null;
let poolPromise: Promise<InstanceType<typeof Pool>> | null = null;

async function getPool(): Promise<InstanceType<typeof Pool>> {
  if (pool) return pool;
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("Database not configured: set DATABASE_URL");
    }
    const p = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.startsWith("postgresql://") && !databaseUrl.includes("localhost")
        ? { rejectUnauthorized: false }
        : undefined,
      max: 20,
    });
    pool = p;
    return p;
  })();

  return poolPromise;
}

/** Single query. */
export async function query(sql: string, args: unknown[] = []) {
  const p = await getPool();
  return p.query(sql, args);
}

/** Multiple queries in one connection (e.g. transaction). */
export async function withConnection<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const p = await getPool();
  const client = await p.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
