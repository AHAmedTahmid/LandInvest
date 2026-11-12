# 14. Deployment & Operations

**Purpose:** Production build, process management, backups, multi-tenant schema migrations, and release checklist.  
**Intended Reader:** DevOps Engineer, Technical Lead, Maintainer.  
**Last Verified:** 2026-11-12

---

## Production Build & Required Services

1. **Build:** `npm run build` (`next build`) followed by `npm run start` (`next start`).
2. **Required Services:**
   - Next.js web process (`npm run start`)
   - BullMQ worker process (`npm run worker`)
   - MySQL 8.4+
   - Redis 6.2+
   - Chromium (for Puppeteer PDF exports)

> **Status:** `NOT IMPLEMENTED` — No production `Dockerfile`, `nginx.conf`, or `PM2` (`ecosystem.config.js`) manifest exists in the repository. **Recommendation:** Run Next.js and `npm run worker` under `pm2` or `systemd` behind Nginx/Caddy with TLS (`HTTPS`).

---

## Backup & Restore Strategy (`UNVERIFIED:` — No automated script in repo)

- **Control Plane Backup:**
  ```bash
  mysqldump -u <user> -p control_plane > control_plane_$(date +%F).sql
  ```
- **Single Tenant Backup:**
  ```bash
  mysqldump -u <user> -p tenant_<slug> > tenant_<slug>_$(date +%F).sql
  ```
- **Restore One Tenant:**
  ```bash
  mysql -u <user> -p tenant_<slug> < tenant_<slug>_2026-11-12.sql
  ```

---

## Rolling Out Schema Migrations Across All Tenants

Because each tenant has its own database, any change to `prisma/tenant/schema.prisma` must be applied to **every** tenant in `control_plane.tenants`:

```bash
# Example rollout loop (run after backing up all databases)
# Query SELECT db_name FROM control_plane.tenants WHERE status IN ('active', 'trial')
# For each db_name:
DATABASE_URL_TENANT="mysql://<user>:<pass>@localhost:3306/<db_name>" npx prisma db push --schema=prisma/tenant/schema.prisma
```

*(Also see `scripts/migrate_rbac.mjs` and `scripts/migrate_dashboard_schema.mjs` for existing multi-tenant rollout script patterns in this repo.)*

---

## Pre-Release Checklist

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes.
- [ ] `npm run test:fy`, `npm run test:all`, and `npm run acceptance` pass.
- [ ] Database backups taken for `control_plane` and all active `tenant_*` DBs.
- [ ] Schema changes pushed to all active tenant DBs.
- [ ] `npm run docs:generate` re-run if tables, permissions, routes, or reports changed.
`;
writeDoc("14-deployment-and-operations.md", ...)`
