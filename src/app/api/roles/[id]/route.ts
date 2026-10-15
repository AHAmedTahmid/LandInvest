import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can, getUserPermissions, invalidateTenantCache } from "@/lib/rbac";
import { isValidKey } from "@/lib/permissions";
import { getTenantClientFromSession } from "@/lib/tenant";
import { writeAudit } from "@/lib/tenantRules";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "roles.manage"))) return NextResponse.json({ error: "Forbidden: roles.manage" }, { status: 403 });
  const body = await req.json();
  const name = body.name !== undefined ? String(body.name).trim() : undefined;
  const description = body.description !== undefined ? String(body.description).trim() || null : undefined;
  const keys: string[] | undefined = Array.isArray(body.permissionKeys) ? body.permissionKeys : undefined;
  if (keys) for (const k of keys) if (!isValidKey(k)) return NextResponse.json({ error: `Invalid key: ${k}` }, { status: 400 });

  const isOwner = !!(session.user as any)?.isOwner;
  if (keys && !isOwner) {
    const myPerms = new Set(await getUserPermissions(session));
    for (const k of keys) if (!myPerms.has(k)) return NextResponse.json({ error: `Cannot grant permission you don't hold: ${k}` }, { status: 403 });
  }

  const prisma: any = await getTenantClientFromSession();
  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.isSystem) return NextResponse.json({ error: "System role cannot be edited" }, { status: 403 });
  if (name && name !== existing.name) {
    const dup = await prisma.role.findUnique({ where: { name } });
    if (dup) return NextResponse.json({ error: "Role name already exists" }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const tenantId = (session.user as any).tenantId;
  const oldPerms = (await prisma.rolePermission.findMany({ where: { roleId: id } })).map((p: any) => p.permissionKey);

  const updated = await prisma.$transaction(async (tx: any) => {
    const r = await tx.role.update({ where: { id }, data: { ...(name !== undefined ? { name } : {}), ...(description !== undefined ? { description } : {}) } });
    if (keys !== undefined) {
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
      for (const k of keys) await tx.rolePermission.create({ data: { roleId: id, permissionKey: k } });
    }
    await writeAudit(tx, "roles", id, "UPDATE", userId, { name: existing.name, description: existing.description, keys: oldPerms }, { name: name ?? existing.name, description: description ?? existing.description, keys: keys ?? oldPerms });
    if (keys !== undefined) await writeAudit(tx, "role_permissions", id, "UPDATE", userId, { keys: oldPerms }, { keys });
    return r;
  });
  invalidateTenantCache(tenantId);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "roles.manage"))) return NextResponse.json({ error: "Forbidden: roles.manage" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.isSystem) return NextResponse.json({ error: "System role cannot be deleted" }, { status: 403 });
  const assigned = await prisma.userRole.count({ where: { roleId: id } });
  if (assigned > 0) return NextResponse.json({ error: `Role is assigned to ${assigned} user(s). Reassign them first.` }, { status: 400 });
  const userId = (session.user as any).id;
  const tenantId = (session.user as any).tenantId;
  await prisma.$transaction(async (tx: any) => {
    await tx.rolePermission.deleteMany({ where: { roleId: id } });
    await tx.role.delete({ where: { id } });
    await writeAudit(tx, "roles", id, "DELETE", userId, existing, null);
  });
  invalidateTenantCache(tenantId);
  return NextResponse.json({ ok: true });
}
