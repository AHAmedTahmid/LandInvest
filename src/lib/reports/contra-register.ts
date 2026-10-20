import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const contraColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "from", labelEn: "From", labelBn: "থেকে" },
  { key: "to", labelEn: "To", labelBn: "প্রতি" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "purpose", labelEn: "Purpose", labelBn: "উদ্দেশ্য" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
];

export async function queryContraRegister(prisma: any, filters: ReportFilters): Promise<ReportData> {
  // Contra transfers are recorded as two treasury_ledger rows (OUT + IN) with referenceType CONTRA.
  const where: any = { referenceType: "CONTRA", flowType: "OUT" };
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const rows: any[] = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "desc" }] });
  const accounts: any[] = await prisma.bankAccount.findMany();
  const accMap = new Map(accounts.map((a: any) => [a.id, a]));
  const label = (type: string, id: string | null) => (type === "CASH" ? "Cash" : (id ? `${accMap.get(id)?.bankName ?? ""} ${accMap.get(id)?.accountNumber ?? ""}`.trim() : type));

  const data = rows.map((r: any) => ({
    date: r.txnDate,
    from: label(r.accountType, r.bankAccountId),
    to: label(r.accountType === "CASH" ? "BANK" : "CASH", r.bankAccountId),
    amount: toNum(r.amount),
    purpose: r.purpose,
    status: "APPROVED",
  }));

  return {
    columns: contraColumns,
    rows: data,
    totals: { amount: data.reduce((s: number, r: any) => s + r.amount, 0) },
  };
}
