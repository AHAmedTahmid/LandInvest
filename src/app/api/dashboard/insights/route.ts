import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { evaluateDashboardInsights } from "@/lib/dashboard/insights";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const hasView = await can(session, "dashboard.view");
    if (!hasView) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const prisma: any = await getTenantClientFromSession();
    const insights = await evaluateDashboardInsights(prisma);

    return NextResponse.json({
      insights,
      count: insights.length,
      evaluatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
