# 06. End-to-End Business Workflows

**Purpose:** Step-by-step explanations and Mermaid diagrams for all core LandInvest workflows.  
**Intended Reader:** Business Owner, Technical Lead, QA Engineer, New Developer.  
**Last Verified:** 2026-11-12

---

## 1. Tenant Signup & Provisioning

1. User submits organization name, email, and password at `/signup` (`POST /api/signup`).
2. API creates a `tenants` row (`status = "trial"`, unique `db_name`) and `global_users` row (`isOwner = true`), then enqueues a job on BullMQ queue `tenant-provisioning`.
3. `src/worker.ts` picks up the job, runs `CREATE DATABASE`, pushes `prisma/tenant/schema.prisma`, seeds `default_categories`, seeds 4 default roles, and assigns `Owner` to the signup user.

```mermaid
sequenceDiagram
  actor Owner
  participant API as POST /api/signup
  participant CDB as control_plane
  participant Q as Redis (tenant-provisioning)
  participant W as src/worker.ts
  participant TDB as tenant_<slug>

  Owner->>API: Submit org & owner credentials
  API->>CDB: Insert Tenant + GlobalUser (isOwner=1)
  API->>Q: Enqueue provisioning job
  API-->>Owner: 200 Queued
  W->>Q: Consume job
  W->>TDB: CREATE DATABASE + prisma db push
  W->>TDB: Seed default_categories + 4 roles + assign Owner
```

---

## 2. Login, Session & Tenant Resolution

1. User submits email + password at `/login` (`next-auth` CredentialsProvider).
2. `src/auth.ts` verifies `global_users.passwordHash` (`bcryptjs`), `isActive === true`, and `tenant.status` in `["active", "trial"]`.
3. JWT stores `tenantId`, `user_id`, `isOwner`, `dbName`. Subsequent requests call `getTenantClientFromSession()` to resolve the cached `PrismaClient` for that tenant.

---

## 3. User Invitation & Direct Creation

- **Direct Creation:** Admin creates user via `POST /api/users` with role + temporary password (`mustChangePassword = true`).
- **Invitation:** Admin sends invite via `POST /api/invites` creating a `user_invitations` token; invitee accepts at `/invite/[token]`.

---

## 4. Capital Pooling (Partner Deposit / Withdrawal)

1. Manager/Owner records a deposit or withdrawal on `/partners/capital`.
2. Within `$transaction`: writes `partner_transactions`, writes `treasury_ledger` (`CASH` or `BANK`), updates `bank_accounts.current_balance` if `BANK`, and records `audit_log`.

```mermaid
flowchart LR
  P["Partner Capital Form"] --> TX["Prisma $transaction"]
  TX --> PT["partner_transactions\n(DEPOSIT / WITHDRAWAL)"]
  TX --> TL["treasury_ledger\n(CASH or BANK)"]
  TL -->|If BANK| BA["bank_accounts.current_balance"]
  TX --> AL["audit_log"]
```

---

## 5. Land Acquisition & 6. Project Lifecycle State Machine

1. User completes the Land Acquisition wizard (`/projects/new`): project details, Mouza/JL/Dag/Khatian metadata, partner share % (must sum to 100%), and optional placeholder plot generation.
2. Project transitions across lifecycle states:

```mermaid
stateDiagram-v2
  [*] --> ACQUIRING: Project Created (Bayna / Acquisition)
  ACQUIRING --> ACTIVE: Acquisition Approved / Land Registered
  ACTIVE --> COMPLETED: All Plots Sold & Profit Distributed
  ACQUIRING --> ON_HOLD: Paused
  ACTIVE --> ON_HOLD: Paused
  ON_HOLD --> ACTIVE: Resumed
```

---

## 7. Expense Voucher Approval & Three Payment Channels

1. User creates an expense (`POST /api/expenses`) -> status `PENDING` + `audit_log`.
2. Approver clicks Approve/Reject (`POST /api/expenses/[id]/approve`):
   - **CASH:** Writes `treasury_ledger` (`CASH`, `DEBIT`).
   - **BANK:** Writes `treasury_ledger` (`BANK`, `DEBIT`) and decrements `bank_accounts.current_balance`.
   - **PAID_BY_PARTNER:** Never touches `treasury_ledger`; writes `partner_transactions` (`DIRECT_EXPENSE`)!

```mermaid
flowchart TD
  Create["POST /api/expenses -> status: PENDING"] --> Decision{"POST /api/expenses/[id]/approve"}
  Decision -->|REJECTED| Rej["Update status=REJECTED + audit_log"]
  Decision -->|APPROVED| Channel{"payment_channel?"}
  Channel -->|CASH| Cash["Write treasury_ledger (CASH DEBIT) + audit_log"]
  Channel -->|BANK| Bank["Write treasury_ledger (BANK DEBIT) + decrement bank_accounts + audit_log"]
  Channel -->|PAID_BY_PARTNER| Partner["Write partner_transactions (DIRECT_EXPENSE) + audit_log\n(NO treasury_ledger write)"]
```

---

## 8. Plot Status State Machine

```mermaid
stateDiagram-v2
  [*] --> AVAILABLE: Plot Created / Generated
  AVAILABLE --> BOOKED: Partial / Installment Sale Created
  AVAILABLE --> SOLD: 100% Upfront Payment Sale Created
  BOOKED --> SOLD: Installments Settled (current_due_amount == 0)
```

---

## 9. Plot Sale, Installments & Collections

1. Sale created via `POST /api/sales` (single plot, multi-plot `plot_ids`, or `is_whole_project`). Validates `advance <= total_agreed_price`.
2. Creates `land_sales` (`PAID_IN_FULL`, `PARTIAL`, or `BOOKED`), updates `project_plots` (`SOLD` or `BOOKED`), generates `installment_schedule` rows, and records advance in `customer_payments` + `treasury_ledger`.
3. Subsequent payments (`POST /api/sales/[id]/pay` via `collectPayment()` in `src/lib/collections.ts`) validate `amount <= currentDueAmount`, settle `installment_schedule` rows **FIFO**, update `land_sales.status` to `PAID_IN_FULL` and plots to `SOLD` when due reaches `0`.

```mermaid
flowchart LR
  Sale["POST /api/sales"] -->|Advance > 0| PayAdv["customer_payments + treasury_ledger"]
  Sale -->|Installments > 0| Sched["installment_schedule (UPCOMING)"]
  Collect["POST /api/sales/[id]/pay"] --> Guard{"amount <= currentDueAmount?"}
  Guard -->|No| Err["400 Error"]
  Guard -->|Yes| FIFO["Settle installment_schedule FIFO\n+ customer_payments + treasury_ledger"]
  FIFO -->|due == 0| Sold["land_sales=PAID_IN_FULL\nproject_plots=SOLD"]
```

---

## 10. Contra Transfer (Cash ↔ Bank)

- **Accountant** (`POST /api/treasury/contra` without `treasury.contra.approve`): creates a `PENDING` `treasury_transfer_requests` row.
- **Owner / Managing Partner** (`POST /api/treasury/contra/[id]/approve` or direct creation): writes paired `DEBIT` and `CREDIT` rows in `treasury_ledger`, updates `bank_accounts.current_balance`, and records `audit_log`.

---

## 11. Profit Calculation & Distribution

```mermaid
flowchart LR
  Rev["Total Sales Revenue\n(land_sales)"] --> Net["Net Profit =\nRevenue - Approved Project Expenses"]
  Exp["Approved project_expenses"] --> Net
  Net --> Split["Split by project_partners.share_percent\n(Total = 100%)"]
  Split --> Dist["profit_distributions + partner_transactions (PROFIT_CREDIT) + audit_log"]
```

---

## 12. Report Generation & Export

1. User opens `/reports` (filterable by category and switchable between Grid/List view).
2. Opens `/reports/[key]`, selects preset (including `this_fy` which resolves the tenant's active Fiscal Year from `dashboard_settings`) or custom dates.
3. Exports via `/api/reports/[key]?format=pdf|excel` using Puppeteer (PDF) or HTML table (Excel).

---

## 13. Role & Permission Changes

1. Admin edits role permissions in `/settings/roles` (`PATCH /api/roles/[id]`).
2. Because `can()` queries `user_roles -> role_permissions` from the tenant DB on each request, permission changes take effect **immediately** without requiring user re-login.

---

## 14. Tenant Backup, Restore & Migration Rollout

- **Backup:** `mysqldump` of `control_plane` + each `tenant_*` database.
- **Restore:** `mysql < backup.sql` into target DB.
- **Schema Rollout:** Iterate over all active `tenants.db_name` rows in `control_plane` and execute `prisma db push --schema=prisma/tenant/schema.prisma` with `DATABASE_URL_TENANT` set per tenant.
`;
writeDoc("06-workflows.md", ...)`
