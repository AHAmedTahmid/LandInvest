import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { controlPrisma } from "@/lib/control";

const expenseColumns: ReportColumn[] = [
  { key: "voucherNo", labelEn: "Voucher No", labelBn: "ভাউচার নং" },
  { key: "date", labelEn: "Expense Date", labelBn: "ব্যয়ের তারিখ", type: "date" },
  { key: "postedAt", labelEn: "Posted Date & Time", labelBn: "পোস্টের তারিখ ও সময়", type: "datetime" },
  { key: "postedBy", labelEn: "Posted By", labelBn: "পোস্টকারী" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "category", labelEn: "Category", labelBn: "বিভাগ" },
  { key: "payee", labelEn: "Payee / Partner", labelBn: "প্রাপক / অংশীদার" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "channel", labelEn: "Channel", labelBn: "মাধ্যম" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
  { key: "approver", labelEn: "Approver", labelBn: "অনুমোদক" },
];

export async function queryExpenseRegister(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.status) where.status = filters.status;
  if (filters.from || filters.to) {
    where.expenseDate = {};
    if (filters.from) where.expenseDate.gte = new Date(filters.from);
    if (filters.to) where.expenseDate.lte = new Date(filters.to);
  }
  const expenses = await prisma.projectExpense.findMany({ where, orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }] });
  const projects = await prisma.landProject.findMany();
  const partners = await prisma.partner.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));
  const partnerMap = new Map(partners.map((p: any) => [p.id, p.name]));

  // Resolve user details (posted by and approver) from control plane
  const userIds = new Set<string>();
  for (const e of expenses) {
    if (e.createdBy) userIds.add(e.createdBy);
    if (e.approvedBy) userIds.add(e.approvedBy);
  }

  let userMap = new Map<string, string>();
  if (userIds.size > 0) {
    try {
      const users: any[] = await (controlPrisma as any).globalUser.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, fullName: true, email: true },
      });
      userMap = new Map(users.map((u: any) => [u.id, u.fullName || u.email]));
    } catch {
      // Fallback silently if control plane is unreachable
    }
  }

  const resolveUser = (uid?: string | null) => {
    if (!uid) return "-";
    return userMap.get(uid) || `User (${uid.slice(0, 6)})`;
  };

  const data = expenses.map((e: any) => ({
    voucherNo: e.voucherNumber || `V-${e.id.slice(0, 8).toUpperCase()}`,
    date: e.expenseDate,
    postedAt: e.createdAt,
    postedBy: resolveUser(e.createdBy),
    project: e.projectId ? projMap.get(e.projectId) ?? "-" : "General",
    category: e.expenseCategory,
    payee: e.paidByPartnerId ? partnerMap.get(e.paidByPartnerId) ?? "-" : "-",
    amount: toNum(e.amount),
    channel: e.paymentChannel,
    status: e.status,
    approver: e.status === "APPROVED" ? resolveUser(e.approvedBy) : "-",
  }));

  const subtotals = new Map<string, number>();
  for (const r of data) subtotals.set(r.category, (subtotals.get(r.category) ?? 0) + r.amount);

  return {
    columns: expenseColumns,
    rows: data,
    totals: { amount: data.reduce((s: number, r: any) => s + r.amount, 0) },
    summary: [...subtotals.entries()].map(([cat, amt]) => ({
      labelEn: cat,
      labelBn: cat,
      value: fmt(amt),
    })),
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
