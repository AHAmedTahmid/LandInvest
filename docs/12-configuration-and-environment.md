# 12. Configuration & Environment Variables

**Purpose:** Lists all environment variable names, database-backed settings tables, and feature flags.  
**Intended Reader:** DevOps, New Developer, Technical Lead.  
**Last Verified:** 2026-11-12

---

## Environment Variables (Names Only — Never Commit Secrets)

| Variable Name | Purpose | Required | Example Placeholder |
|---|---|---|---|
| `DATABASE_URL_CONTROL` | MySQL connection string for `control_plane` | Yes | `mysql://user:pass@localhost:3306/control_plane` |
| `DATABASE_URL_TENANT` | MySQL connection string for tenant Prisma CLI / default tenant | Yes | `mysql://user:pass@localhost:3306/tenant_demo` |
| `NEXTAUTH_SECRET` | Secret key for signing Auth.js JWTs | Yes | `<random-32-byte-hex-secret>` |
| `NEXTAUTH_URL` | Canonical base URL of the Next.js app | Yes | `http://localhost:3000` |
| `BASE_URL` | Used by test/acceptance scripts | For tests | `http://localhost:3000` |
| `REDIS_URL` | Redis connection URL for BullMQ & rate limiting | Yes (worker) | `redis://localhost:6379` |
| `AUTH_RATE_LIMIT_MAX` | Maximum login attempts per window | Optional | `20` |
| `NODE_ENV` | Runtime mode (`development` / `production`) | Standard | `development` |

*(Prisma-internal `PRISMA_*` and `DOTENV_*` variables referenced by generated clients do not need manual configuration.)*

---

## Database Settings Tables (`dashboard_settings`)

Stored in each tenant database (`dashboard_settings`: `id`, `setting_key`, `setting_value` JSON, `updated_by`, `updated_at`):

| `setting_key` | Managed By | Purpose & Default |
|---|---|---|
| `fiscal_years` | `src/lib/fiscalYear.ts`, `/settings/fiscal-years` | Array of `FiscalYearEntry` (`id`, `label`, `labelBn`, `startDate`, `endDate`, `isCurrent`, `status`). Defaults to current & previous Bangladesh Jul–Jun FYs if unset. |
| `alert_thresholds` (or dashboard insight keys) | `src/lib/dashboard/insights.ts` | Thresholds for cash alerts, overdue installments, and executive notifications. |

---

## Feature Flags

- No external feature-flag service is used. Feature visibility is controlled by **RBAC permissions** (`src/lib/permissions.ts`) and tenant status (`control_plane.tenants.status` in `["active", "trial"]`).
`;
writeDoc("12-configuration-and-environment.md", ...)`
