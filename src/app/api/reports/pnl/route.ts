import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { computePnl } from "@/lib/pnl";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can((session.user as any).role, "viewDashboard")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const pnl = await computePnl(prisma);
  return NextResponse.json(pnl);
}
