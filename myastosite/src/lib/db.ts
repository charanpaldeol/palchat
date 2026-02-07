import { Pool, PoolClient } from "pg";

// Lazy-initialized pool so we don't crash at import when env is missing.
let pool: Pool | null = null;
let poolPromise: Promise<Pool> | null = null;

async function getPool(): Promise<Pool> {
  if (pool) return pool;
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    const databaseUrl = process.env.DATABASE_URL;

    // Local / simple: use DATABASE_URL (e.g. postgres://user:pass@host:5432/db)
    if (databaseUrl) {
      const p = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.startsWith("postgresql://") && !databaseUrl.includes("localhost")
          ? { rejectUnauthorized: false }
          : undefined,
        max: 20,
      });
      pool = p;
      return p;
    }

    // Vercel + Aurora: use OIDC + RDS Signer (requires PGHOST, PGUSER, AWS_ROLE_ARN, etc.)
    const host = process.env.PGHOST;
    const roleArn = process.env.AWS_ROLE_ARN;
    if (host && roleArn) {
      const { awsCredentialsProvider } = await import("@vercel/functions/oidc");
      const { attachDatabasePool } = await import("@vercel/functions");
      const { Signer } = await import("@aws-sdk/rds-signer");

      const signer = new Signer({
        hostname: host,
        port: Number(process.env.PGPORT) || 5432,
        username: process.env.PGUSER,
        region: process.env.AWS_REGION,
        credentials: awsCredentialsProvider({
          roleArn,
          clientConfig: { region: process.env.AWS_REGION },
        }),
      });

      const password = await signer.getAuthToken();
      const p = new Pool({
        host,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE || "postgres",
        password,
        port: Number(process.env.PGPORT) || 5432,
        ssl: { rejectUnauthorized: false },
        max: 20,
      });
      attachDatabasePool(p);
      pool = p;
      return p;
    }

    throw new Error(
      "Database not configured: set DATABASE_URL (local) or PGHOST + PGUSER + AWS_ROLE_ARN (Vercel Aurora)"
    );
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
