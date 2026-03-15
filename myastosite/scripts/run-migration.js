/**
 * Run SQL migration file(s) against Postgres.
 * Usage:
 *   node scripts/run-migration.js              — run all migrations in sql/ (001 through 005)
 *   node scripts/run-migration.js sql/005_contact_submissions.sql  — run one file
 * Requires: DATABASE_URL in .env
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlDir = path.join(__dirname, '../sql');
const { Client } = pg;

function getMigrationPaths() {
  const arg = process.argv[2];
  if (arg) {
    const resolved = path.isAbsolute(arg) ? arg : path.join(__dirname, '..', arg);
    return [resolved];
  }
  const names = fs.readdirSync(sqlDir).filter((n) => n.endsWith('.sql')).sort();
  return names.map((n) => path.join(sqlDir, n));
}

async function run() {
  const paths = getMigrationPaths();
  const isLocal = process.env.DATABASE_URL?.includes('localhost');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_URL && !isLocal
        ? { rejectUnauthorized: true }
        : undefined,
  });

  try {
    await client.connect();
    for (const sqlPath of paths) {
      if (!fs.existsSync(sqlPath)) {
        console.error('File not found:', sqlPath);
        process.exit(1);
      }
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await client.query(sql);
      console.log('Migration completed:', path.basename(sqlPath));
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
