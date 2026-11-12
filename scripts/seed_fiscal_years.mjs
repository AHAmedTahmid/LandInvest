import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

/**
 * Seeds relative Fiscal Year (FY) configuration into tenant_demo.dashboard_settings
 * and ensures an audit_log entry is recorded.
 * Safe to re-run (upserts setting_key = 'fiscal_years').
 */
export async function seedFiscalYears() {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tenant_demo",
  });

  try {
    let actorId = "00000000-0000-0000-0000-000000000001";
    try {
      const [[owner]] = await conn.query(
        "SELECT id FROM tenant_users WHERE email = 'owner@demo.com' LIMIT 1"
      );
      if (owner?.id) actorId = owner.id;
    } catch {
      // Fallback to default system actor UUID
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    // Bangladesh standard FY: July 1 – June 30
    const curStartYear = m >= 6 ? y : y - 1;

    const fiscalYears = [
      {
        id: "fy-seed-cur",
        label: `FY ${curStartYear}-${curStartYear + 1}`,
        labelBn: `অর্থবছর ${curStartYear}-${curStartYear + 1}`,
        startDate: `${curStartYear}-07-01`,
        endDate: `${curStartYear + 1}-06-30`,
        isCurrent: true,
        status: "ACTIVE",
        notes: "Current Active Bangladesh Fiscal Year (Jul – Jun)",
        createdAt: now.toISOString(),
      },
      {
        id: "fy-seed-next",
        label: `FY ${curStartYear + 1}-${curStartYear + 2}`,
        labelBn: `অর্থবছর ${curStartYear + 1}-${curStartYear + 2}`,
        startDate: `${curStartYear + 1}-07-01`,
        endDate: `${curStartYear + 2}-06-30`,
        isCurrent: false,
        status: "ACTIVE",
        notes: "Upcoming Fiscal Year (Prepared)",
        createdAt: now.toISOString(),
      },
      {
        id: "fy-seed-prev1",
        label: `FY ${curStartYear - 1}-${curStartYear}`,
        labelBn: `অর্থবছর ${curStartYear - 1}-${curStartYear}`,
        startDate: `${curStartYear - 1}-07-01`,
        endDate: `${curStartYear}-06-30`,
        isCurrent: false,
        status: "CLOSED",
        notes: "Previous Fiscal Year (Audited & Closed)",
        createdAt: now.toISOString(),
      },
      {
        id: "fy-seed-prev2",
        label: `FY ${curStartYear - 2}-${curStartYear - 1}`,
        labelBn: `অর্থবছর ${curStartYear - 2}-${curStartYear - 1}`,
        startDate: `${curStartYear - 2}-07-01`,
        endDate: `${curStartYear - 1}-06-30`,
        isCurrent: false,
        status: "CLOSED",
        notes: "Historical Fiscal Year (Archived)",
        createdAt: now.toISOString(),
      },
    ];

    const [[existing]] = await conn.query(
      "SELECT id, setting_value FROM dashboard_settings WHERE setting_key = 'fiscal_years' LIMIT 1"
    );

    if (existing) {
      await conn.query(
        "UPDATE dashboard_settings SET setting_value = ?, updated_by = ?, updated_at = NOW() WHERE setting_key = 'fiscal_years'",
        [JSON.stringify(fiscalYears), actorId]
      );
      await conn.query(
        `INSERT INTO audit_log (id, table_name, record_id, action, changed_by, old_values, new_values, created_at)
         VALUES (?, 'dashboard_settings', ?, 'UPDATE', ?, ?, ?, NOW())`,
        [
          randomUUID(),
          existing.id,
          actorId,
          typeof existing.setting_value === "string"
            ? existing.setting_value
            : JSON.stringify(existing.setting_value),
          JSON.stringify(fiscalYears),
        ]
      );
    } else {
      const id = randomUUID();
      await conn.query(
        "INSERT INTO dashboard_settings (id, setting_key, setting_value, updated_by, updated_at) VALUES (?, 'fiscal_years', ?, ?, NOW())",
        [id, JSON.stringify(fiscalYears), actorId]
      );
      await conn.query(
        `INSERT INTO audit_log (id, table_name, record_id, action, changed_by, old_values, new_values, created_at)
         VALUES (?, 'dashboard_settings', ?, 'CREATE', ?, NULL, ?, NOW())`,
        [randomUUID(), id, actorId, JSON.stringify(fiscalYears)]
      );
    }

    console.log(
      `Seeded ${fiscalYears.length} Fiscal Years for tenant_demo (Current: ${fiscalYears[0].label}).`
    );
    return fiscalYears;
  } finally {
    await conn.end();
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("seed_fiscal_years.mjs")) {
  seedFiscalYears().catch((err) => {
    console.error("Failed to seed fiscal years:", err);
    process.exit(1);
  });
}
