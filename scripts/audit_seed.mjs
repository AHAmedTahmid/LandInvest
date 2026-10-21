import { execSync } from "child_process";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const MYSQL = { host: "localhost", user: "root", password: "", port: 3306 };
const CONTROL = "control_plane";
const TENANTS = [
  { id: "aaaaaaaa-0000-0000-0000-0000000000a1", name: "Alpha Estates", db: "tenant_alpha", company: "Alpha Estates Ltd" },
  { id: "bbbbbbbb-0000-0000-0000-0000000000b2", name: "Beta Holdings", db: "tenant_beta", company: "Beta Holdings Ltd" },
];

// deterministic RNG
let _s = 42;
const rnd = () => { _s = (_s * 1103515245 + 12345) % 2147483648; return _s / 2147483648; };
const rand = (min, max) => Math.round((min + rnd() * (max - min)) * 100) / 100;
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

async function raw(sql, params = []) {
  const conn = await mysql.createConnection(MYSQL);
  const [res] = await conn.query(sql, params);
  await conn.end();
  return res;
}
async function exec(sql, params = []) {
  const conn = await mysql.createConnection(MYSQL);
  const [res] = await conn.query(sql, params);
  await conn.end();
  return res;
}

async function resetTenantDb(db) {
  const conn = await mysql.createConnection(MYSQL);
  await conn.query(`DROP DATABASE IF EXISTS \`${db}\``);
  await conn.query(`CREATE DATABASE \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
  execSync(`npx prisma db push --schema=prisma/tenant/schema.prisma --skip-generate --accept-data-loss`, {
    stdio: "ignore", env: { ...process.env, DATABASE_URL_TENANT: `mysql://root:@localhost:3306/${db}` },
  });
}

async function resetControl() {
  const conn = await mysql.createConnection(MYSQL);
  await conn.query(`DROP DATABASE IF EXISTS \`${CONTROL}\``);
  await conn.query(`CREATE DATABASE \`${CONTROL}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
  execSync(`npx prisma db push --schema=prisma/control/schema.prisma --skip-generate --accept-data-loss`, {
    stdio: "ignore", env: { ...process.env, DATABASE_URL_CONTROL: `mysql://root:@localhost:3306/${CONTROL}` },
  });
}

const CATS = [
  ["Registration", "project"], ["Mutation", "project"], ["Bayna", "project"],
  ["Development", "project"], ["Survey", "project"], ["Utility", "project"],
  ["Labour", "project"], ["Misc", "project"],
];
const EXP_CATS = ["Registration", "Mutation", "Development", "Survey", "Utility", "Labour", "Misc"];

async function seedTenant(tenant) {
  const db = tenant.db;
  const conn = await mysql.createConnection({ ...MYSQL, database: db });

  // default categories
  await conn.query(`CREATE TABLE IF NOT EXISTS default_categories (id CHAR(36) PRIMARY KEY, name VARCHAR(100) NOT NULL, kind VARCHAR(20) NOT NULL, UNIQUE KEY uq_cat_name (name))`);
  for (const [name, kind] of CATS) await conn.query("INSERT IGNORE INTO default_categories (id,name,kind) VALUES (?,?,?)", [randomUUID(), name, kind]);

  // ---- partners ----
  const partners = [];
  const partnerDefs = [
    ["Rahim Uddin", "01711000001", 500000],
    ["Karim Ahmed", "01711000002", 300000],
    ["Fatima Begum", "01711000003", 200000],
    ["Jamal Hossain", "01711000004", 150000],
  ];
  for (const [name, phone, opening] of partnerDefs) {
    const id = randomUUID();
    await conn.query(
      "INSERT INTO partners (id, global_user_id, name, phone, nid_number, opening_balance, created_at) VALUES (?,?,?,?,?,?,NOW())",
      [id, null, name, phone, `NID-${phone.slice(-8)}`, opening]
    );
    partners.push({ id, name, opening });
  }

  // ---- bank accounts ----
  const banks = [];
  for (const [name, acc] of [["BRAC Bank", "110-220-330"], ["City Bank", "440-550-660"]]) {
    const id = randomUUID();
    await conn.query("INSERT INTO bank_accounts (id, bank_name, account_number, branch_name, current_balance, is_active) VALUES (?,?,?,?,0,1)", [id, name, acc, "Dhanmondi"]);
    banks.push({ id, name, acc });
  }

  // ---- projects ----
  const projects = [];
  const projectDefs = [
    ["Green Valley", "Savar", "JL-101", "Dag 1-50", "Khatian 100-150", 1000, 8000000, 500000, 200000, 100000],
    ["River View", "Keraniganj", "JL-202", "Dag 51-120", "Khatian 200-260", 1500, 12000000, 800000, 300000, 150000],
    ["Lake Garden", "Narayanganj", "JL-303", "Dag 121-200", "Khatian 300-380", 1200, 9500000, 600000, 250000, 120000],
  ];
  for (const [name, mouza, jl, dag, khatian, area, purchase, bayna, reg, mut] of projectDefs) {
    const id = randomUUID();
    await conn.query(
      "INSERT INTO land_projects (id, project_name, mouza, jl_number, dag_numbers, khatian_numbers, total_area_shotok, purchase_price, bayna_amount, registration_cost, mutation_tax_cost, status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NOW())",
      [id, name, mouza, jl, dag, khatian, area, purchase, bayna, reg, mut, "UNDER_BAYNA"]
    );
    projects.push({ id, name, area, purchase, bayna, reg, mut });
  }

  // ---- project partners (shares sum to 100%) ----
  const shareSets = [[50, 30, 20], [40, 35, 25], [60, 25, 15]];
  projects.forEach((proj, pi) => {
    const shares = shareSets[pi];
    const chosen = partners.slice(0, shares.length);
    chosen.forEach((p, i) => {
      const ppId = randomUUID();
      conn.query("INSERT INTO project_partners (id, project_id, partner_id, share_percentage) VALUES (?,?,?,?)", [ppId, proj.id, p.id, shares[i]]);
    });
  });

  // ---- plots ----
  const plots = [];
  for (const proj of projects) {
    const count = 12;
    for (let i = 1; i <= count; i++) {
      const id = randomUUID();
      const size = rand(3, 10);
      const asking = Math.round(size * rand(8000, 15000));
      await conn.query("INSERT INTO project_plots (id, project_id, plot_number, plot_size_shotok, asking_price, status) VALUES (?,?,?,?,?,?)", [id, proj.id, `${proj.name.slice(0,2)}-${String(i).padStart(3,"0")}`, size, asking, "AVAILABLE"]);
      plots.push({ id, projectId: proj.id, size, asking });
    }
  }

  // ---- treasury ledger + partner transactions ----
  const ledger = [];
  const addLedger = async (accountType, bankId, flow, amount, purpose, refType, refId, date, by) => {
    const id = randomUUID();
    await conn.query(
      "INSERT INTO treasury_ledger (id, txn_date, account_type, bank_account_id, flow_type, amount, purpose, reference_type, reference_id, created_by, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [id, date, accountType, bankId, flow, amount, purpose, refType, refId, by, date]
    );
    ledger.push({ accountType, bankId, flow, amount, id });
    return id;
  };
  const addPartnerTxn = async (partnerId, txnType, amount, date, refId, notes) => {
    await conn.query(
      "INSERT INTO partner_transactions (id, partner_id, txn_type, amount, txn_date, reference_id, notes, created_at) VALUES (?,?,?,?,?,?,?,?)",
      [randomUUID(), partnerId, txnType, amount, date, refId ?? null, notes ?? null, date]
    );
  };

  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 86400000);
  const dates = [];
  for (let i = 0; i < 120; i++) dates.push(daysAgo(i));

  // partner capital deposits (increase capital)
  for (const p of partners) {
    const n = 2 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const amt = rand(20000, 150000);
      const date = dates[Math.floor(rnd() * 90)];
      const channel = rnd() < 0.6 ? "CASH" : "BANK";
      const bankId = channel === "BANK" ? banks[Math.floor(rnd() * banks.length)].id : null;
      const lid = await addLedger(channel, bankId, "IN", amt, "Partner capital deposit", "PARTNER_DEPOSIT", null, date, "owner");
      await addPartnerTxn(p.id, "DEPOSIT", amt, date, lid, "Capital deposit");
    }
    // a withdrawal for some
    if (rnd() < 0.5) {
      const amt = rand(10000, 50000);
      const date = dates[Math.floor(rnd() * 40)];
      await addPartnerTxn(p.id, "WITHDRAWAL", amt, date, null, "Capital withdrawal");
    }
  }

  // contra transfers (equal in/out)
  for (let i = 0; i < 6; i++) {
    const amt = rand(50000, 300000);
    const date = dates[Math.floor(rnd() * 60)];
    const bank = banks[Math.floor(rnd() * banks.length)];
    await addLedger("CASH", null, "OUT", amt, "Contra transfer", "CONTRA", null, date, "owner");
    await addLedger("BANK", bank.id, "IN", amt, "Contra transfer", "CONTRA", null, date, "owner");
  }

  // ---- expenses (50) ----
  let approvedCash = 0, approvedBank = 0, approvedPartner = 0;
  const expenses = [];
  for (let i = 0; i < 50; i++) {
    const proj = pick(projects);
    const cat = pick(EXP_CATS);
    const amt = rand(5000, 200000);
    const channel = pick(["CASH", "BANK", "PAID_BY_PARTNER"]);
    const status = pick(["APPROVED", "APPROVED", "APPROVED", "PENDING", "REJECTED"]);
    const date = dates[Math.floor(rnd() * 100)];
    const id = randomUUID();
    const bankId = channel === "BANK" ? banks[Math.floor(rnd() * banks.length)].id : null;
    const paidBy = channel === "PAID_BY_PARTNER" ? partners[Math.floor(rnd() * partners.length)].id : null;
    await conn.query(
      "INSERT INTO project_expenses (id, project_id, expense_category, amount, expense_date, description, payment_channel, bank_account_id, paid_by_partner_id, status, approved_by, created_by, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [id, proj.id, cat, amt, date, `${cat} expense #${i + 1}`, channel, bankId, paidBy, status, status === "APPROVED" ? "owner" : null, "owner", date]
    );
    expenses.push({ id, proj: proj.id, cat, amt, channel, status, date });
    if (status === "APPROVED") {
      if (channel === "CASH") { approvedCash += amt; await addLedger("CASH", null, "OUT", amt, cat, "EXPENSE", id, date, "owner"); }
      else if (channel === "BANK") { approvedBank += amt; await addLedger("BANK", bankId, "OUT", amt, cat, "EXPENSE", id, date, "owner"); }
      else if (channel === "PAID_BY_PARTNER") { approvedPartner += amt; await addPartnerTxn(paidBy, "DIRECT_EXPENSE", amt, date, id, cat); }
    }
  }

  // ---- sales (30) with installments + payments ----
  const sales = [];
  for (let i = 0; i < 30; i++) {
    const proj = pick(projects);
    const plot = plots.find((p) => p.projectId === proj.id && true) ?? null;
    const total = rand(1000000, 16000000);
    const date = dates[Math.floor(rnd() * 110)];
    const id = randomUUID();
    const advance = rnd() < 0.4 ? Math.round(total * 0.1) : 0;
    const buyer = `Buyer ${String(i + 1).padStart(2, "0")}`;
    await conn.query(
      "INSERT INTO land_sales (id, project_id, plot_id, buyer_name, buyer_phone, buyer_nid, sale_date, total_agreed_price, advance_booking_amount, current_due_amount, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [id, proj.id, plot ? plot.id : null, buyer, `01722${String(100000 + i).slice(0, 6)}`, `NID-B${i}`, date, total, advance, total - advance, advance > 0 ? "PARTIAL" : "BOOKED"]
    );
    if (plot) await conn.query("UPDATE project_plots SET status='BOOKED' WHERE id=?", [plot.id]);
    // installments
    const instCount = 4;
    for (let k = 0; k < instCount; k++) {
      const dueDate = new Date(date.getTime() + (k + 1) * 30 * 86400000);
      const dueAmt = Math.round((total - advance) / instCount);
      await conn.query("INSERT INTO installment_schedule (id, sale_id, due_date, due_amount, status) VALUES (?,?,?,?,?)", [randomUUID(), id, dueDate, dueAmt, dueDate < now ? "OVERDUE" : "UPCOMING"]);
    }
    // payments (advance + some installments)
    let paid = advance;
    if (advance > 0) {
      const ch = rnd() < 0.5 ? "CASH" : "BANK";
      const bankId = ch === "BANK" ? banks[Math.floor(rnd() * banks.length)].id : null;
      await addLedger(ch, bankId, "IN", advance, `Advance ${buyer}`, "SALE_PAYMENT", id, date, "owner");
      await conn.query("INSERT INTO customer_payments (id, sale_id, payment_date, amount_paid, payment_method, bank_account_id, receiptNo, remarks) VALUES (?,?,?,?,?,?,?,?)", [randomUUID(), id, date, advance, ch, bankId, `R-${i}-0`, "Advance"]);
    }
    const extraPays = Math.floor(rnd() * 3);
    for (let k = 0; k < extraPays; k++) {
      const amt = rand(20000, 200000);
      paid += amt;
      const ch = rnd() < 0.5 ? "CASH" : "BANK";
      const bankId = ch === "BANK" ? banks[Math.floor(rnd() * banks.length)].id : null;
      const payDate = new Date(date.getTime() + (k + 1) * 20 * 86400000);
      await addLedger(ch, bankId, "IN", amt, `Installment ${buyer}`, "SALE_PAYMENT", id, payDate, "owner");
      await conn.query("INSERT INTO customer_payments (id, sale_id, payment_date, amount_paid, payment_method, bank_account_id, receiptNo, remarks) VALUES (?,?,?,?,?,?,?,?)", [randomUUID(), id, payDate, amt, ch, bankId, `R-${i}-${k + 1}`, "Installment"]);
    }
    if (paid >= total) {
      await conn.query("UPDATE land_sales SET status='PAID_IN_FULL', current_due_amount=0 WHERE id=?", [id]);
      if (plot) await conn.query("UPDATE project_plots SET status='SOLD' WHERE id=?", [plot.id]);
    } else if (paid > 0) {
      await conn.query("UPDATE land_sales SET status='PARTIAL', current_due_amount=? WHERE id=?", [total - paid, id]);
    }
    sales.push({ id, total, paid });
  }

  // ---- profit distribution for profitable projects ----
  for (const proj of projects) {
    const projSales = sales.filter((s) => true); // all
    // compute net profit for this project from sales of this project
    const [projSaleRows] = await conn.query("SELECT id, total_agreed_price FROM land_sales WHERE project_id=?", [proj.id]);
    const [payRows] = await conn.query("SELECT sale_id, amount_paid FROM customer_payments");
    const cost = proj.purchase + proj.reg + proj.mut + expenses.filter((e) => e.proj === proj.id && e.status === "APPROVED").reduce((s, e) => s + e.amt, 0);
    let revenue = 0;
    for (const s of projSaleRows) revenue += payRows.filter((p) => p.sale_id === s.id).reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const net = revenue - cost;
    if (net > 0) {
      const [pps] = await conn.query("SELECT partner_id, share_percentage FROM project_partners WHERE project_id=?", [proj.id]);
      const distId = randomUUID();
      // round each payout; give the leftover paisa to the last partner so payouts sum exactly to net
      let allocated = 0;
      const raw = pps.map((pp) => ({ partnerId: pp.partner_id, share: Number(pp.share_percentage), payout: Math.round(net * Number(pp.share_percentage) * 100) / 10000 }));
      const sumRaw = raw.reduce((s, r) => s + r.payout, 0);
      const leftover = Math.round((net - sumRaw) * 100) / 100;
      raw[raw.length - 1].payout = Math.round((raw[raw.length - 1].payout + leftover) * 100) / 100;
      for (const r of raw) {
        await conn.query(
          "INSERT INTO profit_distributions (id, project_id, distribution_date, realization_basis, total_project_net_profit, partner_id, partner_share_percent, payout_amount) VALUES (?,?,?,?,?,?,?,?)",
          [randomUUID(), proj.id, now, "CASH_BASIS", net, r.partnerId, r.share, r.payout]
        );
        await addPartnerTxn(r.partnerId, "PROFIT_CREDIT", r.payout, now, distId, `Profit ${proj.name}`);
      }
    }
  }

  // ---- set bank account balances = sum of ledger per account ----
  for (const bank of banks) {
    const [rows] = await conn.query("SELECT flow_type, amount FROM treasury_ledger WHERE account_type='BANK' AND bank_account_id=?", [bank.id]);
    let bal = 0;
    for (const r of rows) bal += r.flow_type === "IN" ? Number(r.amount) : -Number(r.amount);
    await conn.query("UPDATE bank_accounts SET current_balance=? WHERE id=?", [bal, bank.id]);
  }

  // ---- audit log for the writes ----
  for (const e of expenses) {
    await conn.query("INSERT INTO audit_log (id, table_name, record_id, action, changed_by, old_values, new_values, created_at) VALUES (?,?,?,?,?,?,?,?)", [randomUUID(), "project_expenses", e.id, "CREATE", "owner", null, JSON.stringify({ category: e.cat, amount: e.amt, status: e.status }), e.date]);
  }

  await conn.end();
  return { partners: partners.length, projects: projects.length, expenses: expenses.length, sales: sales.length, ledger: ledger.length };
}

// ---------- control plane ----------
async function seedControl() {
  await resetControl();
  await resetTenantDb(TENANTS[0].db);
  await resetTenantDb(TENANTS[1].db);

  const conn = await mysql.createConnection({ ...MYSQL, database: CONTROL });
  const hash = await bcrypt.hash("123456", 10);

  // plans
  await conn.query("INSERT INTO plans (id, name, price_monthly, price_yearly, max_users, max_projects, features) VALUES (?,?,?,?,?,?,?)", ["00000000-0000-0000-0000-000000000001", "Basic", 1000, 10000, 5, 10, JSON.stringify({ plots: true })]);
  await conn.query("INSERT INTO plans (id, name, price_monthly, price_yearly, max_users, max_projects, features) VALUES (?,?,?,?,?,?,?)", ["00000000-0000-0000-0000-000000000002", "Pro", 2500, 25000, 15, 50, JSON.stringify({ plots: true, reports: true })]);

  for (const t of TENANTS) {
    await conn.query("INSERT INTO tenants (id, company_name, db_host, db_name, db_user, db_password_encrypted, status, created_at) VALUES (?,?,?,?,?,?,?,NOW())", [t.id, t.company, "localhost", t.db, "root", "enc_stub", "active"]);
    await conn.query("INSERT INTO subscriptions (id, tenant_id, plan_id, billing_cycle, status, current_period_start, current_period_end) VALUES (?,?,?,?,?,?,?)", [randomUUID(), t.id, "00000000-0000-0000-0000-000000000002", "monthly", "active", new Date(), new Date(Date.now() + 30 * 86400000)]);
  }

  // users
  const users = [
    // tenant A
    ["owner@alpha.com", "Alpha Owner", TENANTS[0].id, true, "Owner"],
    ["admin@alpha.com", "Alpha Admin", TENANTS[0].id, false, "Managing Partner"],
    ["auditor@alpha.com", "Alpha Auditor", TENANTS[0].id, false, "Auditor"],
    ["field@alpha.com", "Alpha Field", TENANTS[0].id, false, "Field Officer"],
    ["sales@alpha.com", "Alpha Sales", TENANTS[0].id, false, "Sales Agent"],
    // tenant B
    ["owner@beta.com", "Beta Owner", TENANTS[1].id, true, "Owner"],
    ["admin@beta.com", "Beta Admin", TENANTS[1].id, false, "Managing Partner"],
  ];
  for (const [email, name, tid, isOwner, role] of users) {
    await conn.query("INSERT INTO global_users (id, tenant_id, full_name, email, password_hash, is_owner, is_active, must_change_password, created_at) VALUES (?,?,?,?,?,?,?,?,NOW())", [randomUUID(), tid, name, email, hash, isOwner ? 1 : 0, 1, 0]);
  }
  await conn.end();
}

console.log("Resetting databases...");
await seedControl();
console.log("Control seeded. Seeding tenants...");
for (const t of TENANTS) {
  const r = await seedTenant(t);
  console.log(`${t.name}:`, JSON.stringify(r));
}

// assign default roles + custom roles per tenant
const { PrismaClient: ControlClient } = await import("../src/generated/control/index.js");
const cPrisma = new ControlClient({ datasources: { db: { url: `mysql://root:@localhost:3306/${CONTROL}` } } });
const { PrismaClient: TenantClient } = await import("../src/generated/tenant/index.js");
const { seedDefaultRoles } = await import("../src/lib/seedRoles.js");

const CUSTOM_ROLES = [
  { name: "Auditor", keys: ["audit.view", "reports.view", "reports.audit.view", "reports.export", "reports.financial.view", "reports.projects.view", "reports.sales.view", "reports.partners.view"] },
  { name: "Field Officer", keys: ["dashboard.view", "projects.view", "expenses.view", "expenses.create", "reports.view", "reports.projects.view"] },
  { name: "Sales Agent", keys: ["dashboard.view", "sales.view", "sales.create", "sales.collect", "receipts.print", "reports.view", "reports.sales.view"] },
];

for (const t of TENANTS) {
  const tPrisma = new TenantClient({ datasources: { db: { url: `mysql://root:@localhost:3306/${t.db}` } } });
  const owner = await cPrisma.globalUser.findFirst({ where: { tenantId: t.id, isOwner: true } });
  await seedDefaultRoles(tPrisma, owner?.id ?? null);
  // custom roles
  const roleIds = {};
  for (const cr of CUSTOM_ROLES) {
    const id = randomUUID();
    await tPrisma.role.create({ data: { id, name: cr.name, description: `Custom role: ${cr.name}`, isSystem: false, createdBy: owner?.id ?? null } });
    for (const k of cr.keys) await tPrisma.rolePermission.create({ data: { roleId: id, permissionKey: k } });
    roleIds[cr.name] = id;
  }
  // assign users
  const defRole = async (n) => (await tPrisma.role.findUnique({ where: { name: n } }))?.id;
  const allUsers = await cPrisma.globalUser.findMany({ where: { tenantId: t.id } });
  const roleByEmail = {
    [owner?.email ?? ""]: "Owner",
    ...(t.id === TENANTS[0].id
      ? { "admin@alpha.com": "Managing Partner", "auditor@alpha.com": "Auditor", "field@alpha.com": "Field Officer", "sales@alpha.com": "Sales Agent" }
      : { "admin@beta.com": "Managing Partner" }),
  };
  for (const u of allUsers) {
    const roleName = roleByEmail[u.email];
    const roleId = roleName === "Owner" ? await defRole("Owner") : roleName ? (await tPrisma.role.findUnique({ where: { name: roleName } }))?.id : null;
    if (roleId) await tPrisma.userRole.upsert({ where: { userId: u.id }, update: { roleId }, create: { userId: u.id, roleId, assignedBy: owner?.id ?? u.id } });
  }
  await tPrisma.$disconnect();
}
await cPrisma.$disconnect();
console.log("\nAudit seed complete.");
console.log("Tenant A (Alpha): owner@alpha.com / admin@alpha.com / auditor@alpha.com / field@alpha.com / sales@alpha.com â€” password 123456");
console.log("Tenant B (Beta): owner@beta.com / admin@beta.com â€” password 123456");
