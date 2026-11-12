# 19. Known Issues, Tech Debt & Roadmap

**Purpose:** Candid inventory of incomplete/stubbed features, technical debt, dependency advisories, and prioritized next steps.  
**Intended Reader:** Technical Lead, Business Owner, Maintainer.  
**Last Verified:** 2026-11-12

---

## Severity-Ranked Issues & Tech Debt

| Severity | Item | Where | Details & Recommended Fix |
|---|---|---|---|
| **High** | **Hardcoded DB Credentials in `tenant.ts` & `worker.ts`** | `src/lib/tenant.ts`, `src/worker.ts` | Uses `root` with empty password on `localhost`. Parameterize host/user/password from encrypted tenant config or env vars before production. |
| **High** | **Stubbed Billing Payment Gateway** | `src/app/api/billing/pay/route.ts`, `/settings/billing` | Marks invoices paid without live gateway verification. Integrate SSLCommerz / bKash / Stripe + signed webhooks. |
| **High** | **Schema Mismatch: `default_categories`** | `src/worker.ts` vs `prisma/tenant/schema.prisma` | `default_categories` table is created via raw SQL in `src/worker.ts` and missing from `prisma/tenant/schema.prisma`. Add it to Prisma schema or remove raw DDL. |
| **Medium** | **17 `npm audit` Vulnerabilities** | `package-lock.json` (`docs/_generated/npm_audit.json`) | 1 critical, 9 high, 7 moderate advisories. Review and upgrade affected packages (`npm audit fix` / targeted bumps). |
| **Medium** | **No Bounded Pool / Eviction on `tenantClients`** | `src/lib/tenant.ts` | `globalThis.tenantClients` grows unboundedly as active tenants increase. Add LRU cache with `$disconnect()` eviction and `connection_limit`. |
| **Medium** | **Upload MIME/Size Validation** | `src/app/api/expenses/route.ts` | Voucher uploads should enforce allowed MIME types (`image/*`, `application/pdf`) and max file size. |
| **Low** | **No Automated Plot Hold Expiry Worker** | `src/worker.ts` | Only `tenant-provisioning` worker is active; add scheduled BullMQ job if temporary plot holds are used. |
| **Low** | **Production Deployment Manifests Missing** | Repository root | Add `ecosystem.config.js` (PM2), Nginx reverse proxy template, and automated `mysqldump` backup script. |

---

## Suggested Next Steps (Priority Order)

1. Parameterize MySQL credentials and `PrismaClient` connection limits in `src/lib/tenant.ts` and `src/worker.ts`.
2. Add `default_categories` to `prisma/tenant/schema.prisma` so Prisma and MySQL are 100% in sync.
3. Wire live transactional email (invitations & password resets) and payment gateway (billing).
4. Add Playwright browser E2E tests for client modals and set up automated daily DB backups.
`;
writeDoc("19-known-issues-and-roadmap.md", ...)`
