import pg from "pg";
import type { PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

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
    const isLocal = databaseUrl.includes("localhost");
    const p = new Pool({
      connectionString: databaseUrl,
      ssl:
        databaseUrl.startsWith("postgresql://") && !isLocal
          ? { rejectUnauthorized: true }
          : undefined,
      max: 20,
    });
    pool = p;
    return p;
  })();

  return poolPromise;
}

export async function query(sql: string, args: unknown[] = []) {
  const p = await getPool();
  return p.query(sql, args);
}

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
