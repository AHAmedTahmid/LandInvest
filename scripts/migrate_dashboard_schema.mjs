import mysql from "mysql2/promise";

async function main() {
  const dbs = ["tenant_demo", "tenant_alpha", "tenant_beta"];
  for (const db of dbs) {
    try {
      const conn = await mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: db,
      });

      await conn.query(`
        CREATE TABLE IF NOT EXISTS dashboard_layouts (
          id CHAR(36) PRIMARY KEY,
          scope VARCHAR(10) NOT NULL,
          scope_id CHAR(36) NOT NULL,
          layout JSON NOT NULL,
          updated_by CHAR(36),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_scope_scope_id (scope, scope_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS dashboard_settings (
          id CHAR(36) PRIMARY KEY,
          setting_key VARCHAR(100) UNIQUE NOT NULL,
          setting_value JSON NOT NULL,
          updated_by CHAR(36),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      console.log(`✓ Tables created/verified in ${db}`);
      await conn.end();
    } catch (err) {
      console.warn(`Could not migrate ${db}:`, err.message);
    }
  }
}

main();

