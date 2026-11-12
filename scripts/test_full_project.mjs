import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";

const BASE = "http://localhost:3000";

const REPORT_KEYS = [
  "balance-sheet",
  "cash-book",
  "bank-book",
  "daily-summary",
  "receipts-payments",
  "contra-register",
  "partner-capital",
  "partners-summary",
  "partner-contribution",
  "project-cost",
  "project-pnl",
  "projects-comparison",
  "expense-register",
  "pending-approval",
  "land-documents",
  "sales-register",
  "plot-inventory",
  "buyer-statement",
  "receivables-aging",
  "installment-report",
  "collection-report",
  "profit-allocation",
  "profit-history",
  "audit-trail",
  "user-activity",
  "reconciliation",
];

const APP_PAGES = [
  "/dashboard",
  "/partners",
  "/partners/dashboard",
  "/partners/capital",
  "/treasury",
  "/treasury/dashboard",
  "/treasury/accounts",
  "/treasury/transactions",
  "/treasury/approvals",
  "/projects",
  "/projects/new",
  "/projects/plots",
  "/expenses",
  "/expenses/dashboard",
  "/expenses/approvals",
  "/expenses/breakdown",
  "/vouchers",
  "/sales",
  "/sales/bookings",
  "/sales/dues",
  "/reports",
  "/reports/project-pnl",
  "/audit",
  "/settings/users",
  "/settings/roles",
  "/settings/fiscal-years",
  "/settings/billing",
];

async function login(email, password = "123456") {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const csrfCookies = csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : [];
  const { csrfToken } = await csrfRes.json();
  let jar = csrfCookies.map((c) => c.split(";")[0]).join("; ");

  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: jar },
    body: new URLSearchParams({ email, password, csrfToken, json: "true" }),
    redirect: "manual",
  });

  const loginCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [];
  jar = [...jar.split("; "), ...loginCookies.map((c) => c.split(";")[0])]
    .filter(Boolean)
    .join("; ");

  const me = await fetch(`${BASE}/api/me/permissions`, { headers: { Cookie: jar } });
  assert.equal(me.status, 200, `Login failed for ${email} (status ${me.status})`);
  return jar;
}

async function apiJson(cookie, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body && typeof options.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // non-json
  }
  return { status: res.status, json, text };
}

function assertCleanHtml(html, routeLabel) {
  assert.ok(
    !html.includes("Application error: a server-side exception") &&
      !html.includes("Application error: a client-side exception") &&
      !html.includes("__next_error__"),
    `${routeLabel} rendered Next.js error boundary`
  );
  assert.ok(!html.includes("Forbidden:"), `${routeLabel} unexpectedly rendered Forbidden for super_admin`);
}

describe("LandInvest Full Project E2E Suite (Start to Reports)", () => {
  let ownerCookie = "";
  let acctCookie = "";
  let siteCookie = "";
  let db;
  let seededProjectId = "";
  let seededBankId = "";
  let seededPartnerId = "";
  let seededSaleId = "";
  let availPlotIds = [];

  before(async () => {
    db = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "tenant_demo",
    });

    ownerCookie = await login("owner@demo.com");
    acctCookie = await login("acct@demo.com");
    siteCookie = await login("site@demo.com");

    const [[proj]] = await db.query("SELECT id FROM land_projects LIMIT 1");
    const [[bank]] = await db.query("SELECT id FROM bank_accounts WHERE is_active = 1 LIMIT 1");
    const [[partner]] = await db.query("SELECT id FROM partners LIMIT 1");
    const [[sale]] = await db.query("SELECT id FROM land_sales LIMIT 1");
    const [plots] = await db.query(
      "SELECT id, project_id FROM project_plots WHERE status = 'AVAILABLE' LIMIT 2"
    );

    seededProjectId = proj?.id || "";
    seededBankId = bank?.id || "";
    seededPartnerId = partner?.id || "";
    seededSaleId = sale?.id || "";
    availPlotIds = plots.map((p) => p.id);
  });

  after(async () => {
    if (db) await db.end();
  });

  it("1. Auth & Login page checks (unauth 401 + no Create account link on /login)", async () => {
    for (const ep of ["/api/me/permissions", "/api/sales", "/api/expenses", "/api/settings/fiscal-years"]) {
      const res = await apiJson(null, ep);
      assert.equal(res.status, 401, `Expected 401 for unauthenticated ${ep}, got ${res.status}`);
    }

    const loginRes = await fetch(`${BASE}/login`);
    assert.equal(loginRes.status, 200);
    const loginHtml = await loginRes.text();
    assert.equal(
      loginHtml.includes("Create account"),
      false,
      "/login should NOT display 'Create account' link"
    );
  });

  it("2. All App Pages load with HTTP 200 and no error boundary for super_admin", async () => {
    const pages = [
      ...APP_PAGES,
      ...(seededProjectId ? [`/projects/${seededProjectId}`] : []),
      ...(seededSaleId ? [`/sales/${seededSaleId}`] : []),
    ];

    const failures = [];
    for (const p of pages) {
      const res = await fetch(`${BASE}${p}`, { headers: { Cookie: ownerCookie } });
      const html = await res.text();
      if (res.status !== 200) {
        failures.push(`${p} -> HTTP ${res.status}`);
      } else if (
        html.includes("Application error: a server-side exception") ||
        html.includes("Application error: a client-side exception") ||
        html.includes("Forbidden:")
      ) {
        failures.push(`${p} -> rendered error/forbidden`);
      }
    }
    assert.deepEqual(failures, [], `Page failures:\n${failures.join("\n")}`);
  });

  it("3. Core read APIs & Dashboard endpoints return 200", async () => {
    for (const ep of [
      "/api/dashboard/layout",
      "/api/dashboard/insights",
      "/api/partners",
      "/api/banks",
      "/api/projects",
      "/api/vouchers",
      "/api/sales",
      "/api/expenses",
      "/api/settings/fiscal-years",
    ]) {
      const res = await apiJson(ownerCookie, ep);
      assert.equal(res.status, 200, `GET ${ep} returned ${res.status}: ${res.text.slice(0, 200)}`);
    }
  });

  it("4. Treasury Contra Transfer -> Queue as Accountant & Approve as Owner", async () => {
    assert.ok(seededBankId, "Need an active bank account");
    const createRes = await apiJson(acctCookie, "/api/treasury/contra", {
      method: "POST",
      body: JSON.stringify({
        fromType: "CASH",
        toType: "BANK",
        bankAccountId: seededBankId,
        amount: 5000,
        purpose: "Full E2E test contra transfer",
      }),
    });
    assert.equal(createRes.status, 200, `Contra create failed: ${createRes.text}`);
    assert.ok(createRes.json?.id, "Expected contra transfer id");

    if (createRes.json.pending) {
      const appRes = await apiJson(ownerCookie, `/api/treasury/contra/${createRes.json.id}/approve`, {
        method: "POST",
        body: JSON.stringify({ action: "APPROVED" }),
      });
      assert.equal(appRes.status, 200, `Contra approve failed: ${appRes.text}`);
    }
  });

  it("5. Expenses & Vouchers -> Validation (400 JSON), Create (CASH & PAID_BY_PARTNER) -> Approve -> Fetch Voucher", async () => {
    assert.ok(seededProjectId, "Need a seeded project");

    // Missing required fields must return 400 JSON (not empty 500)
    const badFd = new FormData();
    badFd.append("amount", "1500");
    const badRes = await fetch(`${BASE}/api/expenses`, {
      method: "POST",
      headers: { Cookie: siteCookie },
      body: badFd,
    });
    assert.equal(badRes.status, 400);
    const badJson = await badRes.json();
    assert.ok(badJson.error, "Expected JSON error message for missing category");

    const fd1 = new FormData();
    fd1.append("projectId", seededProjectId);
    fd1.append("expenseCategory", "DEVELOPMENT");
    fd1.append("amount", "1500");
    fd1.append("expenseDate", "2026-08-10");
    fd1.append("paymentChannel", "CASH");
    fd1.append("description", "Full E2E CASH expense");

    const expRes = await fetch(`${BASE}/api/expenses`, {
      method: "POST",
      headers: { Cookie: siteCookie },
      body: fd1,
    });
    const expJson = await expRes.json();
    assert.equal(expRes.status, 200, `Expense create failed: ${JSON.stringify(expJson)}`);
    assert.ok(expJson.id);

    const appRes = await apiJson(ownerCookie, `/api/expenses/${expJson.id}/approve`, {
      method: "POST",
      body: JSON.stringify({ action: "APPROVED" }),
    });
    assert.equal(appRes.status, 200, `Expense approve failed: ${appRes.text}`);

    const voucherRes = await fetch(`${BASE}/api/expenses/${expJson.id}/voucher`, {
      headers: { Cookie: ownerCookie },
    });
    assert.equal(voucherRes.status, 200, `Voucher fetch failed: ${voucherRes.status}`);

    if (seededPartnerId) {
      const fd2 = new FormData();
      fd2.append("projectId", seededProjectId);
      fd2.append("expenseCategory", "LEGAL");
      fd2.append("amount", "2200");
      fd2.append("expenseDate", "2026-08-11");
      fd2.append("paymentChannel", "PAID_BY_PARTNER");
      fd2.append("paidByPartnerId", seededPartnerId);
      fd2.append("description", "Full E2E PAID_BY_PARTNER expense");

      const pExpRes = await fetch(`${BASE}/api/expenses`, {
        method: "POST",
        headers: { Cookie: ownerCookie },
        body: fd2,
      });
      const pExpJson = await pExpRes.json();
      assert.equal(pExpRes.status, 200, `Partner expense failed: ${JSON.stringify(pExpJson)}`);
    }
  });

  it("6. Sales -> Overpayment Guards, Multi-Plot Sale, Installment Payment & Receipt", async () => {
    assert.ok(seededProjectId, "Need a seeded project");
    // Ensure we have 2 AVAILABLE plots (create 2 temporary ones if needed)
    let plotIds = [...availPlotIds];
    if (plotIds.length < 2) {
      for (let i = plotIds.length; i < 2; i++) {
        const pid = randomUUID();
        await db.query(
          `INSERT INTO project_plots (id, project_id, plot_number, area_shotok, asking_price, status)
           VALUES (?, ?, ?, 3.0, 600000.00, 'AVAILABLE')`,
          [pid, seededProjectId, `E2E-P-${pid.slice(0, 6)}`]
        );
        plotIds.push(pid);
      }
    }

    // 6a. Advance > Total Agreed Price must fail with 400
    const overAdv = await apiJson(ownerCookie, "/api/sales", {
      method: "POST",
      body: JSON.stringify({
        project_id: seededProjectId,
        plot_ids: [plotIds[0]],
        buyer_name: "Overpay Guard Buyer",
        buyer_phone: "01700000099",
        total_agreed_price: 500000,
        advance: 600000,
        installments_count: 0,
        channel: "CASH",
      }),
    });
    assert.equal(overAdv.status, 400, `Expected 400 for advance > total, got ${overAdv.status}`);

    // 6b. Multi-plot sale with 2 plots
    const saleRes = await apiJson(ownerCookie, "/api/sales", {
      method: "POST",
      body: JSON.stringify({
        project_id: seededProjectId,
        plot_ids: plotIds,
        buyer_name: "E2E Multi-Plot Buyer",
        buyer_phone: "01711223344",
        total_agreed_price: 1200000,
        advance: 200000,
        installments_count: 4,
        channel: "CASH",
      }),
    });
    assert.equal(saleRes.status, 200, `Multi-plot sale failed: ${saleRes.text}`);
    assert.ok(saleRes.json?.id);

    // Verify both plots marked BOOKED (matching single-plot sellPlot behavior)
    const [bookedPlots] = await db.query(
      `SELECT id, status FROM project_plots WHERE id IN (?, ?)`,
      [plotIds[0], plotIds[1]]
    );
    assert.equal(bookedPlots.length, 2);
    for (const sp of bookedPlots) {
      assert.equal(sp.status, "BOOKED", `Plot ${sp.id} should be BOOKED`);
    }

    // 6c. Installment overpayment (> 1,000,000 remaining due) must fail with 400
    const overPay = await apiJson(ownerCookie, `/api/sales/${saleRes.json.id}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount: 1500000, channel: "CASH" }),
    });
    assert.equal(overPay.status, 400, `Expected 400 for overpayment, got ${overPay.status}`);

    // 6d. Valid installment payment + receipt
    const payRes = await apiJson(ownerCookie, `/api/sales/${saleRes.json.id}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount: 250000, channel: "CASH" }),
    });
    assert.equal(payRes.status, 200, `Valid payment failed: ${payRes.text}`);

    const receiptRes = await fetch(`${BASE}/api/sales/${saleRes.json.id}/receipt`, {
      headers: { Cookie: ownerCookie },
    });
    assert.equal(receiptRes.status, 200, `Receipt endpoint failed: ${receiptRes.status}`);
  });

  it("7. Reports Catalog (/reports) has category filter & Grid/List view toggle", async () => {
    const res = await fetch(`${BASE}/reports`, { headers: { Cookie: ownerCookie } });
    assert.equal(res.status, 200);
    const html = await res.text();
    assertCleanHtml(html, "/reports");
    assert.ok(html.includes("Financial / Treasury") || html.includes("Financial"), "Missing category filter");
    assert.ok(html.includes("Grid") && html.includes("List"), "Missing Grid/List view toggle");
  });

  it("8. ALL 26 Reports (UI Page + Excel Export API) and PnL Endpoints return HTTP 200 without errors", async () => {
    const reportFailures = [];

    for (const key of REPORT_KEYS) {
      const pageRes = await fetch(`${BASE}/reports/${key}`, {
        headers: { Cookie: ownerCookie },
      });
      const pageHtml = await pageRes.text();
      if (pageRes.status !== 200) {
        reportFailures.push(`PAGE /reports/${key} -> HTTP ${pageRes.status}`);
      } else if (
        pageHtml.includes("Application error: a server-side exception") ||
        pageHtml.includes("Application error: a client-side exception") ||
        pageHtml.includes("Forbidden:")
      ) {
        reportFailures.push(`PAGE /reports/${key} -> rendered error/forbidden`);
      }

      if (key === "expense-register" && pageRes.status === 200) {
        if (
          pageHtml.includes(`/api/reports/${key}/pdf`) ||
          pageHtml.includes(`/api/reports/${key}/excel`)
        ) {
          reportFailures.push(`PAGE /reports/${key} -> still links to broken /pdf or /excel subpath`);
        }
        if (!pageHtml.includes(`format=pdf`) || !pageHtml.includes(`format=excel`)) {
          reportFailures.push(`PAGE /reports/${key} -> missing ?format=pdf or ?format=excel export link`);
        }
      }

      const expRes = await fetch(`${BASE}/api/reports/${key}?format=excel`, {
        headers: { Cookie: ownerCookie },
      });
      if (expRes.status !== 200) {
        const body = await expRes.text();
        reportFailures.push(`API /api/reports/${key}?format=excel -> HTTP ${expRes.status}: ${body.slice(0, 120)}`);
      }
    }

    for (const pnlEp of ["/api/reports/pnl", "/api/reports/pnl/excel", "/api/reports/pnl/pdf"]) {
      const r = await fetch(`${BASE}${pnlEp}`, { headers: { Cookie: ownerCookie } });
      if (r.status !== 200) {
        reportFailures.push(`API ${pnlEp} -> HTTP ${r.status}`);
      }
    }

    assert.deepEqual(
      reportFailures,
      [],
      `Report failures (${reportFailures.length}):\n${reportFailures.join("\n")}`
    );
  });
});

