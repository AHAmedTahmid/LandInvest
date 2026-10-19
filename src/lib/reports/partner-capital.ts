import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const capitalColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "type", labelEn: "Type", labelBn: "ধরন" },
  { key: "description", labelEn: "Description", labelBn: "বিবরণ" },
  { key: "deposit", labelEn: "Deposit", labelBn: "জমা", type: "number", align: "right" },
  { key: "withdrawal", labelEn: "Withdrawal", labelBn: "উত্তোলন", type: "number", align: "right" },
  { key: "balance", labelEn: "Running Balance", labelBn: "চলতি ব্যালেন্স", type: "number", align: "right" },
];

export async function queryPartnerCapital(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const partner = filters.partnerId
    ? await prisma.partner.findUnique({ where: { id: filters.partnerId } })
    : await prisma.partner.findFirst();
  if (!partner) return { columns: capitalColumns, rows: [], summary: [] };

  const where: any = { partnerId: partner.id };
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const txns = await prisma.partnerTransaction.findMany({ where, orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }] });

  let balance = toNum(partner.openingBalance);
  const opening = balance;
  const data = txns.map((t: any) => {
    const amt = toNum(t.amount);
    const isCredit = ["DEPOSIT", "DIRECT_EXPENSE", "PROFIT_CREDIT"].includes(t.txnType);
    balance += isCredit ? amt : -amt;
    return {
      date: t.txnDate,
      type: t.txnType,
      description: t.notes || t.txnType,
      deposit: isCredit ? amt : null,
      withdrawal: !isCredit ? amt : null,
      balance,
    };
  });

  const totalDeposit = data.reduce((s: number, r: any) => s + (r.deposit || 0), 0);
  const totalWithdrawal = data.reduce((s: number, r: any) => s + (r.withdrawal || 0), 0);

  return {
    columns: capitalColumns,
    rows: data,
    totals: { deposit: totalDeposit, withdrawal: totalWithdrawal, balance },
    summary: [
      { labelEn: "Partner", labelBn: "অংশীদার", value: partner.name },
      { labelEn: "Opening Balance", labelBn: "প্রারম্ভিক ব্যালেন্স", value: fmt(opening) },
      { labelEn: "Closing Balance", labelBn: "সমাপনী ব্যালেন্স", value: fmt(balance) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
