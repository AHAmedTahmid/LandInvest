# 04a. Database Overview

**Purpose:** High-level summary of LandInvest's dual-database MySQL architecture, totals, conventions, and Prisma schema verification.  
**Intended Reader:** Technical Lead, Database Administrator, New Developer.  
**Last Verified:** 2026-11-12

---

## Database Totals (Introspected Live from `information_schema`)

| Database | Tables | Views | Foreign Keys | Indexes | Engine | Charset / Collation |
|---|---:|---:|---:|---:|---|---|
| `control_plane` | 7 | 0 | 6 | 18 | InnoDB | `utf8mb4` / `utf8mb4_unicode_ci` |
| `tenant_demo` (per-tenant) | 19 | 0 | 17 | 57 | InnoDB | `utf8mb4` / `utf8mb4_unicode_ci` |
| **Combined Total** | **26** | **0** | **23** | **75** | InnoDB | `utf8mb4` |

---

## Prisma Schema vs Live MySQL Verification

| Schema | In Live MySQL but NOT in Prisma | In Prisma but NOT in Live MySQL |
|---|---|---|
| `prisma/control/schema.prisma` | None (100% match) | None (100% match) |
| `prisma/tenant/schema.prisma` | `default_categories` | None (100% match) |

> **Schema Mismatch Note:** `default_categories` is created directly via raw SQL in `src/worker.ts` (`seedDefaultCategories`) during tenant provisioning rather than via `prisma/tenant/schema.prisma`.

---

## Naming & Type Conventions

- **ID Strategy:** UUID v4 strings stored as `CHAR(36)` generated in application code via `crypto.randomUUID()`.
- **Money Type:** `DECIMAL(15, 2)` (or `DECIMAL(18, 2)` for larger aggregates); formatted in BDT using lakh/crore grouping in `src/lib/format.ts`.
- **Land Area Unit:** Base unit is **Shotok** (`DECIMAL(10, 2)` / `DECIMAL(12, 4)`); converted to Katha (`1 Katha = 1.65 Shotok`) and Bigha (`1 Bigha = 33 Shotok`) in `src/lib/area.ts` (*verify exact factor in 08-business-rules.md*).
- **Timestamps:** `DATETIME(3)` / `TIMESTAMP` in UTC/server time.
- **Logical Cross-Database Links:** Because tenant databases are separate MySQL schemas, cross-DB links (e.g., `tenant.user_roles.user_id` -> `control_plane.global_users.id`, `tenant.partners.global_user_id`, `created_by`, `approved_by`, `changed_by`) are validated in application code rather than MySQL foreign key constraints.

---

## Money Data Flow by Business Event

| Business Event | Tables Written | Tables Read |
|---|---|---|
| **Partner Capital Deposit** | `partner_transactions`, `treasury_ledger`, `bank_accounts` (if BANK), `audit_log` | `partners`, `bank_accounts` |
| **Partner Withdrawal** | `partner_transactions`, `treasury_ledger`, `bank_accounts` (if BANK), `audit_log` | `partners`, `treasury_ledger` |
| **Expense Create** | `project_expenses`, `audit_log` | `land_projects`, `bank_accounts`, `partners` |
| **Expense Approve (CASH/BANK)** | `project_expenses`, `treasury_ledger`, `bank_accounts` (if BANK), `audit_log` | `project_expenses`, `treasury_ledger` |
| **Expense Approve (PAID_BY_PARTNER)** | `project_expenses`, `partner_transactions` (`DIRECT_EXPENSE`), `audit_log` | `project_expenses`, `partners` |
| **Plot Sale + Advance** | `land_sales`, `project_plots`, `installment_schedule`, `customer_payments`, `treasury_ledger`, `bank_accounts`, `audit_log` | `project_plots`, `bank_accounts` |
| **Installment Collection** | `customer_payments`, `land_sales`, `installment_schedule` (FIFO), `project_plots` (to `SOLD` when due=0), `treasury_ledger`, `bank_accounts`, `audit_log` | `land_sales`, `installment_schedule` |
| **Contra Transfer** | `treasury_transfer_requests`, `treasury_ledger`, `bank_accounts`, `audit_log` | `treasury_ledger`, `bank_accounts` |
| **Profit Distribution** | `profit_distributions`, `partner_transactions` (`PROFIT_CREDIT`), `audit_log` | `land_projects`, `project_partners`, `land_sales`, `project_expenses` |
