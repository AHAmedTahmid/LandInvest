import mysql from "mysql2/promise";

const CONTROL = "mysql://root:@localhost:3306/control_plane";
const { PrismaClient: ControlClient } = await import("../src/generated/control/index.js");
const cPrisma = new ControlClient({ datasources: { db: { url: CONTROL } } });
const tenants = await cPrisma.tenant.findMany();
console.log("tenants", tenants.map(t=>t.dbName));

for (const tenant of tenants) {
  const url = `mysql://root:@localhost:3306/${tenant.dbName}`;
  const { PrismaClient: TenantClient } = await import("../src/generated/tenant/index.js");
  const tPrisma = new TenantClient({ datasources: { db: { url } } });
  const { seedDefaultRoles } = await import("../src/lib/seedRoles.js");
  const owner = await cPrisma.globalUser.findFirst({ where: { tenantId: tenant.id, isOwner: true } });
  // also fallback to first user if no owner flagged
  const fallbackOwner = owner ?? await cPrisma.globalUser.findFirst({ where: { tenantId: tenant.id }, orderBy: { createdAt: "asc" } });
  await seedDefaultRoles(tPrisma, fallbackOwner?.id ?? null);
  // assign roles based on old heuristic: isOwner -> Owner, others -> map by email
  const users = await cPrisma.globalUser.findMany({ where: { tenantId: tenant.id } });
  const ownerRole = await tPrisma.role.findUnique({ where: { name: "Owner" } });
  const mpRole = await tPrisma.role.findUnique({ where: { name: "Managing Partner" } });
  const smRole = await tPrisma.role.findUnique({ where: { name: "Site Manager" } });
  const acRole = await tPrisma.role.findUnique({ where: { name: "Accountant" } });
  for (const u of users) {
    let targetRoleId = null;
    if (u.isOwner) targetRoleId = ownerRole?.id;
    else if (u.email.includes("site")) targetRoleId = smRole?.id;
    else if (u.email.includes("acct")) targetRoleId = acRole?.id;
    else if (u.email.includes("admin")) targetRoleId = mpRole?.id;
    else if (u.email.includes("rakib")) targetRoleId = ownerRole?.id; // rakib is owner for his tenant but isOwner true already handled
    else targetRoleId = mpRole?.id;
    if (!targetRoleId) continue;
    const existing = await tPrisma.userRole.findUnique({ where: { userId: u.id } }).catch(()=>null);
    if (!existing) {
      await tPrisma.userRole.create({ data: { userId: u.id, roleId: targetRoleId, assignedBy: fallbackOwner?.id ?? u.id } });
      console.log(`assigned ${u.email} -> ${targetRoleId}`);
    } else {
      console.log(`skip ${u.email} already has role`);
    }
  }
  await tPrisma.$disconnect();
}
await cPrisma.$disconnect();
console.log("migrate done");
