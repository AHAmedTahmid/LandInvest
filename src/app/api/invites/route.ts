import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { getTenantClient } from "@/lib/tenant";
import { can, getUserPermissions } from "@/lib/rbac";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.manage"))) return NextResponse.json({ error: "Forbidden: users.manage" }, { status: 403 });
  const { email, roleId } = await req.json();
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !roleId) return NextResponse.json({ error: "email and roleId required" }, { status: 400 });
  const tenantId = (session.user as any).tenantId;
  const userId = (session.user as any).id;
  const isOwner = !!(session.user as any).isOwner;

  const sub = await (controlPrisma as any).subscription.findFirst({ where: { tenantId, status: "active" }, include: { plan: true } });
  const maxUsers = sub?.plan?.maxUsers ?? 5;
  const currentCount = await (controlPrisma as any).globalUser.count({ where: { tenantId } });
  const pendingInvites = await (controlPrisma as any).userInvitation.count({ where: { tenantId, accepted: false } });
  if (currentCount + pendingInvites >= maxUsers) return NextResponse.json({ error: `User limit reached (${maxUsers}). Upgrade plan.` }, { status: 400 });

  const tenant = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  const tPrisma: any = getTenantClient(tenant);
  const role = await tPrisma.role.findUnique({ where: { id: roleId } });
  if (!role) return NextResponse.json({ error: "Role not found in this tenant" }, { status: 400 });

  if (!isOwner) {
    const myPerms = new Set(await getUserPermissions(session));
    const rolePerms = await tPrisma.rolePermission.findMany({ where: { roleId } });
    for (const p of rolePerms) if (!myPerms.has(p.permissionKey)) return NextResponse.json({ error: `Cannot assign role with permission you don't hold: ${p.permissionKey}` }, { status: 403 });
  }

  const existingUser = await (controlPrisma as any).globalUser.findUnique({ where: { email: cleanEmail } });
  if (existingUser) return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  const existingInvite = await (controlPrisma as any).userInvitation.findFirst({ where: { tenantId, email: cleanEmail, accepted: false } });
  if (existingInvite) return NextResponse.json({ error: "Invite already pending for this email" }, { status: 400 });

  const token = randomUUID();
  const invite = await (controlPrisma as any).userInvitation.create({ data: { tenantId, email: cleanEmail, roleId, inviteToken: token, expiresAt: new Date(Date.now() + 7 * 864e5) } });
  try {
    const { writeAudit } = await import("@/lib/tenantRules");
    await writeAudit(tPrisma, "user_invitations", invite.id, "CREATE", userId, null, { email: cleanEmail, roleId, token });
  } catch {}
  console.log(`[invite] ${cleanEmail} -> role ${role.name} token http://localhost:3000/invite/${token}`);
  return NextResponse.json({ ...invite, inviteLink: `http://localhost:3000/invite/${token}` });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.view"))) return NextResponse.json({ error: "Forbidden: users.view" }, { status: 403 });
  const tenantId = (session.user as any).tenantId;
  const list = await (controlPrisma as any).userInvitation.findMany({ where: { tenantId }, orderBy: { expiresAt: "desc" } });
  return NextResponse.json(list);
}
