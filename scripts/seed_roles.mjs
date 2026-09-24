import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const conn = await mysql.createConnection({
  host: "localhost", user: "root", password: "", port: 3306, database: "control_plane",
});

const [[tenant]] = await conn.query("SELECT id FROM tenants WHERE db_name = ?", ["tenant_demo"]);
if (!tenant) { console.error("tenant_demo not found"); process.exit(1); }

const roles = [
  { email: "owner@demo.com", role: "super_admin", fullName: "Demo Owner" },
  { email: "admin@demo.com", role: "managing_partner", fullName: "Demo Admin" },
  { email: "site@demo.com", role: "site_manager", fullName: "Demo Site" },
  { email: "acct@demo.com", role: "accountant", fullName: "Demo Accountant" },
];

for (const r of roles) {
  const hash = await bcrypt.hash("123456", 10);
  const [[exists]] = await conn.query("SELECT id FROM global_users WHERE email = ?", [r.email]);
  if (exists) {
    await conn.query("UPDATE global_users SET role=?, password_hash=?, is_active=1 WHERE id=?", [r.role, hash, exists.id]);
    console.log(`updated ${r.email} -> ${r.role}`);
  } else {
    await conn.query(
      "INSERT INTO global_users (id,tenant_id,full_name,email,password_hash,role) VALUES (?,?,?,?,?,?)",
      [randomUUID(), tenant.id, r.fullName, r.email, hash, r.role]
    );
    console.log(`created ${r.email} -> ${r.role}`);
  }
}

await conn.end();
console.log("roles ready (password: 123456)");
