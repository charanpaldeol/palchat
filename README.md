# Reclaim

Frontend (Astro) and standalone API for [Reclaim](https://www.reclaim.org). Deploy separately so backend and frontend can be updated independently.

## Repo layout

| Path | Purpose |
|------|--------|
| **myastosite/** | Astro frontend (Reclaim site). Vercel builds from this directory. |
| **api/** | Standalone Vercel API (auth, blog, thoughts, db-health). Deploy as a second Vercel project. |
| **docs/** | Setup and hosting docs (Neon, hosting options). |
| **scripts/** | Repo-level scripts (e.g. create Vercel API project). |
| **sql/** | Database migrations (run from `myastosite`; see [Running migrations](#running-migrations)). |
| **DESIGN_SYSTEM.md** | Design system for all UI work. |

## Run locally

1. **API** (optional for full behavior; contact form works without it):

   ```bash
   cd api && npm install && npx vercel dev
   ```
   Serves API at `http://localhost:3000`. See [api/README.md](api/README.md) for env vars.

2. **Frontend**

   ```bash
   cd myastosite && npm install && npm run dev
   ```
   Open **http://localhost:4321**

   With the API running, set `API_URL=http://localhost:3000` in `myastosite/.env` so `/api/*` is proxied to the API.

## Build

```bash
cd myastosite && npm run build
```

## Deploy

- **Frontend:** Vercel with **Root Directory** = `myastosite` (see root [vercel.json](vercel.json)). Add rewrites so `/api/*` goes to the API project.
- **API:** Second Vercel project with **Root Directory** = `api`. Full steps in [api/README.md](api/README.md).

## Running migrations

From the repo root or from `myastosite`:

```bash
cd myastosite && node scripts/run-migration.js
```

Requires `DATABASE_URL` in `myastosite/.env`. Migrations live in the repo root [sql/](sql/) directory. See [docs/neon-setup.md](docs/neon-setup.md) for DB setup.

## Docs and guides

- [docs/neon-setup.md](docs/neon-setup.md) — Connect to Neon Postgres
- [docs/hosting-options.md](docs/hosting-options.md) — Hosting and database options
- [api/README.md](api/README.md) — API setup, deploy, and endpoints
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Typography, colors, components
- [SECURITY.md](SECURITY.md) — Security notes

**Site-specific:** [myastosite/EMAIL_SETUP.md](myastosite/EMAIL_SETUP.md), [myastosite/FONT_CONSISTENCY_GUIDE.md](myastosite/FONT_CONSISTENCY_GUIDE.md)
