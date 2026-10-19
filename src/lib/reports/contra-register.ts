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
  const where: any = { action: { in: ["PENDING", "APPROVED", "REJECTED"] } };
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }
  const rows = await prisma.treasuryTransferRequest.findMany({ where, orderBy: [{ createdAt: "desc" }] });
  const accounts: any[] = await prisma.bankAccount.findMany();
  const accMap = new Map(accounts.map((a: any) => [a.id, a]));

  const data = rows.map((r: any) => ({
    date: r.createdAt,
    from: r.fromType === "CASH" ? "Cash" : accMap.get(r.bankAccountId)?.bankName ?? r.fromType,
    to: r.toType === "CASH" ? "Cash" : accMap.get(r.bankAccountId)?.bankName ?? r.toType,
    amount: toNum(r.amount),
    purpose: r.purpose,
    status: r.status,
  }));

  return {
    columns: contraColumns,
    rows: data,
    totals: { amount: data.reduce((s: number, r: any) => s + r.amount, 0) },
  };
}
