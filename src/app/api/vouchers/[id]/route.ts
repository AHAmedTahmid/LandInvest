import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { writeAudit } from "@/lib/tenantRules";
import { storage } from "@/lib/storage";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(session, "expenses.view"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const prisma: any = await getTenantClientFromSession();
  const voucher = await prisma.projectExpense.findUnique({
    where: { id },
    include: {
      project: true,
      bankAccount: true,
      paidByPartner: true,
    },
  });

  if (!voucher) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  return NextResponse.json({ voucher });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const canEdit = (await can(session, "expenses.create")) || (await can(session, "expenses.approve"));
  if (!canEdit) return NextResponse.json({ error: "Forbidden: expenses.create or expenses.approve required." }, { status: 403 });

  const userId = (session.user as any).id;
  const prisma: any = await getTenantClientFromSession();

  const existing = await prisma.projectExpense.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });

  let category: string | undefined;
  let amount: number | undefined;
  let projectId: string | null | undefined;
  let paymentChannel: string | undefined;
  let bankAccountId: string | null | undefined;
  let paidByPartnerId: string | null | undefined;
  let description: string | null | undefined;
  let expenseDate: Date | undefined;
  let voucherUrl: string | null | undefined;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    if (form.has("category")) category = (form.get("category") as string)?.trim();
    if (form.has("amount")) {
      const a = parseFloat(form.get("amount") as string);
      if (!isNaN(a) && a > 0) amount = a;
    }
    if (form.has("project_id")) {
      const p = form.get("project_id") as string;
      projectId = p && p !== "" ? p : null;
    }
    if (form.has("payment_channel")) paymentChannel = form.get("payment_channel") as string;
    if (form.has("bank_account")) {
      const b = form.get("bank_account") as string;
      bankAccountId = b && b !== "" ? b : null;
    }
    if (form.has("paid_by_partner")) {
      const pt = form.get("paid_by_partner") as string;
      paidByPartnerId = pt && pt !== "" ? pt : null;
    }
    if (form.has("description")) description = (form.get("description") as string)?.trim() || null;
    if (form.has("date")) {
      const d = form.get("date") as string;
      if (d) expenseDate = new Date(d);
    }
    const file = form.get("voucher") as File | null;
    if (file && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      voucherUrl = await storage.save(`vouchers/${randomUUID()}-${file.name}`, buf);
    }
  } else {
    const body = await req.json();
    if (body.category !== undefined) category = String(body.category).trim();
    if (body.amount !== undefined) {
      const a = Number(body.amount);
      if (!isNaN(a) && a > 0) amount = a;
    }
    if (body.projectId !== undefined) projectId = body.projectId ? String(body.projectId) : null;
    if (body.paymentChannel !== undefined) paymentChannel = String(body.paymentChannel);
    if (body.bankAccountId !== undefined) bankAccountId = body.bankAccountId ? String(body.bankAccountId) : null;
    if (body.paidByPartnerId !== undefined) paidByPartnerId = body.paidByPartnerId ? String(body.paidByPartnerId) : null;
    if (body.description !== undefined) description = body.description ? String(body.description).trim() : null;
    if (body.date !== undefined) expenseDate = new Date(body.date);
    if (body.voucherImageUrl !== undefined) voucherUrl = body.voucherImageUrl;
  }

  // Business logic: if voucher is already APPROVED, do not allow changing financial amounts or channel directly
  if (existing.status === "APPROVED") {
    if (amount !== undefined && amount !== Number(existing.amount)) {
      return NextResponse.json({ error: "Cannot change the amount of an already APPROVED voucher. Please reject/cancel or create an adjustment." }, { status: 400 });
    }
    if (paymentChannel !== undefined && paymentChannel !== existing.paymentChannel) {
      return NextResponse.json({ error: "Cannot change payment channel of an already APPROVED voucher." }, { status: 400 });
    }
  }

  const updateData: any = {};
  if (category !== undefined) updateData.expenseCategory = category;
  if (amount !== undefined) updateData.amount = amount;
  if (projectId !== undefined) updateData.projectId = projectId;
  if (paymentChannel !== undefined) {
    updateData.paymentChannel = paymentChannel;
    updateData.bankAccountId = paymentChannel === "BANK" ? bankAccountId : null;
    updateData.paidByPartnerId = paymentChannel === "PAID_BY_PARTNER" ? paidByPartnerId : null;
  } else {
    if (bankAccountId !== undefined) updateData.bankAccountId = bankAccountId;
    if (paidByPartnerId !== undefined) updateData.paidByPartnerId = paidByPartnerId;
  }
  if (description !== undefined) updateData.description = description;
  if (expenseDate !== undefined) updateData.expenseDate = expenseDate;
  if (voucherUrl !== undefined) updateData.voucherImageUrl = voucherUrl;

  const result = await prisma.$transaction(async (tx: any) => {
    const updated = await tx.projectExpense.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        bankAccount: true,
        paidByPartner: true,
      },
    });

    await writeAudit(tx, "project_expenses", id, "UPDATE", userId, existing, updated);
    return updated;
  });

  return NextResponse.json({ success: true, voucher: result });
}
