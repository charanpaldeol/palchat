# Connect Reclaim to Neon (Postgres)

Use Neon’s serverless Postgres with a single connection string. No IAM, no AWS — works with your existing `DATABASE_URL` setup.

---

## 1. Get your Neon connection string

You already have a Neon account. In the [Neon Console](https://console.neon.tech):

1. Open your project (or create one).
2. Go to **Dashboard** → **Connection details** (or **SQL Editor** for the connection string).
3. Copy the **connection string**.
   - For **Vercel/serverless**: prefer the **pooled** connection string (e.g. “Pooled connection” or endpoint with `-pooler`). This avoids exhausting connections with serverless functions.
   - Format is like:  
     `postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`

If you see both “Direct” and “Pooled”, use **Pooled** for production on Vercel.

---

## 2. Set `DATABASE_URL` locally

In `myastosite/`:

1. Copy the example env file if you don’t have `.env` yet:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set:
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```
   Use your actual Neon connection string (pooled recommended).

Do **not** commit `.env`; it’s in `.gitignore`.

---

## 3. Create the `comments` table in Neon (one-time)

In the Neon Console:

1. Open **SQL Editor**.
2. Run:

```sql
CREATE TABLE IF NOT EXISTS comments (
  id   SERIAL PRIMARY KEY,
  comment TEXT
);
```

Or run the project’s migration script (with `DATABASE_URL` in `myastosite/.env`):

```bash
cd myastosite && node scripts/run-migration.js
```

(This runs `sql/001_comments.sql` by default. Or pass a path: `node scripts/run-migration.js ../docs/init-comments.sql`.)

---

## 4. Verify locally

From `myastosite/`:

```bash
npm run dev
```

- Open **http://localhost:4321/api/db-health** — you should see `{"ok":true,"now":"..."}`.
- Open **http://localhost:4321/comments** — comments page should load (empty or with rows).

---

## 5. Use Neon on Vercel (production)

1. **Vercel** → your project → **Settings** → **Environment variables**.
2. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: your Neon connection string (pooled recommended).
   - **Environments**: Production (and Preview if you want).
3. Save and **redeploy**.

Optional: use the [Neon + Vercel integration](https://neon.tech/docs/guides/vercel-managed-integration) so Neon injects `DATABASE_URL` (and optionally preview DBs) for you.

---

## Summary

| Step | What to do |
|------|------------|
| 1 | Copy **pooled** connection string from Neon Console. |
| 2 | Set `DATABASE_URL` in `myastosite/.env` for local dev. |
| 3 | Run `docs/init-comments.sql` in Neon SQL Editor (or via migration script). |
| 4 | Run `npm run dev` and check `/api/db-health` and `/comments`. |
| 5 | Add `DATABASE_URL` in Vercel env vars and redeploy. |

Your app already uses `DATABASE_URL` in `src/lib/db.ts`; no code changes are required for Neon.
