import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { toNum } from "@/lib/format";
import DuesClient, { DuesPageData } from "./DuesClient";

export default async function DuesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-8 text-red-600">Unauthorized</div>;
  }
  if (!(await can(session, "sales.view"))) {
    return <div className="p-8 text-red-600">Forbidden: receiveSales</div>;
  }

  const canCollect = await can(session, "sales.collect");
  const prisma: any = await getTenantClientFromSession();

  const [rawSales, rawBanks] = await Promise.all([
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
      },
    }),
  ]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const sales = rawSales.map((s: any) => {
    const totalAgreedPrice = toNum(s.totalAgreedPrice);
    const advanceBookingAmount = toNum(s.advanceBookingAmount);
    const currentDueAmount = toNum(s.currentDueAmount);
    const totalPaid = totalAgreedPrice - currentDueAmount;
    const paidPercent = totalAgreedPrice > 0 ? Math.min(100, Math.round((totalPaid / totalAgreedPrice) * 100)) : 0;

    const schedules = (s.installmentSchedules || []).map((inst: any) => {
      const dueDate = new Date(inst.dueDate);
      const isPast = dueDate < now && inst.status !== "PAID";
      return {
        id: inst.id,
        dueDate: dueDate.toISOString(),
        dueAmount: toNum(inst.dueAmount),
        status: isPast && inst.status === "UPCOMING" ? "OVERDUE" : inst.status,
      };
    });

    const overdueSchedules = schedules.filter((inst: any) => inst.status === "OVERDUE");
    const overdueAmount = overdueSchedules.reduce((sum: number, inst: any) => sum + inst.dueAmount, 0);

    const upcomingSchedules = schedules.filter((inst: any) => inst.status === "UPCOMING" || inst.status === "OVERDUE");
    const nextInstallment = upcomingSchedules[0] || null;

    const customerPayments = (s.customerPayments || []).map((p: any) => ({
      id: p.id,
      amountPaid: toNum(p.amountPaid),
      paymentDate: new Date(p.paymentDate).toISOString(),
      receiptNo: p.receiptNo || "-",
      paymentMethod: p.paymentMethod,
      remarks: p.remarks || null,
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
      overdueAmount,
      overdueCount: overdueSchedules.length,
      nextInstallment,
      totalInstallments: schedules.length,
      paidInstallmentsCount: schedules.filter((inst: any) => inst.status === "PAID").length,
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

  const totalOutstandingDue = sales.reduce((acc: number, s: any) => acc + s.currentDueAmount, 0);
  const totalAgreed = sales.reduce((acc: number, s: any) => acc + s.totalAgreedPrice, 0);
  const totalCollected = totalAgreed - totalOutstandingDue;
  const overdueRecords = sales.filter((s: any) => s.overdueAmount > 0);
  const totalOverdueAmount = overdueRecords.reduce((acc: number, s: any) => acc + s.overdueAmount, 0);
  const totalOverdueInstallments = overdueRecords.reduce((acc: number, s: any) => acc + s.overdueCount, 0);

  const dueThisMonth = sales.reduce((acc: number, s: any) => {
    const monthDue = s.schedules
      .filter((inst: any) => {
        if (inst.status === "PAID") return false;
        const d = new Date(inst.dueDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sub: number, inst: any) => sub + inst.dueAmount, 0);
    return acc + monthDue;
  }, 0);

  const data: DuesPageData = {
    sales,
    bankAccounts: rawBanks,
    canCollect,
    metrics: {
      totalOutstandingDue,
      totalAgreed,
      totalCollected,
      totalOverdueAmount,
      totalOverdueInstallments,
      dueThisMonth,
      activeDueAccountsCount: sales.filter((s: any) => s.currentDueAmount > 0).length,
      settledAccountsCount: sales.filter((s: any) => s.currentDueAmount <= 0).length,
    },
  };

  return <DuesClient data={data} />;
}
