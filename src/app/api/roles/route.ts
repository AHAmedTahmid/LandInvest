import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can, invalidateTenantCache, getUserPermissions } from "@/lib/rbac";
import { ALL_KEYS, isValidKey, PERMISSIONS } from "@/lib/permissions";
import { getTenantClientFromSession } from "@/lib/tenant";
import { writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "roles.manage"))) return NextResponse.json({ error: "Forbidden: roles.manage" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const roles = await prisma.role.findMany({ orderBy: { createdAt: "asc" } });
  const withCounts = await Promise.all(roles.map(async (r: any) => {
    const permCount = r.isSystem ? ALL_KEYS.length : await prisma.rolePermission.count({ where: { roleId: r.id } });
    const userCount = await prisma.userRole.count({ where: { roleId: r.id } });
    const perms = r.isSystem ? ALL_KEYS : (await prisma.rolePermission.findMany({ where: { roleId: r.id } })).map((p: any) => p.permissionKey);
    return { ...r, permCount, userCount, permissions: perms };
  }));
  return NextResponse.json(withCounts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "roles.manage"))) return NextResponse.json({ error: "Forbidden: roles.manage" }, { status: 403 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim() || null;
  const keys: string[] = Array.isArray(body.permissionKeys) ? body.permissionKeys : [];
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  for (const k of keys) if (!isValidKey(k)) return NextResponse.json({ error: `Invalid permission key: ${k}` }, { status: 400 });

  // safety: cannot grant permissions they don't hold (unless owner)
  const isOwner = !!(session.user as any)?.isOwner;
  if (!isOwner) {
    const myPerms = new Set(await getUserPermissions(session));
    for (const k of keys) if (!myPerms.has(k)) return NextResponse.json({ error: `Cannot grant permission you don't hold: ${k}` }, { status: 403 });
  }

  const prisma: any = await getTenantClientFromSession();
  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) return NextResponse.json({ error: "Role name already exists" }, { status: 400 });

  const id = randomUUID();
  const userId = (session.user as any).id;
  const tenantId = (session.user as any).tenantId;

  const role = await prisma.$transaction(async (tx: any) => {
    const r = await tx.role.create({ data: { id, name, description, isSystem: false, createdBy: userId } });
    for (const k of keys) await tx.rolePermission.create({ data: { roleId: id, permissionKey: k } });
    await writeAudit(tx, "roles", id, "CREATE", userId, null, { name, description, keys });
    return r;
  });
  invalidateTenantCache(tenantId);
  return NextResponse.json(role);
}
