import { toNum } from "@/lib/format";
import type { ReportColumn, ReportData } from "./pdf";
import type { ReportFilters } from "./cash-book";

export interface PlotInventoryItem {
  id: string;
  plotNumber: string;
  projectId: string;
  projectName: string;
  mouza?: string | null;
  plotSizeShotok: number;
  plotSizeKatha: number;
  askingPrice: number;
  ratePerShotok: number;
  status: "AVAILABLE" | "BOOKED" | "SOLD" | "RESERVED" | "HELD" | "NOT_FOR_SALE" | "UNPRICED" | string;
  statusLabelEn: string;
  statusLabelBn: string;
  // Linked sales info if booked or sold
  saleId?: string | null;
  buyerName?: string | null;
  buyerPhone?: string | null;
  saleDate?: string | Date | null;
  totalAgreedPrice?: number | null;
  advanceBookingAmount?: number | null;
  totalPaid?: number | null;
  currentDueAmount?: number | null;
  saleStatus?: string | null;
}

export interface PlotInventoryKpis {
  totalPlots: number;
  totalAreaShotok: number;
  totalAreaKatha: number;
  totalAreaAcres: number;
  availableCount: number;
  availableAreaShotok: number;
  availableValuation: number;
  bookedCount: number;
  bookedAreaShotok: number;
  bookedValuation: number;
  soldCount: number;
  soldAreaShotok: number;
  soldValuation: number;
  reservedHeldCount: number;
  reservedHeldAreaShotok: number;
  reservedHeldValuation: number;
  unpricedCount: number;
  unpricedAreaShotok: number;
  totalAskingValuation: number;
  avgAskingRatePerShotok: number;
  disposalRate: number; // (sold + booked) / totalPlots * 100
}

export interface ProjectPlotBreakdown {
  projectId: string;
  projectName: string;
  totalPlots: number;
  totalAreaShotok: number;
  availableCount: number;
  availableAreaShotok: number;
  bookedCount: number;
  soldCount: number;
  unpricedCount: number;
  reservedCount: number;
  askingValuation: number;
  disposalRate: number;
}

export interface PlotInventoryResult extends ReportData {
  items: PlotInventoryItem[];
  kpis: PlotInventoryKpis;
  projectBreakdown: ProjectPlotBreakdown[];
  statusBreakdown: {
    status: string;
    labelEn: string;
    labelBn: string;
    count: number;
    areaShotok: number;
    valuation: number;
    percentage: number;
  }[];
}

const inventoryColumns: ReportColumn[] = [
  { key: "plot", labelEn: "Plot No.", labelBn: "প্লট নং" },
  { key: "project", labelEn: "Project Estate", labelBn: "প্রকল্প" },
  { key: "size", labelEn: "Area (Shotok)", labelBn: "আকার (শতক)", type: "number", align: "right" },
  { key: "askingPrice", labelEn: "Asking Price (৳)", labelBn: "জিজ্ঞাসা মূল্য", type: "number", align: "right" },
  { key: "ratePerShotok", labelEn: "Rate / Shotok", labelBn: "দর / শতক", type: "number", align: "right" },
  { key: "status", labelEn: "Stock Status", labelBn: "অবস্থা" },
  { key: "buyer", labelEn: "Allotment / Buyer", labelBn: "বরাদ্দ / ক্রেতা" },
];

export async function queryPlotInventory(prisma: any, filters: ReportFilters): Promise<PlotInventoryResult> {
  const where: any = {};
  if (filters.projectId && filters.projectId !== "ALL") {
    where.projectId = filters.projectId;
  }
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  const rawPlots = await prisma.projectPlot.findMany({
    where,
    include: {
      project: { select: { id: true, projectName: true, mouza: true } },
      landSales: {
        select: {
          id: true,
          buyerName: true,
          buyerPhone: true,
          saleDate: true,
          totalAgreedPrice: true,
          advanceBookingAmount: true,
          currentDueAmount: true,
          status: true,
          customerPayments: { select: { amountPaid: true } },
        },
      },
    },
    orderBy: [
      { project: { projectName: "asc" } },
      { plotNumber: "asc" },
    ],
  });

  const items: PlotInventoryItem[] = [];
  let totalAreaShotok = 0;
  let totalAskingValuation = 0;
  let availableCount = 0;
  let availableAreaShotok = 0;
  let availableValuation = 0;
  let bookedCount = 0;
  let bookedAreaShotok = 0;
  let bookedValuation = 0;
  let soldCount = 0;
  let soldAreaShotok = 0;
  let soldValuation = 0;
  let reservedHeldCount = 0;
  let reservedHeldAreaShotok = 0;
  let reservedHeldValuation = 0;
  let unpricedCount = 0;
  let unpricedAreaShotok = 0;

  // Project Aggregations
  const projMap = new Map<string, {
    projectName: string;
    totalPlots: number;
    totalAreaShotok: number;
    availableCount: number;
    availableAreaShotok: number;
    bookedCount: number;
    soldCount: number;
    unpricedCount: number;
    reservedCount: number;
    askingValuation: number;
  }>();

  // Status Aggregations
  const statusMap = new Map<string, { count: number; area: number; val: number }>();

  for (const p of rawPlots) {
    const size = toNum(p.plotSizeShotok);
    const asking = toNum(p.askingPrice);
    const rate = size > 0 && asking > 0 ? asking / size : 0;
    const status = (p.status || "AVAILABLE").toUpperCase();

    totalAreaShotok += size;
    totalAskingValuation += asking;

    // Track status buckets
    if (status === "AVAILABLE") {
      availableCount++;
      availableAreaShotok += size;
      availableValuation += asking;
    } else if (status === "BOOKED") {
      bookedCount++;
      bookedAreaShotok += size;
      bookedValuation += asking;
    } else if (status === "SOLD") {
      soldCount++;
      soldAreaShotok += size;
      soldValuation += asking;
    } else if (status === "UNPRICED") {
      unpricedCount++;
      unpricedAreaShotok += size;
    } else {
      // RESERVED, HELD, NOT_FOR_SALE
      reservedHeldCount++;
      reservedHeldAreaShotok += size;
      reservedHeldValuation += asking;
    }

    // Status map
    const curStatus = statusMap.get(status) || { count: 0, area: 0, val: 0 };
    curStatus.count++;
    curStatus.area += size;
    curStatus.val += asking;
    statusMap.set(status, curStatus);

    // Project map
    const projId = p.projectId;
    const projName = p.project?.projectName || "Unknown Project";
    if (!projMap.has(projId)) {
      projMap.set(projId, {
        projectName: projName,
        totalPlots: 0,
        totalAreaShotok: 0,
        availableCount: 0,
        availableAreaShotok: 0,
        bookedCount: 0,
        soldCount: 0,
        unpricedCount: 0,
        reservedCount: 0,
        askingValuation: 0,
      });
    }
    const pEntry = projMap.get(projId)!;
    pEntry.totalPlots++;
    pEntry.totalAreaShotok += size;
    pEntry.askingValuation += asking;
    if (status === "AVAILABLE") {
      pEntry.availableCount++;
      pEntry.availableAreaShotok += size;
    } else if (status === "BOOKED") {
      pEntry.bookedCount++;
    } else if (status === "SOLD") {
      pEntry.soldCount++;
    } else if (status === "UNPRICED") {
      pEntry.unpricedCount++;
    } else {
      pEntry.reservedCount++;
    }

    // Parse Linked Sale
    let saleInfo: any = null;
    if (p.landSales && p.landSales.length > 0) {
      const activeSale = p.landSales[0];
      const payments = activeSale.customerPayments || [];
      const totalPaid = payments.reduce((sum: number, c: any) => sum + toNum(c.amountPaid), 0);
      saleInfo = {
        saleId: activeSale.id,
        buyerName: activeSale.buyerName,
        buyerPhone: activeSale.buyerPhone,
        saleDate: activeSale.saleDate,
        totalAgreedPrice: toNum(activeSale.totalAgreedPrice),
        advanceBookingAmount: toNum(activeSale.advanceBookingAmount),
        totalPaid,
        currentDueAmount: toNum(activeSale.currentDueAmount),
        saleStatus: activeSale.status,
      };
    }

    const { labelEn, labelBn } = getStatusLabels(status);

    items.push({
      id: p.id,
      plotNumber: p.plotNumber,
      projectId: p.projectId,
      projectName: projName,
      mouza: p.project?.mouza,
      plotSizeShotok: size,
      plotSizeKatha: size / 1.65, // Standard 1 Katha = 1.65 Shotok in Bangladesh
      askingPrice: asking,
      ratePerShotok: rate,
      status,
      statusLabelEn: labelEn,
      statusLabelBn: labelBn,
      ...(saleInfo || {}),
    });
  }

  const pricedAreaShotok = totalAreaShotok - unpricedAreaShotok;
  const avgAskingRatePerShotok = pricedAreaShotok > 0 ? totalAskingValuation / pricedAreaShotok : 0;
  const totalPlots = items.length;
  const disposalRate = totalPlots > 0 ? ((soldCount + bookedCount) / totalPlots) * 100 : 0;

  const kpis: PlotInventoryKpis = {
    totalPlots,
    totalAreaShotok,
    totalAreaKatha: totalAreaShotok / 1.65,
    totalAreaAcres: totalAreaShotok / 100,
    availableCount,
    availableAreaShotok,
    availableValuation,
    bookedCount,
    bookedAreaShotok,
    bookedValuation,
    soldCount,
    soldAreaShotok,
    soldValuation,
    reservedHeldCount,
    reservedHeldAreaShotok,
    reservedHeldValuation,
    unpricedCount,
    unpricedAreaShotok,
    totalAskingValuation,
    avgAskingRatePerShotok,
    disposalRate,
  };

  const projectBreakdown: ProjectPlotBreakdown[] = Array.from(projMap.entries()).map(([pId, val]) => ({
    projectId: pId,
    projectName: val.projectName,
    totalPlots: val.totalPlots,
    totalAreaShotok: val.totalAreaShotok,
    availableCount: val.availableCount,
    availableAreaShotok: val.availableAreaShotok,
    bookedCount: val.bookedCount,
    soldCount: val.soldCount,
    unpricedCount: val.unpricedCount,
    reservedCount: val.reservedCount,
    askingValuation: val.askingValuation,
    disposalRate: val.totalPlots > 0 ? ((val.soldCount + val.bookedCount) / val.totalPlots) * 100 : 0,
  })).sort((a, b) => b.totalAreaShotok - a.totalAreaShotok);

  const statusBreakdown = Array.from(statusMap.entries()).map(([st, val]) => {
    const { labelEn, labelBn } = getStatusLabels(st);
    return {
      status: st,
      labelEn,
      labelBn,
      count: val.count,
      areaShotok: val.area,
      valuation: val.val,
      percentage: totalPlots > 0 ? (val.count / totalPlots) * 100 : 0,
    };
  }).sort((a, b) => b.count - a.count);

  // Backwards compatible rows
  const rows = items.map((r) => ({
    plot: r.plotNumber,
    project: r.projectName,
    size: r.plotSizeShotok,
    askingPrice: r.askingPrice,
    ratePerShotok: r.ratePerShotok,
    status: r.statusLabelEn,
    buyer: r.buyerName ? `${r.buyerName} (${r.buyerPhone || ""})` : "Unallocated",
  }));

  return {
    columns: inventoryColumns,
    rows,
    totals: {
      size: totalAreaShotok,
      askingPrice: totalAskingValuation,
    },
    summary: [
      { labelEn: "Total Demarcated Stock", labelBn: "মোট প্লট সংখ্যা", value: `${totalPlots} Plots (${totalAreaShotok.toFixed(2)} Shotok)` },
      { labelEn: "Available For Sale", labelBn: "বিক্রয়যোগ্য অবশিষ্ট প্লট", value: `${availableCount} Plots (${availableAreaShotok.toFixed(2)} Shotok)` },
      { labelEn: "Available Stock Valuation", labelBn: "বিক্রয়যোগ্য বাজার মূল্য", value: fmt(availableValuation) },
      { labelEn: "Contracted / Disposed", labelBn: "বিক্রিত ও বুকিংকৃত প্লট", value: `${soldCount + bookedCount} Plots (${disposalRate.toFixed(1)}%)` },
    ],
    items,
    kpis,
    projectBreakdown,
    statusBreakdown,
  };
}

function getStatusLabels(status: string): { labelEn: string; labelBn: string } {
  switch (status) {
    case "AVAILABLE":
      return { labelEn: "Available for Sale", labelBn: "বিক্রয়যোগ্য" };
    case "BOOKED":
      return { labelEn: "Booked (Installment Plan)", labelBn: "বুকিংকৃত (চলমান)" };
    case "SOLD":
      return { labelEn: "Sold & Handed Over", labelBn: "বিক্রিত ও হস্তান্তর" };
    case "RESERVED":
      return { labelEn: "Reserved / In Token Bayna", labelBn: "সংরক্ষিত বায়না" };
    case "HELD":
      return { labelEn: "Held by Management", labelBn: "স্থগিত / সংরক্ষিত" };
    case "NOT_FOR_SALE":
      return { labelEn: "Institutional / Utility", labelBn: "জনকল্যাণ / সার্ভিস" };
    case "UNPRICED":
      return { labelEn: "Under Development (Unpriced)", labelBn: "উন্নয়নশীল (মূল্যহীন)" };
    default:
      return { labelEn: status, labelBn: status };
  }
}

function fmt(n: number): string {
  return "৳ " + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n));
}
