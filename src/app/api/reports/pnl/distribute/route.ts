import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { distributeProject } from "@/lib/pnl";

export async function POST(req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can((s.user as any).role, "distributeProfits")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { projectId, basis } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  const prisma: any = await getTenantClientFromSession();
  try {
    const rows = await distributeProject(prisma, { projectId, basis: basis || "CASH_BASIS", userId: (s.user as any).id });
    return NextResponse.json({ distributed: rows.length, rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
