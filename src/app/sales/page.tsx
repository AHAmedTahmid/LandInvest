import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { toNum } from "@/lib/format";
import SalesDirectoryClient, { SalesDirectoryData } from "./SalesDirectoryClient";

export default async function SalesPage() {
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
      orderBy: { createdAt: "desc" },
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
            remarks: true,
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
      orderBy: { bankName: "asc" },
      select: {
        id: true,
        bankName: true,
        accountNumber: true,
        branchName: true,
        accountType: true,
        currentBalance: true,
      },
    }),
  ]);

  const projects = rawProjects.map((p: any) => ({
    id: p.id,
    projectName: p.projectName,
    mouza: p.mouza,
    totalPlotsCount: p.projectPlots?.length || 0,
    plots: (p.projectPlots || [])
      .filter((pl: any) => pl.status === "AVAILABLE")
      .map((pl: any) => ({
        id: pl.id,
        plotNumber: pl.plotNumber,
        askingPrice: toNum(pl.askingPrice),
        plotSizeShotok: toNum(pl.plotSizeShotok),
        status: pl.status,
      })),
  }));

  const sales = rawSales.map((s: any) => {
    const totalAgreedPrice = toNum(s.totalAgreedPrice);
    const advanceBookingAmount = toNum(s.advanceBookingAmount);
    const currentDueAmount = toNum(s.currentDueAmount);
    const totalPaid = totalAgreedPrice - currentDueAmount;
    const paidPercent = totalAgreedPrice > 0 ? Math.min(100, Math.round((totalPaid / totalAgreedPrice) * 100)) : 100;

    const schedules = (s.installmentSchedules || []).map((inst: any) => ({
      id: inst.id,
      dueDate: new Date(inst.dueDate).toISOString(),
      dueAmount: toNum(inst.dueAmount),
      status: inst.status,
    }));

    const customerPayments = (s.customerPayments || []).map((cp: any) => ({
      id: cp.id,
      amountPaid: toNum(cp.amountPaid),
      paymentDate: new Date(cp.paymentDate).toISOString(),
      receiptNo: cp.receiptNo || "-",
      paymentMethod: cp.paymentMethod,
      remarks: cp.remarks || null,
    }));

    return {
      id: s.id,
      buyerName: s.buyerName,
      buyerPhone: s.buyerPhone,
      buyerNid: s.buyerNid || null,
      saleDate: new Date(s.saleDate).toISOString(),
      status: s.status,
      totalAgreedPrice,
      advanceBookingAmount,
      currentDueAmount,
      totalPaid,
      paidPercent,
      project: s.project
        ? {
            id: s.project.id,
            projectName: s.project.projectName,
            mouza: s.project.mouza || "",
            totalAreaShotok: toNum(s.project.totalAreaShotok),
          }
        : null,
      plot: s.plot
        ? {
            id: s.plot.id,
            plotNumber: s.plot.plotNumber,
            plotSizeShotok: toNum(s.plot.plotSizeShotok),
            askingPrice: toNum(s.plot.askingPrice),
          }
        : null,
      schedules,
      customerPayments,
    };
  });

  const totalGrossRevenue = sales.reduce((acc: number, s: any) => acc + s.totalAgreedPrice, 0);
  const totalOutstandingDues = sales.reduce((acc: number, s: any) => acc + s.currentDueAmount, 0);
  const totalRealizedRevenue = totalGrossRevenue - totalOutstandingDues;
  const fullySettledCount = sales.filter((s: any) => s.currentDueAmount <= 0).length;
  const partialCount = sales.filter((s: any) => s.status === "PARTIAL").length;
  const bookedCount = sales.filter((s: any) => s.status === "BOOKED").length;

  const banks = rawBanks.map((b: any) => ({
    id: b.id,
    bankName: b.bankName,
    accountNumber: b.accountNumber,
    branchName: b.branchName || null,
    accountType: b.accountType || "BANK",
    currentBalance: toNum(b.currentBalance),
  }));

  const data: SalesDirectoryData = {
    sales,
    projects,
    banks,
    canCreate,
    canCollect,
    metrics: {
      totalGrossRevenue,
      totalRealizedRevenue,
      totalOutstandingDues,
      totalSalesCount: sales.length,
      fullySettledCount,
      partialCount,
      bookedCount,
    },
  };

  return <SalesDirectoryClient data={data} />;
}
