import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { getTenantClientFromSession } from "@/lib/tenant";
import { formatBDT, toNum } from "@/lib/format";
import Link from "next/link";
import SalesForm from "./SalesForm";

export default async function SalesPage() {
  const session = await getServerSession(authOptions);
  if (!(await can(session, "sales.view"))) return <div className="p-8 text-red-600">Forbidden: receiveSales</div>;
  const canCreate = await can(session, "sales.create");
  const prisma: any = await getTenantClientFromSession();

  const projects = await prisma.landProject.findMany({
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
  });

  const projectsData = projects.map((p: any) => ({
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

  const sales = await prisma.landSale.findMany({
    orderBy: { saleDate: "desc" },
    include: {
      project: { select: { projectName: true } },
      plot: { select: { plotNumber: true } },
    },
  });

  const banks = await prisma.bankAccount.findMany({
    where: { isActive: true },
    select: { id: true, bankName: true, accountNumber: true },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plot Sales & Bookings</h1>
          <p className="text-sm text-slate-500">Sell plots from acquired land projects. Selling a plot automatically reserves it and decreases available inventory for that land.</p>
        </div>
      </div>

      {canCreate && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">New Plot Sale</h2>
          <SalesForm projects={projectsData} banks={banks} />
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">All Sales ({sales.length})</h2>
        <table className="w-full text-sm bg-white rounded-xl shadow border">
          <thead>
            <tr className="border-b text-left text-slate-600 bg-slate-50">
              <th className="p-3">Buyer</th>
              <th>Project</th>
              <th>Plot</th>
              <th className="text-right">Total Price</th>
              <th className="text-right">Advance Paid</th>
              <th className="text-right">Due Amount</th>
              <th className="text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  No sales recorded yet. Select an available plot above to create a sale.
                </td>
              </tr>
            )}
            {sales.map((s: any) => (
              <tr key={s.id} className="border-b hover:bg-slate-50/50">
                <td className="p-3 font-medium text-slate-900">{s.buyerName}</td>
                <td className="text-slate-600">{s.project?.projectName || "-"}</td>
                <td className="font-semibold text-blue-700">{s.plot?.plotNumber || "Unassigned"}</td>
                <td className="text-right font-medium">{formatBDT(toNum(s.totalAgreedPrice))}</td>
                <td className="text-right text-emerald-600">{formatBDT(toNum(s.advanceBookingAmount))}</td>
                <td className="text-right text-rose-600 font-semibold">{formatBDT(toNum(s.currentDueAmount))}</td>
                <td className="text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      s.status === "PAID_IN_FULL"
                        ? "bg-emerald-100 text-emerald-800"
                        : s.status === "PARTIAL"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/sales/${s.id}`} className="text-blue-600 hover:underline font-medium text-xs">
                    View & Collections
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
