import { randomUUID } from "crypto";
import { toNum } from "@/lib/format";
import { writeAudit } from "@/lib/tenantRules";

export type PnlRow = {
  projectId: string;
  projectName: string;
  revenue: number;
  landCost: number;
  expCost: number;
  totalCost: number;
  netProfit: number;
  partners: any[];
};

/** Single source of truth for project PnL. */
export async function computePnl(prisma: any): Promise<PnlRow[]> {
  const projects = await prisma.landProject.findMany({ include: { projectPartners: { include: { partner: true } } } });
  const expenses = await prisma.projectExpense.findMany({ where: { status: "APPROVED" } });
  const sales = await prisma.landSale.findMany();
  const payments = await prisma.customerPayment.findMany();

  const saleByProject = new Map<string, string[]>();
  for (const s of sales) {
    const a = saleByProject.get(s.projectId) ?? [];
    a.push(s.id);
    saleByProject.set(s.projectId, a);
  }
  const payBySale = new Map<string, number>();
  for (const p of payments) payBySale.set(p.saleId, (payBySale.get(p.saleId) ?? 0) + toNum(p.amountPaid));

  return projects.map((pr: any) => {
    const sIds = saleByProject.get(pr.id) ?? [];
    const revenue = sIds.reduce((s: number, id: string) => s + (payBySale.get(id) ?? 0), 0);
    const landCost = toNum(pr.purchasePrice) + toNum(pr.registrationCost) + toNum(pr.mutationTaxCost);
    const expCost = expenses.filter((e: any) => e.projectId === pr.id).reduce((s: number, e: any) => s + toNum(e.amount), 0);
    return {
      projectId: pr.id,
      projectName: pr.projectName,
      revenue,
      landCost,
      expCost,
      totalCost: landCost + expCost,
      netProfit: revenue - landCost - expCost,
      partners: pr.projectPartners,
    };
  });
}

const VALID_BASIS = ["CASH_BASIS", "COMPLETION_BASIS"] as const;
export type Basis = (typeof VALID_BASIS)[number];

/**
 * Distribute a project's net profit across partners by share_percentage.
 * Writes profit_distributions + partner_transactions(PROFIT_CREDIT) + audit_log atomically.
 * Guards against double-distribution for the same project.
 */
export async function distributeProject(
  prisma: any,
  args: { projectId: string; basis: string; userId: string; netProfit?: number }
) {
  const basis: Basis = args.basis === "COMPLETION_BASIS" ? "COMPLETION_BASIS" : "CASH_BASIS";
  const pnl = await computePnl(prisma);
  const row = pnl.find((r) => r.projectId === args.projectId);
  if (!row) throw new Error("Project not found");
  const netProfit = args.netProfit ?? row.netProfit;
  if (netProfit <= 0) throw new Error("No profit to distribute");

  const partners = await prisma.projectPartner.findMany({ where: { projectId: args.projectId } });
  if (partners.length === 0) throw new Error("No partners allocated to this project");

  const shareSum = partners.reduce((s: number, p: any) => s + toNum(p.sharePercentage), 0);
  if (shareSum > 100.01) throw new Error(`Partner shares total ${shareSum}% exceeds 100%`);

  const existing = await prisma.profitDistribution.count({ where: { projectId: args.projectId } });
  if (existing > 0) throw new Error("Profit already distributed for this project");

  return prisma.$transaction(async (tx: any) => {
    const created: any[] = [];
    for (const p of partners) {
      const share = toNum(p.sharePercentage);
      const payout = Math.round(netProfit * share) / 100;
      const id = randomUUID();
      const d = await tx.profitDistribution.create({
        data: {
          id,
          projectId: args.projectId,
          distributionDate: new Date(),
          realizationBasis: basis,
          totalProjectNetProfit: netProfit,
          partnerId: p.partnerId,
          partnerSharePercent: share,
          payoutAmount: payout,
        },
      });
      await writeAudit(tx, "profit_distributions", id, "CREATE", args.userId, null, d);
      const pt = await tx.partnerTransaction.create({
        data: {
          id: randomUUID(),
          partnerId: p.partnerId,
          txnType: "PROFIT_CREDIT",
          amount: payout,
          txnDate: new Date(),
          referenceId: id,
          notes: `Profit ${row.projectName}`,
        },
      });
      created.push({ ...d, partnerTransaction: pt });
    }
    return created;
  });
}
