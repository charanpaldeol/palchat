# Reclaim API (Backend)

Standalone API for Reclaim. Deploy separately from the frontend so backend and frontend can be deployed independently.

## Setup

1. **Install dependencies**

   ```bash
   cd api && npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string (same DB as before).
   - `ALLOWED_ORIGINS` – Comma-separated origins for Origin/Referer checks, e.g.  
     `https://www.reclaim.org,https://reclaim.org,http://localhost:4321`

## Local development

1. Start the API (from repo root):

   ```bash
   cd api && npx vercel dev
   ```

   By default this serves the API at `http://localhost:3000`.

2. In the frontend (`myastosite`), set in `.env`:

   ```env
   API_URL=http://localhost:3000
   ```

3. Start the frontend:

   ```bash
   cd myastosite && npm run dev
   ```

   The Astro dev server proxies `/api/*` to the API (see `astro.config.mjs`).

## Deploy (Vercel)

1. **Create a second Vercel project for the API**

   - In Vercel dashboard: Add New Project → Import the same repo.
   - Set **Root Directory** to `api`.
   - Add env vars: `DATABASE_URL`, `ALLOWED_ORIGINS` (include your production frontend URL and any preview URLs).

2. **Deploy the API**

   Deploy this project (e.g. from the `api` directory or by pushing with root dir `api`). Note the deployment URL (e.g. `https://reclaim-api-xxx.vercel.app`).

3. **Wire the frontend to the API**

   - In the **frontend** Vercel project (root directory `myastosite`):
     - Add env var: `API_URL` = your API deployment URL (e.g. `https://reclaim-api-xxx.vercel.app`).
     - In `myastosite/vercel.json`, replace the rewrite destination placeholder with that URL:
       - Change  
         `"destination": "https://YOUR_API_PROJECT.vercel.app/api/:path*"`  
         to  
         `"destination": "https://<your-actual-api-url>/api/:path*"`  
         (no trailing slash).
   - Redeploy the frontend.

After this, frontend and API deploy independently: change only frontend → deploy frontend; change only API → deploy API.

## Endpoints

- `GET /api/db-health` – DB health check
- `GET /api/auth/me` – Current user from session cookie (for middleware)
- `POST /api/auth/login` – Login (form)
- `POST /api/auth/register` – Register (form)
- `POST /api/auth/logout` – Logout
- `POST /api/auth/delete-account` – Delete account
- `POST /api/add-comment` – Add thought/comment
- `GET /api/thoughts` – List thoughts (for comments page)
- `GET /api/blog` – List blog posts
- `GET /api/blog/:slug` – Get one blog post
- `POST /api/blog/create` – Create blog post (auth required)
