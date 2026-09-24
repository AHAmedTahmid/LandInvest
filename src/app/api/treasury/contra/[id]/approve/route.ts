import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { approveContra } from "@/lib/treasury";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  // Only super_admin / managing_partner may approve (same set as approveExpense)
  if (!can(role, "approveExpense")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  try {
    const res = await approveContra(prisma, { requestId: id, approverId: (session.user as any).id, approverRole: role });
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
