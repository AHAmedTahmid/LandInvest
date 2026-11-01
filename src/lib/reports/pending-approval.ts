import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { controlPrisma } from "@/lib/control";

const pendingColumns: ReportColumn[] = [
  { key: "voucherNo", labelEn: "Voucher No", labelBn: "ভাউচার নং" },
  { key: "date", labelEn: "Expense Date", labelBn: "ব্যয়ের তারিখ", type: "date" },
  { key: "postedAt", labelEn: "Posted Date & Time", labelBn: "পোস্টের তারিখ ও সময়", type: "datetime" },
  { key: "postedBy", labelEn: "Posted By", labelBn: "পোস্টকারী" },
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "category", labelEn: "Category", labelBn: "বিভাগ" },
  { key: "amount", labelEn: "Amount", labelBn: "পরিমাণ", type: "number", align: "right" },
  { key: "channel", labelEn: "Channel", labelBn: "মাধ্যম" },
  { key: "age", labelEn: "Age (days)", labelBn: "বয়স (দিন)", type: "number", align: "right" },
];

export async function queryPendingApproval(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = { status: "PENDING" };
  if (filters.projectId) where.projectId = filters.projectId;
  const expenses = await prisma.projectExpense.findMany({ where, orderBy: [{ expenseDate: "asc" }, { createdAt: "desc" }] });
  const projects = await prisma.landProject.findMany();
  const projMap = new Map(projects.map((p: any) => [p.id, p.projectName]));

  // Resolve user details (posted by) from control plane
  const userIds = new Set<string>();
  for (const e of expenses) {
    if (e.createdBy) userIds.add(e.createdBy);
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
      // Fallback
    }
  }

  const resolveUser = (uid?: string | null) => {
    if (!uid) return "-";
    return userMap.get(uid) || `User (${uid.slice(0, 6)})`;
  };

  const now = new Date();
  const data = expenses.map((e: any) => {
    const days = Math.floor((now.getTime() - new Date(e.expenseDate).getTime()) / 86400000);
    return {
      voucherNo: e.voucherNumber || `V-${e.id.slice(0, 8).toUpperCase()}`,
      date: e.expenseDate,
      postedAt: e.createdAt,
      postedBy: resolveUser(e.createdBy),
      project: e.projectId ? projMap.get(e.projectId) ?? "-" : "General",
      category: e.expenseCategory,
      amount: toNum(e.amount),
      channel: e.paymentChannel,
      age: Math.max(0, days),
    };
  });

  return {
    columns: pendingColumns,
    rows: data,
    totals: {
      amount: data.reduce((s: number, r: any) => s + r.amount, 0),
      age: data.length > 0 ? Math.round(data.reduce((s: number, r: any) => s + r.age, 0) / data.length) : 0,
    },
  };
}
