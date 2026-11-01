import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { getEffectiveLayout } from "@/lib/dashboard/layout";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hasDashboardView = await can(session, "dashboard.view");
    if (!hasDashboardView) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const prisma: any = await getTenantClientFromSession();
    const result = await getEffectiveLayout(prisma, session);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, scope, scopeId, layout } = body;
    const prisma: any = await getTenantClientFromSession();

    const userId = (session.user as any)?.id || (session.user as any)?.userId;

    if (action === "reset") {
      // Reset personal layout to role default
      if (scope === "USER") {
        if (prisma.dashboardLayout) {
          await prisma.dashboardLayout.deleteMany({
            where: { scope: "USER", scopeId: userId },
          });
        } else {
          await prisma.$executeRawUnsafe(
            "DELETE FROM dashboard_layouts WHERE scope = 'USER' AND scope_id = ?",
            userId
          );
        }
      } else if (scope === "ROLE") {
        const canManage = await can(session, "dashboard.layout.manage");
        if (!canManage) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        if (prisma.dashboardLayout) {
          await prisma.dashboardLayout.deleteMany({
            where: { scope: "ROLE", scopeId },
          });
        } else {
          await prisma.$executeRawUnsafe(
            "DELETE FROM dashboard_layouts WHERE scope = 'ROLE' AND scope_id = ?",
            scopeId
          );
        }
      }
      const updated = await getEffectiveLayout(prisma, session);
      return NextResponse.json({ success: true, ...updated });
    }

    // Save layout
    const targetScope = scope === "ROLE" ? "ROLE" : "USER";
    const targetId = scope === "ROLE" ? scopeId : userId;

    if (targetScope === "USER") {
      const canCustomize = await can(session, "dashboard.customize");
      if (!canCustomize) return NextResponse.json({ error: "Forbidden: customize permission required" }, { status: 403 });
    } else {
      const canManage = await can(session, "dashboard.layout.manage");
      if (!canManage) return NextResponse.json({ error: "Forbidden: layout.manage permission required" }, { status: 403 });
    }

    if (prisma.dashboardLayout) {
      const existing = await prisma.dashboardLayout.findUnique({
        where: { scope_scopeId: { scope: targetScope, scopeId: targetId } },
      });
      if (existing) {
        await prisma.dashboardLayout.update({
          where: { id: existing.id },
          data: { layout, updatedBy: userId },
        });
      } else {
        await prisma.dashboardLayout.create({
          data: {
            id: randomUUID(),
            scope: targetScope,
            scopeId: targetId,
            layout,
            updatedBy: userId,
          },
        });
      }
    } else {
      const layoutJson = typeof layout === "string" ? layout : JSON.stringify(layout);
      const newId = randomUUID();
      await prisma.$executeRawUnsafe(
        `INSERT INTO dashboard_layouts (id, scope, scope_id, layout, updated_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE layout = VALUES(layout), updated_by = VALUES(updated_by)`,
        newId,
        targetScope,
        targetId,
        layoutJson,
        userId
      );
    }

    const effective = await getEffectiveLayout(prisma, session);
    return NextResponse.json({ success: true, ...effective });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
