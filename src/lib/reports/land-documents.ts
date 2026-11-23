import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";

export interface LandDocumentItem {
  id: string;
  projectName: string;
  mouza: string;
  jlNumber: string;
  dagNumbers: string;
  khatianNumbers: string;
  totalAreaShotok: number;
  totalAreaAcres: number;
  netPlotAreaShotok: number;
  reserveAreaShotok: number;
  efficiencyRatio: number;
  totalPlots: number;
  soldPlots: number;
  availablePlots: number;
  purchasePrice: number;
  baynaAmount: number;
  registrationCost: number;
  mutationTaxCost: number;
  totalAcquisitionCost: number;
  costPerShotok: number;
  status: "SOLD_OUT" | "SELLING" | "DEVELOPING" | "UNDER_BAYNA" | "DRAFT" | string;
  statusLabelEn: string;
  statusLabelBn: string;
  createdAt: string | Date;
  partners: {
    partnerId: string;
    name: string;
    phone?: string | null;
    sharePercentage: number;
  }[];
}

export interface LandDocumentKpis {
  totalProjects: number;
  totalAreaShotok: number;
  totalAreaAcres: number;
  totalNetPlotAreaShotok: number;
  totalReserveAreaShotok: number;
  overallEfficiencyRatio: number;
  totalPlots: number;
  totalSoldPlots: number;
  totalAvailablePlots: number;
  totalPurchasePrice: number;
  totalBaynaAmount: number;
  totalRegistrationCost: number;
  totalMutationTaxCost: number;
  totalAcquisitionCost: number;
  avgCostPerShotok: number;
  registeredProjectsCount: number;
  underBaynaProjectsCount: number;
  draftProjectsCount: number;
}

export interface LandDocumentData extends ReportData {
  items: LandDocumentItem[];
  kpis: LandDocumentKpis;
  statusBreakdown: {
    status: string;
    labelEn: string;
    labelBn: string;
    count: number;
    areaShotok: number;
    acquisitionCost: number;
    percentage: number;
  }[];
}

const landDocColumns: ReportColumn[] = [
  { key: "project", labelEn: "Project Name", labelBn: "প্রকল্পের নাম", width: "15%" },
  { key: "mouza", labelEn: "Mouza & J.L.", labelBn: "মৌজা ও জে.এল.", width: "14%" },
  { key: "dag", labelEn: "Dag Numbers (CS/SA/RS/BS)", labelBn: "দাগ নম্বর", width: "15%" },
  { key: "khatian", labelEn: "Khatian Numbers", labelBn: "খতিয়ান নম্বর", width: "14%" },
  { key: "area", labelEn: "Gross Area (Shotok)", labelBn: "মোট জায়গা (শতক)", type: "number", align: "right", width: "10%" },
  { key: "netArea", labelEn: "Net Plots (Shotok)", labelBn: "নেট প্লট (শতক)", type: "number", align: "right", width: "10%" },
  { key: "acquisitionCost", labelEn: "Acquisition Cost", labelBn: "অধিগ্রহণ খরচ", type: "number", align: "right", width: "12%" },
  { key: "status", labelEn: "Title Status", labelBn: "দলিল অবস্থা", width: "10%" },
];

export async function queryLandDocuments(prisma: any): Promise<LandDocumentData> {
  const projects = await prisma.landProject.findMany({
    include: {
      projectPlots: {
        select: { id: true, plotNumber: true, plotSizeShotok: true, status: true, askingPrice: true },
      },
      projectPartners: {
        include: {
          partner: { select: { id: true, name: true, phone: true } },
        },
      },
    },
    orderBy: [{ createdAt: "asc" }],
  });

  let totalAreaShotok = 0;
  let totalNetPlotAreaShotok = 0;
  let totalPlots = 0;
  let totalSoldPlots = 0;
  let totalAvailablePlots = 0;
  let totalPurchasePrice = 0;
  let totalBaynaAmount = 0;
  let totalRegistrationCost = 0;
  let totalMutationTaxCost = 0;
  let totalAcquisitionCost = 0;

  let registeredProjectsCount = 0;
  let underBaynaProjectsCount = 0;
  let draftProjectsCount = 0;

  const items: LandDocumentItem[] = projects.map((p: any) => {
    const grossArea = toNum(p.totalAreaShotok);
    const purchase = toNum(p.purchasePrice);
    const bayna = toNum(p.baynaAmount);
    const regCost = toNum(p.registrationCost);
    const mutCost = toNum(p.mutationTaxCost);
    const acqCost = purchase + regCost + mutCost;

    const plots = p.projectPlots || [];
    const netPlotArea = plots.reduce((sum: number, pl: any) => sum + toNum(pl.plotSizeShotok), 0);
    const reserveArea = Math.max(0, grossArea - netPlotArea);
    const efficiency = grossArea > 0 ? (netPlotArea / grossArea) * 100 : 0;

    const soldCount = plots.filter((pl: any) => pl.status === "SOLD").length;
    const availCount = plots.filter((pl: any) => pl.status === "AVAILABLE" || pl.status === "UNPRICED").length;

    totalAreaShotok += grossArea;
    totalNetPlotAreaShotok += netPlotArea;
    totalPlots += plots.length;
    totalSoldPlots += soldCount;
    totalAvailablePlots += availCount;
    totalPurchasePrice += purchase;
    totalBaynaAmount += bayna;
    totalRegistrationCost += regCost;
    totalMutationTaxCost += mutCost;
    totalAcquisitionCost += acqCost;

    if (p.status === "SOLD_OUT" || p.status === "SELLING" || p.status === "DEVELOPING") {
      registeredProjectsCount++;
    } else if (p.status === "UNDER_BAYNA") {
      underBaynaProjectsCount++;
    } else {
      draftProjectsCount++;
    }

    const partners = (p.projectPartners || []).map((pp: any) => ({
      partnerId: pp.partnerId,
      name: pp.partner?.name || "Partner",
      phone: pp.partner?.phone || null,
      sharePercentage: toNum(pp.sharePercentage),
    }));

    let statusLabelEn = p.status;
    let statusLabelBn = p.status;
    if (p.status === "SOLD_OUT") {
      statusLabelEn = "Registered & Sold Out";
      statusLabelBn = "রেজিস্ট্রিকৃত ও সম্পূর্ণ বিক্রিত";
    } else if (p.status === "SELLING") {
      statusLabelEn = "Registered & Active Sales";
      statusLabelBn = "রেজিস্ট্রিকৃত ও বিক্রয়মান";
    } else if (p.status === "DEVELOPING") {
      statusLabelEn = "Registered & Developing";
      statusLabelBn = "রেজিস্ট্রিকৃত ও উন্নয়নমান";
    } else if (p.status === "UNDER_BAYNA") {
      statusLabelEn = "Under Bayna Deed";
      statusLabelBn = "বায়নাপত্র নিবন্ধিত";
    } else if (p.status === "DRAFT") {
      statusLabelEn = "Title Vetting / Draft";
      statusLabelBn = "আইনি যাচাই ও খসড়া";
    }

    return {
      id: p.id,
      projectName: p.projectName,
      mouza: p.mouza,
      jlNumber: p.jlNumber || "-",
      dagNumbers: p.dagNumbers || "-",
      khatianNumbers: p.khatianNumbers || "-",
      totalAreaShotok: grossArea,
      totalAreaAcres: grossArea / 100,
      netPlotAreaShotok: netPlotArea,
      reserveAreaShotok: reserveArea,
      efficiencyRatio: efficiency,
      totalPlots: plots.length,
      soldPlots: soldCount,
      availablePlots: availCount,
      purchasePrice: purchase,
      baynaAmount: bayna,
      registrationCost: regCost,
      mutationTaxCost: mutCost,
      totalAcquisitionCost: acqCost,
      costPerShotok: grossArea > 0 ? acqCost / grossArea : 0,
      status: p.status,
      statusLabelEn,
      statusLabelBn,
      createdAt: p.createdAt,
      partners,
    };
  });

  const totalReserveAreaShotok = Math.max(0, totalAreaShotok - totalNetPlotAreaShotok);
  const overallEfficiencyRatio = totalAreaShotok > 0 ? (totalNetPlotAreaShotok / totalAreaShotok) * 100 : 0;
  const avgCostPerShotok = totalAreaShotok > 0 ? totalAcquisitionCost / totalAreaShotok : 0;

  const kpis: LandDocumentKpis = {
    totalProjects: items.length,
    totalAreaShotok,
    totalAreaAcres: totalAreaShotok / 100,
    totalNetPlotAreaShotok,
    totalReserveAreaShotok,
    overallEfficiencyRatio,
    totalPlots,
    totalSoldPlots,
    totalAvailablePlots,
    totalPurchasePrice,
    totalBaynaAmount,
    totalRegistrationCost,
    totalMutationTaxCost,
    totalAcquisitionCost,
    avgCostPerShotok,
    registeredProjectsCount,
    underBaynaProjectsCount,
    draftProjectsCount,
  };

  const statusMap = new Map<string, { count: number; area: number; cost: number; labelEn: string; labelBn: string }>();
  for (const it of items) {
    const cur = statusMap.get(it.status) || {
      count: 0,
      area: 0,
      cost: 0,
      labelEn: it.statusLabelEn,
      labelBn: it.statusLabelBn,
    };
    cur.count++;
    cur.area += it.totalAreaShotok;
    cur.cost += it.totalAcquisitionCost;
    statusMap.set(it.status, cur);
  }

  const statusBreakdown = Array.from(statusMap.entries()).map(([st, val]) => ({
    status: st,
    labelEn: val.labelEn,
    labelBn: val.labelBn,
    count: val.count,
    areaShotok: val.area,
    acquisitionCost: val.cost,
    percentage: totalAreaShotok > 0 ? (val.area / totalAreaShotok) * 100 : 0,
  }));

  // Backwards compatible standard rows
  const rows = items.map((p) => ({
    project: p.projectName,
    mouza: `${p.mouza} (JL #${p.jlNumber})`,
    dag: p.dagNumbers,
    khatian: p.khatianNumbers,
    area: p.totalAreaShotok,
    netArea: p.netPlotAreaShotok,
    acquisitionCost: p.totalAcquisitionCost,
    status: p.statusLabelEn,
  }));

  return {
    columns: landDocColumns,
    rows,
    totals: {
      area: totalAreaShotok,
      netArea: totalNetPlotAreaShotok,
      acquisitionCost: totalAcquisitionCost,
    },
    summary: [
      { labelEn: "Total Acreage", labelBn: "মোট জায়গা", value: `${totalAreaShotok.toFixed(2)} Shotok (${(totalAreaShotok / 100).toFixed(2)} Acres)` },
      { labelEn: "Net Demarcated Plots", labelBn: "নেট প্লট আয়তন", value: `${totalNetPlotAreaShotok.toFixed(2)} Shotok (${overallEfficiencyRatio.toFixed(1)}%)` },
      { labelEn: "Total Land Investment", labelBn: "মোট জমি বিনিয়োগ", value: fmt(totalAcquisitionCost) },
      { labelEn: "Average Cost per Shotok", labelBn: "শতক প্রতি গড় খরচ", value: fmt(avgCostPerShotok) },
    ],
    items,
    kpis,
    statusBreakdown,
  };
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
