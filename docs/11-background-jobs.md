# 11. Background Jobs & Worker Architecture

**Purpose:** Documents BullMQ queues, Redis requirements, tenant provisioning worker, and scheduled/missing jobs.  
**Intended Reader:** Backend Developer, DevOps / Maintainer.  
**Last Verified:** 2026-11-12

---

## Queue & Worker Overview (`src/worker.ts`)

LandInvest uses **BullMQ** (`bullmq`) backed by **Redis 6.2+** (`ioredis`). Start the worker with:

```bash
npm run worker
```

On startup, `src/worker.ts` verifies:
1. MySQL is reachable on `localhost:3306`.
2. Redis responds `PONG` and is version **6.2+** (required for BullMQ streams / `XADD`).

---

## Active Queues

### `tenant-provisioning`
- **Trigger:** Enqueued by `POST /api/signup` when a new organization signs up.
- **Job Payload:** `{ tenantId: string, dbName: string }`
- **Steps Executed:**
  1. `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  2. Runs `npx prisma db push --schema=prisma/tenant/schema.prisma --skip-generate` with `DATABASE_URL_TENANT` pointing to the new database.
  3. Calls `seedDefaultCategories(dbName)` (creates `default_categories` table and inserts 6 default categories idempotently).
  4. Calls `seedDefaultRoles(tPrisma, owner.id)` to create the 4 default roles (`Owner`, `Managing Partner`, `Accountant`, `Site Manager`) and assigns `Owner` to the signup `global_users` record.
- **Failure Handling & Monitoring:** Worker logs `[worker] provisioning ...` to stdout/stderr; failed jobs remain in BullMQ's failed set in Redis and can be inspected via BullMQ/Redis CLI (`LRANGE` / `XINFO`).

---

## Unimplemented / Planned Jobs (`UNVERIFIED:`)

- **Plot Hold Expiry:** `UNVERIFIED:` No scheduled BullMQ repeatable job currently expires plot holds automatically.
- **Automated Daily Snapshots / Backups:** `UNVERIFIED:` Not present in `src/worker.ts`.
`;
writeDoc("11-background-jobs.md", ...)`
