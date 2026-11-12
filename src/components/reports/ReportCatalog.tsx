import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { REPORT_REGISTRY, reportsByCategory, type ReportCategory } from "@/lib/reports/registry";
import ReportCatalogClient from "./ReportCatalogClient";

const CATEGORIES: { key: ReportCategory; labelEn: string; labelBn: string }[] = [
  { key: "financial", labelEn: "Financial / Treasury", labelBn: "আর্থিক / ট্রেজারি" },
  { key: "partners", labelEn: "Partners", labelBn: "অংশীদার" },
  { key: "projects", labelEn: "Land Projects", labelBn: "জমি প্রকল্প" },
  { key: "sales", labelEn: "Sales & Receivables", labelBn: "বিক্রয় ও বকেয়া" },
  { key: "profit", labelEn: "Profit Distribution", labelBn: "লাভ বণ্টন" },
  { key: "audit", labelEn: "Control & Audit", labelBn: "নিয়ন্ত্রণ ও অডিট" },
];

export default async function ReportCatalog() {
  const session = await getServerSession(authOptions);
  const isOwner = !!(session?.user as any)?.isOwner;

  // filter reports by the permission this user actually holds
  const groups = await Promise.all(
    CATEGORIES.map(async (cat) => ({
      ...cat,
      reports: (await Promise.all(
        reportsByCategory(cat.key).map(async (r) => (isOwner || (await can(session, r.permission as any)) ? r : null))
      )).filter(Boolean) as typeof REPORT_REGISTRY,
    }))
  );

  if (!isOwner && !(await can(session, "reports.view"))) {
    return <div className="p-8 text-red-600">Forbidden: reports.view</div>;
  }

  return <ReportCatalogClient groups={groups} />;
}
