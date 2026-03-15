# Database migrations

All migrations live in this directory (repo root `sql/`). Run them from the frontend app so `DATABASE_URL` from `myastosite/.env` is used.

**Run all migrations (in order 001–005):**

```bash
cd myastosite && node scripts/run-migration.js
```

**Run a single file:**

```bash
cd myastosite && node scripts/run-migration.js 005_contact_submissions.sql
```

Or with a path from repo root:

```bash
cd myastosite && node scripts/run-migration.js ../sql/005_contact_submissions.sql
```

| File | Tables |
|------|--------|
| `001_comments.sql` | `thoughts` (legacy name: comments) |
| `002_users_and_sessions.sql` | `users`, `sessions` |
| `003_rename_comments_to_thoughts.sql` | renames comments → thoughts |
| `004_blog_posts.sql` | `blog_posts` |
| `005_contact_submissions.sql` | `contact_submissions` (contact form) |

See [docs/neon-setup.md](../docs/neon-setup.md) for database setup.
