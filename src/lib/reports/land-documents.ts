import type { ReportColumn, ReportData } from "./pdf";

const landDocColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project", labelBn: "প্রকল্প" },
  { key: "mouza", labelEn: "Mouza", labelBn: "মৌজা" },
  { key: "jl", labelEn: "JL No", labelBn: "জেএল নং" },
  { key: "dag", labelEn: "Dag Numbers", labelBn: "দাগ নম্বর" },
  { key: "khatian", labelEn: "Khatian Numbers", labelBn: "খতিয়ান নম্বর" },
  { key: "area", labelEn: "Area (Shotok)", labelBn: "জায়গা (শতক)", type: "number", align: "right" },
  { key: "status", labelEn: "Status", labelBn: "অবস্থা" },
];

export async function queryLandDocuments(prisma: any): Promise<ReportData> {
  const projects = await prisma.landProject.findMany({ orderBy: { createdAt: "asc" } });
  const data = projects.map((p: any) => ({
    project: p.projectName,
    mouza: p.mouza,
    jl: p.jlNumber ?? "-",
    dag: p.dagNumbers,
    khatian: p.khatianNumbers,
    area: Number(p.totalAreaShotok),
    status: p.status,
  }));
  return { columns: landDocColumns, rows: data };
}
