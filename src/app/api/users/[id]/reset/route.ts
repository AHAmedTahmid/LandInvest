import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { controlPrisma } from "@/lib/control";
import { getTenantClient } from "@/lib/tenant";
import { can, invalidateTenantCache } from "@/lib/rbac";
import { writeAudit } from "@/lib/tenantRules";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: targetId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "users.manage"))) return NextResponse.json({ error: "Forbidden: users.manage" }, { status: 403 });
  const { newPassword } = await req.json();
  if (!newPassword || String(newPassword).length < 6) return NextResponse.json({ error: "Password too short" }, { status: 400 });
  const tenantId = (session.user as any).tenantId;
  const actorId = (session.user as any).id;
  const target: any = await (controlPrisma as any).globalUser.findUnique({ where: { id: targetId } });
  if (!target || String(target.tenantId) !== String(tenantId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.isOwner) return NextResponse.json({ error: "Cannot reset owner password this way" }, { status: 403 });
  const tenant: any = await (controlPrisma as any).tenant.findUnique({ where: { id: tenantId } });
  const tPrisma: any = getTenantClient(tenant);
  const hash = await bcrypt.hash(String(newPassword), 10);
  await (controlPrisma as any).globalUser.update({ where: { id: targetId }, data: { passwordHash: hash, mustChangePassword: true } });
  try { await writeAudit(tPrisma, "global_users", targetId, "UPDATE", actorId, { passwordReset: false }, { passwordReset: true }); } catch {}
  invalidateTenantCache(tenantId);
  return NextResponse.json({ ok: true });
}
