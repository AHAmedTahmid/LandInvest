import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getTenantClientFromSession } from "@/lib/tenant";
import { can } from "@/lib/rbac";
import { computePnl } from "@/lib/pnl";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!can((session.user as any).role, "viewDashboard")) return new Response("Forbidden", { status: 403 });
  const prisma: any = await getTenantClientFromSession();
  const pnl = await computePnl(prisma);
  let csv = "Project,Revenue,Land Cost,Expenses,Total Cost,Net Profit\n";
  for (const r of pnl) {
    csv += `"${r.projectName}",${r.revenue},${r.landCost},${r.expCost},${r.totalCost},${r.netProfit}\n`;
  }
  return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=pnl.csv" } });
}
