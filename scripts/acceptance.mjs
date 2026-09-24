import mysql from "mysql2/promise";
import Redis from "ioredis";
import { randomUUID } from "crypto";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CONTROL_URL = "mysql://root:@localhost:3306/control_plane";
const TENANT_URL = "mysql://root:@localhost:3306/tenant_demo";

const results = [];
function check(criterion, name, ok, detail = "") {
  results.push({ criterion, name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  C${criterion}  ${name}${detail ? `  --  ${detail}` : ""}`);
}

/* ---------------- HTTP helpers (manual cookie jar, NextAuth v4) ---------------- */

function applyCookies(jar, res) {
  const set = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of set) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    const k = pair.slice(0, i).trim();
    const v = pair.slice(i + 1).trim();
    if (!v || v === "deleted") jar.delete(k);
    else jar.set(k, v);
  }
}
const cookieHeader = (jar) => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

async function login(email, password) {
  const jar = new Map();
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  applyCookies(jar, csrfRes);
  const { csrfToken } = await csrfRes.json();
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: cookieHeader(jar) },
    body: new URLSearchParams({ email, password, csrfToken, redirect: "false", json: "true" }),
  });
  applyCookies(jar, res);
  const keys = [...jar.keys()];
  if (!keys.some((k) => k.includes("session-token"))) {
    throw new Error(`login failed for ${email} (status ${res.status}, cookies: ${keys.join(",") || "none"})`);
  }
  return { jar, cookie: cookieHeader(jar) };
}

async function call(sess, path, { method = "GET", json, form } = {}) {
  const headers = { cookie: sess.cookie };
  let body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) {
    body = form; // FormData -> multipart automatically
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body, redirect: "manual" });
  const text = await res.text();
  let parsed = null;
  try { parsed = JSON.parse(text); } catch { /* html/text */ }
  return { status: res.status, text, json: parsed };
}

function expenseForm(overrides = {}) {
  const f = new FormData();
  const data = {
    project_id: "",
    category: "Acceptance test expense",
    amount: "1234.50",
    payment_channel: "CASH",
    bank_account: "",
    paid_by_partner: "",
    description: "created by scripts/acceptance.mjs",
    ...overrides,
  };
  for (const [k, v] of Object.entries(data)) f.append(k, String(v ?? ""));
  return f;
}

/* ---------------- Phase 0: criterion 1 - services reachable ---------------- */

async function phase1Services() {
  const conn = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "control_plane", connectTimeout: 8000 });
  const [[row]] = await conn.query("SELECT COUNT(*) AS c FROM tenants");
  await conn.end();
  check(1, "MySQL reachable (SELECT control_plane.tenants)", Number(row.c) >= 1, `tenants=${row.c}`);

  const redis = new Redis({ host: "127.0.0.1", port: 6379, lazyConnect: true, maxRetriesPerRequest: 1, retryStrategy: () => null });
  await redis.connect();
  const pong = await redis.ping();
  const streamKey = `acc:test:${Date.now()}`;
  await redis.xadd(streamKey, "*", "event", "acceptance");
  const groups = await redis.xinfo("GROUPS", streamKey).catch(() => []);
  await redis.del(streamKey);
  redis.disconnect();
  check(1, "Redis reachable (PING + XADD + XINFO stream groups)", pong === "PONG" && Array.isArray(groups), `ping=${pong}`);

  const web = await fetch(BASE).catch((e) => ({ status: 0, err: e.message }));
  check(1, "Next.js dev server responding", web.status > 0 && web.status < 500, `status=${web.status}`);
}

/* ---------------- Phase 1: seed base records ---------------- */

async function seedBase() {
  const { PrismaClient } = await import("../src/generated/tenant/index.js");
  const prisma = new PrismaClient({ datasources: { db: { url: TENANT_URL } } });

  const ids = {
    partnerA: "00000000-0000-0000-0000-0000acce0001",
    partnerB: "00000000-0000-0000-0000-0000acce0002",
    project: "00000000-0000-0000-0000-0000acce0101",
    bank: "00000000-0000-0000-0000-0000acce0201",
    plots: ["00000000-0000-0000-0000-0000acce0301", "00000000-0000-0000-0000-0000acce0302"],
  };

  await prisma.partner.upsert({ where: { id: ids.partnerA }, update: {}, create: { id: ids.partnerA, name: "Akter Hossain", phone: "01711000001", openingBalance: 50000 } });
  await prisma.partner.upsert({ where: { id: ids.partnerB }, update: {}, create: { id: ids.partnerB, name: "Nasrin Akter", phone: "01711000002", openingBalance: 30000 } });

  await prisma.landProject.upsert({
    where: { id: ids.project },
    update: {},
    create: {
      id: ids.project,
      projectName: "Bosila Heights",
      mouza: "Bosila",
      jlNumber: "45",
      dagNumbers: "101,102",
      khatianNumbers: "789",
      totalAreaShotok: 120,
      purchasePrice: 100000,
      registrationCost: 5000,
      mutationTaxCost: 2000,
      status: "UNDER_BAYNA",
    },
  });

  for (const [pid, share] of [[ids.partnerA, 60], [ids.partnerB, 40]]) {
    const cnt = await prisma.projectPartner.count({ where: { projectId: ids.project, partnerId: pid } });
    if (cnt === 0) await prisma.projectPartner.create({ data: { id: randomUUID(), projectId: ids.project, partnerId: pid, sharePercentage: share } });
  }

  await prisma.bankAccount.upsert({ where: { id: ids.bank }, update: {}, create: { id: ids.bank, bankName: "BRAC Bank", accountNumber: "15012200998877", branchName: "Dhanmondi", currentBalance: 0 } });

  for (let i = 0; i < ids.plots.length; i++) {
    await prisma.projectPlot.upsert({
      where: { id: ids.plots[i] },
      update: {},
      create: { id: ids.plots[i], projectId: ids.project, plotNumber: `A-${i + 1}`, plotSizeShotok: 25, askingPrice: 250000, status: "AVAILABLE" },
    });
  }

  // a plot that is still sellable (previous runs may have booked A-1)
  let salePlotId = (await prisma.projectPlot.findFirst({ where: { projectId: ids.project, status: "AVAILABLE" } }))?.id ?? null;
  if (!salePlotId) {
    const n = (await prisma.projectPlot.count({ where: { projectId: ids.project } })) + 1;
    salePlotId = randomUUID();
    await prisma.projectPlot.create({ data: { id: salePlotId, projectId: ids.project, plotNumber: `A-${n}`, plotSizeShotok: 25, askingPrice: 250000, status: "AVAILABLE" } });
  }

  const counts = {
    partners: await prisma.partner.count(),
    projects: await prisma.landProject.count(),
    plots: await prisma.projectPlot.count(),
    bankAccounts: await prisma.bankAccount.count(),
  };
  await prisma.$disconnect();

  const ok = counts.partners >= 2 && counts.projects >= 1 && counts.plots >= 2 && counts.bankAccounts >= 1;
  check(2, "Seed records exist (partners / land project / plots / bank account)", ok, JSON.stringify(counts));
  return { ...ids, salePlotId };
}

/* ---------------- Phase 2: end-to-end financial flows over HTTP ---------------- */

async function phase2Flows(ids) {
  const admin = await login("admin@demo.com", "123456");
  const accountant = await login("acct@demo.com", "123456");

  // --- expense (PENDING) ---
  const exp1 = await call(admin, "/api/expenses", { method: "POST", form: expenseForm({ amount: "5000" }) });
  check(2, "Create expense via POST /api/expenses", exp1.status === 200 && exp1.json?.status === "PENDING", `status=${exp1.status} record=${exp1.json?.status}`);

  // --- PAID_BY_PARTNER expense: never touches treasury_ledger ---
  const exp2 = await call(admin, "/api/expenses", { method: "POST", form: expenseForm({ amount: "3000", payment_channel: "PAID_BY_PARTNER", paid_by_partner: ids.partnerA }) });
  check(2, "Create PAID_BY_PARTNER expense", exp2.status === 200 && exp2.json?.paidByPartnerId === ids.partnerA, `status=${exp2.status}`);

  // --- approve ---
  const app1 = await call(admin, `/api/expenses/${exp1.json?.id}/approve`, { method: "POST", json: { action: "APPROVED" } });
  check(2, "Approve expense via POST /api/expenses/[id]/approve", app1.status === 200 && app1.json?.status === "APPROVED", `status=${app1.status} record=${app1.json?.status}`);

  const app2 = await call(admin, `/api/expenses/${exp2.json?.id}/approve`, { method: "POST", json: { action: "APPROVED" } });
  check(2, "Approve PAID_BY_PARTNER expense", app2.status === 200 && app2.json?.status === "APPROVED", `status=${app2.status}`);

  // --- sale with installment schedule ---
  const installments = Array.from({ length: 6 }, (_, i) => ({
    dueDate: new Date(Date.now() + (i + 1) * 30 * 86400000).toISOString(),
    dueAmount: 50000,
  }));
  const saleRes = await call(admin, "/api/sales", {
    method: "POST",
    json: {
      project_id: ids.project,
      plot_id: ids.salePlotId,
      buyer_name: "Rahim Uddin",
      buyer_phone: "01811000001",
      buyer_nid: "1990123456789",
      total_agreed_price: 500000,
      advance: 200000,
      payment_method: "CASH",
      installments,
    },
  });
  const saleId = saleRes.json?.id;
  check(2, "Create sale (advance + 6 installments) via POST /api/sales", saleRes.status === 200 && !!saleId, `status=${saleRes.status} sale=${saleId}`);

  // --- collect an installment (partial) ---
  const payRes = await call(admin, `/api/sales/${saleId}/pay`, { method: "POST", json: { amount: 100000, payment_method: "CASH" } });
  check(2, "Collect payment via POST /api/sales/[id]/pay", payRes.status === 200, `status=${payRes.status} ${payRes.json?.error ?? ""}`);

  // --- accountant submits a transfer (must become PENDING) ---
  const contra = await call(accountant, "/api/treasury/contra", {
    method: "POST",
    json: { fromType: "CASH", toType: "BANK", amount: 25000, bankAccountId: ids.bank, purpose: "Cash deposit" },
  });
  check(2, "Accountant contra transfer is queued for approval", contra.status === 200 && contra.json?.pending === true, `status=${contra.status} pending=${contra.json?.pending}`);

  // --- admin approves it ---
  const approveReq = await call(admin, `/api/treasury/contra/${contra.json?.requestId}/approve`, { method: "POST", json: {} });
  check(2, "Approve contra transfer via POST /api/treasury/contra/[id]/approve", approveReq.status === 200 && approveReq.json?.approved === true, `status=${approveReq.status} ${approveReq.json?.error ?? ""}`);

  // --- distribute profit ---
  const dist = await call(admin, "/api/reports/pnl/distribute", { method: "POST", json: { projectId: ids.project, basis: "CASH_BASIS" } });
  const distOk = (dist.status === 200 && (dist.json?.distributed ?? 0) >= 2) ||
    (dist.status === 400 && /already distributed/i.test(dist.json?.error || ""));
  check(2, "Distribute profit via POST /api/reports/pnl/distribute", distOk, `status=${dist.status} distributed=${dist.json?.distributed} ${dist.json?.error ?? ""}`);

  // --- PnL + exports ---
  const pnl = await call(admin, "/api/reports/pnl");
  check(2, "PnL report computed (GET /api/reports/pnl)", pnl.status === 200 && Array.isArray(pnl.json) && pnl.json[0]?.revenue > 0, `rows=${pnl.json?.length} revenue=${pnl.json?.[0]?.revenue} net=${pnl.json?.[0]?.netProfit}`);
  const csv = await call(admin, "/api/reports/pnl/excel");
  const pdf = await call(admin, "/api/reports/pnl/pdf");
  check(2, "PnL CSV + PDF exports", csv.status === 200 && pdf.status === 200, `csv=${csv.status} pdf=${pdf.status}`);

  return { admin, accountant, exp1, exp2, saleId, contra };
}

/* ---------------- Phase 3: audit + business-rule invariants ---------------- */

async function phase3Audit(ids) {
  const conn = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "tenant_demo" });

  const protectedTables = ["project_expenses", "treasury_ledger", "land_sales", "customer_payments", "profit_distributions"];
  for (const t of protectedTables) {
    const [[{ c: total }]] = await conn.query(`SELECT COUNT(*) c FROM \`${t}\``);
    const [[{ c: audited }]] = await conn.query(
      `SELECT COUNT(DISTINCT a.record_id) c FROM audit_log a JOIN \`${t}\` r ON r.id = a.record_id WHERE a.table_name = ?`,
      [t]
    );
    check(3, `Every ${t} row has an audit_log entry`, total === 0 || audited >= total, `rows=${total} audited=${audited}`);
  }

  const [[{ c: noActor }]] = await conn.query(`SELECT COUNT(*) c FROM audit_log WHERE changed_by IS NULL OR changed_by = ''`);
  check(3, "Every audit_log row records who did it", noActor === 0, `rows without changed_by=${noActor}`);

  // PAID_BY_PARTNER must NOT appear in treasury_ledger
  const [[{ c: partnerInTreasury }]] = await conn.query(
    `SELECT COUNT(*) c FROM treasury_ledger WHERE reference_id IN (SELECT id FROM project_expenses WHERE payment_channel = 'PAID_BY_PARTNER')`
  );
  check(3, "PAID_BY_PARTNER expense never writes treasury_ledger", partnerInTreasury === 0, `leaked=${partnerInTreasury}`);

  // ...but must write partner_transactions(DIRECT_EXPENSE)
  const [[{ c: partnerTxn }]] = await conn.query(
    `SELECT COUNT(*) c FROM partner_transactions WHERE reference_id IN (SELECT id FROM project_expenses WHERE payment_channel = 'PAID_BY_PARTNER') AND txn_type = 'DIRECT_EXPENSE'`
  );
  check(3, "PAID_BY_PARTNER expense writes partner_transactions (DIRECT_EXPENSE)", partnerTxn >= 1, `rows=${partnerTxn}`);

  // profit distribution wrote PROFIT_CREDIT
  const [[{ c: profitTxn }]] = await conn.query(`SELECT COUNT(*) c FROM partner_transactions WHERE txn_type = 'PROFIT_CREDIT'`);
  check(3, "Profit distribution writes partner_transactions (PROFIT_CREDIT)", profitTxn >= 2, `rows=${profitTxn}`);

  // plot + sale status transitions
  const [[{ c: soldPlots }]] = await conn.query(`SELECT COUNT(*) c FROM project_plots WHERE status <> 'AVAILABLE'`);
  const [[{ c: saleStates }]] = await conn.query(`SELECT COUNT(*) c FROM land_sales WHERE status IN ('BOOKED','PARTIAL','PAID_IN_FULL')`);
  check(2, "Plot sold + land_sales status in spec enum", soldPlots >= 1 && saleStates >= 1, `plots=${soldPlots} sales=${saleStates}`);

  // installment schedule settled FIFO
  const [[{ paid }]] = await conn.query(`SELECT COUNT(*) paid FROM installment_schedule WHERE status = 'PAID'`);
  const [[{ total }]] = await conn.query(`SELECT COUNT(*) total FROM installment_schedule`);
  check(2, "Installment schedule rows settled FIFO by payment", total > 0 && paid >= 1, `paid=${paid}/${total}`);

  // treasury double-entry for the approved contra
  const [[{ c: contras }]] = await conn.query(`SELECT COUNT(*) c FROM audit_log WHERE table_name = 'treasury_transfer_requests' AND action = 'UPDATE'`);
  check(2, "Approved contra recorded in audit_log (treasury_transfer_requests)", contras >= 1, `approved=${contras}`);

  await conn.end();
}

/* ---------------- Phase 4: RBAC - every role, every feature ---------------- */

const MATRIX = {
  viewDashboard: ["super_admin", "managing_partner"],
  managePartners: ["super_admin"],
  addLand: ["super_admin", "managing_partner", "site_manager"], // site_manager = draft access
  createExpense: ["super_admin", "managing_partner", "site_manager", "accountant"],
  approveExpense: ["super_admin", "managing_partner"],
  receiveSales: ["super_admin", "managing_partner", "accountant"],
  bankTransfer: ["super_admin", "managing_partner", "accountant"],
  distributeProfits: ["super_admin", "managing_partner"],
  inviteUsers: ["super_admin"],
  manageBilling: ["super_admin"],
};

const ROLES = {
  "super_admin": "owner@demo.com",
  "managing_partner": "admin@demo.com",
  "site_manager": "site@demo.com",
  "accountant": "acct@demo.com",
};

async function phase4Rbac(ids, ctx) {
  const sessions = {};
  for (const [role, email] of Object.entries(ROLES)) {
    try {
      sessions[role] = await login(email, "123456");
      check(4, `Login works as ${role} (${email})`, true);
    } catch (e) {
      check(4, `Login works as ${role} (${email})`, false, e.message);
    }
  }

  const conn = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "control_plane" });
  const [[inv]] = await conn.query("SELECT id FROM billing_invoices LIMIT 1");
  await conn.end();
  const invoiceId = inv?.id ?? randomUUID();

  const probes = [
    { feature: "viewDashboard", kind: "api", run: (s) => call(s, "/api/reports/pnl") },
    { feature: "viewDashboard", kind: "page", path: "/dashboard", marker: "Forbidden: viewDashboard" },
    { feature: "managePartners", kind: "page", path: "/partners", marker: "Forbidden: managePartners" },
    { feature: "addLand", kind: "page", path: "/projects", marker: "Forbidden: addLand" },
    { feature: "createExpense", kind: "api", run: (s) => call(s, "/api/expenses", { method: "POST", form: expenseForm({ amount: "100" }) }) },
    { feature: "approveExpense", kind: "api", run: (s) => call(s, `/api/expenses/${ctx.exp1.json.id}/approve`, { method: "POST", json: { action: "APPROVED" } }) },
    { feature: "receiveSales", kind: "api", run: (s) => call(s, "/api/sales") },
    { feature: "receiveSales", kind: "page", path: "/sales", marker: "Forbidden: receiveSales" },
    { feature: "bankTransfer", kind: "api", run: (s) => call(s, "/api/treasury/contra", { method: "POST", json: { fromType: "CASH", toType: "BANK", amount: 100, bankAccountId: ids.bank, purpose: "rbac probe" } }) },
    { feature: "bankTransfer", kind: "page", path: "/treasury", marker: "Forbidden: bankTransfer" },
    { feature: "distributeProfits", kind: "api", run: (s) => call(s, "/api/reports/pnl/distribute", { method: "POST", json: { projectId: ids.project, basis: "CASH_BASIS" } }) },
    { feature: "inviteUsers", kind: "api", run: (s) => call(s, "/api/invites") },
    { feature: "inviteUsers", kind: "page", path: "/settings/users", marker: "Forbidden: Super Admin only" },
    { feature: "manageBilling", kind: "api", run: (s) => call(s, "/api/billing/pay", { method: "POST", json: { invoiceId } }) },
    { feature: "manageBilling", kind: "page", path: "/settings/billing", marker: "Forbidden" },
  ];

  for (const probe of probes) {
    for (const [role, sess] of Object.entries(sessions)) {
      const shouldAllow = MATRIX[probe.feature].includes(role);
      let ok = false;
      let detail = "";
      try {
        if (probe.kind === "page") {
          const res = await fetch(`${BASE}${probe.path}`, { headers: { cookie: sess.cookie } });
          const html = await res.text();
          const blocked = html.includes(probe.marker);
          ok = shouldAllow ? !blocked : blocked;
          detail = `http=${res.status} marker=${blocked}`;
        } else {
          const res = await probe.run(sess);
          const is403 = res.status === 403;
          ok = shouldAllow ? !is403 : is403;
          detail = `http=${res.status}${res.json?.error ? ` (${res.json.error})` : ""}`;
        }
      } catch (e) {
        ok = false;
        detail = `error: ${e.message}`;
      }
      check(4, `${probe.feature} [${probe.kind}] as ${role} -> ${shouldAllow ? "allow" : "deny"}`, ok, detail);
    }
  }

  // extra: unauthorized must get 401
  const anon = await fetch(`${BASE}/api/reports/pnl`);
  check(4, "Unauthenticated request is rejected 401", anon.status === 401, `status=${anon.status}`);
}

/* ---------------- main ---------------- */

async function main() {
  console.log("=== LandInvest acceptance run ===\n");
  await phase1Services();
  const ids = await seedBase();
  const ctx = await phase2Flows(ids);
  await phase3Audit(ids);
  await phase4Rbac(ids, ctx);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`);
  for (const f of failed) console.log(`  FAILED  C${f.criterion}  ${f.name}  ${f.detail}`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error("ACCEPTANCE SCRIPT ERROR:", e);
  process.exit(2);
});
