import { randomUUID } from "crypto";
import { ALL_KEYS, type PermissionKey } from "@/lib/permissions";

export const DEFAULT_ROLES: { name: string; description: string; isSystem: boolean; keys: PermissionKey[] }[] = [
  {
    name: "Owner",
    description: "Full access — cannot be edited or deleted",
    isSystem: true,
    keys: [...ALL_KEYS],
  },
  {
    name: "Managing Partner",
    description: "Everything except user/role/billing management",
    isSystem: false,
    keys: ALL_KEYS.filter((k) => !["users.manage", "roles.manage", "billing.manage"].includes(k)) as PermissionKey[],
  },
  {
    name: "Site Manager",
    description: "Projects view + expenses view/create",
    isSystem: false,
    keys: ["projects.view", "expenses.view", "expenses.create"] as PermissionKey[],
  },
  {
    name: "Accountant",
    description: "Expenses, sales collect, receipts, treasury view/contra",
    isSystem: false,
    keys: ["expenses.create", "sales.view", "sales.collect", "receipts.print", "treasury.view", "treasury.contra.create"] as PermissionKey[],
  },
];

export async function seedDefaultRoles(prisma: any, createdBy: string | null) {
  for (const r of DEFAULT_ROLES) {
    const existing = await prisma.role.findUnique({ where: { name: r.name } });
    if (existing) continue;
    const id = randomUUID();
    await prisma.role.create({ data: { id, name: r.name, description: r.description, isSystem: r.isSystem, createdBy } });
    // Owner is system — permissions are implicit, but we still store them for visibility if desired; skip to keep it implicit per spec
    if (!r.isSystem) {
      for (const k of r.keys) {
        await prisma.rolePermission.create({ data: { roleId: id, permissionKey: k } });
      }
    } else {
      // optionally store all keys for Owner as well for audit visibility — spec says implicitly has EVERY, but we can store none and treat isSystem as all
    }
    // audit log for role creation
    try {
      const { writeAudit } = await import("@/lib/tenantRules");
      await writeAudit(prisma, "roles", id, "CREATE", createdBy ?? "system", null, { name: r.name, isSystem: r.isSystem, keys: r.keys });
    } catch {}
  }
}
