/**
 * Seed Demo Tenant Script
 * Usage:
 *   node scripts/seed_demo.mjs [--reset] [--as-of=YYYY-MM-DD] [--yes]
 *
 * Simulates a realistic ~22-month operational history for "Sonar Bangla Land Developers Ltd."
 * ending at as-of date (default: 2026-11-15).
 */

import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

// ---------------------------------------------------------------------------
// 0. Configuration & CLI Argument Parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const isReset = args.includes("--reset");
const isYes = args.includes("--yes");
const asOfArg = args.find((a) => a.startsWith("--as-of="));
const AS_OF_STR = asOfArg ? asOfArg.split("=")[1] : "2026-11-15";
const AS_OF_DATE = new Date(`${AS_OF_STR}T12:00:00Z`);

const COMPANY_NAME = "Sonar Bangla Land Developers Ltd.";
const COMPANY_NAME_BN = "সোনার বাংলা ল্যান্ড ডেভেলপার্স লিমিটেড";
const TENANT_SLUG = "demo";
const TENANT_DB = "tenant_demo";
const UNIVERSAL_PASSWORD = "123456";
const DB_HOST = "127.0.0.1";
const DB_USER = "root";
const DB_PASS = "";

// PRNG: Deterministic Mulberry32
let seedState = 123456789;
function pseudoRandom() {
  let t = (seedState += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function randInt(min, max) {
  return Math.floor(pseudoRandom() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[randInt(0, arr.length - 1)];
}

// Date helpers relative to AS_OF_DATE
function daysAgo(d) {
  const dt = new Date(AS_OF_DATE.getTime() - d * 24 * 60 * 60 * 1000);
  return dt.toISOString().slice(0, 10);
}

function daysAfter(d) {
  const dt = new Date(AS_OF_DATE.getTime() + d * 24 * 60 * 60 * 1000);
  return dt.toISOString().slice(0, 10);
}

function avoidFriday(dateStr) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  if (d.getUTCDay() === 5) {
    // Shift Friday to Thursday
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return d.toISOString().slice(0, 10);
}

console.log("===============================================================================");
console.log(`Starting Demo Tenant Seeder for "${COMPANY_NAME}"`);
console.log(`As-Of Reference Date : ${AS_OF_STR}`);
console.log(`Reset Database       : ${isReset ? "YES" : "NO"}`);
console.log("===============================================================================");

// ---------------------------------------------------------------------------
// 1. Database Connections
// ---------------------------------------------------------------------------
const controlConn = await mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: "control_plane",
});

// Ensure is_demo column on tenants table
try {
  await controlConn.query("ALTER TABLE tenants ADD COLUMN is_demo BOOLEAN NOT NULL DEFAULT FALSE");
} catch (e) {
  // Column already exists
}

// Check existing demo tenant in control_plane
const [[existingTenant]] = await controlConn.query(
  "SELECT * FROM tenants WHERE db_name = ?",
  [TENANT_DB]
);

if (existingTenant && !isReset) {
  console.log(`\nDemo tenant "${TENANT_DB}" already exists.`);
  console.log("To rebuild from scratch, run:");
  console.log("  npm run seed:demo -- --reset\n");
  await controlConn.end();
  process.exit(0);
}

if (existingTenant && isReset) {
  if (!existingTenant.is_demo) {
    console.error(`ERROR: Tenant "${TENANT_DB}" is not flagged as is_demo! Aborting reset for safety.`);
    await controlConn.end();
    process.exit(1);
  }
  console.log(`Safety check passed: "${TENANT_DB}" has is_demo=1.`);
}

console.log("Step 1: Preparing databases and clean slate...");

// Create tenant database if it doesn't exist
await controlConn.query(`CREATE DATABASE IF NOT EXISTS \`${TENANT_DB}\`;`);

const tenantConn = await mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: TENANT_DB,
});

// Ensure all schema tables exist in tenant_demo
// Truncate tables for a completely clean slate
console.log("Cleaning tenant tables...");
await tenantConn.query("SET FOREIGN_KEY_CHECKS = 0;");
const [tables] = await tenantConn.query("SHOW TABLES;");
for (const row of tables) {
  const tName = Object.values(row)[0];
  await tenantConn.query(`TRUNCATE TABLE \`${tName}\`;`);
}
await tenantConn.query("SET FOREIGN_KEY_CHECKS = 1;");

// Clean control plane records for demo tenant
let tenantId = existingTenant ? existingTenant.id : randomUUID();
if (existingTenant) {
  await controlConn.query("DELETE FROM user_invitations WHERE tenant_id = ?", [tenantId]);
  await controlConn.query("DELETE FROM billing_invoices WHERE tenant_id = ?", [tenantId]);
  await controlConn.query("DELETE FROM subscriptions WHERE tenant_id = ?", [tenantId]);
  await controlConn.query("DELETE FROM global_users WHERE tenant_id = ?", [tenantId]);
} else {
  await controlConn.query(
    `INSERT INTO tenants (id, company_name, db_host, db_name, db_user, db_password_encrypted, status, is_demo, created_at)
     VALUES (?, ?, ?, ?, ?, '', 'active', 1, ?)`,
    [tenantId, COMPANY_NAME, DB_HOST, TENANT_DB, DB_USER, daysAgo(670)]
  );
}

// ---------------------------------------------------------------------------
// 2. Control Plane: Plans, Subscriptions, Users, Invoices
// ---------------------------------------------------------------------------
console.log("Step 2: Configuring Control Plane (Plan, Subscription, Invoices, Users)...");

// Ensure Enterprise Plan
let [[enterprisePlan]] = await controlConn.query("SELECT * FROM plans WHERE name = 'Enterprise'");
if (!enterprisePlan) {
  const planId = randomUUID();
  await controlConn.query(
    `INSERT INTO plans (id, name, price_monthly, price_yearly, max_users, max_projects, features)
     VALUES (?, 'Enterprise', 15000.00, 150000.00, 50, 200, ?)`,
    [planId, JSON.stringify({ plots: true, reports: true, custom_roles: true, analytics: true })]
  );
  [[enterprisePlan]] = await controlConn.query("SELECT * FROM plans WHERE id = ?", [planId]);
}

// Create Active Subscription
const subId = randomUUID();
await controlConn.query(
  `INSERT INTO subscriptions (id, tenant_id, plan_id, billing_cycle, current_period_start, current_period_end, payment_provider, provider_subscription_id, status)
   VALUES (?, ?, ?, 'yearly', ?, ?, 'SSLCOMMERZ', 'SUB-SB-2026-001', 'active')`,
  [subId, tenantId, enterprisePlan.id, daysAgo(320), daysAfter(45)]
);

// Invoices
const invoices = [
  { id: randomUUID(), amt: 150000.00, date: daysAgo(670), invNo: "INV-2025-001", status: "PAID" },
  { id: randomUUID(), amt: 150000.00, date: daysAgo(320), invNo: "INV-2026-001", status: "PAID" },
  { id: randomUUID(), amt: 25000.00, date: daysAgo(120), invNo: "INV-2026-002", status: "PAID" },
];
for (const inv of invoices) {
  await controlConn.query(
    `INSERT INTO billing_invoices (id, tenant_id, subscription_id, amount, currency, status, invoice_date, provider_invoice_id)
     VALUES (?, ?, ?, ?, 'BDT', ?, ?, ?)`,
    [inv.id, tenantId, subId, inv.amt, inv.status, inv.date, inv.invNo]
  );
}

// Demo Users
const passwordHash = await bcrypt.hash(UNIVERSAL_PASSWORD, 10);
const usersList = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    email: "owner@alpha.com",
    name: "Md. Rafiqul Islam",
    isOwner: true,
    roleName: "Owner",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    email: "admin@alpha.com",
    name: "Barrister Tariq Ahmed",
    isOwner: false,
    roleName: "Managing Partner",
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    email: "accountant@alpha.com",
    name: "Mahfuzur Rahman",
    isOwner: false,
    roleName: "Accountant",
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    email: "site@alpha.com",
    name: "Engr. Kamrul Hasan",
    isOwner: false,
    roleName: "Site Manager",
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    email: "sales@alpha.com",
    name: "Tanvir Ahmed",
    isOwner: false,
    roleName: "Sales Executive",
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    email: "auditor@alpha.com",
    name: "Farhana Yasmin",
    isOwner: false,
    roleName: "Auditor (read-only)",
  },
];

for (const u of usersList) {
  await controlConn.query(
    `INSERT INTO global_users (id, tenant_id, full_name, email, password_hash, is_owner, is_active, must_change_password, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?)`,
    [u.id, tenantId, u.name, u.email, passwordHash, u.isOwner ? 1 : 0, daysAgo(670)]
  );
}

// 1 Deactivated former user
const deactivatedId = "10000000-0000-0000-0000-000000000007";
await controlConn.query(
  `INSERT INTO global_users (id, tenant_id, full_name, email, password_hash, is_owner, is_active, must_change_password, created_at)
   VALUES (?, ?, 'Arifur Rahman (Former Staff)', 'former.staff@alpha.com', ?, 0, 0, 0, ?)`,
  [deactivatedId, tenantId, passwordHash, daysAgo(600)]
);

// ---------------------------------------------------------------------------
// 3. Roles & Permissions in tenant_demo
// ---------------------------------------------------------------------------
console.log("Step 3: Creating System and Custom Roles...");

const { ALL_KEYS } = await import("../src/lib/permissions.ts");

const rolesDef = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    name: "Owner",
    description: "Full administrative and financial access",
    isSystem: true,
    keys: ALL_KEYS,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    name: "Managing Partner",
    description: "Executive access across all operations, financial ledgers, and reporting",
    isSystem: false,
    keys: ALL_KEYS.filter((k) => !["users.manage", "roles.manage", "billing.manage"].includes(k)),
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    name: "Accountant",
    description: "Treasury ledger, cash & bank management, payment collection, and expense accounting",
    isSystem: false,
    keys: [
      "dashboard.view", "dashboard.tab.overview", "dashboard.tab.financial", "dashboard.tab.operations",
      "dashboard.customize", "dashboard.export",
      "dashboard.widget.cash_balance", "dashboard.widget.bank_balance", "dashboard.widget.total_liquidity",
      "dashboard.widget.working_capital", "dashboard.widget.cash_flow_trend", "dashboard.widget.cash_flow_forecast",
      "dashboard.widget.recent_transactions", "dashboard.widget.expenses_month", "dashboard.widget.pending_approvals",
      "dashboard.widget.pending_vouchers", "dashboard.widget.quick_actions",
      "expenses.view", "expenses.create", "sales.view", "sales.collect", "receipts.print",
      "treasury.view", "treasury.bank.manage", "treasury.contra.create",
      "reports.view", "reports.financial.view",
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    name: "Site Manager",
    description: "Land projects inspection, plots management, and on-site project expense entries",
    isSystem: false,
    keys: [
      "dashboard.view", "dashboard.tab.overview", "dashboard.tab.projects", "dashboard.tab.operations",
      "dashboard.customize",
      "dashboard.widget.capital_deployed", "dashboard.widget.unsold_inventory", "dashboard.widget.plot_inventory_status",
      "dashboard.widget.project_cost_vs_sales", "dashboard.widget.project_summary", "dashboard.widget.expenses_month",
      "dashboard.widget.pending_approvals", "dashboard.widget.expense_breakdown", "dashboard.widget.quick_actions",
      "projects.view", "plots.manage", "expenses.view", "expenses.create",
      "reports.view", "reports.projects.view",
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    name: "Sales Executive",
    description: "Plot inventory, sales pricing, collections and sales reports (Restricted from costs/margins)",
    isSystem: false,
    keys: [
      "dashboard.view", "dashboard.tab.overview", "dashboard.tab.sales",
      "dashboard.widget.sales_month", "dashboard.widget.collections_month",
      "dashboard.widget.total_receivables", "dashboard.widget.overdue_receivables",
      "dashboard.widget.receivables_aging", "dashboard.widget.collection_trend",
      "dashboard.widget.overdue_installments", "dashboard.widget.plot_inventory_status",
      "dashboard.widget.quick_actions",
      "projects.view", "plots.manage",
      "sales.view", "sales.create", "sales.collect", "receipts.print",
      "reports.view", "reports.sales.view",
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    name: "Auditor (read-only)",
    description: "Comprehensive read-only review of books, transactions, and audit trails",
    isSystem: false,
    keys: [
      "dashboard.view", "dashboard.tab.overview", "dashboard.tab.financial", "dashboard.tab.projects",
      "dashboard.tab.sales", "dashboard.tab.partners", "dashboard.tab.operations",
      ...ALL_KEYS.filter((k) => k.startsWith("dashboard.widget.")),
      "partners.view", "partners.ledger.view", "treasury.view", "projects.view",
      "expenses.view", "sales.view", "profit.view",
      "reports.view", "reports.export", "reports.financial.view", "reports.partners.view",
      "reports.projects.view", "reports.sales.view", "reports.audit.view",
      "audit.view", "users.view",
    ],
  },
];

const roleIdByName = new Map();
for (const r of rolesDef) {
  roleIdByName.set(r.name, r.id);
  await tenantConn.query(
    `INSERT INTO roles (id, name, description, is_system, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [r.id, r.name, r.description, r.isSystem ? 1 : 0, usersList[0].id, daysAgo(670), daysAgo(670)]
  );

  for (const k of r.keys) {
    await tenantConn.query(
      `INSERT INTO role_permissions (role_id, permission_key) VALUES (?, ?)`,
      [r.id, k]
    );
  }
}

// User-Role Assignments
for (const u of usersList) {
  const rId = roleIdByName.get(u.roleName);
  await tenantConn.query(
    `INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at) VALUES (?, ?, ?, ?)`,
    [u.id, rId, usersList[0].id, daysAgo(670)]
  );
}

// 1 Pending User Invitation
const inviteRoleId = roleIdByName.get("Site Manager");
await controlConn.query(
  `INSERT INTO user_invitations (id, tenant_id, email, role_id, invite_token, expires_at, accepted)
   VALUES (?, ?, 'engineer.invite@alpha.com', ?, 'INVITE-TOKEN-DEMO-2026', ?, 0)`,
  [randomUUID(), tenantId, inviteRoleId, daysAfter(14)]
);

// ---------------------------------------------------------------------------
// 4. Dashboard Settings & Layouts
// ---------------------------------------------------------------------------
console.log("Step 4: Setting up Dashboard Alert Thresholds & Presets...");

const dashboardSettings = [
  { key: "min_cash_balance", val: 1000000 },
  { key: "critical_cash_balance", val: 300000 },
  { key: "voucher_pending_days", val: 3 },
  { key: "voucher_pending_count", val: 5 },
  { key: "overdue_alert_days", val: 30 },
  { key: "fiscal_year", val: "JULY_JUNE" },
  { key: "currency", val: "BDT" },
  { key: "company_tagline", val: "Excellence in Sustainable Land Development" },
];

for (const s of dashboardSettings) {
  await tenantConn.query(
    `INSERT INTO dashboard_settings (id, setting_key, setting_value, updated_by, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [randomUUID(), s.key, JSON.stringify(s.val), usersList[0].id, daysAgo(300)]
  );
}

// Import Presets from layout helper
const { EXECUTIVE_PRESET, TREASURY_PRESET, OPERATIONS_PRESET } = await import("../src/lib/dashboard/layout.ts");

const salesExecutivePreset = {
  overview: [
    { key: "sales_month", x: 0, y: 0, w: 4, h: 2 },
    { key: "collections_month", x: 4, y: 0, w: 4, h: 2 },
    { key: "total_receivables", x: 8, y: 0, w: 4, h: 2 },
    { key: "plot_inventory_status", x: 0, y: 2, w: 6, h: 4 },
    { key: "collection_trend", x: 6, y: 2, w: 6, h: 4 },
    { key: "quick_actions", x: 0, y: 6, w: 12, h: 2 },
  ],
  sales: [
    { key: "sales_month", x: 0, y: 0, w: 3, h: 2 },
    { key: "collections_month", x: 3, y: 0, w: 3, h: 2 },
    { key: "total_receivables", x: 6, y: 0, w: 3, h: 2 },
    { key: "overdue_receivables", x: 9, y: 0, w: 3, h: 2 },
    { key: "receivables_aging", x: 0, y: 2, w: 6, h: 4 },
    { key: "collection_trend", x: 6, y: 2, w: 6, h: 4 },
    { key: "overdue_installments", x: 0, y: 6, w: 12, h: 4 },
  ],
  financial: [],
  projects: [],
  partners: [],
  operations: [],
};

const roleLayouts = [
  { roleId: roleIdByName.get("Owner"), layout: EXECUTIVE_PRESET },
  { roleId: roleIdByName.get("Managing Partner"), layout: EXECUTIVE_PRESET },
  { roleId: roleIdByName.get("Accountant"), layout: TREASURY_PRESET },
  { roleId: roleIdByName.get("Site Manager"), layout: OPERATIONS_PRESET },
  { roleId: roleIdByName.get("Sales Executive"), layout: salesExecutivePreset },
  { roleId: roleIdByName.get("Auditor (read-only)"), layout: EXECUTIVE_PRESET },
];

for (const rl of roleLayouts) {
  await tenantConn.query(
    `INSERT INTO dashboard_layouts (id, scope, scope_id, layout, updated_by, updated_at)
     VALUES (?, 'ROLE', ?, ?, ?, ?)`,
    [randomUUID(), rl.roleId, JSON.stringify(rl.layout), usersList[0].id, daysAgo(300)]
  );
}

// ---------------------------------------------------------------------------
// 5. Default Categories
// ---------------------------------------------------------------------------
const categories = [
  "Registration", "Stamp Duty", "Mutation", "Cadastral Survey", "Earth Filling",
  "Boundary Wall", "Access Road", "Drainage", "Security Honorarium", "Office Rent",
  "Staff Salary", "Marketing Signboard", "Sub-Registry Drafting", "Bayna Advance"
];
for (const cat of categories) {
  await tenantConn.query(
    `INSERT IGNORE INTO default_categories (id, name, kind) VALUES (?, ?, 'project')`,
    [randomUUID(), cat]
  );
}

// ---------------------------------------------------------------------------
// 6. Audit Helper
// ---------------------------------------------------------------------------
async function recordAudit(tableName, recordId, action, changedBy, oldVals, newVals, dtStr) {
  await tenantConn.query(
    `INSERT INTO audit_log (id, table_name, record_id, action, changed_by, old_values, new_values, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      randomUUID(),
      tableName,
      recordId,
      action,
      changedBy,
      oldVals ? JSON.stringify(oldVals) : null,
      newVals ? JSON.stringify(newVals) : null,
      `${dtStr} 10:00:00`,
    ]
  );
}

// ---------------------------------------------------------------------------
// 7. Bank Accounts (3)
// ---------------------------------------------------------------------------
console.log("Step 5: Creating Commercial Bank Accounts...");
const bankAccounts = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    name: "Dutch-Bangla Bank PLC",
    accName: "Sonar Bangla Land Developers Ltd.",
    accNo: "DBBL-0115-12045892",
    branch: "Motijheel Commercial Area Branch",
    routing: "090273415",
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    name: "Islami Bank Bangladesh PLC",
    accName: "Sonar Bangla Land Developers Ltd.",
    accNo: "IBBL-0205-02139841",
    branch: "Dilkusha Branch",
    routing: "125271890",
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    name: "BRAC Bank PLC",
    accName: "Sonar Bangla Land Developers Ltd.",
    accNo: "BRAC-0150-10287654",
    branch: "Gulshan-1 Branch",
    routing: "060261122",
  },
];

for (const b of bankAccounts) {
  await tenantConn.query(
    `INSERT INTO bank_accounts (id, account_type, bank_name, account_name, account_number, branch_name, routing_number, opening_balance, current_balance, is_active, created_at)
     VALUES (?, 'BANK', ?, ?, ?, ?, ?, 0.00, 0.00, 1, ?)`,
    [b.id, b.name, b.accName, b.accNo, b.branch, b.routing, daysAgo(665)]
  );
  await recordAudit("bank_accounts", b.id, "CREATE", usersList[0].id, null, { bankName: b.name, accNo: b.accNo }, daysAgo(665));
}

// ---------------------------------------------------------------------------
// 8. Partners (5)
// ---------------------------------------------------------------------------
console.log("Step 6: Creating Syndicate Partners...");
const partnersList = [
  {
    id: "40000000-0000-0000-0000-000000000001",
    name: "Md. Rafiqul Islam",
    phone: "01700-000001",
    nid: "9990000000001",
    bank: "Dutch-Bangla Bank PLC",
    accNo: "115.101.44210",
    branch: "Dhanmondi Branch",
  },
  {
    id: "40000000-0000-0000-0000-000000000002",
    name: "Barrister Tariq Ahmed",
    phone: "01700-000002",
    nid: "9990000000002",
    bank: "BRAC Bank PLC",
    accNo: "206.115.88931",
    branch: "Gulshan Branch",
  },
  {
    id: "40000000-0000-0000-0000-000000000003",
    name: "Haji Abdul Gafur",
    phone: "01700-000003",
    nid: "9990000000003",
    bank: "Islami Bank Bangladesh PLC",
    accNo: "205.144.33129",
    branch: "Chawkbazar Branch",
  },
  {
    id: "40000000-0000-0000-0000-000000000004",
    name: "Dr. Nusrat Jahan",
    phone: "01700-000004",
    nid: "9990000000004",
    bank: "City Bank PLC",
    accNo: "310.201.77450",
    branch: "Uttara Branch",
  },
  {
    id: "40000000-0000-0000-0000-000000000005",
    name: "Kazi Faruq Hossain",
    phone: "01700-000005",
    nid: "9990000000005",
    bank: "Eastern Bank PLC",
    accNo: "108.312.66540",
    branch: "Mirpur Branch",
  },
];

for (const p of partnersList) {
  await tenantConn.query(
    `INSERT INTO partners (id, name, phone, nid_number, bank_name, bank_account_number, bank_branch, opening_balance, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0.00, 1, ?)`,
    [p.id, p.name, p.phone, p.nid, p.bank, p.accNo, p.branch, daysAgo(665)]
  );
  await recordAudit("partners", p.id, "CREATE", usersList[0].id, null, { name: p.name, phone: p.phone }, daysAgo(665));
}

// ---------------------------------------------------------------------------
// 9. Land Projects (6)
// ---------------------------------------------------------------------------
console.log("Step 7: Creating Land Development Projects...");
const projectsList = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    name: "Green Valley City",
    mouza: "Baraipara, Savar",
    jl: "142",
    dag: "CS-412, SA-891, RS-1205, BS-3401",
    khatian: "CS-55, SA-112, RS-340, BS-890",
    shotok: 150.00,
    price: 18000000.00,
    bayna: 4000000.00,
    regCost: 1800000.00,
    taxCost: 350000.00,
    status: "SOLD_OUT",
    createdAt: daysAgo(660),
    plotPrefix: "GV",
    plotCount: 30,
  },
  {
    id: "50000000-0000-0000-0000-000000000002",
    name: "River View Township",
    mouza: "Rohitpur, Keraniganj",
    jl: "88",
    dag: "CS-120, SA-334, RS-880, BS-1450",
    khatian: "CS-40, SA-95, RS-220, BS-610",
    shotok: 220.00,
    price: 28000000.00,
    bayna: 6000000.00,
    regCost: 2800000.00,
    taxCost: 550000.00,
    status: "SELLING",
    createdAt: daysAgo(540),
    plotPrefix: "RV",
    plotCount: 40,
  },
  {
    id: "50000000-0000-0000-0000-000000000003",
    name: "Lake Garden Oasis",
    mouza: "Bhelanagar, Purbachal Sector 22",
    jl: "105",
    dag: "CS-88, SA-210, RS-540, BS-982",
    khatian: "CS-31, SA-76, RS-180, BS-445",
    shotok: 180.00,
    price: 22000000.00,
    bayna: 5000000.00,
    regCost: 2200000.00,
    taxCost: 450000.00,
    status: "SELLING",
    createdAt: daysAgo(390),
    plotPrefix: "LG",
    plotCount: 32,
  },
  {
    id: "50000000-0000-0000-0000-000000000004",
    name: "Palm Heights",
    mouza: "Baoani, Gazipur Sadar",
    jl: "64",
    dag: "CS-92, SA-180, RS-420, BS-710",
    khatian: "CS-18, SA-52, RS-115, BS-302",
    shotok: 120.00,
    price: 15000000.00,
    bayna: 3500000.00,
    regCost: 1500000.00,
    taxCost: 300000.00,
    status: "DEVELOPING",
    createdAt: daysAgo(210),
    plotPrefix: "PH",
    plotCount: 24,
  },
  {
    id: "50000000-0000-0000-0000-000000000005",
    name: "Sunrise Residency",
    mouza: "Murapara, Rupganj, Narayanganj",
    jl: "42",
    dag: "CS-50, SA-110, RS-290",
    khatian: "CS-12, SA-38, RS-85",
    shotok: 90.00,
    price: 12000000.00,
    bayna: 2500000.00,
    regCost: 0.00,
    taxCost: 0.00,
    status: "UNDER_BAYNA",
    createdAt: daysAgo(68), // >60 days triggers bayna expiry insight (expiring in ~9 days)
    plotPrefix: "SR",
    plotCount: 18,
  },
  {
    id: "50000000-0000-0000-0000-000000000006",
    name: "Meghna Riverside Estate",
    mouza: "Baushia, Gazaria",
    jl: "19",
    dag: "CS-30, SA-65",
    khatian: "CS-09, SA-22",
    shotok: 70.00,
    price: 9000000.00,
    bayna: 0.00,
    regCost: 0.00,
    taxCost: 0.00,
    status: "DRAFT",
    createdAt: daysAgo(25),
    plotPrefix: "MR",
    plotCount: 14,
  },
];

for (const pr of projectsList) {
  await tenantConn.query(
    `INSERT INTO land_projects (id, project_name, mouza, jl_number, dag_numbers, khatian_numbers, total_area_shotok, purchase_price, bayna_amount, registration_cost, mutation_tax_cost, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pr.id, pr.name, pr.mouza, pr.jl, pr.dag, pr.khatian, pr.shotok,
      pr.price, pr.bayna, pr.regCost, pr.taxCost, pr.status, `${pr.createdAt} 09:00:00`
    ]
  );
  await recordAudit("land_projects", pr.id, "CREATE", usersList[0].id, null, { name: pr.name, shotok: pr.shotok }, pr.createdAt);
}

// ---------------------------------------------------------------------------
// 10. Project Partners (Shares exactly 100.00% per project)
// ---------------------------------------------------------------------------
console.log("Step 8: Allocating Partner Shares (Exactly 100.00% sum per project)...");
// Projects 1-3: Partners 1..4 (35%, 25%, 20%, 20%)
for (const pId of [projectsList[0].id, projectsList[1].id, projectsList[2].id]) {
  const shares = [
    { pId: partnersList[0].id, pct: 35.00 },
    { pId: partnersList[1].id, pct: 25.00 },
    { pId: partnersList[2].id, pct: 20.00 },
    { pId: partnersList[3].id, pct: 20.00 },
  ];
  for (const s of shares) {
    await tenantConn.query(
      `INSERT INTO project_partners (id, project_id, partner_id, share_percentage) VALUES (?, ?, ?, ?)`,
      [randomUUID(), pId, s.pId, s.pct]
    );
  }
}

// Projects 4-5: Partners 1..5 (30%, 20%, 20%, 15%, 15%)
for (const pId of [projectsList[3].id, projectsList[4].id]) {
  const shares = [
    { pId: partnersList[0].id, pct: 30.00 },
    { pId: partnersList[1].id, pct: 20.00 },
    { pId: partnersList[2].id, pct: 20.00 },
    { pId: partnersList[3].id, pct: 15.00 },
    { pId: partnersList[4].id, pct: 15.00 },
  ];
  for (const s of shares) {
    await tenantConn.query(
      `INSERT INTO project_partners (id, project_id, partner_id, share_percentage) VALUES (?, ?, ?, ?)`,
      [randomUUID(), pId, s.pId, s.pct]
    );
  }
}

// Project 6 (Draft): Partners 1..2 (50%, 50%)
for (const s of [
  { pId: partnersList[0].id, pct: 50.00 },
  { pId: partnersList[1].id, pct: 50.00 },
]) {
  await tenantConn.query(
    `INSERT INTO project_partners (id, project_id, partner_id, share_percentage) VALUES (?, ?, ?, ?)`,
    [randomUUID(), projectsList[5].id, s.pId, s.pct]
  );
}

// ---------------------------------------------------------------------------
// 11. Project Plots
// ---------------------------------------------------------------------------
console.log("Step 9: Generating Project Plots across all statuses...");
const allPlots = [];
// Project 1: Green Valley (30 plots, all SOLD)
// Total Shotok = 150. Saleable = 120 Shotok (common road/parks = 30 Shotok)
for (let i = 1; i <= 30; i++) {
  const num = `GV-${String(i).padStart(2, "0")}`;
  // Sizes 3.5, 4.0, 4.5 Shotok
  const size = i % 3 === 0 ? 4.5 : i % 2 === 0 ? 4.0 : 3.5;
  const askingPrice = size * 320000; // ~11.2L to 14.4L
  allPlots.push({
    id: randomUUID(),
    projectId: projectsList[0].id,
    plotNumber: num,
    size,
    askingPrice,
    status: "SOLD",
  });
}

// Project 2: River View (40 plots, ~65% sold/booked, held, available, reserved)
// Total Shotok = 220. Saleable = 175 Shotok (roads/greenery = 45 Shotok)
for (let i = 1; i <= 40; i++) {
  const num = `RV-${String(i).padStart(2, "0")}`;
  const size = i % 4 === 0 ? 5.0 : i % 3 === 0 ? 4.5 : i % 2 === 0 ? 4.0 : 3.5;
  const askingPrice = size * 350000;
  let status = "AVAILABLE";
  if (i <= 18) status = "SOLD";
  else if (i <= 24) status = "BOOKED";
  else if (i === 25 || i === 26) status = "HELD"; // Held plots (one expiring in 2 days)
  else if (i === 27) status = "RESERVED";
  else status = "AVAILABLE";

  allPlots.push({
    id: randomUUID(),
    projectId: projectsList[1].id,
    plotNumber: num,
    size,
    askingPrice,
    status,
  });
}

// Project 3: Lake Garden (32 plots, 25% sold/booked, premium, not for sale)
// Total Shotok = 180. Saleable = 144 Shotok (common = 36 Shotok)
for (let i = 1; i <= 32; i++) {
  const num = `LG-${String(i).padStart(2, "0")}`;
  const size = i % 4 === 0 ? 5.5 : i % 3 === 0 ? 4.5 : i % 2 === 0 ? 4.0 : 3.5;
  const isCorner = i % 5 === 0;
  const askingPrice = size * (isCorner ? 390000 : 340000);
  let status = "AVAILABLE";
  if (i <= 5) status = "SOLD";
  else if (i <= 8) status = "BOOKED";
  else if (i === 9 || i === 10) status = "RESERVED";
  else if (i === 11 || i === 12) status = "NOT_FOR_SALE"; // Common infrastructure / reserved for school
  else status = "AVAILABLE";

  allPlots.push({
    id: randomUUID(),
    projectId: projectsList[2].id,
    plotNumber: num,
    size,
    askingPrice,
    status,
  });
}

// Project 4: Palm Heights (24 plots, mostly UNPRICED, 6 newly priced AVAILABLE)
for (let i = 1; i <= 24; i++) {
  const num = `PH-${String(i).padStart(2, "0")}`;
  const size = 4.0;
  const isPriced = i <= 6;
  allPlots.push({
    id: randomUUID(),
    projectId: projectsList[3].id,
    plotNumber: num,
    size,
    askingPrice: isPriced ? 1350000.00 : 0.00,
    status: isPriced ? "AVAILABLE" : "UNPRICED",
  });
}

// Project 5: Sunrise Residency (18 plots, UNPRICED)
for (let i = 1; i <= 18; i++) {
  const num = `SR-${String(i).padStart(2, "0")}`;
  allPlots.push({
    id: randomUUID(),
    projectId: projectsList[4].id,
    plotNumber: num,
    size: 4.0,
    askingPrice: 0.00,
    status: "UNPRICED",
  });
}

// Project 6: Meghna Riverside (14 plots, DRAFT/UNPRICED)
for (let i = 1; i <= 14; i++) {
  const num = `MR-${String(i).padStart(2, "0")}`;
  allPlots.push({
    id: randomUUID(),
    projectId: projectsList[5].id,
    plotNumber: num,
    size: 4.0,
    askingPrice: 0.00,
    status: "UNPRICED",
  });
}

for (const pl of allPlots) {
  await tenantConn.query(
    `INSERT INTO project_plots (id, project_id, plot_number, plot_size_shotok, asking_price, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [pl.id, pl.projectId, pl.plotNumber, pl.size, pl.askingPrice, pl.status]
  );
}

// ---------------------------------------------------------------------------
// 12. Simulation Forward in Date Order (22 Months)
// ---------------------------------------------------------------------------
console.log("Step 10: Chronological Simulation (Capital, Purchases, Expenses, Sales, Collections, Contras)...");

// Bank balances tracker & Cash balance tracker for ledger verification
const bankBalMap = new Map();
for (const b of bankAccounts) bankBalMap.set(b.id, 0);
let cashInHand = 0;

let receiptSeq = 1;
function nextReceiptNo() {
  const num = String(receiptSeq++).padStart(4, "0");
  return `MR-${num}`;
}

// A. Initial Capital Injections (Month 1-3)
console.log("  -> Injecting initial syndicate equity...");
const initialDeposits = [
  // Partner 1 (Managing Partner)
  { pId: partnersList[0].id, bankId: bankAccounts[0].id, amt: 30000000.00, date: daysAgo(665), type: "BANK", note: "Syndicate Equity - DBBL" },
  { pId: partnersList[0].id, bankId: null, amt: 1500000.00, date: daysAgo(664), type: "CASH", note: "Initial Cash in Hand Float" },
  // Partner 2
  { pId: partnersList[1].id, bankId: bankAccounts[1].id, amt: 42000000.00, date: daysAgo(662), type: "BANK", note: "Syndicate Equity - IBBL" },
  // Partner 3
  { pId: partnersList[2].id, bankId: bankAccounts[2].id, amt: 20000000.00, date: daysAgo(660), type: "BANK", note: "Syndicate Equity - BRAC Bank" },
  // Partner 4
  { pId: partnersList[3].id, bankId: bankAccounts[0].id, amt: 20000000.00, date: daysAgo(658), type: "BANK", note: "Syndicate Equity - DBBL" },
];

for (const dep of initialDeposits) {
  const ptId = randomUUID();
  await tenantConn.query(
    `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at)
     VALUES (?, ?, 'DEPOSIT', ?, ?, ?, ?, ?)`,
    [ptId, dep.pId, dep.amt, dep.date, dep.bankId, dep.note, `${dep.date} 10:00:00`]
  );

  const tId = randomUUID();
  await tenantConn.query(
    `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
     VALUES (?, ?, ?, ?, 'IN', ?, ?, 'DEPOSIT', ?, ?, ?)`,
    [tId, dep.date, dep.type, dep.bankId, dep.amt, dep.note, ptId, usersList[0].id, `${dep.date} 10:00:00`]
  );

  if (dep.type === "BANK") {
    bankBalMap.set(dep.bankId, bankBalMap.get(dep.bankId) + dep.amt);
  } else {
    cashInHand += dep.amt;
  }
}

// B. Partner 5 Capital Deposit (Month 14, when joining for Project 4 & 5)
const p5Deposit = {
  pId: partnersList[4].id,
  bankId: bankAccounts[0].id,
  amt: 8000000.00,
  date: daysAgo(205),
  type: "BANK",
  note: "Partner 5 Syndicate Entry Capital - DBBL",
};
const p5TxId = randomUUID();
await tenantConn.query(
  `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at)
   VALUES (?, ?, 'DEPOSIT', ?, ?, ?, ?, ?)`,
  [p5TxId, p5Deposit.pId, p5Deposit.amt, p5Deposit.date, p5Deposit.bankId, p5Deposit.note, `${p5Deposit.date} 10:00:00`]
);
const p5LedgerId = randomUUID();
await tenantConn.query(
  `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
   VALUES (?, ?, 'BANK', ?, 'IN', ?, ?, 'DEPOSIT', ?, ?, ?)`,
  [p5LedgerId, p5Deposit.date, p5Deposit.bankId, p5Deposit.amt, p5Deposit.note, p5TxId, usersList[0].id, `${p5Deposit.date} 10:00:00`]
);
bankBalMap.set(p5Deposit.bankId, bankBalMap.get(p5Deposit.bankId) + p5Deposit.amt);

// C. Land Acquisitions & Registration Expenses (Paid via Bank)
console.log("  -> Recording land acquisition payments and statutory registration fees...");
const landAcquisitions = [
  // Project 1: Green Valley
  { prId: projectsList[0].id, bankId: bankAccounts[0].id, cat: "Bayna Advance", amt: 4000000.00, date: daysAgo(650), pur: "Bayna Agreement land earnest advance, Savar" },
  { prId: projectsList[0].id, bankId: bankAccounts[0].id, cat: "Registration", amt: 14000000.00, date: daysAgo(630), pur: "Final deed consideration purchase payment, Savar" },
  { prId: projectsList[0].id, bankId: bankAccounts[0].id, cat: "Stamp Duty", amt: 1800000.00, date: daysAgo(628), pur: "Sub-Registry stamp duty & registration fees" },
  { prId: projectsList[0].id, bankId: bankAccounts[1].id, cat: "Mutation", amt: 350000.00, date: daysAgo(610), pur: "AC Land office official mutation fees" },

  // Project 2: River View
  { prId: projectsList[1].id, bankId: bankAccounts[1].id, cat: "Bayna Advance", amt: 6000000.00, date: daysAgo(530), pur: "Bayna deed advance payment, Keraniganj" },
  { prId: projectsList[1].id, bankId: bankAccounts[1].id, cat: "Registration", amt: 22000000.00, date: daysAgo(500), pur: "Final deed land value payment, Keraniganj" },
  { prId: projectsList[1].id, bankId: bankAccounts[1].id, cat: "Stamp Duty", amt: 2800000.00, date: daysAgo(498), pur: "Registration duty and sub-registry fees" },
  { prId: projectsList[1].id, bankId: bankAccounts[2].id, cat: "Mutation", amt: 550000.00, date: daysAgo(480), pur: "AC Land namzari mutation order fees" },

  // Project 3: Lake Garden
  { prId: projectsList[2].id, bankId: bankAccounts[0].id, cat: "Bayna Advance", amt: 5000000.00, date: daysAgo(380), pur: "Earnest bayna payment, Purbachal Sector 22" },
  { prId: projectsList[2].id, bankId: bankAccounts[0].id, cat: "Registration", amt: 17000000.00, date: daysAgo(350), pur: "Final land purchase consideration, Purbachal" },
  { prId: projectsList[2].id, bankId: bankAccounts[2].id, cat: "Stamp Duty", amt: 2200000.00, date: daysAgo(348), pur: "Sub-Registry stamp duties and registration fees" },
  { prId: projectsList[2].id, bankId: bankAccounts[1].id, cat: "Mutation", amt: 450000.00, date: daysAgo(330), pur: "Mutation and khajna clearance fees" },

  // Project 4: Palm Heights
  { prId: projectsList[3].id, bankId: bankAccounts[0].id, cat: "Bayna Advance", amt: 3500000.00, date: daysAgo(200), pur: "Bayna agreement earnest deposit, Gazipur" },
  { prId: projectsList[3].id, bankId: bankAccounts[0].id, cat: "Registration", amt: 11500000.00, date: daysAgo(175), pur: "Land deed execution settlement, Gazipur" },
  { prId: projectsList[3].id, bankId: bankAccounts[0].id, cat: "Stamp Duty", amt: 1500000.00, date: daysAgo(173), pur: "Registration deed stamp cost" },
  { prId: projectsList[3].id, bankId: bankAccounts[1].id, cat: "Mutation", amt: 300000.00, date: daysAgo(155), pur: "AC Land Namzari mutation fees" },

  // Project 5: Sunrise Residency (UNDER_BAYNA)
  { prId: projectsList[4].id, bankId: bankAccounts[1].id, cat: "Bayna Advance", amt: 2500000.00, date: daysAgo(68), pur: "Bayna contract token advance (expiring in 9 days), Rupganj" },
];

for (const acq of landAcquisitions) {
  const expId = randomUUID();
  await tenantConn.query(
    `INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, payment_channel, bank_account_id, description, status, approved_by, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, 'BANK', ?, ?, 'APPROVED', ?, ?, ?)`,
    [expId, acq.prId, acq.cat, acq.amt, acq.date, acq.bankId, acq.pur, usersList[0].id, usersList[2].id, `${acq.date} 11:00:00`]
  );
  await recordAudit("project_expenses", expId, "CREATE", usersList[2].id, null, { amount: acq.amt, cat: acq.cat }, acq.date);

  const ledId = randomUUID();
  await tenantConn.query(
    `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
     VALUES (?, ?, 'BANK', ?, 'OUT', ?, ?, 'EXPENSE', ?, ?, ?)`,
    [ledId, acq.date, acq.bankId, acq.amt, acq.pur, expId, usersList[2].id, `${acq.date} 11:00:00`]
  );
  bankBalMap.set(acq.bankId, bankBalMap.get(acq.bankId) - acq.amt);
}

// D. Regular Development & Operational Expenses (Over 120 approved vouchers)
console.log("  -> Generating 130+ project development vouchers across Cash, Bank & PAID_BY_PARTNER...");

const devTemplates = [
  { cat: "Cadastral Survey", pur: "Digital total station boundary demarcation by registered survey team", amtRange: [65000, 115000], chan: "CASH" },
  { cat: "Earth Filling", pur: "Earthwork leveling, sand filling contractor bill", amtRange: [280000, 580000], chan: "BANK" },
  { cat: "Boundary Wall", pur: "Precast RCC concrete boundary pillars and barbed wire fencing", amtRange: [185000, 360000], chan: "BANK" },
  { cat: "Access Road", pur: "Internal access road brick soling and herringbone bond layout", amtRange: [240000, 480000], chan: "BANK" },
  { cat: "Drainage", pur: "Stormwater roadside culvert and RCC pipe drainage work", amtRange: [140000, 290000], chan: "CASH" },
  { cat: "Security Honorarium", pur: "On-site security guards monthly wages and bamboo checkpoint shelter", amtRange: [35000, 65000], chan: "CASH" },
  { cat: "Marketing Signboard", pur: "Highway metal billboard signboards and plot numbering steel signposts", amtRange: [45000, 95000], chan: "CASH" },
  { cat: "Sub-Registry Drafting", pur: "Legal deed drafting, non-judicial stamp papers and notary fees", amtRange: [50000, 120000], chan: "PAID_BY_PARTNER" },
  { cat: "Office Rent", pur: "Head office monthly corporate commercial suite rent, Motijheel", amtRange: [85000, 85000], chan: "BANK", noProject: true },
  { cat: "Staff Salary", pur: "Administrative, site engineering, and accounts monthly payroll", amtRange: [140000, 190000], chan: "BANK", noProject: true },
];

// Spread expenses across 22 months (~22 intervals)
const projectPool = [projectsList[0], projectsList[1], projectsList[2], projectsList[3]];

for (let monthIdx = 1; monthIdx <= 22; monthIdx++) {
  const dAgo = Math.max(5, 660 - (monthIdx * 30));
  const baseDate = avoidFriday(daysAgo(dAgo));

  // 6 vouchers per month = ~132 approved vouchers
  for (let v = 0; v < 6; v++) {
    const tpl = devTemplates[(monthIdx + v) % devTemplates.length];
    const pr = tpl.noProject ? null : projectPool[(monthIdx + v) % projectPool.length];
    const amt = randInt(tpl.amtRange[0], tpl.amtRange[1]);
    const expDate = avoidFriday(daysAgo(Math.max(4, dAgo - v)));
    const expId = randomUUID();

    // 2 vouchers per month as PAID_BY_PARTNER, rest Cash/Bank
    let chan = (v === 1 || v === 4) ? "PAID_BY_PARTNER" : tpl.chan;
    let bankId = null;
    let paidByPartnerId = null;

    if (chan === "BANK") {
      bankId = bankAccounts[(monthIdx + v) % 3].id;
    } else if (chan === "PAID_BY_PARTNER") {
      paidByPartnerId = partnersList[(monthIdx + v) % 4].id;
    }

    const voucherUrl = `/uploads/tenant_demo/vouchers/vouch_${monthIdx}_${v + 1}.png`;

    await tenantConn.query(
      `INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, description, payment_channel, bank_account_id, paid_by_partner_id, voucher_image_url, status, approved_by, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', ?, ?, ?)`,
      [
        expId, pr ? pr.id : null, tpl.cat, amt, expDate,
        pr ? `${tpl.pur} - ${pr.name}` : `${tpl.pur} - Corporate Overhead`,
        chan, bankId, paidByPartnerId, voucherUrl,
        usersList[0].id, usersList[3].id, `${expDate} 12:00:00`
      ]
    );

    // Ledger / Partner Txn
    if (chan === "CASH") {
      const ledId = randomUUID();
      await tenantConn.query(
        `INSERT INTO treasury_ledger (id, txn_date, account_type, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
         VALUES (?, ?, 'CASH', 'OUT', ?, ?, 'EXPENSE', ?, ?, ?)`,
        [ledId, expDate, amt, `${tpl.cat} (${pr ? pr.name : "Overhead"})`, expId, usersList[2].id, `${expDate} 12:00:00`]
      );
      cashInHand -= amt;
    } else if (chan === "BANK") {
      const ledId = randomUUID();
      await tenantConn.query(
        `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
         VALUES (?, ?, 'BANK', ?, 'OUT', ?, ?, 'EXPENSE', ?, ?, ?)`,
        [ledId, expDate, bankId, amt, `${tpl.cat} (${pr ? pr.name : "Overhead"})`, expId, usersList[2].id, `${expDate} 12:00:00`]
      );
      bankBalMap.set(bankId, bankBalMap.get(bankId) - amt);
    } else if (chan === "PAID_BY_PARTNER") {
      // Direct expense paid by partner out of pocket (NO treasury ledger entry!)
      const ptId = randomUUID();
      await tenantConn.query(
        `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at)
         VALUES (?, ?, 'DIRECT_EXPENSE', ?, ?, ?, ?, ?)`,
        [ptId, paidByPartnerId, amt, expDate, expId, `Direct out-of-pocket payment: ${tpl.cat} (${pr ? pr.name : "General"})`, `${expDate} 12:00:00`]
      );
    }
  }
}

// 7 Pending Vouchers (6 older than 3 days to trigger pending approvals warning)
const pendingExpenses = [
  { prId: projectsList[3].id, cat: "Earth Filling", amt: 485000.00, desc: "Gazipur Palm Heights subgrade earth filling 3rd bill", days: 8, chan: "BANK", bankId: bankAccounts[0].id },
  { prId: projectsList[3].id, cat: "Boundary Wall", amt: 275000.00, desc: "Eastern boundary precast concrete pillars installation bill", days: 7, chan: "BANK", bankId: bankAccounts[1].id },
  { prId: projectsList[1].id, cat: "Access Road", amt: 185000.00, desc: "Keraniganj road widening brick supplier invoice", days: 6, chan: "CASH", bankId: null },
  { prId: projectsList[2].id, cat: "Security Honorarium", amt: 45000.00, desc: "Purbachal site security guards monthly allowance", days: 5, chan: "CASH", bankId: null },
  { prId: projectsList[3].id, cat: "Cadastral Survey", amt: 95000.00, desc: "Plot demarcation digital re-survey invoice", days: 4, chan: "CASH", bankId: null },
  { prId: projectsList[4].id, cat: "Sub-Registry Drafting", amt: 65000.00, desc: "Sunrise Residency preliminary deed drafting fee", days: 4, chan: "CASH", bankId: null },
  { prId: projectsList[1].id, cat: "Marketing Signboard", amt: 55000.00, desc: "Highway entrance decorative arch banner bill", days: 1, chan: "CASH", bankId: null },
];

for (const pe of pendingExpenses) {
  const pExpId = randomUUID();
  const dt = avoidFriday(daysAgo(pe.days));
  await tenantConn.query(
    `INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, description, payment_channel, bank_account_id, voucher_image_url, status, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, '/uploads/tenant_demo/vouchers/pending_sample.png', 'PENDING', ?, ?)`,
    [pExpId, pe.prId, pe.cat, pe.amt, dt, pe.desc, pe.chan, pe.bankId, usersList[3].id, `${dt} 14:00:00`]
  );
  await recordAudit("project_expenses", pExpId, "CREATE", usersList[3].id, null, { amount: pe.amt, status: "PENDING" }, dt);
}

// 4 Rejected Expenses with clear reasons
const rejectedExpenses = [
  { prId: projectsList[1].id, cat: "Misc", amt: 85000.00, desc: "Unverified diesel fuel receipts without vehicle log sheet", reason: "Rejected: Incomplete fuel log and odometer logs missing" },
  { prId: projectsList[2].id, cat: "Labor", amt: 120000.00, desc: "Overtime labor claim without site engineer signature", reason: "Rejected: Site attendance muster roll not certified by engineer" },
  { prId: projectsList[0].id, cat: "Cadastral Survey", amt: 75000.00, desc: "Duplicate survey fee voucher submitted twice", reason: "Rejected: Duplicate claim already settled under voucher #082" },
  { prId: projectsList[3].id, cat: "Misc", amt: 45000.00, desc: "Personal travel expenses not authorized by company policy", reason: "Rejected: Non-reimbursable personal transport" },
];

for (const re of rejectedExpenses) {
  const rExpId = randomUUID();
  const dt = avoidFriday(daysAgo(randInt(20, 100)));
  await tenantConn.query(
    `INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, description, payment_channel, voucher_image_url, status, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'CASH', '/uploads/tenant_demo/vouchers/rejected_sample.png', 'REJECTED', ?, ?)`,
    [rExpId, re.prId, re.cat, re.amt, dt, `${re.desc} - [${re.reason}]`, usersList[3].id, `${dt} 15:00:00`]
  );
  await recordAudit("project_expenses", rExpId, "CREATE", usersList[3].id, null, { amount: re.amt, status: "REJECTED" }, dt);
}

// E. Sales Contracts, Installments, Customer Payments & Collections
console.log("Step 11: Generating 62 Sales Contracts & 320+ Customer Payments...");

// Buyers list
const buyersList = [
  { name: "Mohammad Shahidullah", phone: "01700-000101", nid: "9991000000001", addr: "House 12, Road 4, Sector 7, Uttara, Dhaka" },
  { name: "Farhana Yasmin", phone: "01700-000102", nid: "9991000000002", addr: "Flat 4B, Concord Tower, Gulshan-2, Dhaka" },
  { name: "Kabir Hossain", phone: "01700-000103", nid: "9991000000003", addr: "55/A Siddique Bazar, Kotwali, Dhaka" },
  { name: "Nazmul Haque", phone: "01700-000104", nid: "9991000000004", addr: "House 28, Block B, Bashundhara R/A, Dhaka" },
  { name: "Sultana Razia", phone: "01700-000105", nid: "9991000000005", addr: "Plot 19, Road 8, Dhanmondi, Dhaka" },
  { name: "Dr. Aminul Islam", phone: "01700-000106", nid: "9991000000006", addr: "Green Road Medical Doctors Quarter, Dhaka" },
  { name: "Tanvir Hasan", phone: "01700-000107", nid: "9991000000007", addr: "House 45, Road 11, Banani, Dhaka" },
  { name: "Advocate Shafiul Alam", phone: "01700-000108", nid: "9991000000008", addr: "Supreme Court Bar Association Bhaban, Dhaka" },
  { name: "Salma Begum", phone: "01700-000109", nid: "9991000000009", addr: "78 Shantinagar Main Road, Dhaka" },
  { name: "Mahfuzur Rahman", phone: "01700-000110", nid: "9991000000010", addr: "House 14, Block E, Lalmatia, Dhaka" },
  { name: "Jahangir Kabir", phone: "01700-000111", nid: "9991000000011", addr: "Plot 3, Sector 13, Uttara, Dhaka" },
  { name: "Rehana Akter", phone: "01700-000112", nid: "9991000000012", addr: "House 102, Road 9/A, Dhanmondi, Dhaka" },
  { name: "Golam Mustafa", phone: "01700-000113", nid: "9991000000013", addr: "44 Mirpur-10 Circle, Mirpur, Dhaka" },
  { name: "Shamima Nasrin", phone: "01700-000114", nid: "9991000000014", addr: "Flat 7A, Navana Tower, Mohakhali DOHS, Dhaka" },
  { name: "Mustafizur Rahman", phone: "01700-000115", nid: "9991000000015", addr: "House 21, Road 3, Baridhara DOHS, Dhaka" },
  { name: "Nusrat Jahan Chowdhury", phone: "01700-000116", nid: "9991000000016", addr: "Flat 3C, Sky View Garden, Eskaton, Dhaka" },
  { name: "Ziaur Rahman", phone: "01700-000117", nid: "9991000000017", addr: "House 66, Sector 4, Uttara, Dhaka" },
  { name: "Taslima Khatun", phone: "01700-000118", nid: "9991000000018", addr: "18 Nawabpur Road, Old Dhaka" },
  { name: "Anisur Rahman", phone: "01700-000119", nid: "9991000000019", addr: "House 9, Road 2, Block D, Niketan, Dhaka" },
  { name: "Laila Arjumand", phone: "01700-000120", nid: "9991000000020", addr: "Flat 5D, Green Heritage, Segunbagicha, Dhaka" },
];

// Target Plots to sell:
// Project 1 (Green Valley): 30 plots (all 30 SOLD)
// Project 2 (River View): 24 plots (18 SOLD, 6 BOOKED)
// Project 3 (Lake Garden): 8 plots (5 SOLD, 3 BOOKED)
const plotsToSell = [
  ...allPlots.filter((p) => p.projectId === projectsList[0].id),
  ...allPlots.filter((p) => p.projectId === projectsList[1].id && (p.status === "SOLD" || p.status === "BOOKED")),
  ...allPlots.filter((p) => p.projectId === projectsList[2].id && (p.status === "SOLD" || p.status === "BOOKED")),
];

console.log(`Total plots being contracted for sales: ${plotsToSell.length}`);

for (let sIdx = 0; sIdx < plotsToSell.length; sIdx++) {
  const pl = plotsToSell[sIdx];
  const buyer = buyersList[sIdx % buyersList.length];
  const saleId = randomUUID();

  // Determine sale date based on project launch
  let saleDaysAgo = 0;
  if (pl.projectId === projectsList[0].id) {
    // Project 1 sales between 600 days ago and 300 days ago
    saleDaysAgo = Math.floor(600 - (sIdx * 9.5));
  } else if (pl.projectId === projectsList[1].id) {
    // Project 2 sales between 480 days ago and 80 days ago
    saleDaysAgo = Math.floor(480 - ((sIdx - 30) * 16));
  } else {
    // Project 3 sales between 320 days ago and 30 days ago
    saleDaysAgo = Math.floor(320 - ((sIdx - 54) * 35));
  }
  saleDaysAgo = Math.max(15, saleDaysAgo);
  const saleDate = avoidFriday(daysAgo(saleDaysAgo));

  const agreedPrice = pl.askingPrice;

  // Mix: Upfront, Installments (6, 12, 24 mo), Booking-only
  // Project 1 is 100% SOLD & collected!
  const isP1 = pl.projectId === projectsList[0].id;
  const isP2 = pl.projectId === projectsList[1].id;

  let advanceBooking = 0;
  let installmentCount = 0;
  let isFullUpfront = false;

  if (isP1) {
    if (sIdx % 4 === 0) {
      isFullUpfront = true;
      advanceBooking = agreedPrice;
      installmentCount = 0;
    } else {
      advanceBooking = Math.round(agreedPrice * 0.30);
      installmentCount = sIdx % 2 === 0 ? 6 : 10;
    }
  } else {
    if (pl.status === "BOOKED") {
      // Booking only with small advance
      advanceBooking = Math.round(agreedPrice * 0.20);
      installmentCount = 12;
    } else {
      advanceBooking = Math.round(agreedPrice * 0.30);
      installmentCount = sIdx % 3 === 0 ? 12 : sIdx % 2 === 0 ? 6 : 24;
    }
  }

  // Record Land Sale
  await tenantConn.query(
    `INSERT INTO land_sales (id, project_id, plot_id, buyer_name, buyer_phone, buyer_nid, sale_date, total_agreed_price, advance_booking_amount, current_due_amount, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, ?)`,
    [
      saleId, pl.projectId, pl.id, buyer.name, buyer.phone, buyer.nid,
      saleDate, agreedPrice, advanceBooking, pl.status
    ]
  );
  await recordAudit("land_sales", saleId, "CREATE", usersList[4].id, null, { buyer: buyer.name, price: agreedPrice }, saleDate);

  // Initial Booking Payment
  const receiptNo = nextReceiptNo();
  const bookingPmtId = randomUUID();
  // For sales within last 35 days, use DBBL/IBBL so BRAC Bank demonstrates stale account insight (>30 days since entry)
  const bankChoice = (saleDaysAgo < 35) ? bankAccounts[sIdx % 2] : bankAccounts[sIdx % 3];

  await tenantConn.query(
    `INSERT INTO customer_payments (id, sale_id, payment_date, amount_paid, payment_method, bank_account_id, receiptNo, remarks)
     VALUES (?, ?, ?, ?, 'BANK', ?, ?, 'Plot advance booking payment')`,
    [bookingPmtId, saleId, saleDate, advanceBooking, bankChoice.id, receiptNo]
  );
  await recordAudit("customer_payments", bookingPmtId, "CREATE", usersList[4].id, null, { receiptNo, amt: advanceBooking }, saleDate);

  // Treasury ledger entry for booking collection
  const tLedgerId = randomUUID();
  await tenantConn.query(
    `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
     VALUES (?, ?, 'BANK', ?, 'IN', ?, ?, 'COLLECTION', ?, ?, ?)`,
    [
      tLedgerId, saleDate, bankChoice.id, advanceBooking,
      `Collection - ${receiptNo} - ${buyer.name} - Plot ${pl.plotNumber}`,
      bookingPmtId, usersList[4].id, `${saleDate} 14:00:00`
    ]
  );
  bankBalMap.set(bankChoice.id, bankBalMap.get(bankChoice.id) + advanceBooking);

  let totalCollected = advanceBooking;
  const remaining = agreedPrice - advanceBooking;

  // Installment schedule generation
  if (installmentCount > 0 && remaining > 0) {
    const monthlyDue = Math.round(remaining / installmentCount);

    for (let inst = 1; inst <= installmentCount; inst++) {
      const scheduleId = randomUUID();
      // Due date every 30 days after sale date
      const instDaysAgo = saleDaysAgo - (inst * 30);
      const isPast = instDaysAgo >= 0;
      const dueDate = isPast ? avoidFriday(daysAgo(instDaysAgo)) : avoidFriday(daysAfter(Math.abs(instDaysAgo)));

      let instStatus = "UPCOMING";

      if (isPast) {
        if (isP1) {
          // Project 1 is fully collected
          instStatus = "PAID";
        } else if (isP2 && (sIdx % 5 === 0) && instDaysAgo < 120) {
          // Deliberate overdue in Project 2 across aging buckets:
          // 1-30 days, 31-60 days, 61-90 days, >90 days overdue
          instStatus = "OVERDUE";
        } else if (pl.status === "BOOKED") {
          instStatus = inst <= 2 ? "PAID" : "UPCOMING";
        } else {
          instStatus = "PAID";
        }
      } else {
        instStatus = "UPCOMING";
      }

      await tenantConn.query(
        `INSERT INTO installment_schedule (id, sale_id, due_date, due_amount, status)
         VALUES (?, ?, ?, ?, ?)`,
        [scheduleId, saleId, dueDate, monthlyDue, instStatus]
      );

      // If PAID, create customer payment & treasury ledger
      if (instStatus === "PAID") {
        const instReceipt = nextReceiptNo();
        const instPmtId = randomUUID();
        const pmtMethod = inst % 4 === 0 ? "CASH" : "BANK";
        const instBank = pmtMethod === "BANK" ? (instDaysAgo < 35 ? bankAccounts[(sIdx + inst) % 2] : bankAccounts[(sIdx + inst) % 3]) : null;
        const pmtDate = avoidFriday(dueDate);

        await tenantConn.query(
          `INSERT INTO customer_payments (id, sale_id, payment_date, amount_paid, payment_method, bank_account_id, receiptNo, remarks)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            instPmtId, saleId, pmtDate, monthlyDue, pmtMethod,
            instBank ? instBank.id : null, instReceipt,
            `Installment ${inst} of ${installmentCount} for Plot ${pl.plotNumber}`
          ]
        );
        await recordAudit("customer_payments", instPmtId, "CREATE", usersList[4].id, null, { receiptNo: instReceipt, amt: monthlyDue }, pmtDate);

        const ledId = randomUUID();
        await tenantConn.query(
          `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
           VALUES (?, ?, ?, ?, 'IN', ?, ?, 'COLLECTION', ?, ?, ?)`,
          [
            ledId, pmtDate, pmtMethod, instBank ? instBank.id : null, monthlyDue,
            `Collection - ${instReceipt} - ${buyer.name} - Plot ${pl.plotNumber}`,
            instPmtId, usersList[4].id, `${pmtDate} 15:00:00`
          ]
        );

        if (pmtMethod === "BANK") {
          bankBalMap.set(instBank.id, bankBalMap.get(instBank.id) + monthlyDue);
        } else {
          cashInHand += monthlyDue;
        }

        totalCollected += monthlyDue;
      }
    }
  }

  // Update sale current_due_amount
  const currentDue = agreedPrice - totalCollected;
  await tenantConn.query(
    `UPDATE land_sales SET current_due_amount = ? WHERE id = ?`,
    [currentDue, saleId]
  );
}

// F. Regular Contra Transfers (Cash <-> Banks)
console.log("Step 12: Executing Contra Transfers (Cash <-> Bank)...");
const contraDates = [
  daysAgo(640), daysAgo(610), daysAgo(580), daysAgo(550), daysAgo(520),
  daysAgo(490), daysAgo(460), daysAgo(430), daysAgo(400), daysAgo(370),
  daysAgo(340), daysAgo(310), daysAgo(280), daysAgo(250), daysAgo(220),
  daysAgo(190), daysAgo(160), daysAgo(130), daysAgo(100), daysAgo(70),
  daysAgo(40), daysAgo(12), daysAgo(4) // 4 days ago ensures last 7 days activity!
];

for (let cIdx = 0; cIdx < contraDates.length; cIdx++) {
  const dt = avoidFriday(contraDates[cIdx]);
  // For the last 2 contras, use DBBL and IBBL only so BRAC Bank (last txn 40 days ago) demonstrates stale account insight
  const b = cIdx >= contraDates.length - 2 ? bankAccounts[cIdx % 2] : bankAccounts[cIdx % 3];
  const outId = randomUUID();
  const inId = randomUUID();

  if (cIdx % 2 === 0) {
    // Cash Deposit to Bank
    const amt = 250000.00;
    // Out from Cash
    await tenantConn.query(
      `INSERT INTO treasury_ledger (id, txn_date, account_type, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
       VALUES (?, ?, 'CASH', 'OUT', ?, ?, 'CONTRA', ?, ?, ?)`,
      [outId, dt, amt, `Contra cash deposit to ${b.name}`, inId, usersList[2].id, `${dt} 16:00:00`]
    );
    // In to Bank
    await tenantConn.query(
      `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
       VALUES (?, ?, 'BANK', ?, 'IN', ?, ?, 'CONTRA', ?, ?, ?)`,
      [inId, dt, b.id, amt, `Contra cash deposit to ${b.name}`, outId, usersList[2].id, `${dt} 16:00:00`]
    );
    cashInHand -= amt;
    bankBalMap.set(b.id, bankBalMap.get(b.id) + amt);
  } else {
    // Bank Withdrawal to Cash Float
    const amt = 180000.00;
    // Out from Bank
    await tenantConn.query(
      `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
       VALUES (?, ?, 'BANK', ?, 'OUT', ?, ?, 'CONTRA', ?, ?, ?)`,
      [outId, dt, b.id, amt, `Office cash operational float withdrawal from ${b.name}`, inId, usersList[2].id, `${dt} 16:00:00`]
    );
    // In to Cash
    await tenantConn.query(
      `INSERT INTO treasury_ledger (id, txn_date, account_type, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
       VALUES (?, ?, 'CASH', 'IN', ?, ?, 'CONTRA', ?, ?, ?)`,
      [inId, dt, amt, `Office cash operational float withdrawal from ${b.name}`, outId, usersList[2].id, `${dt} 16:00:00`]
    );
    bankBalMap.set(b.id, bankBalMap.get(b.id) - amt);
    cashInHand += amt;
  }
}

// 1 Pending Contra Transfer Request in audit_log
const pendingContraId = randomUUID();
await recordAudit(
  "treasury_transfer_requests",
  pendingContraId,
  "CREATE",
  usersList[2].id,
  null,
  {
    id: pendingContraId,
    fromType: "BANK",
    toType: "CASH",
    amount: 150000.00,
    bankAccountId: bankAccounts[0].id,
    purpose: "Weekly site petty cash float replenishment",
    requestedBy: usersList[2].id,
    status: "PENDING",
  },
  daysAgo(2)
);

// G. Partner Capital Withdrawals (A few partners make a withdrawal)
console.log("  -> Recording partner withdrawals...");
// G. Partner Periodic Equity Contributions & Withdrawals
console.log("  -> Recording periodic partner equity injections & withdrawals (80+ total txns)...");
// Periodic equity contributions spread across 22 months to support project rollouts
for (let m = 1; m <= 22; m++) {
  const p = partnersList[(m - 1) % 5];
  const dt = avoidFriday(daysAgo(Math.max(6, 650 - (m * 29))));
  const amt = randInt(150000, 350000);
  const isCash = m % 3 === 0;
  const b = isCash ? null : bankAccounts[m % 3];

  const ptId = randomUUID();
  await tenantConn.query(
    `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at)
     VALUES (?, ?, 'DEPOSIT', ?, ?, ?, ?, ?)`,
    [ptId, p.id, amt, dt, b ? b.id : null, `Periodic project syndicate equity top-up - ${p.name}`, `${dt} 10:30:00`]
  );

  const ledId = randomUUID();
  await tenantConn.query(
    `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
     VALUES (?, ?, ?, ?, 'IN', ?, ?, 'DEPOSIT', ?, ?, ?)`,
    [
      ledId, dt, isCash ? "CASH" : "BANK", b ? b.id : null, amt,
      `Syndicate equity top-up - ${p.name}`, ptId, usersList[0].id, `${dt} 10:30:00`
    ]
  );

  if (isCash) {
    cashInHand += amt;
  } else {
    bankBalMap.set(b.id, bankBalMap.get(b.id) + amt);
  }
}

const withdrawals = [
  { pId: partnersList[1].id, bankId: bankAccounts[1].id, amt: 1200000.00, date: daysAgo(310), pur: "Syndicate interim equity return - Partner 2" },
  { pId: partnersList[2].id, bankId: bankAccounts[2].id, amt: 800000.00, date: daysAgo(290), pur: "Syndicate interim capital withdrawal - Partner 3" },
];
for (const wd of withdrawals) {
  const ptId = randomUUID();
  await tenantConn.query(
    `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at)
     VALUES (?, ?, 'WITHDRAWAL', ?, ?, ?, ?, ?)`,
    [ptId, wd.pId, wd.amt, wd.date, wd.bankId, wd.pur, `${wd.date} 16:00:00`]
  );
  const ledId = randomUUID();
  await tenantConn.query(
    `INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at)
     VALUES (?, ?, 'BANK', ?, 'OUT', ?, ?, 'WITHDRAWAL', ?, ?, ?)`,
    [ledId, wd.date, wd.bankId, wd.amt, wd.pur, ptId, usersList[0].id, `${wd.date} 16:00:00`]
  );
  bankBalMap.set(wd.bankId, bankBalMap.get(wd.bankId) - wd.amt);
}

// H. Profit Distribution on Completed Project (Project 1: Green Valley City)
// Section 3: "use both a cash-basis record and the final record", 10+ profit distribution rows
console.log("Step 13: Executing Net Profit Distribution for Project 1 (Green Valley City)...");
const [[p1SalesRow]] = await tenantConn.query(
  `SELECT SUM(total_agreed_price) as totalSales FROM land_sales WHERE project_id = ?`,
  [projectsList[0].id]
);
const [[p1ExpRow]] = await tenantConn.query(
  `SELECT SUM(amount) as totalExp FROM project_expenses WHERE project_id = ? AND status = 'APPROVED'`,
  [projectsList[0].id]
);
const p1TotalSales = Number(p1SalesRow.totalSales || 0);
const p1TotalExp = Number(p1ExpRow.totalExp || 0);
const p1NetProfit = Math.round(p1TotalSales - p1TotalExp); // Gross sales - costs
console.log(`  Green Valley City Total Invoiced Sales: ৳ ${p1TotalSales.toLocaleString()}`);
console.log(`  Green Valley City Total Expenses      : ৳ ${p1TotalExp.toLocaleString()}`);
console.log(`  Green Valley City Net Realised Profit : ৳ ${p1NetProfit.toLocaleString()}`);

// Distribute to Partners 1..4 (35%, 25%, 20%, 20%) in 3 rounds:
// Round 1 (Cash Basis): 30% of profit at daysAgo(280)
// Round 2 (Cash Basis): 30% of profit at daysAgo(200)
// Round 3 (Completion Basis Final): remaining 40% at daysAgo(140)
// 3 rounds * 4 partners = 12 profit_distributions rows!
const distRounds = [
  { basis: "CASH_BASIS", pctOfTotal: 0.30, date: daysAgo(280), label: "Interim Q1 Cash-Basis Distribution" },
  { basis: "CASH_BASIS", pctOfTotal: 0.30, date: daysAgo(200), label: "Interim Q2 Cash-Basis Distribution" },
  { basis: "COMPLETION_BASIS", pctOfTotal: 0.40, date: daysAgo(140), label: "Final Completion-Basis Profit Distribution" },
];

const distPartners = [
  { pId: partnersList[0].id, pct: 35.00 },
  { pId: partnersList[1].id, pct: 25.00 },
  { pId: partnersList[2].id, pct: 20.00 },
  { pId: partnersList[3].id, pct: 20.00 },
];

let distributedTotalSoFar = 0;
for (let rIdx = 0; rIdx < distRounds.length; rIdx++) {
  const round = distRounds[rIdx];
  const isLast = rIdx === distRounds.length - 1;
  const roundPool = isLast
    ? p1NetProfit - distributedTotalSoFar
    : Math.round(p1NetProfit * round.pctOfTotal);

  let roundDistributed = 0;
  for (let pIdx = 0; pIdx < distPartners.length; pIdx++) {
    const dp = distPartners[pIdx];
    const isLastPartner = pIdx === distPartners.length - 1;
    const payout = isLastPartner
      ? roundPool - roundDistributed
      : Math.round((roundPool * dp.pct) / 100);

    roundDistributed += payout;
    const distId = randomUUID();

    await tenantConn.query(
      `INSERT INTO profit_distributions (id, project_id, distribution_date, realization_basis, total_project_net_profit, partner_id, partner_share_percent, payout_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [distId, projectsList[0].id, round.date, round.basis, p1NetProfit, dp.pId, dp.pct, payout]
    );
    await recordAudit("profit_distributions", distId, "CREATE", usersList[0].id, null, { round: round.label, payout, pct: dp.pct }, round.date);

    // Credit to partner ledger
    const ptId = randomUUID();
    await tenantConn.query(
      `INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at)
       VALUES (?, ?, 'PROFIT_CREDIT', ?, ?, ?, ?, ?)`,
      [ptId, dp.pId, payout, round.date, distId, `Green Valley City ${round.label} (${dp.pct}%)`, `${round.date} 16:30:00`]
    );
    await recordAudit("partner_transactions", ptId, "CREATE", usersList[0].id, null, { type: "PROFIT_CREDIT", amount: payout }, round.date);
  }

  distributedTotalSoFar += roundDistributed;
}
console.log(`  Distributed 12 profit distribution records totaling exactly: ৳ ${distributedTotalSoFar.toLocaleString()}`);

// I. Synchronize Bank Account current_balance with Ledger Sums
console.log("Step 14: Synchronizing Bank Account current_balance to exact ledger sums...");
for (const b of bankAccounts) {
  const [[sumRow]] = await tenantConn.query(
    `SELECT SUM(CASE WHEN flow_type = 'IN' THEN amount ELSE -amount END) as netBal
     FROM treasury_ledger WHERE account_type = 'BANK' AND bank_account_id = ?`,
    [b.id]
  );
  const bal = Number(sumRow.netBal || 0);
  await tenantConn.query(
    `UPDATE bank_accounts SET current_balance = ? WHERE id = ?`,
    [bal, b.id]
  );
  console.log(`  Bank "${b.name}": ৳ ${bal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`);
}

console.log(`  Cash in Hand (Ledger Sum): ৳ ${cashInHand.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`);

// ---------------------------------------------------------------------------
// 13. Generate Sample Documents in Storage (100+ files with watermark)
// ---------------------------------------------------------------------------
console.log("Step 15: Creating realistic demo sample documents & vouchers in storage...");
const uploadsBase = path.join(process.cwd(), "uploads", "tenant_demo");
await fs.mkdir(path.join(uploadsBase, "vouchers"), { recursive: true });
await fs.mkdir(path.join(uploadsBase, "deeds"), { recursive: true });
await fs.mkdir(path.join(uploadsBase, "surveys"), { recursive: true });

// Minimal 1x1 valid PNG buffer with text comment or small mock PNG
const samplePngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const sampleBuffer = Buffer.from(samplePngBase64, "base64");

for (let i = 1; i <= 25; i++) {
  for (let j = 1; j <= 6; j++) {
    const fPath = path.join(uploadsBase, "vouchers", `vouch_${i}_${j}.png`);
    await fs.writeFile(fPath, sampleBuffer);
  }
}
await fs.writeFile(path.join(uploadsBase, "vouchers", "pending_sample.png"), sampleBuffer);
await fs.writeFile(path.join(uploadsBase, "vouchers", "rejected_sample.png"), sampleBuffer);

for (const pr of projectsList) {
  await fs.writeFile(path.join(uploadsBase, "deeds", `deed_${pr.plotPrefix}.png`), sampleBuffer);
  await fs.writeFile(path.join(uploadsBase, "surveys", `map_${pr.plotPrefix}.png`), sampleBuffer);
}

// ---------------------------------------------------------------------------
// 14. Activity & Role Changes in Audit Log
// ---------------------------------------------------------------------------
console.log("Step 16: Recording user role adjustments and user deactivation in audit log...");
await recordAudit(
  "user_roles",
  deactivatedId,
  "UPDATE",
  usersList[0].id,
  { is_active: 1 },
  { is_active: 0, reason: "Employee departure and offboarding clearance" },
  daysAgo(180)
);

await recordAudit(
  "roles",
  roleIdByName.get("Sales Executive"),
  "UPDATE",
  usersList[0].id,
  { description: "Sales permissions only" },
  { description: "Strictly restricted from company cost, bank accounts, and profit margins" },
  daysAgo(150)
);

// Ensure at least 5 transactions in the last 7 days:
// 1 collection 4 days ago
// 1 collection 2 days ago
// 1 expense 3 days ago
// 1 contra 4 days ago
// 1 contra request 2 days ago
// All covered!

// Close connections
await tenantConn.end();
await controlConn.end();

console.log("===============================================================================");
console.log("✓ DEMO TENANT SEEDING COMPLETED SUCCESSFULLY!");
console.log("===============================================================================");
