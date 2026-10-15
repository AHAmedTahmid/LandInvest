import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { getTenantClient } from "@/lib/tenant";
import { can, getUserPermissions, invalidateTenantCache } from "@/lib/rbac";
import { writeAudit } from "@/lib/tenantRules";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.view"))) return NextResponse.json({ error: "Forbidden: users.view" }, { status: 403 });
  const tenantId = (session.user as any).tenantId;
  const tenant: any = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  const tPrisma: any = getTenantClient(tenant);
  const users: any[] = await (controlPrisma as any).globalUser.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
  const roles: any[] = await tPrisma.role.findMany();
  const userRoles: any[] = await tPrisma.userRole.findMany();
  const roleByUser = new Map(userRoles.map((ur: any) => [ur.userId, ur.roleId]));
  const roleById = new Map(roles.map((r: any) => [r.id, r]));
  const invites: any[] = await (controlPrisma as any).userInvitation.findMany({ where: { tenantId, accepted: false } });
  const data = users.map((u: any) => {
    const roleId = roleByUser.get(u.id);
    const role = roleId ? roleById.get(roleId) : null;
    return { id: u.id, email: u.email, fullName: u.fullName, isOwner: !!u.isOwner, isActive: !!u.isActive, mustChangePassword: !!u.mustChangePassword, lastLoginAt: u.lastLoginAt, createdAt: u.createdAt, roleId: roleId ?? null, roleName: role?.name ?? (u.isOwner ? "Owner" : "-"), status: u.isActive ? "active" : "inactive" };
  });
  // also include invited but not yet accepted as virtual users for UI
  const invited = invites.map((inv: any) => {
    const role = roleById.get(inv.roleId);
    return { id: inv.id, email: inv.email, fullName: "(invited)", isOwner: false, isActive: false, mustChangePassword: false, lastLoginAt: null, createdAt: inv.expiresAt, roleId: inv.roleId, roleName: role?.name ?? "-", status: "invited", inviteToken: inv.inviteToken, expiresAt: inv.expiresAt };
  });
  return NextResponse.json({ users: data, invited, roles });
}

// direct create (admin sets temp password, mustChangePassword true)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.manage"))) return NextResponse.json({ error: "Forbidden: users.manage" }, { status: 403 });
  const { email, fullName, password, roleId } = await req.json();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanName = String(fullName || "").trim() || cleanEmail;
  if (!cleanEmail || !password || !roleId) return NextResponse.json({ error: "email, password, roleId required" }, { status: 400 });
  if (String(password).length < 6) return NextResponse.json({ error: "Password too short" }, { status: 400 });
  const tenantId = (session.user as any).tenantId;
  const actorId = (session.user as any).id;
  const isOwner = !!(session.user as any).isOwner;

  const tenant: any = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  const tPrisma: any = getTenantClient(tenant);
  const role: any = await tPrisma.role.findUnique({ where: { id: roleId } });
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 400 });

  // max_users
  const sub: any = await (controlPrisma as any).subscription.findFirst({ where: { tenantId, status: "active" }, include: { plan: true } });
  const maxUsers = sub?.plan?.maxUsers ?? 5;
  const currentCount = await (controlPrisma as any).globalUser.count({ where: { tenantId } });
  if (currentCount >= maxUsers) return NextResponse.json({ error: `User limit reached (${maxUsers})` }, { status: 400 });

  // privilege escalation check
  if (!isOwner) {
    const myPerms = new Set(await getUserPermissions(session));
    const rolePerms: any[] = await tPrisma.rolePermission.findMany({ where: { roleId } });
    // Owner role is implicit all, so we check against my perms
    if (role.isSystem) {
      // Owner role has all perms, so requester must be owner (already checked)
      return NextResponse.json({ error: "Only owner can assign Owner role" }, { status: 403 });
    }
    for (const p of rolePerms) if (!myPerms.has(p.permissionKey)) return NextResponse.json({ error: `Cannot assign role with permission you don't hold: ${p.permissionKey}` }, { status: 403 });
  }

  const existing = await (controlPrisma as any).globalUser.findUnique({ where: { email: cleanEmail } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const hash = await bcrypt.hash(String(password), 10);
  const userId = randomUUID();
  const user = await (controlPrisma as any).globalUser.create({
    data: { id: userId, tenantId, email: cleanEmail, fullName: cleanName, passwordHash: hash, isOwner: false, isActive: true, mustChangePassword: true },
  });
  await tPrisma.userRole.create({ data: { userId, roleId, assignedBy: actorId } });
  try { await writeAudit(tPrisma, "user_roles", userId, "CREATE", actorId, null, { roleId, email: cleanEmail }); } catch {}
  try { await writeAudit(tPrisma, "global_users", userId, "CREATE", actorId, null, { email: cleanEmail, roleId }); } catch {}
  invalidateTenantCache(tenantId);
  return NextResponse.json({ id: userId, email: cleanEmail });
}
