import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { collectPayment } from "@/lib/collections";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: recordId } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can((s.user as any).role, "receiveSales")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { amount, payment_method, bank_account } = await req.json();
  const prisma: any = await getTenantClientFromSession();
  try {
    const res = await prisma.$transaction((tx: any) =>
      collectPayment(tx, {
        saleId: recordId,
        amount: Number(amount),
        paymentMethod: payment_method || "CASH",
        bankAccountId: bank_account || null,
        userId: (s.user as any).id,
      })
    );
    return NextResponse.json(res.payment);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
