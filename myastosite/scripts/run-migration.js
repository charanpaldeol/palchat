/**
 * Run SQL migration file against Postgres.
 * Usage: node scripts/run-migration.js [path to .sql file]
 * Requires: DATABASE_URL or PGHOST, PGUSER, PGPASSWORD, PGDATABASE
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

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
