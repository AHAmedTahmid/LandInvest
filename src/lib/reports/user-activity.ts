import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

const activityColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date", labelBn: "তারিখ", type: "date" },
  { key: "user", labelEn: "User", labelBn: "ব্যবহারকারী" },
  { key: "action", labelEn: "Action", labelBn: "কার্যক্রম" },
  { key: "table", labelEn: "Table", labelBn: "টেবিল" },
  { key: "record", labelEn: "Record", labelBn: "রেকর্ড" },
];

export async function queryUserActivity(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.userId) where.changedBy = filters.userId;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }
  const logs = await prisma.auditLog.findMany({ where, orderBy: [{ createdAt: "desc" }], take: 500 });

  const data = logs.map((l: any) => ({
    date: l.createdAt,
    user: l.changedBy?.slice(0, 8) ?? "-",
    action: l.action,
    table: l.tableName,
    record: l.recordId?.slice(0, 8) ?? "-",
  }));

  return { columns: activityColumns, rows: data };
}
