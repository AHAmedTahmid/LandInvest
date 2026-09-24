import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { createContra, listContraRequests } from "@/lib/treasury";

async function sessionOr401() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await sessionOr401();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (!can(role, "bankTransfer")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { fromType, toType, bankAccountId, amount, purpose } = await req.json();
  const prisma: any = await getTenantClientFromSession();
  try {
    const res = await createContra(prisma, {
      fromType,
      toType,
      amount: Number(amount),
      bankAccountId: bankAccountId || null,
      purpose: purpose || "Contra",
      userId: (session.user as any).id,
      role,
    });
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function GET() {
  const session = await sessionOr401();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  if (!can(role, "bankTransfer") && !can(role, "approveExpense")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  return NextResponse.json(await listContraRequests(prisma));
}
