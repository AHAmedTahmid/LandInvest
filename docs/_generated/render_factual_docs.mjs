import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GEN = path.join(ROOT, "docs", "_generated");
const DOCS = path.join(ROOT, "docs");
const VERIFIED_DATE = "2026-11-12";

const summary = JSON.parse(fs.readFileSync(path.join(GEN, "summary.json"), "utf8"));
const controlDb = JSON.parse(fs.readFileSync(path.join(GEN, "db_control_plane.json"), "utf8"));
const tenantDb = JSON.parse(fs.readFileSync(path.join(GEN, "db_tenant.json"), "utf8"));
const routes = JSON.parse(fs.readFileSync(path.join(GEN, "routes_and_actions.json"), "utf8"));
const deps = JSON.parse(fs.readFileSync(path.join(GEN, "dependencies.json"), "utf8"));
const perms = JSON.parse(fs.readFileSync(path.join(GEN, "permissions.json"), "utf8"));
const dashboard = JSON.parse(fs.readFileSync(path.join(GEN, "dashboard.json"), "utf8"));
const roles = JSON.parse(fs.readFileSync(path.join(GEN, "default_roles.json"), "utf8"));
const reports = JSON.parse(fs.readFileSync(path.join(GEN, "reports.json"), "utf8"));
const audit = JSON.parse(fs.readFileSync(path.join(GEN, "npm_audit.json"), "utf8"));

fs.mkdirSync(path.join(DOCS, "04-database"), { recursive: true });
fs.mkdirSync(path.join(DOCS, "05-modules"), { recursive: true });

function writeDoc(relPath, content) {
  const full = path.join(DOCS, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimEnd() + "\n", "utf8");
}

// 1. 03-tech-stack.md
function buildTechStack() {
  const reasons = {
    "@prisma/client": "Type-safe ORM with dual-schema support (control plane + per-tenant DBs)",
    bcryptjs: "Password hashing for Credentials authentication",
    bullmq: "Redis-backed job queue for asynchronous tenant provisioning",
    ioredis: "Redis client for BullMQ and rate limiting",
    "lucide-react": "Consistent SVG icon set across the UI",
    mysql2: "Direct MySQL driver for provisioning, seeding, and maintenance scripts",
    next: "Full-stack React framework (App Router, Server Components, API routes)",
    "next-auth": "Authentication and JWT session management (Auth.js v4)",
    puppeteer: "Headless Chromium for server-side PDF report & documentation generation",
    react: "UI component library",
    "react-dom": "React DOM renderer",
    recharts: "Interactive charts for executive and financial dashboards",
    "@tailwindcss/postcss": "Tailwind CSS v4 PostCSS integration",
    "@types/node": "TypeScript definitions for Node.js APIs",
    "@types/react": "TypeScript definitions for React",
    "@types/react-dom": "TypeScript definitions for React DOM",
    eslint: "Static code linting",
    "eslint-config-next": "Next.js recommended ESLint rules",
    prisma: "Prisma CLI for schema generation and db push",
    tailwindcss: "Utility-first CSS styling",
    tsx: "TypeScript script runner for workers, seeding, and doc generation",
    typescript: "Static type checking across app and scripts",
  };

  const rows = [...deps.dependencies, ...deps.devDependencies].map(
    (d) =>
      `| \`${d.name}\` | \`${d.locked}\` | \`${d.declared}\` | ${d.type} | ${reasons[d.name] || "Project dependency"} |`
  );

  const v = audit.metadata?.vulnerabilities || {};
  const vulnEntries = Object.entries(audit.vulnerabilities || {}).map(
    ([pkg, info]) => `| \`${pkg}\` | ${info.severity} | ${info.via?.map((x) => (typeof x === "string" ? x : x.title)).slice(0, 2).join("; ") || "-"} | ${info.fixAvailable ? "Yes" : "No"} |`
  );

  return `# 03. Tech Stack

**Purpose:** Complete inventory of languages, frameworks, libraries, runtime versions, and known dependency vulnerabilities.  
**Intended Reader:** Technical Lead, New Developer, DevOps / Maintainer.  
**Last Verified:** ${VERIFIED_DATE}

---

## Runtime & Platform Environment

| Component | Observed Value | Notes |
|---|---|---|
| **Language** | TypeScript \`^5\` + SQL (MySQL) | Strict type checking via \`npm run typecheck\` |
| **Runtime** | Node.js \`${deps.nodeVersion}\` | Native ESM (\`"type": "module"\` not set; \`.mjs\` for ESM scripts, \`tsx\` for TS scripts) |
| **Package Manager** | npm \`${deps.npmVersion}\` | Lockfile: \`package-lock.json\` |
| **Database Engine** | MySQL 8.4 (InnoDB, \`utf8mb4_unicode_ci\`) | Native Windows service on \`localhost:3306\` (no Docker required) |
| **Queue / Cache** | Redis 6.2+ (\`redis-windows\`) | Required by BullMQ streams (\`XADD\`) on \`localhost:6379\` |
| **OS Assumptions** | Windows 10/11 (dev) / Linux (prod) | \`next dev --webpack\` used on Windows for stability |

---

## Dependencies (Extracted from \`package.json\` & \`package-lock.json\`)

| Package | Locked Version | Declared Range | Kind | Purpose |
|---|---|---|---|---|
${rows.join("\n")}

---

## Known Vulnerabilities (\`npm audit\`)

Total dependencies scanned: **${audit.metadata?.dependencies?.total ?? "N/A"}** (${audit.metadata?.dependencies?.prod ?? 0} prod, ${audit.metadata?.dependencies?.dev ?? 0} dev).  
Summary: **${v.total ?? 0} vulnerabilities** (Critical: ${v.critical ?? 0}, High: ${v.high ?? 0}, Moderate: ${v.moderate ?? 0}, Low: ${v.low ?? 0}).

| Package | Severity | Advisory Summary | Fix Available |
|---|---|---|---|
${vulnEntries.join("\n") || "| None | - | - | - |"}
`;
}

// 2. Database docs helpers
const TABLE_META = {
  // Control plane
  tenants: { module: "Auth & Tenant Management", desc: "Registered customer organizations (tenants), database connection metadata, and subscription status." },
  global_users: { module: "Auth & Tenant Management", desc: "Global login identities mapped to a single tenant, storing password hash and owner/active flags." },
  user_invitations: { module: "Users & Invitations", desc: "Pending email/token invitations for onboarding new users into a tenant." },
  password_reset_tokens: { module: "Auth & Tenant Management", desc: "One-time hashed tokens for self-service password resets." },
  audit_logs: { module: "Audit Trail", desc: "Control-plane audit log for tenant and billing-level events." },
  billing_invoices: { module: "Billing", desc: "Subscription invoices per tenant (currently stubbed manual/mock payment flow)." },
  subscription_plans: { module: "Billing", desc: "Available SaaS subscription tiers, pricing, and limits." },

  // Tenant DB
  partners: { module: "Partners & Capital", desc: "Syndicate investors/partners with opening balances, payout bank details, and active status." },
  partner_transactions: { module: "Partners & Capital", desc: "Ledger of partner capital deposits, withdrawals, direct expenses, and profit credits." },
  bank_accounts: { module: "Cash & Bank Ledger", desc: "Company bank accounts with cached current_balance synced from treasury_ledger." },
  treasury_ledger: { module: "Cash & Bank Ledger", desc: "Immutable cash and bank cashbook ledger (CREDIT/DEBIT) for all treasury movements." },
  treasury_transfer_requests: { module: "Cash & Bank Ledger", desc: "Contra transfer requests (Cash <-> Bank) requiring approval for non-approvers." },
  land_projects: { module: "Land & Acquisition", desc: "Real estate / land development projects with mouza, khatian, area, and status." },
  project_partners: { module: "Land & Acquisition", desc: "Shareholding split (%) of partners per land project (must sum to 100%)." },
  project_expenses: { module: "Project Expenses", desc: "Project acquisition, legal, development, and overhead expense vouchers (PENDING/APPROVED/REJECTED)." },
  project_plots: { module: "Plots", desc: "Individual subdivided plots within a project with Shotok size, asking price, and status." },
  land_sales: { module: "Plot Sales & Dues", desc: "Buyer sale contracts (single plot, multi-plot, or whole-project) tracking agreed price and due amount." },
  installment_schedule: { module: "Plot Sales & Dues", desc: "Scheduled installment due dates and amounts settled FIFO by customer payments." },
  customer_payments: { module: "Plot Sales & Dues", desc: "Customer receipts (advance and installments) linked to land_sales and bank/cash." },
  profit_distributions: { module: "Reports & Profit", desc: "Recorded profit distribution payouts per project and partner." },
  roles: { module: "Roles & Permissions", desc: "Tenant-scoped RBAC roles (Owner, Managing Partner, Accountant, Site Manager, custom roles)." },
  role_permissions: { module: "Roles & Permissions", desc: "Permission keys assigned to each role." },
  user_roles: { module: "Users & Roles", desc: "Maps control-plane global_users.id to a tenant role." },
  dashboard_layouts: { module: "Dashboard", desc: "Saved per-role or per-user dashboard tab and widget layout JSON." },
  dashboard_settings: { module: "Configuration", desc: "Tenant-scoped JSON settings store (alert thresholds, fiscal_years, etc.)." },
  audit_log: { module: "Audit Trail", desc: "Tenant-level immutable audit trail recording table, record ID, action, actor, old/new JSON." },
  default_categories: { module: "Project Expenses", desc: "Seeded default expense categories created by provisioning worker (exists in MySQL, not in Prisma schema)." },
};

function renderTableDict(dbObj) {
  const colsByTable = new Map();
  for (const c of dbObj.columns) {
    if (!colsByTable.has(c.TABLE_NAME)) colsByTable.set(c.TABLE_NAME, []);
    colsByTable.get(c.TABLE_NAME).push(c);
  }
  const fksByTableCol = new Map();
  for (const fk of dbObj.foreignKeys) {
    fksByTableCol.set(`${fk.TABLE_NAME}.${fk.COLUMN_NAME}`, `${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
  }

  return dbObj.tables
    .map((t) => {
      const meta = TABLE_META[t.TABLE_NAME] || { module: "General", desc: "Database table." };
      const cols = colsByTable.get(t.TABLE_NAME) || [];
      const pkCols = cols.filter((c) => c.COLUMN_KEY === "PRI").map((c) => `\`${c.COLUMN_NAME}\` (${c.COLUMN_TYPE})`);
      const colRows = cols.map((c) => {
        const keys = [];
        if (c.COLUMN_KEY === "PRI") keys.push("PK");
        if (c.COLUMN_KEY === "UNI") keys.push("UNIQUE");
        if (fksByTableCol.has(`${t.TABLE_NAME}.${c.COLUMN_NAME}`)) {
          keys.push(`FK -> \`${fksByTableCol.get(`${t.TABLE_NAME}.${c.COLUMN_NAME}`)}\``);
        }
        return `| \`${c.COLUMN_NAME}\` | \`${c.COLUMN_TYPE}\` | ${c.IS_NULLABLE} | ${c.COLUMN_DEFAULT === null ? "NULL" : `\`${c.COLUMN_DEFAULT}\``} | ${keys.join(", ") || "-"} | ${c.COLUMN_COMMENT || "-"} |`;
      });

      return `### \`${t.TABLE_NAME}\`
- **Module:** ${meta.module}
- **Purpose:** ${meta.desc}
- **Primary Key:** ${pkCols.join(", ") || "None"} | **Engine:** ${t.ENGINE} | **Collation:** ${t.TABLE_COLLATION}

| Column | Type | Nullable | Default | Key | Notes |
|---|---|---|---|---|---|
${colRows.join("\n")}
`;
    })
    .join("\n");
}

function buildDbOverview() {
  const totalTables = controlDb.tableCount + tenantDb.tableCount;
  const totalFks = controlDb.fkCount + tenantDb.fkCount;
  const totalIndexes = controlDb.uniqueIndexCount + tenantDb.uniqueIndexCount;
  return `# 04a. Database Overview

**Purpose:** High-level summary of LandInvest's dual-database MySQL architecture, totals, conventions, and Prisma schema verification.  
**Intended Reader:** Technical Lead, Database Administrator, New Developer.  
**Last Verified:** ${VERIFIED_DATE}

---

## Database Totals (Introspected Live from \`information_schema\`)

| Database | Tables | Views | Foreign Keys | Indexes | Engine | Charset / Collation |
|---|---:|---:|---:|---:|---|---|
| \`control_plane\` | ${controlDb.tableCount} | ${controlDb.viewCount} | ${controlDb.fkCount} | ${controlDb.uniqueIndexCount} | InnoDB | \`utf8mb4\` / \`utf8mb4_unicode_ci\` |
| \`tenant_demo\` (per-tenant) | ${tenantDb.tableCount} | ${tenantDb.viewCount} | ${tenantDb.fkCount} | ${tenantDb.uniqueIndexCount} | InnoDB | \`utf8mb4\` / \`utf8mb4_unicode_ci\` |
| **Combined Total** | **${totalTables}** | **${controlDb.viewCount + tenantDb.viewCount}** | **${totalFks}** | **${totalIndexes}** | InnoDB | \`utf8mb4\` |

---

## Prisma Schema vs Live MySQL Verification

| Schema | In Live MySQL but NOT in Prisma | In Prisma but NOT in Live MySQL |
|---|---|---|
| \`prisma/control/schema.prisma\` | ${summary.schemaDiff.control.inDbNotPrisma.join(", ") || "None (100% match)"} | ${summary.schemaDiff.control.inPrismaNotDb.join(", ") || "None (100% match)"} |
| \`prisma/tenant/schema.prisma\` | ${summary.schemaDiff.tenant.inDbNotPrisma.map((x) => `\`${x}\``).join(", ") || "None"} | ${summary.schemaDiff.tenant.inPrismaNotDb.join(", ") || "None (100% match)"} |

> **Schema Mismatch Note:** \`default_categories\` is created directly via raw SQL in \`src/worker.ts\` (\`seedDefaultCategories\`) during tenant provisioning rather than via \`prisma/tenant/schema.prisma\`.

---

## Naming & Type Conventions

- **ID Strategy:** UUID v4 strings stored as \`CHAR(36)\` generated in application code via \`crypto.randomUUID()\`.
- **Money Type:** \`DECIMAL(15, 2)\` (or \`DECIMAL(18, 2)\` for larger aggregates); formatted in BDT using lakh/crore grouping in \`src/lib/format.ts\`.
- **Land Area Unit:** Base unit is **Shotok** (\`DECIMAL(10, 2)\` / \`DECIMAL(12, 4)\`); converted to Katha (\`1 Katha = 1.65 Shotok\`) and Bigha (\`1 Bigha = 33 Shotok\`) in \`src/lib/area.ts\` (*verify exact factor in 08-business-rules.md*).
- **Timestamps:** \`DATETIME(3)\` / \`TIMESTAMP\` in UTC/server time.
- **Logical Cross-Database Links:** Because tenant databases are separate MySQL schemas, cross-DB links (e.g., \`tenant.user_roles.user_id\` -> \`control_plane.global_users.id\`, \`tenant.partners.global_user_id\`, \`created_by\`, \`approved_by\`, \`changed_by\`) are validated in application code rather than MySQL foreign key constraints.

---

## Money Data Flow by Business Event

| Business Event | Tables Written | Tables Read |
|---|---|---|
| **Partner Capital Deposit** | \`partner_transactions\`, \`treasury_ledger\`, \`bank_accounts\` (if BANK), \`audit_log\` | \`partners\`, \`bank_accounts\` |
| **Partner Withdrawal** | \`partner_transactions\`, \`treasury_ledger\`, \`bank_accounts\` (if BANK), \`audit_log\` | \`partners\`, \`treasury_ledger\` |
| **Expense Create** | \`project_expenses\`, \`audit_log\` | \`land_projects\`, \`bank_accounts\`, \`partners\` |
| **Expense Approve (CASH/BANK)** | \`project_expenses\`, \`treasury_ledger\`, \`bank_accounts\` (if BANK), \`audit_log\` | \`project_expenses\`, \`treasury_ledger\` |
| **Expense Approve (PAID_BY_PARTNER)** | \`project_expenses\`, \`partner_transactions\` (\`DIRECT_EXPENSE\`), \`audit_log\` | \`project_expenses\`, \`partners\` |
| **Plot Sale + Advance** | \`land_sales\`, \`project_plots\`, \`installment_schedule\`, \`customer_payments\`, \`treasury_ledger\`, \`bank_accounts\`, \`audit_log\` | \`project_plots\`, \`bank_accounts\` |
| **Installment Collection** | \`customer_payments\`, \`land_sales\`, \`installment_schedule\` (FIFO), \`project_plots\` (to \`SOLD\` when due=0), \`treasury_ledger\`, \`bank_accounts\`, \`audit_log\` | \`land_sales\`, \`installment_schedule\` |
| **Contra Transfer** | \`treasury_transfer_requests\`, \`treasury_ledger\`, \`bank_accounts\`, \`audit_log\` | \`treasury_ledger\`, \`bank_accounts\` |
| **Profit Distribution** | \`profit_distributions\`, \`partner_transactions\` (\`PROFIT_CREDIT\`), \`audit_log\` | \`land_projects\`, \`project_partners\`, \`land_sales\`, \`project_expenses\` |
`;
}

function buildIndexesAndFks() {
  const renderFks = (db) =>
    db.foreignKeys
      .map(
        (fk) =>
          `| \`${fk.TABLE_NAME}\` | \`${fk.COLUMN_NAME}\` | \`${fk.REFERENCED_TABLE_NAME}\` | \`${fk.REFERENCED_COLUMN_NAME}\` | ${fk.DELETE_RULE} | ${fk.UPDATE_RULE} | \`${fk.CONSTRAINT_NAME}\` |`
      )
      .join("\n");

  const renderIdx = (db) => {
    const grouped = new Map();
    for (const i of db.indexes) {
      const k = `${i.TABLE_NAME}.${i.INDEX_NAME}`;
      if (!grouped.has(k)) {
        grouped.set(k, { table: i.TABLE_NAME, name: i.INDEX_NAME, unique: i.NON_UNIQUE === 0, type: i.INDEX_TYPE, cols: [] });
      }
      grouped.get(k).cols.push(i.COLUMN_NAME);
    }
    return [...grouped.values()]
      .map((x) => `| \`${x.table}\` | \`${x.name}\` | ${x.unique ? "UNIQUE" : "INDEX"} | ${x.cols.map((c) => `\`${c}\``).join(", ")} | ${x.type} |`)
      .join("\n");
  };

  return `# 04e. Indexes and Foreign Key Constraints

**Purpose:** Complete reference of all physical MySQL foreign keys, unique constraints, indexes, and logical cross-database links.  
**Intended Reader:** Database Administrator, Backend Developer.  
**Last Verified:** ${VERIFIED_DATE}

---

## Control Plane Foreign Keys (\`control_plane\`: ${controlDb.fkCount})

| Child Table | Child Column | Parent Table | Parent Column | ON DELETE | ON UPDATE | Constraint Name |
|---|---|---|---|---|---|---|
${renderFks(controlDb)}

## Tenant Database Foreign Keys (\`tenant_demo\`: ${tenantDb.fkCount})

| Child Table | Child Column | Parent Table | Parent Column | ON DELETE | ON UPDATE | Constraint Name |
|---|---|---|---|---|---|---|
${renderFks(tenantDb)}

---

## Logical Cross-Database Links (Not Physical Foreign Keys)

| Tenant Table & Column | Target Table & Column | Enforced By |
|---|---|---|
| \`user_roles.user_id\` | \`control_plane.global_users.id\` | Application RBAC & session resolution |
| \`partners.global_user_id\` | \`control_plane.global_users.id\` | Partner account linking logic |
| \`project_expenses.created_by\` / \`approved_by\` | \`control_plane.global_users.id\` | Session user ID from JWT |
| \`treasury_ledger.created_by\` | \`control_plane.global_users.id\` | Session user ID from JWT |
| \`treasury_transfer_requests.requested_by\` / \`approved_by\` | \`control_plane.global_users.id\` | Session user ID from JWT |
| \`audit_log.changed_by\` | \`control_plane.global_users.id\` | \`writeAudit()\` in \`src/lib/tenantRules.ts\` |
| \`dashboard_settings.updated_by\` | \`control_plane.global_users.id\` | API route session user ID |

---

## Control Plane Indexes (\`${controlDb.uniqueIndexCount}\` indexes)

| Table | Index Name | Kind | Columns | Type |
|---|---|---|---|---|
${renderIdx(controlDb)}

## Tenant Database Indexes (\`${tenantDb.uniqueIndexCount}\` indexes)

| Table | Index Name | Kind | Columns | Type |
|---|---|---|---|---|
${renderIdx(tenantDb)}
`;
}

// 3. Permissions & Roles doc
function buildAuthRolesDoc() {
  const permRows = perms.permissions.map(
    (p) => `| \`${p.key}\` | ${p.moduleEn} | ${p.en} | ${p.bn} |`
  );

  const roleSummary = roles.map(
    (r) => `| **${r.name}** | ${r.isSystem ? "Yes (Protected)" : "No"} | ${r.keys.length} | ${r.description} |`
  );

  const roleNames = roles.map((r) => r.name);
  const roleSets = roles.map((r) => new Set(r.keys));
  const matrixRows = perms.permissions
    .filter((p) => !p.key.startsWith("dashboard.widget.") && !p.key.startsWith("dashboard.tab."))
    .map((p) => {
      const cells = roleSets.map((s) => (s.has(p.key) ? "YES" : "-"));
      return `| \`${p.key}\` | ${cells.join(" | ")} |`;
    });

  return `# 07. Authentication, Roles & Permissions

**Purpose:** Documents authentication, JWT sessions, tenant resolution, all ${perms.totalKeys} permission keys, default roles, and RBAC safety rules.  
**Intended Reader:** Security Reviewer, Technical Lead, Developer, Admin Owner.  
**Last Verified:** ${VERIFIED_DATE}

---

## Authentication & Session Architecture

- **Provider:** Auth.js v4 (\`next-auth\`) with \`CredentialsProvider\` (\`src/auth.ts\`).
- **Passwords:** Hashed with \`bcryptjs\`. Users invited or created with temporary passwords have \`mustChangePassword = true\`, enforced by \`AppShell.tsx\` redirecting to \`/change-password\`.
- **Session Strategy:** Stateless JWT enriched with \`user_id\`, \`tenantId\`, \`isOwner\`, \`mustChangePassword\`, \`fullName\`, and \`dbName\`.
- **Live Revocation Check:** On every \`session()\` callback, \`src/auth.ts\` queries \`control_plane.global_users\` and \`tenants.status\`. Deactivated users or suspended/cancelled tenants receive \`null\` session (fail-closed).
- **Rate Limiting:** Configurable via \`AUTH_RATE_LIMIT_MAX\` (Redis / in-memory login throttling).

---

## Permission Evaluation Flow

\`\`\`mermaid
flowchart TD
  Req["Incoming Request (Page / API / Server Action)"] --> Sess["getServerSession(authOptions)"]
  Sess -->|No session| Unauth["401 Unauthorized / Redirect /login"]
  Sess -->|Session exists| OwnerCheck{"user.isOwner === true?"}
  OwnerCheck -->|Yes| Allow["ALLOW (Full Access)"]
  OwnerCheck -->|No| LoadPerms["Load user_roles -> role_permissions from Tenant DB"]
  LoadPerms --> HasKey{"Permission key in set?"}
  HasKey -->|Yes| Allow
  HasKey -->|No| Deny["403 Forbidden / Forbidden UI Marker"]
\`\`\`

---

## Default Roles (\`src/lib/seedRoles.ts\`)

| Role Name | System Role | Permission Count | Description |
|---|---|---:|---|
${roleSummary.join("\n")}

---

## Role vs Module Permission Matrix (Base Permissions)

| Permission Key | ${roleNames.join(" | ")} |
|---|${roleNames.map(() => "---").join("|")}|
${matrixRows.join("\n")}

---

## Complete Permission Catalog (${perms.totalKeys} Keys across ${perms.groups} Groups)

| Permission Key | Module | English Label | Bengali Label |
|---|---|---|---|
${permRows.join("\n")}

---

## RBAC Safety Rules

1. **Owner Protection:** The \`Owner\` role (\`isSystem: true\`) cannot be edited or deleted via \`/api/roles/[id]\`.
2. **Privilege Escalation Prevention:** Non-owners cannot grant permissions they do not hold or assign the \`Owner\` role.
3. **Self-Lockout Prevention:** Users cannot deactivate themselves or strip \`users.manage\` / \`roles.manage\` from their own active role.
`;
}

// 4. API & Actions Inventory
function buildApiAndActionsDoc() {
  const apiRows = routes.apis.map(
    (a) =>
      `| \`${a.route}\` | ${a.methods.join(", ") || "HANDLER"} | ${a.permissions.length ? a.permissions.map((p) => `\`${p}\``).join(", ") : "**None / Public or Session-only**"} | \`${a.file}\` |`
  );
  const pageRows = routes.pages.map(
    (p) =>
      `| \`${p.route}\` | Page (RSC) | ${p.permissions.length ? p.permissions.map((x) => `\`${x}\``).join(", ") : "Client/Session gated"} | \`${p.file}\` |`
  );
  const actionRows = routes.serverActions.map(
    (s) =>
      `| \`${s.file}\` | ${s.functions.map((f) => `\`${f}()\``).join(", ") || "-"} | ${s.permissions.length ? s.permissions.map((p) => `\`${p}\``).join(", ") : "**None detected in file**"} |`
  );

  return `# 09. API Routes & Server Actions Inventory

**Purpose:** Auto-extracted inventory of all Next.js App Router pages, API endpoints, and Server Action files with their detected permission checks.  
**Intended Reader:** Backend/Frontend Developers, Security Auditors.  
**Last Verified:** ${VERIFIED_DATE}

---

## Summary Counts
- **App Pages:** ${routes.pages.length}
- **API Route Handlers:** ${routes.apis.length}
- **Server Action Files:** ${routes.serverActions.length}

---

## API Endpoints (${routes.apis.length})

| Route | Methods | Detected Permission Check(s) | File |
|---|---|---|---|
${apiRows.join("\n")}

---

## Server Action Files (${routes.serverActions.length})

| File | Exported Server Actions | Detected Permission Check(s) |
|---|---|---|
${actionRows.join("\n")}

---

## App Pages (${routes.pages.length})

| Route | Type | Detected Server Permission Check(s) | File |
|---|---|---|---|
${pageRows.join("\n")}
`;
}

// 5. Reports & Dashboard
function buildReportsAndDashboardDoc() {
  const repRows = reports.map(
    (r) =>
      `| \`${r.key}\` | ${r.titleEn} | ${r.titleBn} | ${r.category} | \`${r.permission}\` | ${r.filters.join(", ") || "None"} |`
  );
  const tabRows = dashboard.tabs.map(
    (t) => `| \`${t.key}\` | ${t.title.en} | ${t.title.bn} | \`dashboard.tab.${t.key}\` |`
  );
  const widgetList = Array.isArray(dashboard.widgets)
    ? dashboard.widgets
    : Object.entries(dashboard.widgets).map(([key, w]) => ({ key, ...w }));
  const widgetRows = widgetList.map(
    (w) =>
      `| \`${w.key}\` | ${w.title?.en || w.titleEn || w.key} | ${w.tab || "-"} | ${w.type || "-"} | \`${w.permission || `dashboard.widget.${w.key}`}\` |`
  );

  return `# 10. Reports & Dashboard

**Purpose:** Complete catalog of all ${reports.length} built-in reports, ${dashboard.tabs.length} dashboard tabs, and ${dashboard.widgets.length} dashboard widgets, plus formatting conventions.  
**Intended Reader:** Product Owner, Accountant, Frontend/Backend Developers.  
**Last Verified:** ${VERIFIED_DATE}

---

## Number, Currency & Fiscal Year Conventions

- **Currency:** Bangladeshi Taka (\`৳\`), formatted with \`formatBDT()\` in \`src/lib/format.ts\` using \`en-IN\` locale for **lakh** (1,00,000) and **crore** (1,00,00,000) grouping.
- **Bengali Numerals:** \`toBnNum()\` converts digits \`0-9\` to \`০-৯\` when \`lang === "bn"\`.
- **Fiscal Year:** Standard Bangladesh Fiscal Year runs **July 1 – June 30**, dynamically configurable per tenant via \`/settings/fiscal-years\` (\`dashboard_settings\` key \`fiscal_years\`). Reports with \`preset=this_fy\` read the active tenant FY in both the UI page (\`src/app/reports/[key]/page.tsx\`) and export API (\`src/app/api/reports/[key]/route.ts\`).
- **Exports:** Every report supports **PDF** (via Puppeteer HTML-to-PDF) and **Excel** (\`.xls\` HTML table) at \`/api/reports/[key]?format=pdf|excel\`.

---

## Report Catalog (${reports.length} Reports in \`src/lib/reports/registry.ts\`)

| Key | Title (EN) | Title (BN) | Category | Required Permission | Filters |
|---|---|---|---|---|---|
${repRows.join("\n")}

---

## Dashboard Tabs (${dashboard.tabs.length} Tabs)

| Tab Key | Title (EN) | Title (BN) | Required Permission |
|---|---|---|---|
${tabRows.join("\n")}

---

## Dashboard Widget Registry (${widgetList.length} Widgets in \`src/lib/dashboard/widgets.ts\`)

| Widget Key | Title (EN) | Tab | Type | Required Permission |
|---|---|---|---|---|
${widgetRows.join("\n")}
`;
}

writeDoc("03-tech-stack.md", buildTechStack());
writeDoc("04-database/04a-overview.md", buildDbOverview());
writeDoc(
  "04-database/04b-control-plane-tables.md",
  `# 04b. Control Plane Data Dictionary (\`control_plane\`)\n\n**Purpose:** Column-level data dictionary for all ${controlDb.tableCount} tables in \`control_plane\`.\n**Intended Reader:** Backend Developer, DBA.\n**Last Verified:** ${VERIFIED_DATE}\n\n---\n\n${renderTableDict(controlDb)}`
);
writeDoc(
  "04-database/04c-tenant-tables.md",
  `# 04c. Tenant Database Data Dictionary (\`tenant_*\`)\n\n**Purpose:** Column-level data dictionary for all ${tenantDb.tableCount} tables in a provisioned tenant database (verified against \`tenant_demo\`).\n**Intended Reader:** Backend Developer, DBA.\n**Last Verified:** ${VERIFIED_DATE}\n\n---\n\n${renderTableDict(tenantDb)}`
);
writeDoc("04-database/04e-indexes-and-constraints.md", buildIndexesAndFks());
writeDoc("07-auth-roles-permissions.md", buildAuthRolesDoc());
writeDoc("09-api-and-actions.md", buildApiAndActionsDoc());
writeDoc("10-reports-and-dashboard.md", buildReportsAndDashboardDoc());

console.log("Generated factual documentation files successfully.");
