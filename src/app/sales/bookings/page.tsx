import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { toNum } from "@/lib/format";
import BookingsClient, { BookingsPageData } from "./BookingsClient";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-8 text-red-600">Unauthorized</div>;
  }
  if (!(await can(session, "sales.view"))) {
    return <div className="p-8 text-red-600">Forbidden: receiveSales</div>;
  }

  const canCreate = await can(session, "sales.create");
  const canCollect = await can(session, "sales.collect");
  const prisma: any = await getTenantClientFromSession();

  const [rawProjects, rawSales, rawBanks] = await Promise.all([
    prisma.landProject.findMany({
      orderBy: { projectName: "asc" },
      include: {
        projectPlots: {
          select: {
            id: true,
            plotNumber: true,
            askingPrice: true,
            plotSizeShotok: true,
            status: true,
          },
        },
      },
    }),
    prisma.landSale.findMany({
      orderBy: { saleDate: "desc" },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
            mouza: true,
            totalAreaShotok: true,
          },
        },
        plot: {
          select: {
            id: true,
            plotNumber: true,
            plotSizeShotok: true,
            askingPrice: true,
          },
        },
        customerPayments: {
          select: {
            id: true,
            amountPaid: true,
            paymentDate: true,
            receiptNo: true,
            paymentMethod: true,
          },
          orderBy: { paymentDate: "desc" },
        },
        installmentSchedules: {
          select: {
            id: true,
            dueDate: true,
            dueAmount: true,
            status: true,
          },
          orderBy: { dueDate: "asc" },
        },
      },
    }),
    prisma.bankAccount.findMany({
      where: { isActive: true },
      select: { id: true, bankName: true, accountNumber: true },
      orderBy: { bankName: "asc" },
    }),
  ]);

  const projects = rawProjects.map((p: any) => ({
    id: p.id,
    projectName: p.projectName,
    mouza: p.mouza || "",
    totalAreaShotok: toNum(p.totalAreaShotok),
    status: p.status,
    totalPlotsCount: p.projectPlots?.length || 0,
    plots: (p.projectPlots || []).map((pl: any) => ({
      id: pl.id,
      plotNumber: pl.plotNumber,
      plotSizeShotok: toNum(pl.plotSizeShotok),
      askingPrice: toNum(pl.askingPrice),
      status: pl.status,
    })),
  }));

  const bookings = rawSales.map((s: any) => ({
    id: s.id,
    projectId: s.projectId,
    projectName: s.project?.projectName || "Unassigned Project",
    mouza: s.project?.mouza || null,
    plotId: s.plotId || null,
    plotNumber: s.plot?.plotNumber || (s.plotId ? "Plot" : "Entire Project"),
    plotSizeShotok: s.plot ? toNum(s.plot.plotSizeShotok) : null,
    buyerName: s.buyerName,
    buyerPhone: s.buyerPhone,
    buyerNid: s.buyerNid || null,
    saleDate: s.saleDate ? new Date(s.saleDate).toISOString().split("T")[0] : "",
    totalAgreedPrice: toNum(s.totalAgreedPrice),
    advanceBookingAmount: toNum(s.advanceBookingAmount),
    currentDueAmount: toNum(s.currentDueAmount),
    status: s.status,
    paymentsCount: s.customerPayments?.length || 0,
    installmentsCount: s.installmentSchedules?.length || 0,
    latestReceiptNo: s.customerPayments?.[0]?.receiptNo || null,
    installmentSchedules: (s.installmentSchedules || []).map((ins: any) => ({
      id: ins.id,
      dueDate: ins.dueDate ? new Date(ins.dueDate).toISOString().split("T")[0] : "",
      dueAmount: toNum(ins.dueAmount),
      status: ins.status,
    })),
  }));

  const data: BookingsPageData = {
    projects,
    bookings,
    banks: rawBanks,
    canCreate,
    canCollect,
  };

  return <BookingsClient data={data} />;
}
