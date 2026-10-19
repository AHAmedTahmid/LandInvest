import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const contributionColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "partner", labelEn: "Partner", labelBn: "অংশীদার" },
  { key: "cashDeposit", labelEn: "Cash Deposit", labelBn: "নগদ জমা", type: "number", align: "right" },
  { key: "directExpense", labelEn: "Direct Expense", labelBn: "সরাসরি ব্যয়", type: "number", align: "right" },
  { key: "totalContribution", labelEn: "Total Contribution", labelBn: "মোট অবদান", type: "number", align: "right" },
  { key: "sharePct", labelEn: "Share %", labelBn: "শেয়ার %", type: "number", align: "right" },
  { key: "difference", labelEn: "Difference", labelBn: "পার্থক্য", type: "number", align: "right" },
];

export async function queryPartnerContribution(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const projects = await prisma.landProject.findMany({ include: { projectPartners: { include: { partner: true } } } });
  const txns = await prisma.partnerTransaction.findMany();
  const expenses = await prisma.projectExpense.findMany({ where: { status: "APPROVED" } });

  const data: any[] = [];
  for (const proj of projects) {
    if (filters.projectId && proj.id !== filters.projectId) continue;
    for (const pp of proj.projectPartners) {
      const partnerTxns = txns.filter((t: any) => t.partnerId === pp.partnerId);
      const cashDeposit = partnerTxns.filter((t: any) => t.txnType === "DEPOSIT").reduce((s: number, t: any) => s + toNum(t.amount), 0);
      const directExpense = expenses.filter((e: any) => e.paidByPartnerId === pp.partnerId && e.projectId === proj.id).reduce((s: number, e: any) => s + toNum(e.amount), 0);
      const totalContribution = cashDeposit + directExpense;
      const sharePct = toNum(pp.sharePercentage);
      const expected = totalContribution * 100 / sharePct;
      const difference = totalContribution - expected;
      data.push({ project: proj.projectName, partner: pp.partner.name, cashDeposit, directExpense, totalContribution, sharePct, difference });
    }
  }

  return { columns: contributionColumns, rows: data };
}
