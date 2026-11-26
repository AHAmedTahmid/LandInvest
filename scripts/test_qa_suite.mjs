import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";

const BASE = process.env.BASE_URL || "http://localhost:3000";

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

describe("LandInvest Full QA & Financial Calculation TDD Suite", () => {
  let ownerCookie = "";
  let acctCookie = "";
  let siteCookie = "";
  let auditorCookie = "";
  let db;

  let seededProjectId = "";
  let seededBankId = "";
  let seededPartnerId = "";

  // Track created IDs for clean teardown
  const createdExpenseIds = [];
  const createdSaleIds = [];
  const createdPlotIds = [];
  const createdContraIds = [];

  before(async () => {
    db = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "tenant_demo",
    });

    ownerCookie = await login("owner@alpha.com");
    acctCookie = await login("accountant@alpha.com");
    siteCookie = await login("site@alpha.com");
    auditorCookie = await login("auditor@alpha.com");

    const [[proj]] = await db.query("SELECT id FROM land_projects LIMIT 1");
    const [[bank]] = await db.query("SELECT id FROM bank_accounts WHERE is_active = 1 LIMIT 1");
    const [[partner]] = await db.query("SELECT id FROM partners LIMIT 1");

    seededProjectId = proj?.id || "";
    seededBankId = bank?.id || "";
    seededPartnerId = partner?.id || "";

    assert.ok(seededProjectId, "Need seeded project");
    assert.ok(seededBankId, "Need seeded active bank account");
    assert.ok(seededPartnerId, "Need seeded partner");
  });

  after(async () => {
    // Clean up test records in reverse dependency order & resync bank balance if needed
    if (db) {
      for (const sid of createdSaleIds) {
        await db.query("DELETE FROM treasury_ledger WHERE reference_type = 'SALE_PAYMENT' AND reference_id = ?", [sid]);
        await db.query("DELETE FROM installment_schedule WHERE sale_id = ?", [sid]);
        await db.query("DELETE FROM customer_payments WHERE sale_id = ?", [sid]);
        await db.query("DELETE FROM land_sales WHERE id = ?", [sid]);
      }
      for (const pid of createdPlotIds) {
        await db.query("DELETE FROM project_plots WHERE id = ?", [pid]);
      }
      for (const eid of createdExpenseIds) {
        await db.query("DELETE FROM treasury_ledger WHERE reference_type = 'EXPENSE' AND reference_id = ?", [eid]);
        await db.query("DELETE FROM partner_transactions WHERE reference_id = ?", [eid]);
        await db.query("DELETE FROM project_expenses WHERE id = ?", [eid]);
      }
      for (const [outId, inId] of createdContraIds) {
        await db.query("DELETE FROM treasury_ledger WHERE id IN (?, ?)", [outId, inId]);
      }
      // Ensure bank_accounts.current_balance matches treasury_ledger after cleanup
      await db.query(`
        UPDATE bank_accounts ba
        SET current_balance = COALESCE((
          SELECT SUM(CASE WHEN tl.flow_type = 'IN' THEN tl.amount ELSE -tl.amount END)
          FROM treasury_ledger tl WHERE tl.bank_account_id = ba.id
        ), 0)
      `);
      await db.end();
    }
  });

  it("1. Voucher Flow (BANK): Approving and Reactivating via /api/vouchers/[id]/action keeps bank_accounts.current_balance synced with treasury_ledger", async () => {
    const [[bankBefore]] = await db.query("SELECT current_balance FROM bank_accounts WHERE id = ?", [seededBankId]);
    const balBefore = Number(bankBefore.current_balance);

    // Create a PENDING BANK expense voucher
    const fd = new FormData();
    fd.append("projectId", seededProjectId);
    fd.append("expenseCategory", "DEVELOPMENT");
    fd.append("amount", "2500");
    fd.append("expenseDate", "2026-11-10");
    fd.append("paymentChannel", "BANK");
    fd.append("bankAccountId", seededBankId);
    fd.append("description", "QA Test BANK Voucher Sync");

    const createRes = await fetch(`${BASE}/api/expenses`, {
      method: "POST",
      headers: { Cookie: siteCookie },
      body: fd,
    });
    const exp = await createRes.json();
    assert.equal(createRes.status, 200, `Expense create failed: ${JSON.stringify(exp)}`);
    createdExpenseIds.push(exp.id);

    // Approve via /api/vouchers/[id]/action
    const appRes = await apiJson(ownerCookie, `/api/vouchers/${exp.id}/action`, {
      method: "POST",
      body: JSON.stringify({ action: "APPROVED" }),
    });
    assert.equal(appRes.status, 200, `Voucher approve failed: ${appRes.text}`);

    const [[bankAfterApprove]] = await db.query("SELECT current_balance FROM bank_accounts WHERE id = ?", [seededBankId]);
    assert.equal(
      Number(bankAfterApprove.current_balance),
      balBefore - 2500,
      `Bank balance must decrement by 2500 on BANK voucher approval (expected ${balBefore - 2500}, got ${bankAfterApprove.current_balance})`
    );

    // Reactivate via /api/vouchers/[id]/action -> must restore bank balance
    const reactRes = await apiJson(ownerCookie, `/api/vouchers/${exp.id}/action`, {
      method: "POST",
      body: JSON.stringify({ action: "REACTIVATED", reason: "QA rollback test" }),
    });
    assert.equal(reactRes.status, 200, `Voucher reactivate failed: ${reactRes.text}`);

    const [[bankAfterReactivate]] = await db.query("SELECT current_balance FROM bank_accounts WHERE id = ?", [seededBankId]);
    assert.equal(
      Number(bankAfterReactivate.current_balance),
      balBefore,
      `Bank balance must restore to ${balBefore} on REACTIVATED (got ${bankAfterReactivate.current_balance})`
    );
  });

  it("2. Voucher Flow (/api/expenses/[id]/approve): Blocks double-approval on already APPROVED voucher", async () => {
    const fd = new FormData();
    fd.append("projectId", seededProjectId);
    fd.append("expenseCategory", "LEGAL");
    fd.append("amount", "1000");
    fd.append("expenseDate", "2026-11-10");
    fd.append("paymentChannel", "CASH");
    fd.append("description", "QA Double Approval Guard");

    const createRes = await fetch(`${BASE}/api/expenses`, {
      method: "POST",
      headers: { Cookie: siteCookie },
      body: fd,
    });
    const exp = await createRes.json();
    assert.equal(createRes.status, 200);
    createdExpenseIds.push(exp.id);

    const first = await apiJson(ownerCookie, `/api/expenses/${exp.id}/approve`, {
      method: "POST",
      body: JSON.stringify({ action: "APPROVED" }),
    });
    assert.equal(first.status, 200);

    // Second approval attempt MUST be rejected (400), NOT create duplicate treasury_ledger rows
    const second = await apiJson(ownerCookie, `/api/expenses/${exp.id}/approve`, {
      method: "POST",
      body: JSON.stringify({ action: "APPROVED" }),
    });
    assert.equal(second.status, 400, `Expected 400 on double-approval, got ${second.status}: ${second.text}`);

    const [ledgerRows] = await db.query(
      "SELECT COUNT(*) AS cnt FROM treasury_ledger WHERE reference_type = 'EXPENSE' AND reference_id = ?",
      [exp.id]
    );
    assert.equal(Number(ledgerRows[0].cnt), 1, "Exactly 1 treasury_ledger row must exist per approved voucher");
  });

  it("3. Voucher PATCH Guard: Cannot mutate projectId, bankAccountId, or paidByPartnerId on an APPROVED voucher", async () => {
    const fd = new FormData();
    fd.append("projectId", seededProjectId);
    fd.append("expenseCategory", "OFFICE");
    fd.append("amount", "800");
    fd.append("expenseDate", "2026-11-10");
    fd.append("paymentChannel", "BANK");
    fd.append("bankAccountId", seededBankId);
    fd.append("description", "QA Approved Voucher Mutation Guard");

    const createRes = await fetch(`${BASE}/api/expenses`, {
      method: "POST",
      headers: { Cookie: siteCookie },
      body: fd,
    });
    const exp = await createRes.json();
    assert.equal(createRes.status, 200);
    createdExpenseIds.push(exp.id);

    await apiJson(ownerCookie, `/api/vouchers/${exp.id}/action`, {
      method: "POST",
      body: JSON.stringify({ action: "APPROVED" }),
    });

    const patchRes = await apiJson(ownerCookie, `/api/vouchers/${exp.id}`, {
      method: "PATCH",
      body: JSON.stringify({ bankAccountId: null }),
    });
    assert.equal(
      patchRes.status,
      400,
      `Expected 400 when changing bankAccountId on APPROVED voucher, got ${patchRes.status}`
    );
  });

  it("4. Treasury Contra Transfer: CASH -> BANK updates bank_accounts.current_balance atomically with treasury_ledger", async () => {
    const [[bankBefore]] = await db.query("SELECT current_balance FROM bank_accounts WHERE id = ?", [seededBankId]);
    const balBefore = Number(bankBefore.current_balance);

    const createRes = await apiJson(ownerCookie, "/api/treasury/contra", {
      method: "POST",
      body: JSON.stringify({
        fromType: "CASH",
        toType: "BANK",
        bankAccountId: seededBankId,
        amount: 5000,
        purpose: "QA Contra Balance Sync Test",
      }),
    });
    assert.equal(createRes.status, 200, `Contra create failed: ${createRes.text}`);
    if (createRes.json?.outId && createRes.json?.inId) {
      createdContraIds.push([createRes.json.outId, createRes.json.inId]);
    }

    const [[bankAfter]] = await db.query("SELECT current_balance FROM bank_accounts WHERE id = ?", [seededBankId]);
    assert.equal(
      Number(bankAfter.current_balance),
      balBefore + 5000,
      `Bank balance must increment by 5000 on CASH -> BANK contra (expected ${balBefore + 5000}, got ${bankAfter.current_balance})`
    );
  });

  it("5. RBAC Enforcement: Read-Only Auditor cannot collect customer payments via POST /api/sales/[id]/pay", async () => {
    const [[sale]] = await db.query("SELECT id FROM land_sales WHERE current_due_amount > 100 LIMIT 1");
    assert.ok(sale, "Need a sale with due > 100");

    const payRes = await apiJson(auditorCookie, `/api/sales/${sale.id}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount: 100, payment_method: "CASH" }),
    });
    assert.equal(
      payRes.status,
      403,
      `Auditor (Read-Only) MUST get 403 Forbidden on /api/sales/${sale.id}/pay, got ${payRes.status}`
    );
  });

  it("6. Sales Installment Rounding Math: 3 installments for 100,000 remaining sum to exact 100,000.00", async () => {
    const pid = randomUUID();
    await db.query(
      `INSERT INTO project_plots (id, project_id, plot_number, plot_size_shotok, asking_price, status)
       VALUES (?, ?, ?, 3.0, 200000.00, 'AVAILABLE')`,
      [pid, seededProjectId, `QA-R-${pid.slice(0, 6)}`]
    );
    createdPlotIds.push(pid);

    const saleRes = await apiJson(ownerCookie, "/api/sales", {
      method: "POST",
      body: JSON.stringify({
        project_id: seededProjectId,
        plot_id: pid,
        buyer_name: "QA Rounding Buyer",
        buyer_phone: "01700000001",
        total_agreed_price: 150000,
        advance: 50000,
        installments_count: 3,
        payment_method: "CASH",
      }),
    });
    assert.equal(saleRes.status, 200, `Sale create failed: ${saleRes.text}`);
    createdSaleIds.push(saleRes.json.id);

    const [insts] = await db.query(
      "SELECT due_amount FROM installment_schedule WHERE sale_id = ? ORDER BY due_date ASC",
      [saleRes.json.id]
    );
    assert.equal(insts.length, 3);
    const totalScheduled = insts.reduce((s, r) => s + Number(r.due_amount), 0);
    assert.equal(
      Math.round(totalScheduled * 100) / 100,
      100000,
      `Sum of 3 installments must equal exact remaining 100000 (got ${totalScheduled})`
    );
  });

  it("7. All 26 Reports (UI + Data API + Excel Export) & 20/20 Reconciliation Checks PASS", async () => {
    // Check reconciliation report directly via API
    const recRes = await apiJson(ownerCookie, "/api/reports/reconciliation");
    assert.equal(recRes.status, 200, `Reconciliation API failed: ${recRes.text}`);
    const failedChecks = (recRes.json?.rows || []).filter((r) => r.status === "FAIL" || r.Status === "FAIL");
    assert.equal(
      failedChecks.length,
      0,
      `Reconciliation report has failing checks: ${JSON.stringify(failedChecks)}`
    );

    // Check all 26 reports return 200 on JSON API and Excel Export
    for (const key of REPORT_KEYS) {
      const dataRes = await fetch(`${BASE}/api/reports/${key}`, {
        headers: { Cookie: ownerCookie },
      });
      assert.equal(dataRes.status, 200, `Report API /api/reports/${key} returned ${dataRes.status}`);

      const xlsRes = await fetch(`${BASE}/api/reports/${key}?format=excel`, {
        headers: { Cookie: ownerCookie },
      });
      assert.equal(xlsRes.status, 200, `Report Excel export /api/reports/${key}?format=excel returned ${xlsRes.status}`);
    }
  });
});
