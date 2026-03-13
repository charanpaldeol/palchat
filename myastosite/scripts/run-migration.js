/**
 * Run SQL migration file against Postgres.
 * Usage: node scripts/run-migration.js [path to .sql file]
 * Requires: DATABASE_URL in .env
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

async function run() {
  const sqlPath = process.argv[2] || path.join(__dirname, '../sql/001_comments.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration completed:', path.basename(sqlPath));
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
