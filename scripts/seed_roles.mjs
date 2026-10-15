import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const { PrismaClient: ControlClient } = await import("../src/generated/control/index.js");
const { PrismaClient: TenantClient } = await import("../src/generated/tenant/index.js");
const { seedDefaultRoles } = await import("../src/lib/seedRoles.js");

const CONTROL = "mysql://root:@localhost:3306/control_plane";
const cPrisma = new ControlClient({ datasources: { db: { url: CONTROL } } });

const tenantRow = await cPrisma.tenant.findFirst({ where: { dbName: "tenant_demo" } });
if (!tenantRow) { console.error("tenant_demo not found"); process.exit(1); }

const tPrisma = new TenantClient({ datasources: { db: { url: `mysql://root:@localhost:3306/${tenantRow.dbName}` } } });

const owner = await cPrisma.globalUser.findFirst({ where: { tenantId: tenantRow.id, isOwner: true } });
await seedDefaultRoles(tPrisma, owner?.id ?? null);

const roles = [
  { email: "owner@demo.com", fullName: "Demo Owner", roleName: "Owner", isOwner: true },
  { email: "admin@demo.com", fullName: "Demo Admin", roleName: "Managing Partner", isOwner: false },
  { email: "site@demo.com", fullName: "Demo Site", roleName: "Site Manager", isOwner: false },
  { email: "acct@demo.com", fullName: "Demo Accountant", roleName: "Accountant", isOwner: false },
];

const roleByName = new Map();
for (const r of ["Owner", "Managing Partner", "Site Manager", "Accountant"]) {
  const row = await tPrisma.role.findUnique({ where: { name: r } });
  if (row) roleByName.set(r, row.id);
}

const conn = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "control_plane" });
const hash = await bcrypt.hash("123456", 10);

for (const r of roles) {
  const [[exists]] = await conn.query("SELECT id, is_owner FROM global_users WHERE email = ?", [r.email]);
  let userId;
  if (exists) {
    userId = exists.id;
    await conn.query("UPDATE global_users SET password_hash=?, is_active=1, must_change_password=0, is_owner=? WHERE id=?", [hash, r.isOwner ? 1 : 0, userId]);
    console.log(`updated ${r.email} (password reset, is_owner=${r.isOwner})`);
  } else {
    userId = randomUUID();
    await conn.query(
      "INSERT INTO global_users (id, tenant_id, full_name, email, password_hash, is_owner, is_active, must_change_password) VALUES (?,?,?,?,?,?,1,0)",
      [userId, tenantRow.id, r.fullName, r.email, hash, r.isOwner ? 1 : 0]
    );
    console.log(`created ${r.email}`);
  }
  const roleId = roleByName.get(r.roleName);
  if (!roleId) { console.error(`role ${r.roleName} missing`); process.exit(1); }
  await tPrisma.userRole.upsert({
    where: { userId },
    update: { roleId, assignedBy: userId },
    create: { userId, roleId, assignedBy: userId },
  });
  console.log(`  -> ${r.roleName}`);
}

await conn.end();
await cPrisma.$disconnect();
await tPrisma.$disconnect();
console.log("roles ready (password: 123456)");
