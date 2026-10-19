import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const bankBookColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "purpose", labelEn: "Purpose", labelBn: "উদ্দেশ্য" },
  { key: "reference", labelEn: "Reference", labelBn: "রেফারেন্স" },
  { key: "in", labelEn: "Bank In", labelBn: "ব্যাংক আদায়", type: "number", align: "right" },
  { key: "out", labelEn: "Bank Out", labelBn: "ব্যাংক পরিশোধ", type: "number", align: "right" },
  { key: "balance", labelEn: "Running Balance", labelBn: "চলতি ব্যালেন্স", type: "number", align: "right" },
];

export async function queryBankBook(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = { accountType: "BANK" };
  if (filters.bankAccountId) where.bankAccountId = filters.bankAccountId;
  if (filters.from || filters.to) {
    where.txnDate = {};
    if (filters.from) where.txnDate.gte = new Date(filters.from);
    if (filters.to) where.txnDate.lte = new Date(filters.to);
  }
  const rows = await prisma.treasuryLedger.findMany({ where, orderBy: [{ txnDate: "asc" }, { createdAt: "asc" }] });
  const accounts = await prisma.bankAccount.findMany();
  const accMap = new Map(accounts.map((a: any) => [a.id, a]));

  let balance = 0;
  const data = rows.map((r: any) => {
    const amt = toNum(r.amount);
    const isIn = r.flowType === "IN";
    balance += isIn ? amt : -amt;
    return {
      date: r.txnDate,
      purpose: r.purpose,
      reference: r.referenceType,
      in: isIn ? amt : null,
      out: !isIn ? amt : null,
      balance,
    };
  });

  const totalIn = data.reduce((s: number, r: any) => s + (r.in || 0), 0);
  const totalOut = data.reduce((s: number, r: any) => s + (r.out || 0), 0);
  const acc: any = filters.bankAccountId ? accMap.get(filters.bankAccountId) : null;
  const accName = acc ? `${acc.bankName} — ${acc.accountNumber}` : "All accounts";
  const accBalance = acc ? toNum(acc.currentBalance) : accounts.reduce((s: number, a: any) => s + toNum(a.currentBalance), 0);

  return {
    columns: bankBookColumns,
    rows: data,
    totals: { in: totalIn, out: totalOut, balance },
    summary: [
      { labelEn: "Account", labelBn: "অ্যাকাউন্ট", value: accName },
      { labelEn: "Closing Balance (Ledger)", labelBn: "সমাপনী ব্যালেন্স (খাতা)", value: fmt(balance) },
      { labelEn: "Closing Balance (Account)", labelBn: "সমাপনী ব্যালেন্স (অ্যাকাউন্ট)", value: fmt(accBalance) },
    ],
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
