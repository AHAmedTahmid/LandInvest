import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { isPaidByPartner, writeAudit } from "@/lib/tenantRules";
import { storage } from "@/lib/storage";
import { randomUUID } from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "expenses.view"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const list = await prisma.projectExpense.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "expenses.create"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const form = await req.formData();
    const project_id = ((form.get("project_id") ?? form.get("projectId")) as string) || null;
    const category = ((form.get("category") ?? form.get("expenseCategory")) as string)?.trim();
    const amount = parseFloat(form.get("amount") as string);
    const payment_channel = ((form.get("payment_channel") ?? form.get("paymentChannel")) as string)?.trim();
    const bank_account = ((form.get("bank_account") ?? form.get("bankAccountId")) as string) || null;
    const paid_by_partner = ((form.get("paid_by_partner") ?? form.get("paidByPartnerId")) as string) || null;
    const desc = (form.get("description") as string) || null;
    const expenseDateRaw = (form.get("expenseDate") ?? form.get("expense_date")) as string | null;
    const expenseDate = expenseDateRaw ? new Date(expenseDateRaw) : new Date();
    const file = form.get("voucher") as File | null;

    if (!category) return NextResponse.json({ error: "Expense category is required" }, { status: 400 });
    if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "Valid positive amount is required" }, { status: 400 });
    if (!payment_channel) return NextResponse.json({ error: "Payment channel is required" }, { status: 400 });
    if (payment_channel === "BANK" && !bank_account) {
      return NextResponse.json({ error: "Bank account is required for BANK channel" }, { status: 400 });
    }
    if (isPaidByPartner(payment_channel) && !paid_by_partner) {
      return NextResponse.json({ error: "Partner is required for PAID_BY_PARTNER channel" }, { status: 400 });
    }

    let voucherUrl: string | null = null;
    if (file && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      voucherUrl = await storage.save(`vouchers/${randomUUID()}-${file.name}`, buf);
    }

    const id = randomUUID();
    const userId = (session.user as any).id;
    const prisma: any = await getTenantClientFromSession();
    const expense = await prisma.$transaction(async (tx: any) => {
      const e = await tx.projectExpense.create({
        data: {
          id,
          projectId: project_id || null,
          expenseCategory: category,
          amount,
          expenseDate,
          description: desc,
          paymentChannel: payment_channel,
          bankAccountId: payment_channel === "BANK" ? bank_account : null,
          paidByPartnerId: isPaidByPartner(payment_channel) ? paid_by_partner : null,
          voucherImageUrl: voucherUrl,
          status: "PENDING",
          createdBy: userId,
        },
      });
      await writeAudit(tx, "project_expenses", id, "CREATE", userId, null, e);
      return e;
    });
    return NextResponse.json(expense);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create expense" }, { status: 400 });
  }
}
