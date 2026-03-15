# Migrations moved to repo root

Database migrations now live in the **repo root [sql/](../../sql/)** directory.

**Run all migrations:**

```bash
cd myastosite && node scripts/run-migration.js
```

**Run a single migration:**

```bash
cd myastosite && node scripts/run-migration.js 005_contact_submissions.sql
```

See [sql/README.md](../../sql/README.md) and [docs/neon-setup.md](../../docs/neon-setup.md) for details.
