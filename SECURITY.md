# Security

## Tech stack and connections

- **Frontend**: Astro (SSR) on Vercel; HTTPS and TLS are enforced by Vercel.
- **Database**: Neon Postgres; app connects with TLS and **certificate verification enabled** (`rejectUnauthorized: true`). Never disable verification for production.
- **Secrets**: `DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASS` (if used) must be set in Vercel Environment Variables only. Never commit real credentials; use `.env.example` as a template and keep `.env` in `.gitignore`.

## Measures in place

1. **TLS for DB**: `src/lib/db.ts` and `scripts/run-migration.js` use `rejectUnauthorized: true` for non-local Postgres so connections are encrypted and server certificates are verified.
2. **Open redirect**: `/api/add-comment` accepts only allowlisted redirect paths (`/add-comment`, `/comments`). User-controlled redirects to external URLs are rejected.
3. **CSRF**: POST to `/api/add-comment` requires a same-origin `Origin` or `Referer`; cross-site form posts are rejected with 403.
4. **SQL**: Comments are inserted via parameterized queries only; no string concatenation into SQL.
5. **Security headers** (Vercel): `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` to restrict camera/microphone/geolocation.
6. **Input limits**: Comment length enforced (non-empty, ≤ 50 words) before DB write.

## Recommendations

- **Rate limiting**: Add rate limiting for `/api/add-comment` (and any future contact/form APIs) to reduce spam and abuse (e.g. Vercel serverless + external store like Upstash, or a Vercel middleware with a simple in-memory store for low traffic).
- **Health endpoint**: `/api/db-health` is useful for monitoring but exposes DB connectivity. Consider restricting it (e.g. by IP or a secret query param) or moving it behind an internal-only check in production.
- **CSP**: A Content-Security-Policy header can be added in `vercel.json` if you want to lock down scripts and styles; ensure it allows `https://fonts.googleapis.com` and `https://fonts.gstatic.com` if you keep Google Fonts.

## Reporting issues

If you find a security vulnerability, please report it privately (e.g. via a private channel or email) rather than opening a public issue.
