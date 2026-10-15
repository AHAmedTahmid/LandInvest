import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can, getUserPermissions, invalidateTenantCache } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "roles.manage"))) return NextResponse.json({ error: "Forbidden: roles.manage" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required for duplicate" }, { status: 400 });
  const prisma: any = await getTenantClientFromSession();
  const src = await prisma.role.findUnique({ where: { id } });
  if (!src) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const dup = await prisma.role.findUnique({ where: { name } });
  if (dup) return NextResponse.json({ error: "Role name already exists" }, { status: 400 });
  const perms = await prisma.rolePermission.findMany({ where: { roleId: id } });
  const keys = perms.map((p: any) => p.permissionKey);
  const isOwner = !!(session.user as any)?.isOwner;
  if (!isOwner) {
    const myPerms = new Set(await getUserPermissions(session));
    for (const k of keys) if (!myPerms.has(k)) return NextResponse.json({ error: `Cannot duplicate role with permission you don't hold: ${k}` }, { status: 403 });
  }
  const newId = randomUUID();
  const userId = (session.user as any).id;
  const tenantId = (session.user as any).tenantId;
  const role = await prisma.$transaction(async (tx: any) => {
    const r = await tx.role.create({ data: { id: newId, name, description: src.description, isSystem: false, createdBy: userId } });
    for (const k of keys) await tx.rolePermission.create({ data: { roleId: newId, permissionKey: k } });
    await writeAudit(tx, "roles", newId, "CREATE", userId, null, { name, description: src.description, keys, duplicatedFrom: id });
    return r;
  });
  invalidateTenantCache(tenantId);
  return NextResponse.json(role);
}
