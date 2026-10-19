import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";

const summaryColumns: ReportColumn[] = [
  { key: "name", labelEn: "Partner", labelBn: "অংশীদার" },
  { key: "deposited", labelEn: "Total Deposited", labelBn: "মোট জমা", type: "number", align: "right" },
  { key: "directExpenses", labelEn: "Direct Expenses", labelBn: "সরাসরি ব্যয়", type: "number", align: "right" },
  { key: "profitReceived", labelEn: "Profit Received", labelBn: "লাভ প্রাপ্তি", type: "number", align: "right" },
  { key: "withdrawn", labelEn: "Withdrawn", labelBn: "উত্তোলন", type: "number", align: "right" },
  { key: "balance", labelEn: "Current Balance", labelBn: "বর্তমান ব্যালেন্স", type: "number", align: "right" },
];

export async function queryPartnersSummary(prisma: any): Promise<ReportData> {
  const partners = await prisma.partner.findMany();
  const txns = await prisma.partnerTransaction.findMany();

  const data = partners.map((p: any) => {
    const rows = txns.filter((t: any) => t.partnerId === p.id);
    let deposited = 0, directExpenses = 0, profitReceived = 0, withdrawn = 0;
    for (const t of rows) {
      const amt = toNum(t.amount);
      if (t.txnType === "DEPOSIT") deposited += amt;
      else if (t.txnType === "DIRECT_EXPENSE") directExpenses += amt;
      else if (t.txnType === "PROFIT_CREDIT") profitReceived += amt;
      else if (t.txnType === "WITHDRAWAL") withdrawn += amt;
    }
    const balance = toNum(p.openingBalance) + deposited + directExpenses + profitReceived - withdrawn;
    return { name: p.name, deposited, directExpenses, profitReceived, withdrawn, balance };
  });

  return {
    columns: summaryColumns,
    rows: data,
    totals: {
      deposited: data.reduce((s: number, r: any) => s + r.deposited, 0),
      directExpenses: data.reduce((s: number, r: any) => s + r.directExpenses, 0),
      profitReceived: data.reduce((s: number, r: any) => s + r.profitReceived, 0),
      withdrawn: data.reduce((s: number, r: any) => s + r.withdrawn, 0),
      balance: data.reduce((s: number, r: any) => s + r.balance, 0),
    },
  };
}
