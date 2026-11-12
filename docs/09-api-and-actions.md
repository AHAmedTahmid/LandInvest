# 09. API Routes & Server Actions Inventory

**Purpose:** Auto-extracted inventory of all Next.js App Router pages, API endpoints, and Server Action files with their detected permission checks.  
**Intended Reader:** Backend/Frontend Developers, Security Auditors.  
**Last Verified:** 2026-11-12

---

## Summary Counts
- **App Pages:** 37
- **API Route Handlers:** 39
- **Server Action Files:** 11

---

## API Endpoints (39)

| Route | Methods | Detected Permission Check(s) | File |
|---|---|---|---|
| `/api/auth/change-password` | POST | **None / Public or Session-only** | `src/app/api/auth/change-password/route.ts` |
| `/api/auth/forgot-password` | POST | **None / Public or Session-only** | `src/app/api/auth/forgot-password/route.ts` |
| `/api/auth/reset-password` | GET, POST | **None / Public or Session-only** | `src/app/api/auth/reset-password/route.ts` |
| `/api/auth/[...nextauth]` | HANDLER | **None / Public or Session-only** | `src/app/api/auth/[...nextauth]/route.ts` |
| `/api/banks` | GET | **None / Public or Session-only** | `src/app/api/banks/route.ts` |
| `/api/billing/invoices` | GET | `billing.manage` | `src/app/api/billing/invoices/route.ts` |
| `/api/billing/pay` | POST | `billing.manage` | `src/app/api/billing/pay/route.ts` |
| `/api/dashboard/insights` | GET | `dashboard.view` | `src/app/api/dashboard/insights/route.ts` |
| `/api/dashboard/layout` | GET, POST | `dashboard.view`, `dashboard.layout.manage`, `dashboard.customize` | `src/app/api/dashboard/layout/route.ts` |
| `/api/dashboard/widgets/[key]` | GET | **None / Public or Session-only** | `src/app/api/dashboard/widgets/[key]/route.ts` |
| `/api/expenses` | GET, POST | `expenses.view`, `expenses.create` | `src/app/api/expenses/route.ts` |
| `/api/expenses/[id]/approve` | POST | `expenses.approve` | `src/app/api/expenses/[id]/approve/route.ts` |
| `/api/expenses/[id]/voucher` | GET | `expenses.view` | `src/app/api/expenses/[id]/voucher/route.ts` |
| `/api/invites/accept` | POST | **None / Public or Session-only** | `src/app/api/invites/accept/route.ts` |
| `/api/invites` | GET, POST | `users.manage`, `users.view` | `src/app/api/invites/route.ts` |
| `/api/me/permissions` | GET | **None / Public or Session-only** | `src/app/api/me/permissions/route.ts` |
| `/api/partners` | GET | **None / Public or Session-only** | `src/app/api/partners/route.ts` |
| `/api/projects` | GET | **None / Public or Session-only** | `src/app/api/projects/route.ts` |
| `/api/reports/pnl/distribute` | POST | `profit.distribute` | `src/app/api/reports/pnl/distribute/route.ts` |
| `/api/reports/pnl/excel` | GET | `dashboard.view` | `src/app/api/reports/pnl/excel/route.ts` |
| `/api/reports/pnl/pdf` | GET | `dashboard.view` | `src/app/api/reports/pnl/pdf/route.ts` |
| `/api/reports/pnl` | GET | `profit.view` | `src/app/api/reports/pnl/route.ts` |
| `/api/reports/[key]` | GET | `reports.export` | `src/app/api/reports/[key]/route.ts` |
| `/api/roles` | GET, POST | `roles.manage` | `src/app/api/roles/route.ts` |
| `/api/roles/[id]/duplicate` | POST | `roles.manage` | `src/app/api/roles/[id]/duplicate/route.ts` |
| `/api/roles/[id]` | PATCH, DELETE | `roles.manage` | `src/app/api/roles/[id]/route.ts` |
| `/api/sales` | GET, POST | `sales.view`, `sales.create` | `src/app/api/sales/route.ts` |
| `/api/sales/[id]/pay` | POST | `sales.view` | `src/app/api/sales/[id]/pay/route.ts` |
| `/api/sales/[id]/receipt` | GET | `sales.view` | `src/app/api/sales/[id]/receipt/route.ts` |
| `/api/settings/fiscal-years` | GET, POST | `dashboard.settings.manage`, `roles.manage`, `users.manage` | `src/app/api/settings/fiscal-years/route.ts` |
| `/api/signup` | POST | **None / Public or Session-only** | `src/app/api/signup/route.ts` |
| `/api/treasury/contra` | GET, POST | `treasury.contra.create`, `treasury.contra.approve`, `treasury.view` | `src/app/api/treasury/contra/route.ts` |
| `/api/treasury/contra/[id]/approve` | POST | `treasury.contra.approve` | `src/app/api/treasury/contra/[id]/approve/route.ts` |
| `/api/users` | GET, POST | `users.view`, `users.manage` | `src/app/api/users/route.ts` |
| `/api/users/[id]/reset` | POST | `users.manage` | `src/app/api/users/[id]/reset/route.ts` |
| `/api/users/[id]` | PATCH, DELETE | `users.manage` | `src/app/api/users/[id]/route.ts` |
| `/api/vouchers` | GET | `expenses.view` | `src/app/api/vouchers/route.ts` |
| `/api/vouchers/[id]/action` | POST | `expenses.approve` | `src/app/api/vouchers/[id]/action/route.ts` |
| `/api/vouchers/[id]` | GET, PATCH | `expenses.view`, `expenses.create`, `expenses.approve` | `src/app/api/vouchers/[id]/route.ts` |

---

## Server Action Files (11)

| File | Exported Server Actions | Detected Permission Check(s) |
|---|---|---|
| `src/app/partners/capital/page.tsx` | - | `partners.capital.deposit`, `partners.manage`, `partners.view` |
| `src/app/partners/page.tsx` | - | `partners.manage`, `partners.view` |
| `src/app/projects/new/page.tsx` | - | `projects.view`, `projects.create` |
| `src/app/projects/plots/page.tsx` | - | `projects.view`, `plots.manage`, `projects.create`, `projects.edit` |
| `src/app/projects/[id]/page.tsx` | - | `projects.view`, `projects.edit`, `plots.manage` |
| `src/app/reports/project-pnl/page.tsx` | - | `profit.view`, `reports.view`, `profit.distribute`, `reports.export` |
| `src/app/sales/[id]/page.tsx` | - | `sales.view` |
| `src/app/settings/billing/page.tsx` | - | `billing.manage` |
| `src/app/treasury/accounts/page.tsx` | - | `treasury.bank.manage`, `treasury.view` |
| `src/app/treasury/approvals/page.tsx` | - | `treasury.view`, `treasury.contra.approve` |
| `src/app/treasury/page.tsx` | - | `treasury.view`, `treasury.contra.approve`, `treasury.contra.create` |

---

## App Pages (37)

| Route | Type | Detected Server Permission Check(s) | File |
|---|---|---|---|
| `/audit` | Page (RSC) | `audit.view` | `src/app/audit/page.tsx` |
| `/change-password` | Page (RSC) | Client/Session gated | `src/app/change-password/page.tsx` |
| `/dashboard` | Page (RSC) | `dashboard.view`, `dashboard.customize`, `dashboard.layout.manage`, `dashboard.export` | `src/app/dashboard/page.tsx` |
| `/expenses/approvals` | Page (RSC) | `expenses.view`, `expenses.approve` | `src/app/expenses/approvals/page.tsx` |
| `/expenses/breakdown` | Page (RSC) | `expenses.view` | `src/app/expenses/breakdown/page.tsx` |
| `/expenses/dashboard` | Page (RSC) | `expenses.view` | `src/app/expenses/dashboard/page.tsx` |
| `/expenses` | Page (RSC) | `expenses.view`, `expenses.approve`, `expenses.create` | `src/app/expenses/page.tsx` |
| `/forgot-password` | Page (RSC) | Client/Session gated | `src/app/forgot-password/page.tsx` |
| `/invite/[token]` | Page (RSC) | Client/Session gated | `src/app/invite/[token]/page.tsx` |
| `/login` | Page (RSC) | Client/Session gated | `src/app/login/page.tsx` |
| `/` | Page (RSC) | Client/Session gated | `src/app/page.tsx` |
| `/partners/capital` | Page (RSC) | `partners.capital.deposit`, `partners.manage`, `partners.view` | `src/app/partners/capital/page.tsx` |
| `/partners/dashboard` | Page (RSC) | `partners.view`, `partners.manage` | `src/app/partners/dashboard/page.tsx` |
| `/partners` | Page (RSC) | `partners.manage`, `partners.view` | `src/app/partners/page.tsx` |
| `/projects/new` | Page (RSC) | `projects.view`, `projects.create` | `src/app/projects/new/page.tsx` |
| `/projects` | Page (RSC) | `projects.view`, `projects.create` | `src/app/projects/page.tsx` |
| `/projects/plots` | Page (RSC) | `projects.view`, `plots.manage`, `projects.create`, `projects.edit` | `src/app/projects/plots/page.tsx` |
| `/projects/[id]` | Page (RSC) | `projects.view`, `projects.edit`, `plots.manage` | `src/app/projects/[id]/page.tsx` |
| `/reports` | Page (RSC) | Client/Session gated | `src/app/reports/page.tsx` |
| `/reports/project-pnl` | Page (RSC) | `profit.view`, `reports.view`, `profit.distribute`, `reports.export` | `src/app/reports/project-pnl/page.tsx` |
| `/reports/[key]` | Page (RSC) | `reports.export` | `src/app/reports/[key]/page.tsx` |
| `/reset-password/[token]` | Page (RSC) | Client/Session gated | `src/app/reset-password/[token]/page.tsx` |
| `/sales/bookings` | Page (RSC) | `sales.view`, `sales.create`, `sales.collect` | `src/app/sales/bookings/page.tsx` |
| `/sales/dues` | Page (RSC) | `sales.view`, `sales.collect` | `src/app/sales/dues/page.tsx` |
| `/sales` | Page (RSC) | `sales.view`, `sales.create`, `sales.collect` | `src/app/sales/page.tsx` |
| `/sales/[id]` | Page (RSC) | `sales.view` | `src/app/sales/[id]/page.tsx` |
| `/settings/billing` | Page (RSC) | `billing.manage` | `src/app/settings/billing/page.tsx` |
| `/settings/fiscal-years` | Page (RSC) | `dashboard.settings.manage`, `roles.manage`, `users.manage` | `src/app/settings/fiscal-years/page.tsx` |
| `/settings/roles` | Page (RSC) | `roles.manage` | `src/app/settings/roles/page.tsx` |
| `/settings/users` | Page (RSC) | `users.manage` | `src/app/settings/users/page.tsx` |
| `/signup` | Page (RSC) | Client/Session gated | `src/app/signup/page.tsx` |
| `/treasury/accounts` | Page (RSC) | `treasury.bank.manage`, `treasury.view` | `src/app/treasury/accounts/page.tsx` |
| `/treasury/approvals` | Page (RSC) | `treasury.view`, `treasury.contra.approve` | `src/app/treasury/approvals/page.tsx` |
| `/treasury/dashboard` | Page (RSC) | `treasury.view` | `src/app/treasury/dashboard/page.tsx` |
| `/treasury` | Page (RSC) | `treasury.view`, `treasury.contra.approve`, `treasury.contra.create` | `src/app/treasury/page.tsx` |
| `/treasury/transactions` | Page (RSC) | `treasury.view` | `src/app/treasury/transactions/page.tsx` |
| `/vouchers` | Page (RSC) | Client/Session gated | `src/app/vouchers/page.tsx` |
