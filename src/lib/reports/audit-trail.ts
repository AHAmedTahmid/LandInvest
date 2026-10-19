import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";
import { formatDateTime } from "./format";

const auditColumns: ReportColumn[] = [
  { key: "date", labelEn: "Date & Time", labelBn: "তারিখ ও সময়", type: "datetime" },
  { key: "user", labelEn: "User", labelBn: "ব্যবহারকারী" },
  { key: "action", labelEn: "Action", labelBn: "কার্যক্রম" },
  { key: "table", labelEn: "Table", labelBn: "টেবিল" },
  { key: "record", labelEn: "Record ID", labelBn: "রেকর্ড আইডি" },
  { key: "changes", labelEn: "Changes", labelBn: "পরিবর্তন" },
];

export async function queryAuditTrail(prisma: any, filters: ReportFilters): Promise<ReportData> {
  const where: any = {};
  if (filters.userId) where.changedBy = filters.userId;
  if (filters.tableName) where.tableName = filters.tableName;
  if (filters.action) where.action = filters.action;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }
  const logs = await prisma.auditLog.findMany({ where, orderBy: [{ createdAt: "desc" }], take: 500 });

  const data = logs.map((l: any) => {
    let changes = "";
    if (l.oldValues && l.newValues) {
      const oldV = typeof l.oldValues === "string" ? JSON.parse(l.oldValues) : l.oldValues;
      const newV = typeof l.newValues === "string" ? JSON.parse(l.newValues) : l.newValues;
      const keys = new Set([...Object.keys(oldV), ...Object.keys(newV)]);
      const diffs: string[] = [];
      for (const k of keys) {
        if (JSON.stringify(oldV[k]) !== JSON.stringify(newV[k])) {
          diffs.push(`${k}: ${oldV[k] ?? "null"} → ${newV[k] ?? "null"}`);
        }
      }
      changes = diffs.join("; ");
    }
    return {
      date: l.createdAt,
      user: l.changedBy?.slice(0, 8) ?? "-",
      action: l.action,
      table: l.tableName,
      record: l.recordId?.slice(0, 8) ?? "-",
      changes,
    };
  });

  return { columns: auditColumns, rows: data };
}
