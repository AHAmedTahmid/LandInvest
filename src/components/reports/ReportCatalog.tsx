import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { can } from "@/lib/rbac";
import { REPORT_REGISTRY, reportsByCategory, type ReportCategory } from "@/lib/reports/registry";
import Link from "next/link";

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

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Reports</h1>
      {groups.map((cat) => (
        <div key={cat.key}>
          <h2 className="text-lg font-semibold mb-3 text-slate-700">{cat.labelEn}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.reports.map((r) => (
              <Link key={r.key} href={`/reports/${r.key}`}
                className="bg-white rounded-xl shadow border p-4 hover:shadow-md hover:border-brand-600 transition">
                <h3 className="font-semibold text-slate-800">{r.titleEn}</h3>
                <p className="text-sm text-slate-500 mt-1">{r.descriptionEn}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
