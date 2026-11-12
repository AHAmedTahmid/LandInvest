import fs from "node:fs";
import path from "node:path";

const MOD_DIR = path.join(process.cwd(), "docs", "05-modules");
fs.mkdirSync(MOD_DIR, { recursive: true });
const VERIFIED_DATE = "2026-11-12";

const modules = [
  {
    file: "01-auth-and-tenants.md",
    title: "Module 01: Auth & Tenant Management",
    purpose: "Authenticates users, manages password resets and forced password changes, and provisions isolated tenant databases on signup.",
    who: "All users (`/login`, `/change-password`, `/forgot-password`, `/reset-password/[token]`); prospective owners (`/signup`).",
    screens: "`/login`, `/signup`, `/forgot-password`, `/reset-password/[token]`, `/change-password`, `/invite/[token]`.",
    flow: `flowchart LR\n  Login["/login"] --> Auth["src/auth.ts (Credentials)"]\n  Auth --> CDB["control_plane.global_users + tenants"]\n  CDB -->|Valid| JWT["Signed JWT Session"]`,
    data: "Reads/Writes `control_plane.tenants`, `control_plane.global_users`, `control_plane.password_reset_tokens`, `control_plane.user_invitations`.",
    rules: "Active check on every session callback (`src/auth.ts`); suspended/cancelled tenants blocked; rate limiting (`AUTH_RATE_LIMIT_MAX`).",
    calc: "N/A (bcrypt cost factor hashing & token expiry timestamps).",
    integrations: "Provides `tenantId`, `user_id`, and `isOwner` to `src/lib/tenant.ts` and `src/lib/rbac.ts`.",
    codeMap: "`src/auth.ts`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/api/signup/route.ts`, `src/app/api/auth/*`, `src/worker.ts`.",
    edgeCases: "Deactivated users or suspended tenants are rejected on the next session check even if their JWT has not expired.",
    limitations: "Email delivery for password resets/invites is not wired to an external SMTP provider by default.",
  },
  {
    file: "02-partners-and-capital.md",
    title: "Module 02: Partners & Capital",
    purpose: "Tracks syndicate investors, opening equity, capital deposits, withdrawals, direct project expenses, and profit credits.",
    who: "Owner, Managing Partner (`partners.view`, `partners.manage`, `partners.capital.deposit`, `partners.capital.withdraw`, `partners.ledger.view`).",
    screens: "`/partners` (directory), `/partners/dashboard`, `/partners/capital` (deposits & withdrawals).",
    flow: `flowchart LR\n  Cap["/partners/capital"] --> TX["$transaction"]\n  TX --> PT["partner_transactions"]\n  TX --> TL["treasury_ledger"]`,
    data: "Reads/Writes `partners`, `partner_transactions`, `treasury_ledger`, `bank_accounts`, `audit_log`.",
    rules: "Partner capital deposits/withdrawals must update `treasury_ledger` (and `bank_accounts` if BANK) atomically with `audit_log` (`BR-10`, `BR-11`).",
    calc: "**Worked Example:** Opening `৳ 50,00,000` + Deposit `৳ 10,00,000` + Profit Credit `৳ 4,50,000` - Direct Expense `৳ 50,000` - Withdrawal `৳ 2,00,000` = Net Capital `৳ 62,00,000`.",
    integrations: "Feeds `project_partners` share splits, `project_expenses` (`PAID_BY_PARTNER`), `profit_distributions`, and Partner reports.",
    codeMap: "`src/app/partners/**`, `src/app/api/partners/route.ts`, `src/lib/reports/partner-*.ts`.",
    edgeCases: "Opening balance must be included alongside `partner_transactions` when computing total partner net position.",
    limitations: "`POST` mutations use Server Actions rather than `/api/partners` (which is GET-only).",
  },
  {
    file: "03-cash-and-bank-ledger.md",
    title: "Module 03: Cash & Bank Ledger (Treasury)",
    purpose: "Maintains real-time Cash-in-Hand and Bank account balances through an immutable CREDIT/DEBIT ledger and approved contra transfers.",
    who: "Owner, Managing Partner, Accountant (`treasury.view`, `treasury.bank.manage`, `treasury.contra.create`, `treasury.contra.approve`).",
    screens: "`/treasury`, `/treasury/dashboard`, `/treasury/accounts`, `/treasury/transactions`, `/treasury/approvals`.",
    flow: `flowchart LR\n  Acct["Accountant Contra"] -->|Pending| Req["treasury_transfer_requests"]\n  Req -->|Owner Approves| Led["treasury_ledger + bank_accounts"]`,
    data: "Reads/Writes `bank_accounts`, `treasury_ledger`, `treasury_transfer_requests`, `audit_log`.",
    rules: "Non-approvers queue contra transfers as `PENDING`; approvers post paired `DEBIT` and `CREDIT` rows (`BR-13`). `PAID_BY_PARTNER` never writes `treasury_ledger` (`BR-01`).",
    calc: "**Worked Example:** Cash Opening `৳ 5,00,000` + Sale Advance `৳ 3,00,000` - Contra to Bank `৳ 2,00,000` = Cash Balance `৳ 6,00,000`; Bank increases by `+৳ 2,00,000`.",
    integrations: "Receives debits from approved `CASH`/`BANK` expenses and credits from `customer_payments` and partner deposits.",
    codeMap: "`src/lib/treasury.ts`, `src/app/treasury/**`, `src/app/api/banks/route.ts`, `src/app/api/treasury/contra/**`.",
    edgeCases: "Contra transfers requiring a bank account validate `bankAccountId` exists and is active.",
    limitations: "Bank reconciliation against external bank CSV statements is not yet automated.",
  },
  {
    file: "04-land-and-acquisition.md",
    title: "Module 04: Land & Acquisition",
    purpose: "Manages land development projects, Bangladeshi deed metadata (Mouza, JL, Dag, Khatian), and partner ownership percentages.",
    who: "Owner, Managing Partner, Site Manager (`projects.view`, `projects.create`, `projects.edit`, `projects.delete`).",
    screens: "`/projects`, `/projects/new` (acquisition wizard), `/projects/[id]`.",
    flow: `flowchart LR\n  Wiz["/projects/new"] --> LP["land_projects"]\n  Wiz --> PP["project_partners (100%)"]\n  Wiz --> Plots["project_plots (optional)"]`,
    data: "Reads/Writes `land_projects`, `project_partners`, `project_plots`, `audit_log`.",
    rules: "Partner `share_percent` per project must sum to 100% (`BR-03`). Area stored in Shotok (`BR-12`).",
    calc: "**Worked Example:** Acquired `66 Shotok` (`2 Bigha` / `40 Katha`). Partner A (`60%`) + Partner B (`40%`) = `100%`.",
    integrations: "Parent entity for `project_plots`, `project_expenses`, `land_sales`, and `profit_distributions`.",
    codeMap: "`src/app/projects/**`, `src/app/api/projects/route.ts`, `src/lib/area.ts`.",
    edgeCases: "Land acquisition costs (Bayna, Registration) are recorded as `project_expenses` linked to `project_id`.",
    limitations: "Project-level document file attachments (scanned deeds) are limited compared to expense vouchers.",
  },
  {
    file: "05-plots.md",
    title: "Module 05: Plots & Inventory",
    purpose: "Subdivides acquired project land into saleable plots, tracks Shotok size and asking price, and locks sold/booked inventory.",
    who: "Owner, Managing Partner, Site Manager (`plots.manage`, `projects.view`).",
    screens: "`/projects/plots`, `/projects/[id]`.",
    flow: `flowchart LR\n  Avail["AVAILABLE"] -->|Installment Sale| Booked["BOOKED"]\n  Avail -->|100% Upfront Sale| Sold["SOLD"]\n  Booked -->|Due = 0| Sold`,
    data: "Reads/Writes `project_plots`, `land_projects`, `audit_log`.",
    rules: "Total subdivided plot Shotok cannot exceed project saleable area (`BR-04`); only `AVAILABLE` plots can be booked/sold (`BR-05`).",
    calc: "**Worked Example:** `5.00 Shotok` plot @ `৳ 2,50,000/Shotok` = Asking Price `৳ 12,50,000.00` (`≈ 3.03 Katha`).",
    integrations: "Consumed by `POST /api/sales` (single, multi-plot, whole-project) and `plot-inventory` report.",
    codeMap: "`src/app/projects/plots/page.tsx`, `src/lib/tenantRules.ts` (`sellPlot`), `src/lib/area.ts`.",
    edgeCases: "Multi-plot sales store the first plot in `land_sales.plot_id` while updating all selected plots in `project_plots`.",
    limitations: "Automated plot-hold expiry timer is not yet scheduled in `src/worker.ts`.",
  },
  {
    file: "06-project-expenses.md",
    title: "Module 06: Project Expenses",
    purpose: "Captures project acquisition, legal, development, and overhead expenses with approval workflow and 3 payment channels.",
    who: "Site Manager, Accountant, Managing Partner, Owner (`expenses.view`, `expenses.create`, `expenses.approve`, `expenses.delete`).",
    screens: "`/expenses`, `/expenses/dashboard`, `/expenses/approvals`, `/expenses/breakdown`.",
    flow: `flowchart LR\n  Post["POST /api/expenses (PENDING)"] --> App["POST /api/expenses/[id]/approve"]\n  App -->|CASH/BANK| TL["treasury_ledger"]\n  App -->|PAID_BY_PARTNER| PT["partner_transactions"]`,
    data: "Reads/Writes `project_expenses`, `treasury_ledger`, `bank_accounts`, `partner_transactions`, `audit_log`.",
    rules: "`PAID_BY_PARTNER` never touches `treasury_ledger` (`BR-01`); only `APPROVED` expenses count in PnL (`BR-02`). Validates category, positive amount, and channel requirements.",
    calc: "**Worked Example:** `৳ 85,000` (`DEVELOPMENT`, `CASH`) approved -> `project_expenses.status = APPROVED`, `treasury_ledger` debited `৳ 85,000`.",
    integrations: "Linked to `vouchers` UI, `treasury_ledger`, `partner_transactions`, `project-cost`, and `project-pnl`.",
    codeMap: "`src/app/expenses/**`, `src/app/api/expenses/route.ts`, `src/app/api/expenses/[id]/approve/route.ts`.",
    edgeCases: "Supports both snake_case and camelCase FormData keys and returns `400` JSON on invalid/missing fields.",
    limitations: "Uploaded voucher files are saved locally without strict MIME allowlist checks.",
  },
  {
    file: "07-voucher-management.md",
    title: "Module 07: Voucher Management",
    purpose: "Provides centralized voucher listing, approval actions, and printable voucher retrieval for expenses.",
    who: "Accountant, Managing Partner, Owner (`expenses.view`, `expenses.approve`).",
    screens: "`/vouchers`.",
    flow: `flowchart LR\n  List["/vouchers (GET /api/vouchers)"] --> Action["POST /api/vouchers/[id]/action"]\n  List --> Print["GET /api/expenses/[id]/voucher"]`,
    data: "Reads/Writes `project_expenses`, `audit_log` (and treasury/partner ledgers on approval).",
    rules: "Voucher approvals follow the same `BR-01` and `BR-02` rules as `/expenses/approvals`.",
    calc: "N/A (delegates ledger math to expense approval).",
    integrations: "Backed by `project_expenses` and `src/lib/storage.ts` for attached receipt images.",
    codeMap: "`src/app/vouchers/page.tsx`, `src/app/api/vouchers/**`, `src/app/api/expenses/[id]/voucher/route.ts`.",
    edgeCases: "Expenses without an uploaded voucher image still generate a printable system voucher.",
    limitations: "Bulk multi-voucher approval in one click is not implemented.",
  },
  {
    file: "08-plot-sales-and-dues.md",
    title: "Module 08: Plot Sales & Dues",
    purpose: "Handles single-plot, multi-plot, and whole-project sales, installment schedules, FIFO collections, overpayment guards, and money receipts.",
    who: "Owner, Managing Partner, Accountant (`sales.view`, `sales.create`, `sales.collect`, `receipts.print`).",
    screens: "`/sales`, `/sales/bookings`, `/sales/dues`, `/sales/[id]`.",
    flow: `flowchart LR\n  Create["POST /api/sales"] --> Guard{"advance <= total?"}\n  Guard -->|Yes| Sale["land_sales + installment_schedule"]\n  Pay["POST /api/sales/[id]/pay"] --> FIFO["collectPayment() FIFO"]`,
    data: "Reads/Writes `land_sales`, `project_plots`, `installment_schedule`, `customer_payments`, `treasury_ledger`, `bank_accounts`, `audit_log`.",
    rules: "Advance <= total price (`BR-06`), payment <= `currentDueAmount` (`BR-07`), FIFO installment settlement (`BR-08`), full payment sets `PAID_IN_FULL` & `SOLD` (`BR-09`).",
    calc: "**Worked Example:** Price `৳ 12,00,000`, Advance `৳ 2,00,000`, 4 installments -> `current_due_amount = ৳ 10,00,000` (`৳ 2,50,000` each). Paying `৳ 2,50,000` settles Installment #1 (`PAID`) and lowers due to `৳ 7,50,000`.",
    integrations: "Credits `treasury_ledger` / `bank_accounts` and feeds Sales/Collection/Receivables reports.",
    codeMap: "`src/app/sales/**`, `src/app/api/sales/**`, `src/lib/collections.ts`, `src/lib/tenantRules.ts`.",
    edgeCases: "Bank/Cheque/MFS advance payments validate that a valid `bank_account` is selected.",
    limitations: "Multi-plot sales link `land_sales.plot_id` to the first plot; individual secondary plot IDs are tracked via `project_plots.status` & `audit_log`.",
  },
  {
    file: "09-reports.md",
    title: "Module 09: Reports & Profit Distribution",
    purpose: "Provides 26 financial, partner, project, sales, profit, and audit reports with Grid/List catalog views, Fiscal Year filtering, and PDF/Excel export.",
    who: "Role-gated per category (`reports.view`, `reports.export`, `reports.*.view`, `profit.distribute`).",
    screens: "`/reports` (catalog with category filters & Grid/List toggle), `/reports/[key]`, `/reports/project-pnl`.",
    flow: `flowchart LR\n  Cat["/reports"] --> Detail["/reports/[key]?preset=this_fy"]\n  Detail --> FY["Resolve active FY (fiscalYear.ts)"]\n  Detail --> Export["/api/reports/[key]?format=pdf|excel"]`,
    data: "Reads all financial/operational tables; writes `profit_distributions`, `partner_transactions`, `audit_log` on profit distribution.",
    rules: "Only `APPROVED` expenses count (`BR-02`); `this_fy` uses tenant's active FY from `dashboard_settings` when custom dates aren't passed.",
    calc: "**Worked Example:** Revenue `৳ 50,00,000` - Approved Expenses `৳ 35,00,000` = Net Profit `৳ 15,00,000`. Partner (60%) = `৳ 9,00,000`; Partner (40%) = `৳ 6,00,000`.",
    integrations: "Shares query logic with Dashboard widgets; exports via Puppeteer (`pdf.ts`) and Excel HTML (`excel.ts`).",
    codeMap: "`src/app/reports/**`, `src/components/reports/**`, `src/lib/reports/**`, `src/app/api/reports/**`.",
    edgeCases: "Switching preset in `ReportFilters.tsx` omits stale `from`/`to` dates unless `custom` is selected.",
    limitations: "PDF export requires Chromium via Puppeteer; falls back to HTML if Chromium fails to launch.",
  },
  {
    file: "10-audit-trail.md",
    title: "Module 10: Audit Trail",
    purpose: "Displays an immutable, filterable log of every create, update, approval, and settings change with actor attribution.",
    who: "Owner, Managing Partner, Auditors (`audit.view`, `reports.audit.view`).",
    screens: "`/audit`, `/reports/audit-trail`, `/reports/user-activity`, `/reports/reconciliation`.",
    flow: `flowchart LR\n  Mut["Any Financial/Settings Mutation"] --> WA["writeAudit()"]\n  WA --> AL["audit_log (old_values, new_values, changed_by)"]`,
    data: "Reads `audit_log` and `control_plane.global_users` (actor names/emails).",
    rules: "Every financial write must create an `audit_log` row with non-null `changed_by` (`BR-10`).",
    calc: "N/A (append-only event log).",
    integrations: "Called inside `$transaction` across expenses, sales, payments, contra transfers, profit distribution, and Fiscal Years.",
    codeMap: "`src/app/audit/page.tsx`, `src/lib/tenantRules.ts` (`writeAudit`), `src/lib/reports/audit-trail.ts`.",
    edgeCases: "Reconciliation report cross-checks ledger sums against cached balances.",
    limitations: "Control-plane `audit_logs` are separate from tenant `audit_log`.",
  },
  {
    file: "11-users-and-invites.md",
    title: "Module 11: Users & Invitations",
    purpose: "Allows administrators to create staff accounts, send invite tokens, assign roles, reset passwords, and deactivate users.",
    who: "Owner (`users.view`, `users.manage`).",
    screens: "`/settings/users`, `/invite/[token]`.",
    flow: `flowchart LR\n  Admin["/settings/users"] -->|Direct| Create["POST /api/users (mustChangePassword=true)"]\n  Admin -->|Invite| Inv["POST /api/invites -> /invite/[token]"]`,
    data: "Reads/Writes `control_plane.global_users`, `control_plane.user_invitations`, `tenant.user_roles`, `tenant.roles`.",
    rules: "Self-lockout protection prevents admins from deactivating themselves; deactivated users lose session access immediately.",
    calc: "N/A.",
    integrations: "Links `global_users.id` to `tenant.user_roles.user_id`.",
    codeMap: "`src/app/settings/users/**`, `src/app/api/users/**`, `src/app/api/invites/**`, `src/app/invite/[token]/page.tsx`.",
    edgeCases: "Invite acceptance atomically marks `user_invitations.acceptedAt` and creates `global_users` + `user_roles`.",
    limitations: "Invite links must be copied/shared manually unless an email sender is configured.",
  },
  {
    file: "12-roles-and-permissions.md",
    title: "Module 12: Roles & Permissions",
    purpose: "Manages tenant RBAC roles, permission assignments across 79 keys, and role duplication.",
    who: "Owner (`roles.manage`).",
    screens: "`/settings/roles`.",
    flow: `flowchart LR\n  UI["/settings/roles"] --> API["/api/roles & /api/roles/[id]"]\n  API --> DB["roles + role_permissions"]`,
    data: "Reads/Writes `roles`, `role_permissions`, `user_roles`.",
    rules: "System `Owner` role cannot be edited or deleted (`BR-14`); changes take effect immediately on next request.",
    calc: "N/A.",
    integrations: "Evaluated by `can()` in `src/lib/rbac.ts` across every page, API, and dashboard widget.",
    codeMap: "`src/app/settings/roles/**`, `src/app/api/roles/**`, `src/lib/permissions.ts`, `src/lib/rbac.ts`, `src/lib/seedRoles.ts`.",
    edgeCases: "Duplicate role endpoint (`/api/roles/[id]/duplicate`) clones permissions into a non-system custom role.",
    limitations: "Permission keys are code-defined in `src/lib/permissions.ts`.",
  },
  {
    file: "13-dashboard-and-fiscal-years.md",
    title: "Module 13: Executive Dashboard & Fiscal Years (FY)",
    purpose: "Renders permission-gated executive KPIs/charts across 6 tabs and lets admins configure Fiscal Years and the active reporting FY.",
    who: "All authenticated staff (`dashboard.view`, `dashboard.tab.*`, `dashboard.widget.*`); FY mutations require `dashboard.settings.manage`, `roles.manage`, or `users.manage`.",
    screens: "`/dashboard`, `/settings/fiscal-years`.",
    flow: `flowchart LR\n  Dash["/dashboard"] --> Layout["/api/dashboard/layout + /api/dashboard/widgets/[key]"]\n  FY["/settings/fiscal-years"] --> Settings["dashboard_settings (fiscal_years)"]\n  Settings -->|fy-updated| Header["AppShell Header FY Badge"]`,
    data: "Reads/Writes `dashboard_layouts`, `dashboard_settings`, `audit_log`.",
    rules: "Current active FY cannot be deleted (`BR-14`); duplicate FY labels and `endDate < startDate` are rejected with `400`.",
    calc: "**Worked Example:** BD FY `2026-2027` runs `2026-07-01` to `2027-06-30`; switching active FY updates `AppShell` header badge and `preset=this_fy` reports.",
    integrations: "Drives `preset=this_fy` date filtering in `/reports/[key]` and `/api/reports/[key]`.",
    codeMap: "`src/app/dashboard/**`, `src/lib/dashboard/**`, `src/lib/fiscalYear.ts`, `src/app/settings/fiscal-years/**`, `src/app/api/settings/fiscal-years/route.ts`.",
    edgeCases: "If `fiscal_years` has not been customized yet, `getFiscalYears()` returns default BD Jul–Jun current & previous FYs.",
    limitations: "Widget data queries assume a single active FY badge at a time.",
  },
  {
    file: "14-billing.md",
    title: "Module 14: SaaS Billing",
    purpose: "Tracks tenant subscription plans and invoices in the control plane.",
    who: "Owner (`billing.manage`).",
    screens: "`/settings/billing`.",
    flow: `flowchart LR\n  Inv["GET /api/billing/invoices"] --> Pay["POST /api/billing/pay (Stub)"]\n  Pay --> CDB["control_plane.billing_invoices (PAID)"]`,
    data: "Reads/Writes `control_plane.billing_invoices`, `control_plane.subscription_plans`, `control_plane.tenants`.",
    rules: "Restricted to `billing.manage` (Owner role).",
    calc: "Plan price in BDT (`subscription_plans.price_bdt`) per billing cycle.",
    integrations: "Reads `tenantId` from session JWT.",
    codeMap: "`src/app/settings/billing/**`, `src/app/api/billing/invoices/route.ts`, `src/app/api/billing/pay/route.ts`.",
    edgeCases: "Non-owners receive `403 Forbidden`.",
    limitations: "**Stubbed:** `/api/billing/pay` simulates payment without a live bKash/SSLCommerz/Stripe gateway.",
  },
];

for (const m of modules) {
  const md = `# ${m.title}

**Last Verified:** ${VERIFIED_DATE}

1. **Purpose:** ${m.purpose}
2. **Who Uses It:** ${m.who}
3. **Screens & Routes:** ${m.screens}
4. **Main Workflow:**

\`\`\`mermaid
${m.flow}
\`\`\`

5. **Data (Tables Read & Written):** ${m.data}
6. **Business Rules:** ${m.rules}
7. **Calculations:** ${m.calc}
8. **Integrations:** ${m.integrations}
9. **Code Map:** ${m.codeMap}
10. **Edge Cases & Validations:** ${m.edgeCases}
11. **Known Limitations:** ${m.limitations}
`;
  fs.writeFileSync(path.join(MOD_DIR, m.file), md, "utf8");
}

console.log(`Generated ${modules.length} module docs in docs/05-modules/.`);
