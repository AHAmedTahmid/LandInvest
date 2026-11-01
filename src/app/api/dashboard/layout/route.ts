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
        await prisma.dashboardLayout.deleteMany({
          where: { scope: "USER", scopeId: userId },
        });
      } else if (scope === "ROLE") {
        const canManage = await can(session, "dashboard.layout.manage");
        if (!canManage) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        await prisma.dashboardLayout.deleteMany({
          where: { scope: "ROLE", scopeId },
        });
      }
      const updated = await getEffectiveLayout(prisma, session);
      return NextResponse.json({ success: true, ...updated });
    }

    // Save layout
    if (scope === "USER") {
      const canCustomize = await can(session, "dashboard.customize");
      if (!canCustomize) return NextResponse.json({ error: "Forbidden: customize permission required" }, { status: 403 });

      const targetId = userId;
      const existing = await prisma.dashboardLayout.findUnique({
        where: { scope_scopeId: { scope: "USER", scopeId: targetId } },
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
            scope: "USER",
            scopeId: targetId,
            layout,
            updatedBy: userId,
          },
        });
      }
    } else if (scope === "ROLE") {
      const canManage = await can(session, "dashboard.layout.manage");
      if (!canManage) return NextResponse.json({ error: "Forbidden: layout.manage permission required" }, { status: 403 });

      const existing = await prisma.dashboardLayout.findUnique({
        where: { scope_scopeId: { scope: "ROLE", scopeId } },
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
            scope: "ROLE",
            scopeId,
            layout,
            updatedBy: userId,
          },
        });
      }
    }

    const effective = await getEffectiveLayout(prisma, session);
    return NextResponse.json({ success: true, ...effective });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
