import { execSync } from "child_process";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const CONTROL_DB = "control_plane";
const TENANT_DB = "tenant_demo";

async function ensureDb(name) {
  const conn = await mysql.createConnection({ host: "localhost", user: "root", password: "" });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
  console.log(`DB ready: ${name}`);
}

await ensureDb(CONTROL_DB);
execSync(`npx prisma db push --schema=prisma/control/schema.prisma --skip-generate --accept-data-loss`, { stdio: "inherit", env: { ...process.env, DATABASE_URL_CONTROL: `mysql://root:@localhost:3306/${CONTROL_DB}` } });
await ensureDb(TENANT_DB);
execSync(`npx prisma db push --schema=prisma/tenant/schema.prisma --skip-generate --accept-data-loss`, { stdio: "inherit", env: { ...process.env, DATABASE_URL_TENANT: `mysql://root:@localhost:3306/${TENANT_DB}` } });

const { PrismaClient } = await import("../src/generated/control/index.js");
const prisma = new PrismaClient({ datasources: { db: { url: `mysql://root:@localhost:3306/${CONTROL_DB}` } } });
const hash = await bcrypt.hash("123456", 10);

// plans + tenant with new schema
const plan = await prisma.plan.upsert({ where: { id: "00000000-0000-0000-0000-000000000001" }, update: {}, create: { id: "00000000-0000-0000-0000-000000000001", name: "Basic", priceMonthly: 1000, priceYearly: 10000, maxUsers: 5, maxProjects: 10, features: { plots: true } } });
const tenant = await prisma.tenant.upsert({
  where: { dbName: TENANT_DB },
  update: { companyName: "Demo Syndicate", dbHost: "localhost", dbUser: "root", dbPasswordEncrypted: "enc_stub" },
  create: { companyName: "Demo Syndicate", dbHost: "localhost", dbName: TENANT_DB, dbUser: "root", dbPasswordEncrypted: "enc_stub", status: "active" },
});
await prisma.globalUser.upsert({
  where: { email: "admin@demo.com" },
  update: { passwordHash: hash, tenantId: tenant.id, role: "managing_partner", fullName: "Demo Admin" },
  create: { tenantId: tenant.id, fullName: "Demo Admin", email: "admin@demo.com", passwordHash: hash, role: "managing_partner" },
});
await prisma.subscription.upsert({
  where: { id: "00000000-0000-0000-0000-000000000002" },
  update: {},
  create: { id: "00000000-0000-0000-0000-000000000002", tenantId: tenant.id, planId: plan.id, billingCycle: "monthly", status: "active", currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now()+30*864e5) },
});
if ((await prisma.billingInvoice.count({ where: { tenantId: tenant.id } })) === 0) {
  await prisma.billingInvoice.create({ data: { tenantId: tenant.id, subscriptionId: "00000000-0000-0000-0000-000000000002", amount: 1000, currency: "BDT", status: "paid", invoiceDate: new Date() } });
}
await prisma.$disconnect();

// Same default expense categories the provisioning worker creates for new tenants
const tenantConn = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: TENANT_DB });
await tenantConn.query(`CREATE TABLE IF NOT EXISTS default_categories (id CHAR(36) PRIMARY KEY, name VARCHAR(100) NOT NULL, kind VARCHAR(20) NOT NULL, UNIQUE KEY uq_cat_name (name))`);
const categories = [
  ["Registration", "project"], ["Mutation", "project"], ["Bayna", "project"],
  ["Labor", "project"], ["Survey", "project"], ["Misc", "project"],
];
const { randomUUID } = await import("crypto");
for (const [name, kind] of categories) await tenantConn.query("INSERT IGNORE INTO default_categories (id,name,kind) VALUES (?,?,?)", [randomUUID(), name, kind]);
await tenantConn.end();

console.log("Seed done: admin@demo.com / 123456 | billing stubbed | default categories ready");
