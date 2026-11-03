// LandInvest full-system audit suite. Run: npm run audit  (requires app on :3000 + audit seed)
import m from "mysql2/promise";
import { execFileSync } from "child_process";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CONTROL = "control_plane";
let pass = 0, fail = 0;
const results = [];
const section = (name) => { results.push({ name, start: pass + fail }); console.log(`\n\x1b[1m== ${name} ==\x1b[0m`); };
const check = (n, ok, d = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? "  --  " + d : ""}`); };

const db = (database) => m.createConnection({ host: "localhost", user: "root", password: "", database });
const q = async (conn, sql, p) => (await conn.query(sql, p))[0];
const cnt = async (conn, sql, p) => Number((await q(conn, sql, p))[0].c);

async function login(email, password) {
  const jar = new Map();
  const cr = await fetch(`${BASE}/api/auth/csrf`);
  for (const c of (cr.headers.getSetCookie?.() ?? [])) { const [k, v] = c.split(";")[0].split("="); if (v) jar.set(k.trim(), v.trim()); }
  const ck = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  const { csrfToken } = await cr.json();
  const lo = await fetch(`${BASE}/api/auth/callback/credentials`, { method: "POST", redirect: "manual", headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: ck }, body: new URLSearchParams({ email, password, csrfToken, redirect: "false", json: "true" }) });
  const setCookies = lo.headers.getSetCookie?.() ?? [];
  for (const c of setCookies) { const [k, v] = c.split(";")[0].split("="); if (v && v !== "deleted") jar.set(k.trim(), v.trim()); }
  const cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  const hasSession = setCookies.some((c) => c.startsWith("next-auth.session-token") && !c.includes("deleted"));
  return { cookie, hasSession, setCookies, jar };
}
async function api(cookie, path, { method = "GET", json, form } = {}) {
  const headers = { cookie };
  let body;
  if (json !== undefined) { headers["Content-Type"] = "application/json"; body = JSON.stringify(json); }
  else if (form !== undefined) body = form;
  const res = await fetch(`${BASE}${path}`, { method, headers, body, redirect: "manual" });
  const text = await res.text(); let j = null; try { j = JSON.parse(text); } catch {}
  return { status: res.status, json: j, text, headers: res.headers };
}

/* ---------- Section 1: environment ---------- */
section("1. Environment & setup");
{
  const ctrl = await db(CONTROL);
  const owner = await login("owner@alpha.com", "123456");
  check("app up + owner login works", owner.hasSession);
  const s = await fetch(`${BASE}/api/auth/session`, { headers: { cookie: owner.cookie } });
  check("/api/auth/session returns user", !!(await s.json())?.user);
  const [t] = await q(ctrl, "SELECT COUNT(*) c FROM tenants");
  check("control_plane has tenants", Number(t.c) >= 2, `tenants=${t.c}`);
  await ctrl.end();
}

/* ---------- Section 2: schema integrity ---------- */
section("2. Schema integrity");
{
  const a = await db("tenant_alpha");
  // money columns are DECIMAL
  const moneyBad = await q(a, `
    SELECT COUNT(*) c FROM information_schema.columns
    WHERE table_schema='tenant_alpha' AND data_type='float'`);
  check("no FLOAT money columns (all DECIMAL)", Number(moneyBad[0].c) === 0, `float_cols=${moneyBad[0].c}`);
  // date indexes present (added in this audit)
  const idx = await q(a, "SELECT COUNT(*) c FROM information_schema.statistics WHERE table_schema='tenant_alpha' AND index_name IN ('treasury_ledger_txn_date_idx','project_expenses_expense_date_idx','land_sales_sale_date_idx')");
  check("date indexes on report-filter columns exist", Number(idx[0].c) >= 3, `found=${idx[0].c}`);
  // orphan checks across protected FKs
  const orphans = await q(a, `
    SELECT
      (SELECT COUNT(*) FROM project_partners pp LEFT JOIN land_projects p ON p.id=pp.project_id WHERE p.id IS NULL) a,
      (SELECT COUNT(*) FROM customer_payments cp LEFT JOIN land_sales s ON s.id=cp.sale_id WHERE s.id IS NULL) b,
      (SELECT COUNT(*) FROM installment_schedule i LEFT JOIN land_sales s ON s.id=i.sale_id WHERE s.id IS NULL) c,
      (SELECT COUNT(*) FROM partner_transactions t LEFT JOIN partners p ON p.id=t.partner_id WHERE p.id IS NULL) d,
      (SELECT COUNT(*) FROM profit_distributions pd LEFT JOIN land_projects p ON p.id=pd.project_id WHERE p.id IS NULL) e`);
  const o = orphans[0];
  check("no orphan FK rows (partners/sales/installments/txns/profit)", Number(o.a) + Number(o.b) + Number(o.c) + Number(o.d) + Number(o.e) === 0, `orphans=${Number(o.a) + Number(o.b) + Number(o.c) + Number(o.d) + Number(o.e)}`);
  // bank balance = ledger sum
  const bank = await q(a, `
    SELECT SUM(ABS(delta)) bad FROM (
      SELECT ba.id, ba.current_balance - COALESCE((SELECT SUM(CASE WHEN tl.flow_type='IN' THEN tl.amount ELSE -tl.amount END) FROM treasury_ledger tl WHERE tl.bank_account_id=ba.id),0) delta
      FROM bank_accounts ba) x WHERE ABS(delta) > 0.01`);
  check("bank_accounts.current_balance == treasury_ledger sum", Number(bank[0].bad ?? 0) === 0, `mismatched=${Number(bank[0].bad ?? 0)}`);
  // shares sum to 100
  const share = await q(a, "SELECT COUNT(*) c FROM (SELECT project_id, SUM(share_percentage) s FROM project_partners GROUP BY project_id HAVING ABS(s-100)>0.01) x");
  check("project partner shares sum to 100%", Number(share[0].c) === 0, `bad_projects=${share[0].c}`);
  // no PAID_BY_PARTNER leak into treasury
  const leak = await q(a, "SELECT COUNT(*) c FROM treasury_ledger tl JOIN project_expenses e ON e.id=tl.reference_id WHERE tl.reference_type='EXPENSE' AND e.payment_channel='PAID_BY_PARTNER'");
  check("no PAID_BY_PARTNER rows leak into treasury_ledger", Number(leak[0].c) === 0, `leaks=${Number(leak[0].c)}`);
  // no overpaid sales
  const over = await q(a, "SELECT COUNT(*) c FROM land_sales WHERE current_due_amount < -0.01");
  check("no overpaid sales (due never negative)", Number(over[0].c) === 0, `overpaid=${Number(over[0].c)}`);
  await a.end();
}

/* ---------- Section 3: multi-tenant isolation ---------- */
section("3. Multi-tenant isolation");
{
  const ctrl = await db(CONTROL);
  const [ap] = await q(ctrl, "SELECT id FROM tenants WHERE id LIKE 'aaaa%'");
  const [bp] = await q(ctrl, "SELECT id FROM tenants WHERE id LIKE 'bbbb%'");
  await ctrl.end();
  const a = await db("tenant_alpha");
  const b = await db("tenant_beta");
  const aPartners = await q(a, "SELECT id FROM partners");
  const bPartners = await q(b, "SELECT id FROM partners");
  const bPay = await q(b, "SELECT id FROM customer_payments LIMIT 1");
  await a.end(); await b.end();
  const alpha = await login("owner@alpha.com", "123456");
  const beta = await login("owner@beta.com", "123456");
  let alphaLeak = false, betaLeak = false;
  for (const path of ["/projects", "/partners", "/expenses", "/sales", "/treasury", "/dashboard", "/reports"]) {
    const ra = await fetch(`${BASE}${path}`, { headers: { cookie: alpha.cookie }, redirect: "manual" });
    const ta = await ra.text();
    const rb = await fetch(`${BASE}${path}`, { headers: { cookie: beta.cookie }, redirect: "manual" });
    const tb = await rb.text();
    if (bPartners.some((p) => ta.includes(p.id)) || bPay.some((p) => ta.includes(p.id))) alphaLeak = true;
    if (aPartners.some((p) => tb.includes(p.id))) betaLeak = true;
  }
  check("alpha pages leak no beta record IDs", !alphaLeak);
  check("beta pages leak no alpha record IDs", !betaLeak);
  // suspended tenant blocked (login + live session)
  const ctrl2 = await db(CONTROL);
  await q(ctrl2, "UPDATE tenants SET status='suspended' WHERE id LIKE 'aaaa%'");
  const suspendedLogin = await login("owner@alpha.com", "123456");
  check("suspended tenant cannot log in", !suspendedLogin.hasSession);
  const deadSess = await fetch(`${BASE}/api/auth/session`, { headers: { cookie: alpha.cookie } });
  check("existing session dies when tenant suspended", !(await deadSess.json())?.user);
  await q(ctrl2, "UPDATE tenants SET status='active' WHERE id LIKE 'aaaa%'");
  const restored = await fetch(`${BASE}/api/auth/session`, { headers: { cookie: alpha.cookie } });
  check("session revives when tenant reactivated", !!(await restored.json())?.user);
  await ctrl2.end();
}

/* ---------- Section 5: RBAC route/permission matrix ---------- */
section("5. Roles & permissions route matrix");
{
  const ROUTES = [
    { path: "/dashboard", kind: "page", perm: "dashboard.view" },
    { path: "/projects", kind: "page", perm: "projects.view" },
    { path: "/treasury", kind: "page", perm: "treasury.view" },
    { path: "/partners", kind: "page", perm: "partners.manage" },
    { path: "/sales", kind: "page", perm: "sales.view" },
    { path: "/audit", kind: "page", perm: "audit.view" },
    { path: "/reports", kind: "page", perm: "reports.view" },
    { path: "/settings/roles", kind: "page", perm: "roles.manage" },
    { path: "/settings/users", kind: "page", perm: "users.manage" },
    { path: "/settings/billing", kind: "page", perm: "billing.manage" },
    { path: "/api/treasury/contra", kind: "api", perm: "treasury.view" },
    { path: "/api/expenses", kind: "api", perm: "expenses.view" },
    { path: "/api/sales", kind: "api", perm: "sales.view" },
    { path: "/api/users", kind: "api", perm: "users.view" },
    { path: "/api/roles", kind: "api", perm: "roles.manage" },
  ];
  const USERS = ["owner@alpha.com", "admin@alpha.com", "auditor@alpha.com", "field@alpha.com", "sales@alpha.com"];
  for (const email of USERS) {
    const { cookie } = await login(email, "123456");
    const isOwner = email.startsWith("owner@");
    let perms = [];
    if (!isOwner) perms = (await (await api(cookie, "/api/me/permissions")).json)?.permissions ?? [];
    for (const r of ROUTES) {
      const expected = isOwner || perms.includes(r.perm);
      const res = await fetch(`${BASE}${r.path}`, { headers: { cookie }, redirect: "manual" });
      const accessible = r.kind === "page" ? !((await res.text()).includes("Forbidden")) : res.status !== 403;
      check(`${email} ${r.path}`, accessible === expected, `expected=${expected ? "allow" : "deny"} got=${accessible ? "allow" : "deny"}`);
    }
  }
}

/* ---------- Section 6: financial logic ---------- */
section("6. Financial logic (mutates data)");
{
  const a = await db("tenant_alpha");
  const owner = await login("owner@alpha.com", "123456");
  let plot = (await q(a, "SELECT id, project_id FROM project_plots WHERE status='AVAILABLE' LIMIT 1"))[0];
  if (!plot) {
    const proj = (await q(a, "SELECT id FROM land_projects LIMIT 1"))[0];
    if (proj) {
      const { randomUUID } = await import("crypto");
      const pid = randomUUID();
      await a.query("INSERT INTO project_plots (id, project_id, plot_number, plot_size_shotok, asking_price, status) VALUES (?, ?, 'AUDIT-P1', 10, 1000000, 'AVAILABLE')", [pid, proj.id]);
      plot = { id: pid, project_id: proj.id };
    }
  }
  const [partner] = await q(a, "SELECT id FROM partners LIMIT 1");
  const TOTAL = 1000000, ADV = 200000;
  const saleRes = await api(owner.cookie, "/api/sales", { method: "POST", json: {
    project_id: plot.project_id, plot_id: plot.id, buyer_name: "Audit Buyer", buyer_phone: "01700000000",
    total_agreed_price: TOTAL, advance: ADV, payment_method: "CASH",
    installments: [{ dueDate: "2026-12-01", dueAmount: 400000 }, { dueDate: "2027-03-01", dueAmount: 400000 }],
  } });
  check("create sale (plot+advance+installments)", saleRes.status === 200 && saleRes.json?.id, `status=${saleRes.status}`);
  const saleId = saleRes.json?.id;
  if (saleId) {
    const sale = (await q(a, "SELECT * FROM land_sales WHERE id=?", [saleId]))[0];
    check("sale due == total - advance", Number(sale.current_due_amount) === TOTAL - ADV);
    check("advance -> treasury IN (SALE_PAYMENT)", await cnt(a, "SELECT COUNT(*) c FROM treasury_ledger WHERE reference_type='SALE_PAYMENT' AND reference_id=? AND flow_type='IN'", [saleId]) === 1);
    check("2 installments created", await cnt(a, "SELECT COUNT(*) c FROM installment_schedule WHERE sale_id=? AND status='UPCOMING'", [saleId]) === 2);
    await api(owner.cookie, `/api/sales/${saleId}/pay`, { method: "POST", json: { amount: 400000, payment_method: "CASH" } });
    const s1 = (await q(a, "SELECT * FROM land_sales WHERE id=?", [saleId]))[0];
    check("partial pay -> status PARTIAL, due 400000", s1.status === "PARTIAL" && Number(s1.current_due_amount) === 400000, `status=${s1.status} due=${s1.current_due_amount}`);
    await api(owner.cookie, `/api/sales/${saleId}/pay`, { method: "POST", json: { amount: 400000, payment_method: "CASH" } });
    const s2 = (await q(a, "SELECT * FROM land_sales WHERE id=?", [saleId]))[0];
    const plotStatus = (await q(a, "SELECT status FROM project_plots WHERE id=?", [plot.id]))[0].status;
    check("final pay -> PAID_IN_FULL + plot SOLD", s2.status === "PAID_IN_FULL" && plotStatus === "SOLD", `status=${s2.status} plot=${plotStatus}`);
    check("both installments PAID", await cnt(a, "SELECT COUNT(*) c FROM installment_schedule WHERE sale_id=? AND status='PAID'", [saleId]) === 2);
    const over = await api(owner.cookie, `/api/sales/${saleId}/pay`, { method: "POST", json: { amount: 100, payment_method: "CASH" } });
    check("overpay beyond due rejected", over.status === 400);
  }
  // PAID_BY_PARTNER isolation
  const fd = new FormData();
  fd.set("project_id", plot.project_id); fd.set("category", "Fuel"); fd.set("amount", "5000");
  fd.set("payment_channel", "PAID_BY_PARTNER"); fd.set("paid_by_partner", partner.id); fd.set("description", "Audit PBP");
  const e1 = await api(owner.cookie, "/api/expenses", { method: "POST", form: fd });
  if (e1.json?.id) {
    await api(owner.cookie, `/api/expenses/${e1.json.id}/approve`, { method: "POST", json: { action: "APPROVED" } });
    check("PAID_BY_PARTNER -> partner_transactions only", await cnt(a, "SELECT COUNT(*) c FROM partner_transactions WHERE reference_id=? AND txn_type='DIRECT_EXPENSE'", [e1.json.id]) === 1);
    check("PAID_BY_PARTNER -> NO treasury_ledger", await cnt(a, "SELECT COUNT(*) c FROM treasury_ledger WHERE reference_type='EXPENSE' AND reference_id=?", [e1.json.id]) === 0);
  }
  // audit_log on protected tables
  for (const tbl of ["land_sales", "customer_payments", "treasury_ledger", "installment_schedule", "project_plots"]) {
    check(`audit_log has ${tbl} rows`, await cnt(a, "SELECT COUNT(*) c FROM audit_log WHERE table_name=?", [tbl]) > 0);
  }
  await a.end();
}

/* ---------- Section 7: reports recomputation (spawn tsx) ---------- */
section("7. Reports recomputation vs raw SQL");
{
  try {
    const tsxCli = ["node_modules", "tsx", "dist", "cli.mjs"].join("/");
    const out = execFileSync(process.execPath, [tsxCli, "scripts/audit_recompute.mts", "tenant_alpha"], { cwd: process.cwd(), encoding: "utf8", timeout: 120000 });
    for (const l of out.split("\n")) if (l.startsWith("PASS") || l.startsWith("FAIL")) { l.startsWith("PASS") ? pass++ : fail++; console.log(l); }
    const line = out.split("\n").find((l) => l.startsWith("REPORT_RECOMPUTE"));
    check("report recompute sub-suite ran", !!line, line ?? "");
  } catch (e) {
    check("report recompute sub-suite ran", false, (e.message || "").slice(0, 120));
  }
}

/* ---------- Section 4: auth/session security (rate limit LAST) ---------- */
section("4. Auth/session security");
{
  const owner = await login("owner@alpha.com", "123456");
  const sessCookie = owner.setCookies.find((c) => c.startsWith("next-auth.session-token")) || "";
  check("session cookie is HttpOnly", /HttpOnly/i.test(sessCookie), sessCookie.split(";").slice(1).join(";").trim());
  check("session cookie is SameSite=Lax", /SameSite=Lax/i.test(sessCookie));
  // no XSS injection surface
  const { default: fs } = await import("fs");
  const { execSync } = await import("child_process");
  let xss = "";
  try { xss = execSync('findstr /S /M /C:"dangerouslySetInnerHTML" src\\*.tsx src\\*.ts', { encoding: "utf8" }); } catch {}
  check("no dangerouslySetInnerHTML (no raw HTML injection)", xss.trim() === "");
  // rate limiting: hammer login from a unique synthetic IP -> expect 429.
  // Spoofed x-forwarded-for keeps the burst isolated so it does not poison the
  // shared 127.0.0.1 counter used by the other sections (repeat-run safe).
  const synthIP = `198.51.100.${1 + Math.floor(Math.random() * 250)}`;
  let got429 = false, tries = 0;
  for (let i = 0; i < 40 && !got429; i++) {
    tries++;
    const jar = new Map();
    const cr = await fetch(`${BASE}/api/auth/csrf`);
    for (const c of (cr.headers.getSetCookie?.() ?? [])) { const [k, v] = c.split(";")[0].split("="); if (v) jar.set(k.trim(), v.trim()); }
    const ck = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
    const { csrfToken } = await cr.json();
    const lo = await fetch(`${BASE}/api/auth/callback/credentials`, {
      method: "POST", redirect: "manual",
      headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: ck, "x-forwarded-for": synthIP },
      body: new URLSearchParams({ email: `nobody${i}@x.com`, password: "bad", csrfToken, redirect: "false", json: "true" }),
    });
    if (lo.status === 429) got429 = true;
  }
  check("credential login rate-limited (429 after burst)", got429, `ip=${synthIP} tries=${tries}`);
}

/* ---------- scorecard ---------- */
console.log(`\n\x1b[1m========== AUDIT SCORECARD ==========\x1b[0m`);
console.log(`TOTAL: ${pass}/${pass + fail} checks passed, ${fail} failed`);
console.log(`\x1b[${fail ? "31" : "32"}m${fail ? "AUDIT FAILED" : "AUDIT PASSED"}\x1b[0m`);
process.exit(fail ? 1 : 0);
