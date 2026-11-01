import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const MYSQL_CONFIG = { host: "localhost", user: "root", password: "", port: 3306 };
const TENANT_DB = "tenant_demo";
const CONTROL_DB = "control_plane";

async function cleanData() {
  console.log("Connecting to databases...");
  const tConn = await mysql.createConnection({ ...MYSQL_CONFIG, database: TENANT_DB });
  const cConn = await mysql.createConnection({ ...MYSQL_CONFIG, database: CONTROL_DB });

  console.log("Clearing operational test data from tenant_demo...");
  await tConn.query("SET FOREIGN_KEY_CHECKS = 0;");

  const tablesToClear = [
    "audit_log",
    "profit_distributions",
    "installment_schedule",
    "customer_payments",
    "land_sales",
    "project_plots",
    "treasury_ledger",
    "partner_transactions",
    "project_expenses",
    "project_partners",
    "bank_accounts",
    "partners",
    "land_projects",
  ];

  for (const table of tablesToClear) {
    try {
      await tConn.query(`TRUNCATE TABLE \`${table}\``);
      console.log(`  ✓ Cleared ${table}`);
    } catch (err) {
      console.log(`  - Truncate failed on ${table}, running DELETE:`, err.message);
      await tConn.query(`DELETE FROM \`${table}\``);
    }
  }

  await tConn.query("SET FOREIGN_KEY_CHECKS = 1;");

  // Ensure default categories exist
  console.log("Ensuring default categories...");
  await tConn.query(`CREATE TABLE IF NOT EXISTS default_categories (id CHAR(36) PRIMARY KEY, name VARCHAR(100) NOT NULL, kind VARCHAR(20) NOT NULL, UNIQUE KEY uq_cat_name (name))`);
  const categories = [
    ["Registration", "project"], ["Mutation", "project"], ["Bayna", "project"],
    ["Labor", "project"], ["Survey", "project"], ["Misc", "project"],
  ];
  for (const [name, kind] of categories) {
    await tConn.query("INSERT IGNORE INTO default_categories (id,name,kind) VALUES (?,?,?)", [randomUUID(), name, kind]);
  }

  // Verify roles
  const [roles] = await tConn.query("SELECT name FROM roles");
  console.log("Active tenant roles:", roles.map((r) => r.name).join(", "));

  // Ensure login users in control plane
  console.log("Verifying demo login accounts in control_plane...");
  const [tenants] = await cConn.query("SELECT id FROM tenants WHERE db_name = ?", [TENANT_DB]);
  if (tenants.length === 0) {
    throw new Error("Tenant tenant_demo not found in control_plane");
  }
  const tenantId = tenants[0].id;
  const hash = await bcrypt.hash("123456", 10);

  const users = [
    { email: "owner@demo.com", fullName: "Demo Owner", isOwner: true },
    { email: "admin@demo.com", fullName: "Demo Admin", isOwner: false },
    { email: "acct@demo.com", fullName: "Demo Accountant", isOwner: false },
    { email: "site@demo.com", fullName: "Demo Site", isOwner: false },
  ];

  for (const u of users) {
    const [existing] = await cConn.query("SELECT id FROM global_users WHERE email = ?", [u.email]);
    if (existing.length > 0) {
      await cConn.query("UPDATE global_users SET password_hash = ?, is_active = 1, tenant_id = ?, is_owner = ?, must_change_password = 0 WHERE id = ?", [hash, tenantId, u.isOwner ? 1 : 0, existing[0].id]);
      console.log(`  ✓ Updated user: ${u.email}`);
    } else {
      const newId = randomUUID();
      await cConn.query(
        "INSERT INTO global_users (id, tenant_id, full_name, email, password_hash, is_owner, is_active, must_change_password) VALUES (?, ?, ?, ?, ?, ?, 1, 0)",
        [newId, tenantId, u.fullName, u.email, hash, u.isOwner ? 1 : 0]
      );
      console.log(`  ✓ Created user: ${u.email}`);
    }
  }

  // Count checks
  console.log("\nVerification of clean database:");
  for (const table of tablesToClear) {
    const [res] = await tConn.query(`SELECT COUNT(*) as count FROM \`${table}\``);
    console.log(`  ${table}: ${res[0].count} records`);
  }

  await tConn.end();
  await cConn.end();
  console.log("\nClean slate ready! All test transactions removed.");
}

cleanData().catch((err) => {
  console.error("Error during clean:", err);
  process.exit(1);
});
