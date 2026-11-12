import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import { seedFiscalYears } from "./seed_fiscal_years.mjs";

const BASE = "http://localhost:3000";

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
      ...(options.body ? { "Content-Type": "application/json" } : {}),
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

describe("Fiscal Year (FY) Full Process E2E", () => {
  let ownerCookie = "";
  let partnerCookie = "";
  let siteCookie = "";
  let acctCookie = "";
  let db;
  let tempExpenseId = null;

  before(async () => {
    await seedFiscalYears();
    db = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "tenant_demo",
    });

    ownerCookie = await login("owner@demo.com");
    partnerCookie = await login("admin@demo.com");
    siteCookie = await login("site@demo.com");
    acctCookie = await login("acct@demo.com");
  });

  after(async () => {
    if (tempExpenseId && db) {
      await db.query("DELETE FROM project_expenses WHERE id = ?", [tempExpenseId]);
    }
    await seedFiscalYears();
    if (db) await db.end();
  });

  it("1. Rejects unauthenticated GET and POST requests with 401", async () => {
    const getRes = await apiJson(null, "/api/settings/fiscal-years");
    assert.equal(getRes.status, 401);

    const postRes = await apiJson(null, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({
        action: "CREATE",
        label: "FY 2099-2100",
        startDate: "2099-07-01",
        endDate: "2100-06-30",
      }),
    });
    assert.equal(postRes.status, 401);
  });

  it("2. Enforces RBAC on /api/settings/fiscal-years and /settings/fiscal-years", async () => {
    // Non-admins can read current FY, but cannot mutate
    for (const cookie of [siteCookie, acctCookie]) {
      const getRes = await apiJson(cookie, "/api/settings/fiscal-years");
      assert.equal(getRes.status, 200);
      assert.ok(getRes.json?.currentFiscalYear?.label);

      const postRes = await apiJson(cookie, "/api/settings/fiscal-years", {
        method: "POST",
        body: JSON.stringify({ action: "SET_CURRENT", id: "fy-seed-prev1" }),
      });
      assert.equal(postRes.status, 403);

      const pageRes = await fetch(`${BASE}/settings/fiscal-years`, { headers: { Cookie: cookie } });
      const html = await pageRes.text();
      assert.ok(html.includes("Forbidden:"), "Expected Forbidden marker for non-admin");
    }

    // Admins can open /settings/fiscal-years without Forbidden
    for (const cookie of [ownerCookie, partnerCookie]) {
      const pageRes = await fetch(`${BASE}/settings/fiscal-years`, { headers: { Cookie: cookie } });
      const html = await pageRes.text();
      assert.equal(pageRes.status, 200);
      assert.ok(!html.includes("Forbidden:"), "Admin should not see Forbidden");
      assert.ok(html.includes("Fiscal Years"), "Expected Fiscal Years heading");
    }
  });

  it("3. Validates input dates, duplicate labels, and blocks deleting current FY", async () => {
    const badRange = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({
        action: "CREATE",
        label: "FY Bad Range",
        startDate: "2028-07-01",
        endDate: "2028-06-30",
      }),
    });
    assert.equal(badRange.status, 400);

    const dupLabel = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({
        action: "CREATE",
        label: "FY 2026-2027",
        startDate: "2026-07-01",
        endDate: "2027-06-30",
      }),
    });
    assert.equal(dupLabel.status, 400);

    const delCurrent = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({ action: "DELETE", id: "fy-seed-cur" }),
    });
    assert.equal(delCurrent.status, 400);
  });

  it("4. Supports full CREATE -> SET_CURRENT -> TOGGLE_STATUS -> DELETE lifecycle with MySQL & audit_log persistence", async () => {
    const createRes = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({
        action: "CREATE",
        label: "FY 2029-2030",
        labelBn: "অর্থবছর ২০২৯-২০৩০",
        startDate: "2029-07-01",
        endDate: "2030-06-30",
        notes: "TDD lifecycle test FY",
        setAsCurrent: false,
      }),
    });
    assert.equal(createRes.status, 200);
    const created = createRes.json.fiscalYears.find((f) => f.label === "FY 2029-2030");
    assert.ok(created, "Created FY should be in returned list");
    assert.equal(created.isCurrent, false);

    // Set newly created FY as current
    const setRes = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({ action: "SET_CURRENT", id: created.id }),
    });
    assert.equal(setRes.status, 200);
    assert.equal(setRes.json.currentFiscalYear.id, created.id);
    assert.equal(setRes.json.currentFiscalYear.label, "FY 2029-2030");

    // Verify persisted in MySQL dashboard_settings and audit_log
    const [[settingRow]] = await db.query(
      "SELECT id, setting_value FROM dashboard_settings WHERE setting_key = 'fiscal_years' LIMIT 1"
    );
    const stored =
      typeof settingRow.setting_value === "string"
        ? JSON.parse(settingRow.setting_value)
        : settingRow.setting_value;
    assert.equal(stored.find((f) => f.id === created.id)?.isCurrent, true);

    const [[auditRow]] = await db.query(
      "SELECT COUNT(*) AS cnt FROM audit_log WHERE table_name = 'dashboard_settings' AND record_id = ?",
      [settingRow.id]
    );
    assert.ok(auditRow.cnt >= 2, "Expected audit_log entries for FY updates");

    // Restore original current FY so we can toggle & delete the test FY
    const restoreRes = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({ action: "SET_CURRENT", id: "fy-seed-cur" }),
    });
    assert.equal(restoreRes.status, 200);

    // Toggle status of test FY -> CLOSED
    const closeRes = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({ action: "TOGGLE_STATUS", id: created.id, status: "CLOSED" }),
    });
    assert.equal(closeRes.status, 200);
    assert.equal(
      closeRes.json.fiscalYears.find((f) => f.id === created.id)?.status,
      "CLOSED"
    );

    // Delete test FY
    const delRes = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({ action: "DELETE", id: created.id }),
    });
    assert.equal(delRes.status, 200);
    assert.equal(
      delRes.json.fiscalYears.some((f) => f.id === created.id),
      false
    );
  });

  it("5. Reports preset=this_fy dynamically uses the active tenant Fiscal Year on both UI page and Export API", async () => {
    // Seed a relative expense inside FY 2025-2026 (2025-08-15)
    const [[project]] = await db.query("SELECT id FROM land_projects LIMIT 1");
    assert.ok(project?.id, "Expected at least one land_project in tenant_demo");
    tempExpenseId = randomUUID();
    const markerCat = `TDD_FY_2025_2026_${tempExpenseId.slice(0, 8)}`;

    await db.query(
      `INSERT INTO project_expenses (id, project_id, expense_category, description, amount, payment_channel, expense_date, status, created_by, created_at)
       VALUES (?, ?, ?, 'TDD Fiscal Year integration check', 12345.00, 'CASH', '2025-08-15', 'APPROVED', '00000000-0000-0000-0000-000000000001', NOW())`,
      [tempExpenseId, project.id, markerCat]
    );

    // With FY 2026-2027 (2026-07-01..2027-06-30) active, 2025-08-15 expense must NOT appear in this_fy export
    const exportCur = await fetch(
      `${BASE}/api/reports/expense-register?preset=this_fy&format=excel`,
      { headers: { Cookie: ownerCookie } }
    );
    assert.equal(exportCur.status, 200);
    const xlsCur = await exportCur.text();
    assert.equal(
      xlsCur.includes(markerCat),
      false,
      "2025-08-15 expense should NOT appear when FY 2026-2027 is current"
    );

    // Switch active FY to FY 2025-2026 (2025-07-01..2026-06-30)
    const switchRes = await apiJson(ownerCookie, "/api/settings/fiscal-years", {
      method: "POST",
      body: JSON.stringify({ action: "SET_CURRENT", id: "fy-seed-prev1" }),
    });
    assert.equal(switchRes.status, 200);
    assert.equal(switchRes.json.currentFiscalYear.label, "FY 2025-2026");

    // Report UI page should show the 2025-08-15 expense when FY 2025-2026 is current
    const reportPage = await fetch(`${BASE}/reports/expense-register?preset=this_fy`, {
      headers: { Cookie: ownerCookie },
    });
    assert.equal(reportPage.status, 200);
    const reportHtml = await reportPage.text();
    assert.ok(reportHtml.includes(markerCat), "Report UI should include the FY 2025-2026 expense");

    // Report Export API should ALSO use active FY (2025-07-01..2026-06-30) and include the 2025-08-15 expense
    const exportPrev = await fetch(
      `${BASE}/api/reports/expense-register?preset=this_fy&format=excel`,
      { headers: { Cookie: ownerCookie } }
    );
    assert.equal(exportPrev.status, 200);
    const xlsPrev = await exportPrev.text();
    assert.ok(
      xlsPrev.includes(markerCat),
      "2025-08-15 expense MUST appear in export when FY 2025-2026 is current"
    );
  });
});
