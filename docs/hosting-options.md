# Hosting + database: simpler options

You can keep your domain and code and only change where the database comes from, or move app + DB to one provider. Below are options from “least change” to “all-in-one”.

---

## Option 1 — Stay on Vercel, add a Postgres provider (easiest)

**Idea:** Keep hosting and domain on Vercel. Add a managed Postgres that gives a connection string. No IAM, no AWS RDS setup.

| Provider | What you get | Effort |
|----------|----------------|--------|
| **Neon** | Serverless Postgres, free tier, connection string in minutes. Works with Vercel. | Sign up at neon.tech → Create project → Copy `DATABASE_URL` → Add to Vercel env vars. Your existing `db.ts` already uses `DATABASE_URL`. |
| **Vercel Marketplace (Neon/Supabase)** | Postgres from Vercel dashboard; env vars can be linked to the project. | In Vercel project: Storage / Integrations → Add Postgres (Neon or Supabase) → env vars auto-added. |

**You keep:** Current repo, Vercel deployment, domain (reclaim.org).  
**You change:** Only where `DATABASE_URL` comes from (e.g. Neon or Marketplace).

---

## Option 2 — One platform: app + DB in the same place

**Idea:** Move both the Astro app and Postgres to a single provider. One dashboard, one bill, DB and app wired by default.

| Provider | What you get | Effort |
|----------|----------------|--------|
| **Railway** | Deploy app from GitHub + add PostgreSQL with one click. `DATABASE_URL` is created and injected. Custom domain supported. | Connect GitHub → New Project → Add PostgreSQL → Add GitHub repo as service → Set `DATABASE_URL` from PostgreSQL service → Add custom domain. Astro needs Node adapter and a start command (see [Railway Astro guide](https://docs.railway.com/guides/astro)). |
| **Render** | Web Service + PostgreSQL in one place. Free tier: DB and web service can spin down / have limits. Custom domain supported. | New Web Service from repo + New PostgreSQL → Use internal DB URL in env → Add custom domain. |

**You change:** Deployment target (Railway or Render instead of Vercel), and you point your domain there. Code stays the same apart from adapter/start command.

---

## Option 3 — Backend-in-a-box (Supabase) + keep Vercel

**Idea:** Use Supabase for Postgres (+ auth, APIs, optional realtime). Keep the frontend on Vercel and domain on Vercel.

| Provider | What you get | Effort |
|----------|----------------|--------|
| **Supabase** | Postgres, auth, REST/API, dashboard. Vercel integration in marketplace. | Create Supabase project → Get connection string and API keys → Add to Vercel env (or use Vercel + Supabase integration). Frontend stays on Vercel; only backend moves to Supabase. |

**You keep:** Vercel for the site and domain.  
**You change:** Database (and optionally auth) live in Supabase; you’d use `DATABASE_URL` from Supabase in `db.ts`, or use Supabase client for auth/tables.

---

## Recommendation

- **Fastest and least change:** Use **Neon** (or Postgres via **Vercel Marketplace**). Keep app and domain on Vercel; add one env var `DATABASE_URL`. No move, no IAM.
- **Want everything in one place:** Use **Railway** — one dashboard for app + Postgres, then point reclaim.org to Railway.

---

## If you choose Neon (minimal change)

1. Sign up at **https://neon.tech** and create a project (region close to your users).
2. In the Neon dashboard, open **Connection details** and copy the **connection string** (e.g. `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).
3. In **Vercel** → your project → **Settings** → **Environment variables** → add `DATABASE_URL` with that string (Production and optionally Preview).
4. Redeploy. Your existing `db.ts` will use it.
5. Run your schema (e.g. `docs/init-comments.sql`) once in Neon’s SQL editor or via `psql`.

No AWS, no IAM, no provider move — only the source of `DATABASE_URL` changes.
