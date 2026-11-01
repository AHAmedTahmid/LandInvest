import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const MYSQL_CONFIG = { host: "localhost", user: "root", password: "", port: 3306 };
const CONTROL_DB = "control_plane";

async function cleanAllData() {
  console.log("Connecting to MySQL server...");
  const rootConn = await mysql.createConnection(MYSQL_CONFIG);

  // Discover all tenant databases
  const [dbs] = await rootConn.query("SHOW DATABASES");
  const tenantDbs = dbs
    .map((d) => Object.values(d)[0])
    .filter((name) => name.startsWith("tenant_"));

  console.log("Found tenant databases:", tenantDbs.join(", "));

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

  for (const dbName of tenantDbs) {
    console.log(`\n--- Cleaning tenant DB: ${dbName} ---`);
    const tConn = await mysql.createConnection({ ...MYSQL_CONFIG, database: dbName });

    await tConn.query("SET FOREIGN_KEY_CHECKS = 0;");
    for (const table of tablesToClear) {
      try {
        await tConn.query(`TRUNCATE TABLE \`${table}\``);
        console.log(`  ✓ Cleared ${table}`);
      } catch (err) {
        try {
          await tConn.query(`DELETE FROM \`${table}\``);
          console.log(`  ✓ Deleted all from ${table}`);
        } catch {
          // Table might not exist in this tenant
        }
      }
    }
    await tConn.query("SET FOREIGN_KEY_CHECKS = 1;");

    // Ensure default categories exist
    try {
      await tConn.query(`CREATE TABLE IF NOT EXISTS default_categories (id CHAR(36) PRIMARY KEY, name VARCHAR(100) NOT NULL, kind VARCHAR(20) NOT NULL, UNIQUE KEY uq_cat_name (name))`);
      const categories = [
        ["Registration", "project"], ["Mutation", "project"], ["Bayna", "project"],
        ["Labor", "project"], ["Survey", "project"], ["Misc", "project"],
      ];
      for (const [name, kind] of categories) {
        await tConn.query("INSERT IGNORE INTO default_categories (id,name,kind) VALUES (?,?,?)", [randomUUID(), name, kind]);
      }
    } catch (e) {
      console.log("  Default categories notice:", e.message);
    }

    // Verify verification count
    for (const table of ["land_projects", "project_expenses", "treasury_ledger", "partners"]) {
      try {
        const [res] = await tConn.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        console.log(`  ${table}: ${res[0].count} records`);
      } catch {}
    }

    await tConn.end();
  }

  // Set password to 123456 for all users in control_plane
  console.log("\n--- Resetting passwords for all users in control_plane ---");
  const cConn = await mysql.createConnection({ ...MYSQL_CONFIG, database: CONTROL_DB });
  const hash = await bcrypt.hash("123456", 10);
  await cConn.query("UPDATE global_users SET password_hash = ?, is_active = 1, must_change_password = 0", [hash]);
  const [users] = await cConn.query("SELECT email, full_name FROM global_users");
  console.log("All users password reset to '123456':");
  for (const u of users) {
    console.log(`  • ${u.email} (${u.full_name})`);
  }

  await cConn.end();
  await rootConn.end();
  console.log("\n🎉 ALL TENANT DATABASES COMPLETELY CLEARED! Ready for clean demo.");
}

cleanAllData().catch((err) => {
  console.error("Clean failed:", err);
  process.exit(1);
});
