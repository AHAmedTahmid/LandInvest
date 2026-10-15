import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { getTenantClient } from "@/lib/tenant";
import { can, getUserPermissions, invalidateTenantCache } from "@/lib/rbac";
import { writeAudit } from "@/lib/tenantRules";

async function isAdminUser(tenant: any, userId: string): Promise<boolean> {
  const tPrisma: any = getTenantClient(tenant);
  const ur: any = await tPrisma.userRole.findUnique({ where: { userId } });
  if (!ur) return false;
  const perms: any[] = await tPrisma.rolePermission.findMany({ where: { roleId: ur.roleId } });
  const keys = new Set(perms.map((p: any) => p.permissionKey));
  // Owner is admin by definition
  const gu: any = await (controlPrisma as any).globalUser.findUnique({ where: { id: userId } });
  if (gu?.isOwner) return true;
  const role: any = await tPrisma.role.findUnique({ where: { id: ur.roleId } });
  if (role?.isSystem) return true;
  return keys.has("users.manage") || keys.has("roles.manage");
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: targetId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.manage"))) return NextResponse.json({ error: "Forbidden: users.manage" }, { status: 403 });
  const body = await req.json();
  const tenantId = (session.user as any).tenantId;
  const actorId = (session.user as any).id;
  const isOwnerActor = !!(session.user as any).isOwner;
  const tenant: any = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  const target: any = await (controlPrisma as any).globalUser.findUnique({ where: { id: targetId } });
  if (!target || String(target.tenantId) !== String(tenantId)) return NextResponse.json({ error: "User not found in this tenant" }, { status: 404 });

  // safety: owner cannot be deactivated/modified
  if (target.isOwner) return NextResponse.json({ error: "Owner account cannot be changed" }, { status: 403 });
  // cannot self-deactivate or self-delete via this route (isActive false)
  if (String(targetId) === String(actorId) && body.isActive === false) return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 403 });

  const tPrisma: any = getTenantClient(tenant);

  // role change
  if (body.roleId !== undefined) {
    const newRoleId = String(body.roleId);
    const role: any = await tPrisma.role.findUnique({ where: { id: newRoleId } });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 400 });
    if (role.isSystem && !isOwnerActor) return NextResponse.json({ error: "Only owner can assign Owner role" }, { status: 403 });
    // privilege escalation: must hold all perms of target role
    if (!isOwnerActor) {
      const myPerms = new Set(await getUserPermissions(session));
      const rolePerms: any[] = await tPrisma.rolePermission.findMany({ where: { roleId: newRoleId } });
      // if target is Owner (system), already blocked above
      for (const p of rolePerms) if (!myPerms.has(p.permissionKey)) return NextResponse.json({ error: `Cannot assign role with permission you don't hold: ${p.permissionKey}` }, { status: 403 });
    }
    // cannot remove own last admin
    if (String(targetId) === String(actorId)) {
      const willBeAdmin = await (async () => {
        if (role.isSystem) return true;
        const perms: any[] = await tPrisma.rolePermission.findMany({ where: { roleId: newRoleId } });
        const keys = new Set(perms.map((p: any) => p.permissionKey));
        return keys.has("users.manage") || keys.has("roles.manage");
      })();
      if (!willBeAdmin) {
        // check if another admin exists
        const allUsers: any[] = await (controlPrisma as any).globalUser.findMany({ where: { tenantId, isActive: true } });
        let otherAdmin = false;
        for (const u of allUsers) {
          if (String(u.id) === String(actorId)) continue;
          if (await isAdminUser(tenant, u.id)) { otherAdmin = true; break; }
        }
        if (!otherAdmin) return NextResponse.json({ error: "Cannot remove your last administrative access" }, { status: 403 });
      }
    }
    const old = await tPrisma.userRole.findUnique({ where: { userId: targetId } });
    await tPrisma.userRole.upsert({
      where: { userId: targetId },
      update: { roleId: newRoleId, assignedBy: actorId },
      create: { userId: targetId, roleId: newRoleId, assignedBy: actorId },
    });
    try { await writeAudit(tPrisma, "user_roles", targetId, "UPDATE", actorId, old, { roleId: newRoleId }); } catch {}
    invalidateTenantCache(tenantId);
  }

  // isActive toggle
  if (body.isActive !== undefined) {
    const newActive = !!body.isActive;
    if (!newActive && String(targetId) === String(actorId)) return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 403 });
    if (target.isOwner && !newActive) return NextResponse.json({ error: "Owner cannot be deactivated" }, { status: 403 });
    const oldActive = !!target.isActive;
    await (controlPrisma as any).globalUser.update({ where: { id: targetId }, data: { isActive: newActive } });
    try { await writeAudit(tPrisma, "global_users", targetId, "UPDATE", actorId, { isActive: oldActive }, { isActive: newActive }); } catch {}
    invalidateTenantCache(tenantId);
  }

  // fullName update (optional)
  if (body.fullName !== undefined) {
    await (controlPrisma as any).globalUser.update({ where: { id: targetId }, data: { fullName: String(body.fullName).trim() } });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: targetId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.manage"))) return NextResponse.json({ error: "Forbidden: users.manage" }, { status: 403 });
  const tenantId = (session.user as any).tenantId;
  const actorId = (session.user as any).id;
  const target: any = await (controlPrisma as any).globalUser.findUnique({ where: { id: targetId } });
  if (!target || String(target.tenantId) !== String(tenantId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.isOwner) return NextResponse.json({ error: "Owner cannot be deleted" }, { status: 403 });
  if (String(targetId) === String(actorId)) return NextResponse.json({ error: "Cannot delete yourself" }, { status: 403 });
  const tenant: any = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  // prevent deleting last admin
  const willDeleteAdmin = await isAdminUser(tenant, targetId);
  if (willDeleteAdmin) {
    const allUsers: any[] = await (controlPrisma as any).globalUser.findMany({ where: { tenantId, isActive: true } });
    let otherAdmin = false;
    for (const u of allUsers) {
      if (String(u.id) === String(targetId)) continue;
      if (await isAdminUser(tenant, u.id)) { otherAdmin = true; break; }
    }
    if (!otherAdmin) return NextResponse.json({ error: "Cannot remove last admin" }, { status: 403 });
  }
  const tPrisma: any = getTenantClient(tenant);
  await tPrisma.userRole.deleteMany({ where: { userId: targetId } });
  await (controlPrisma as any).globalUser.delete({ where: { id: targetId } });
  try { await writeAudit(tPrisma, "global_users", targetId, "DELETE", actorId, target, null); } catch {}
  invalidateTenantCache(tenantId);
  return NextResponse.json({ ok: true });
}
