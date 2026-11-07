import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { sellPlot, writeAudit } from "@/lib/tenantRules";
import { randomUUID } from "crypto";

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(s, "sales.view"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  return NextResponse.json(await prisma.landSale.findMany({ orderBy: { saleDate: "desc" } }));
}

export async function POST(req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await can(s, "sales.create"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const userId = (s.user as any).id;
  const prisma: any = await getTenantClientFromSession();
  const saleId = randomUUID();
  const advance = Number(b.advance || 0);
  const totalPrice = Number(b.total_agreed_price || 0);
  if (advance > totalPrice) {
    return NextResponse.json(
      { error: `Advance payment cannot exceed total agreed price` },
      { status: 400 }
    );
  }
  const due = totalPrice - advance;

  // If multiple plots are given, take the first as the primary plotId reference
  const primaryPlotId =
    b.plot_id ||
    (Array.isArray(b.plot_ids) && b.plot_ids.length > 0 ? b.plot_ids[0] : null);

  const saleData = {
    id: saleId,
    projectId: b.project_id,
    plotId: b.is_whole_project ? null : primaryPlotId,
    buyerName: b.buyer_name,
    buyerPhone: b.buyer_phone,
    buyerNid: b.buyer_nid || null,
    saleDate: new Date(),
    totalAgreedPrice: b.total_agreed_price,
    advanceBookingAmount: b.advance || 0,
    currentDueAmount: due,
    status: "BOOKED",
  };

  const result = await prisma.$transaction(async (tx: any) => {
    let sale;

    if (b.is_whole_project) {
      // Entire project booking: reserve all available plots in this project
      const availPlots = await tx.projectPlot.findMany({
        where: { projectId: b.project_id, status: "AVAILABLE" },
      });
      for (const pl of availPlots) {
        await tx.projectPlot.update({ where: { id: pl.id }, data: { status: "BOOKED" } });
        await writeAudit(tx, "project_plots", pl.id, "UPDATE", userId, { status: "AVAILABLE" }, { status: "BOOKED" });
      }
      sale = await tx.landSale.create({ data: { ...saleData, plotId: null } });
      await writeAudit(tx, "land_sales", saleId, "CREATE", userId, null, sale);
    } else if (Array.isArray(b.plot_ids) && b.plot_ids.length > 0) {
      // Multi-plot booking
      for (const pid of b.plot_ids) {
        const plot = await tx.projectPlot.findUnique({ where: { id: pid } });
        if (plot && plot.status === "AVAILABLE") {
          await tx.projectPlot.update({ where: { id: pid }, data: { status: "BOOKED" } });
          await writeAudit(tx, "project_plots", pid, "UPDATE", userId, { status: "AVAILABLE" }, { status: "BOOKED" });
        }
      }
      sale = await tx.landSale.create({ data: saleData });
      await writeAudit(tx, "land_sales", saleId, "CREATE", userId, null, sale);
    } else if (b.plot_id) {
      // Single plot booking / sale (default path)
      sale = await sellPlot(tx, b.plot_id, saleData, userId);
    } else {
      // Project-level or unassigned plot sale
      sale = await tx.landSale.create({ data: saleData });
      await writeAudit(tx, "land_sales", saleId, "CREATE", userId, null, saleData);
    }

    if (b.installments?.length) {
      for (const ins of b.installments) {
        const id = randomUUID();
        const r = await tx.installmentSchedule.create({
          data: { id, saleId, dueDate: new Date(ins.dueDate), dueAmount: ins.dueAmount, status: "UPCOMING" },
        });
        await writeAudit(tx, "installment_schedule", id, "CREATE", userId, null, r);
      }
    } else if (b.installments_count && parseInt(b.installments_count, 10) > 0) {
      const months = parseInt(b.installments_count, 10);
      const remaining = Number(b.total_agreed_price) - Number(b.advance || 0);
      const per = Math.round((remaining / months) * 100) / 100;
      for (let i = 1; i <= months; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        const rid = randomUUID();
        const r = await tx.installmentSchedule.create({
          data: { id: rid, saleId, dueDate, dueAmount: per, status: "UPCOMING" },
        });
        await writeAudit(tx, "installment_schedule", rid, "CREATE", userId, null, r);
      }
    }

    if (Number(b.advance) > 0) {
      const payId = randomUUID();
      const cp = await tx.customerPayment.create({
        data: {
          id: payId,
          saleId,
          paymentDate: new Date(),
          amountPaid: b.advance,
          paymentMethod: b.payment_method || "CASH",
          bankAccountId: b.bank_account || null,
          receiptNo: `R-${Date.now()}`,
          remarks: b.is_whole_project ? "Whole Project Advance" : "Advance / Booking Token",
        },
      });
      await writeAudit(tx, "customer_payments", payId, "CREATE", userId, null, cp);

      const tl = await tx.treasuryLedger.create({
        data: {
          id: randomUUID(),
          txnDate: new Date(),
          accountType: b.bank_account ? "BANK" : "CASH",
          bankAccountId: b.bank_account || null,
          flowType: "IN",
          amount: b.advance,
          purpose: `Plot Booking Advance: ${b.buyer_name || "Buyer"}`,
          referenceType: "SALE_PAYMENT",
          referenceId: saleId,
          createdBy: userId,
        },
      });
      await writeAudit(tx, "treasury_ledger", tl.id, "CREATE", userId, null, tl);
    }

    return sale;
  });

  return NextResponse.json(result);
}
