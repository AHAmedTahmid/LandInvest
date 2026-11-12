# 18. Architecture & Design Decision Log

**Purpose:** Records key architectural and product decisions, alternatives considered, and trade-offs.  
**Intended Reader:** Technical Lead, New Developer, Business Owner.  
**Last Verified:** 2026-11-12

---

| # | Decision | Choice Made | Alternatives Considered | Reason & Evidence | Trade-Off |
|---|---|---|---|---|---|
| **D-01** | Multi-tenancy isolation | **Database-per-tenant** (`control_plane` + `tenant_<slug>`) | Shared database with `tenant_id` row-level filtering | `Inferred reason:` Hard physical isolation between competing land syndicates and per-tenant backup/restore. | Schema changes must roll out to every tenant DB (`src/lib/tenant.ts`). |
| **D-02** | Primary Database | **MySQL 8.4** | PostgreSQL | Configured across `prisma/control/schema.prisma`, `prisma/tenant/schema.prisma`, and `mysql2` scripts. | Cross-DB foreign keys are enforced in app code rather than SQL constraints. |
| **D-03** | ORM Setup | **Prisma with dual schemas** | Single schema / raw SQL only | Separate `prisma/control` and `prisma/tenant` schemas generate isolated clients (`src/generated/*`). | Two `prisma generate` targets to maintain. |
| **D-04** | Full-stack Framework | **Next.js 16 App Router + Server Actions + API Routes** | Separate SPA + Express backend | Unified TypeScript codebase with server-side RBAC gating (`src/app/`). | Dev server uses `next dev --webpack` on Windows. |
| **D-05** | Authentication | **Auth.js v4 Credentials + JWT** | OAuth-only / Database sessions | Simple email/password login for syndicate staff with live `isActive` DB re-check (`src/auth.ts`). | Requires `NEXTAUTH_SECRET` and manual password reset token handling. |
| **D-06** | Primary Keys | **UUID v4 (`CHAR(36)`)** | Auto-increment integers | Application-generated `randomUUID()` allows pre-generating IDs for audit logs inside transactions. | Slightly larger index size than `BIGINT`. |
| **D-07** | Land Area Base Unit | **Shotok (`DECIMAL`)** | Sqft / Katha as base | Standard Bangladeshi unit across rural/peri-urban land (`project_plots.plot_size_shotok`, `src/lib/area.ts`). | UI converts to Katha/Bigha on display. |
| **D-08** | Treasury Balances | **Ledger-derived (`treasury_ledger`)** | Mutable balance columns only | Immutable `CREDIT`/`DEBIT` ledger guarantees full auditability (`src/lib/treasury.ts`, `src/lib/collections.ts`). | `bank_accounts.current_balance` must stay synced in `$transaction`. |
| **D-09** | Dashboard RBAC | **Per-tab & per-widget permissions** | Single all-or-nothing dashboard flag | Allows Owners to grant Accountants financial widgets without exposing executive profit charts (`src/lib/permissions.ts`). | 79 permission keys to manage. |
| **D-10** | Acquisition Costs | **Reuse `project_expenses`** | Separate acquisition cost table | Bayna, registration, and development costs flow through one voucher approval & ledger pipeline (`src/app/api/expenses/route.ts`). | Relies on `expense_category` to distinguish land vs. development costs. |
| **D-11** | Local Infrastructure | **Native MySQL + Redis on Windows** | Docker Compose | `Inferred reason:` Explicit native service checks in `src/worker.ts` (`net start MySQL84`, `redis-windows 6.2+`). | Contributors must install MySQL & Redis locally. |
| **D-12** | SaaS Billing | **Stubbed billing module** | Live Stripe / SSLCommerz / bKash | `Inferred reason:` Data model (`billing_invoices`, `subscription_plans`) is ready while payment gateway integration is deferred. | Cannot collect real online payments yet. |
`;
writeDoc("18-decision-log.md", ...)`
