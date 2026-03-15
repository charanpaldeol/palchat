# Database migrations

Run all migrations (with `DATABASE_URL` set in `myastosite/.env`):

```bash
cd myastosite && node scripts/run-migration.js
```

Or run a single file:

```bash
cd myastosite && node scripts/run-migration.js sql/005_contact_submissions.sql
```

| File | Tables |
|------|--------|
| `001_comments.sql` | `thoughts` (legacy name: comments) |
| `002_users_and_sessions.sql` | `users`, `sessions` |
| `003_rename_comments_to_thoughts.sql` | renames comments → thoughts |
| `004_blog_posts.sql` | `blog_posts` |
| `005_contact_submissions.sql` | `contact_submissions` (contact form) |
