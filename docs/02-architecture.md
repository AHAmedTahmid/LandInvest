# 02. System Architecture

**Purpose:** Explains LandInvest's multi-tenant architecture, request lifecycle, database client caching, and codebase layering.  
**Intended Reader:** Technical Lead, Backend Developer, Architect.  
**Last Verified:** 2026-11-12

---

## High-Level System Architecture

```mermaid
flowchart LR
  Browser["Browser (React 19 / Next.js UI)"] -->|HTTPS / HTTP| NextApp["Next.js 16 App Router\n(Pages, API Routes, Server Actions)"]
  NextApp -->|Auth, Tenant Lookup, Billing| ControlDB[("MySQL: control_plane\n(7 tables)")]
  NextApp -->|Cached PrismaClient per tenantId| TenantDB[("MySQL: tenant_<slug>\n(19 tables per tenant)")]
  NextApp -->|Rate Limit & Enqueue Jobs| Redis[("Redis 6.2+\n(BullMQ Streams)")]
  Redis -->|tenant-provisioning| Worker["BullMQ Worker\n(src/worker.ts)"]
  Worker -->|CREATE DATABASE + prisma db push + seed| TenantDB
  Worker -->|Update tenant status| ControlDB
  NextApp -->|Voucher Uploads| Storage["Local File Storage\n(src/lib/storage.ts)"]
  NextApp -->|HTML -> PDF| Puppeteer["Puppeteer / Chromium\n(src/lib/reports/pdf.ts)"]
```

---

## Multi-Tenant Design: Database-Per-Tenant

LandInvest uses a **hybrid control-plane + database-per-tenant** model:
- **`control_plane` (1 shared database):** Stores registered tenants (`tenants`), user login credentials (`global_users`), invitations, password resets, subscription plans, and billing invoices.
- **`tenant_*` (1 database per customer):** Stores all operational ERP data (partners, projects, plots, expenses, sales, ledgers, roles, audit logs).

### Why This Was Chosen (`Inferred reason:`)
- **Hard Data Isolation:** A bug in a SQL `WHERE` clause cannot leak one syndicate's financial data to another customer because their data lives in separate MySQL schemas.
- **Per-Customer Backup & Export:** An individual tenant database can be backed up, restored, or offboarded without touching other tenants.

### Trade-Offs
- **Migrations Across Tenants:** Any change to `prisma/tenant/schema.prisma` must be pushed to *every* active tenant database.
- **Connection Management:** Each active tenant requires its own `PrismaClient` connection pool.

---

## Request Lifecycle (Sequence)

```mermaid
sequenceDiagram
  autonumber
  actor U as User (Browser)
  participant N as Next.js Route / RSC
  participant A as Auth.js (src/auth.ts)
  participant C as MySQL (control_plane)
  participant T as Tenant Client Cache (src/lib/tenant.ts)
  participant D as MySQL (tenant_db)

  U->>N: HTTP Request with JWT Cookie
  N->>A: getServerSession(authOptions)
  A->>C: Verify global_users.isActive & tenant.status
  alt Invalid / Suspended / Inactive
    C-->>A: Inactive or not found
    A-->>N: null session
    N-->>U: 401 Unauthorized / Redirect /login
  else Active User & Tenant
    C-->>A: Valid user + tenantId
    A-->>N: Session object
    N->>T: getTenantClientFromSession()
    T->>C: Lookup tenant dbName by tenantId
    T->>T: Return cached PrismaClient from globalThis.tenantClients Map
    N->>D: can(session, "permission.key") -> check user_roles & role_permissions
    alt Missing Permission
      N-->>U: 403 Forbidden / Forbidden UI Marker
    else Permitted
      N->>D: Execute business query / $transaction + writeAudit()
      D-->>N: Result
      N-->>U: 200 JSON / Rendered HTML
    end
  end
```

---

## Tenant Database Client Caching & Connection Limits

Implemented in [`src/lib/tenant.ts`](../src/lib/tenant.ts):
- `globalThis.tenantClients` holds a `Map<string, PrismaClient>` keyed by `tenant.id`.
- `getTenantClient(tenant)` checks `globalForTenant.tenantClients.get(tenant.id)` (and verifies `(cached as any).dashboardLayout` exists to handle hot-reload schema updates in dev) before instantiating a new `PrismaClient` with `mysql://${tenant.dbUser}:@localhost:3306/${tenant.dbName}`.
- **Note on Connection Limits:** No explicit `connection_limit` query parameter or LRU eviction is currently set on `globalThis.tenantClients` (noted in `19-known-issues-and-roadmap.md`).

---

## Folder & Layer Overview

| Layer | Location | Responsibility |
|---|---|---|
| **App Router UI & Pages** | `src/app/**/page.tsx` | Server Components (auth/RBAC checks + initial data fetch) and `*Client.tsx` interactive views. |
| **API Routes** | `src/app/api/**/route.ts` | REST/JSON & file-upload/PDF/Excel endpoints. |
| **Core Domain & Rules** | `src/lib/` | `tenantRules.ts`, `collections.ts`, `treasury.ts`, `fiscalYear.ts`, `rbac.ts`, `permissions.ts`, `format.ts`, `area.ts`. |
| **Reports & Dashboard** | `src/lib/reports/`, `src/lib/dashboard/` | 26 report query modules + PDF/Excel builders + widget registry. |
| **Background Worker** | `src/worker.ts` | BullMQ worker for `tenant-provisioning`. |
| **Database Schemas** | `prisma/control/schema.prisma`, `prisma/tenant/schema.prisma` | Separate Prisma schemas & generated clients (`src/generated/control`, `src/generated/tenant`). |
| **Scripts & Tests** | `scripts/` | Setup, seeding, acceptance (`acceptance.mjs`), Fiscal Year TDD (`test_fiscal_years.mjs`), Full E2E (`test_full_project.mjs`). |
`;
