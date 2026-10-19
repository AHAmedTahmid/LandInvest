import { formatBDT, formatDate, formatDateTime } from "./format";

export type ReportColumn = {
  key: string;
  labelEn: string;
  labelBn: string;
  align?: "left" | "right" | "center";
  type?: "text" | "number" | "date" | "datetime";
  width?: string;
};

export type ReportData = {
  columns: ReportColumn[];
  rows: Record<string, any>[];
  totals?: Record<string, number>;
  summary?: { labelEn: string; labelBn: string; value: string }[];
};

export function buildReportHtml(opts: {
  titleEn: string;
  titleBn: string;
  companyName: string;
  filterSummary: string;
  generatedBy: string;
  lang: "en" | "bn";
  data: ReportData;
  subtitle?: string;
}): string {
  const { titleEn, titleBn, companyName, filterSummary, generatedBy, lang, data, subtitle } = opts;
  const title = lang === "bn" ? titleBn : titleEn;
  const now = formatDateTime(new Date());

  const headerCells = data.columns.map((c) => {
    const label = lang === "bn" ? c.labelBn : c.labelEn;
    const align = c.align === "right" ? "right" : c.align === "center" ? "center" : "left";
    return `<th style="text-align:${align};${c.width ? `width:${c.width};` : ""}">${label}</th>`;
  }).join("");

  const bodyRows = data.rows.map((row) => {
    const cells = data.columns.map((c) => {
      const val = row[c.key];
      const align = c.align === "right" ? "right" : c.align === "center" ? "center" : "left";
      let display = "-";
      if (val !== null && val !== undefined && val !== "") {
        if (c.type === "number") {
          const num = Number(val);
          display = formatBDT(num);
          if (num < 0) return `<td style="text-align:${align};color:#dc2626">${display}</td>`;
        } else if (c.type === "date") {
          display = formatDate(val);
        } else if (c.type === "datetime") {
          display = formatDateTime(val);
        } else {
          display = String(val);
        }
      }
      return `<td style="text-align:${align}">${display}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  const totalRow = data.totals
    ? `<tr>${data.columns.map((c) => {
        const align = c.align === "right" ? "right" : c.align === "center" ? "center" : "left";
        if (data.totals![c.key] !== undefined) {
          const num = data.totals![c.key];
          const color = num < 0 ? "color:#dc2626;" : "";
          return `<td style="text-align:${align};${color}font-weight:bold">${formatBDT(num)}</td>`;
        }
        const label = lang === "bn" ? c.labelBn : c.labelEn;
        return `<td style="text-align:${align};font-weight:bold">${label}</td>`;
      }).join("")}</tr>`
    : "";

  const summaryHtml = data.summary?.length
    ? `<div style="margin-bottom:12px;padding:8px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:12px">
        ${data.summary.map((s) => `<div><strong>${lang === "bn" ? s.labelBn : s.labelEn}:</strong> ${s.value}</div>`).join("")}
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4 landscape; margin: 12mm 10mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Noto Sans Bengali', sans-serif; font-size: 11px; color: #1e293b; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4b5c09; padding-bottom: 8px; margin-bottom: 12px; }
  .company { font-size: 16px; font-weight: 700; color: #2c3605; }
  .report-title { font-size: 13px; font-weight: 600; color: #4b5c09; margin-top: 2px; }
  .meta { text-align: right; font-size: 10px; color: #64748b; line-height: 1.6; }
  .filters { font-size: 10px; color: #475569; margin-bottom: 10px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #4b5c09; color: #fff; padding: 6px 8px; font-size: 10px; font-weight: 600; border: 1px solid #3d4a07; }
  td { padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10px; }
  tr:nth-child(even) td { background: #f8fafc; }
  .totals td { background: #f0fdf4 !important; border-top: 2px solid #4b5c09; }
  .footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
  .page-num { text-align: right; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">${companyName}</div>
      <div class="report-title">${title}${subtitle ? ` — ${subtitle}` : ""}</div>
    </div>
    <div class="meta">
      <div>Generated: ${now}</div>
      <div>By: ${generatedBy}</div>
    </div>
  </div>
  <div class="filters"><strong>Filters:</strong> ${filterSummary}</div>
  ${summaryHtml}
  <table>
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
    ${data.totals ? `<tfoot><tr class="totals">${totalRow.replace(/<tr>|<\/tr>/g, "")}</tr></tfoot>` : ""}
  </table>
  <div class="footer">
    <span>${companyName} — ${title}</span>
    <span class="page-num">Page <span class="page"></span> of <span class="pages"></span></span>
  </div>
  <script>
    document.querySelectorAll('.page').forEach(el => el.textContent = '1');
    document.querySelectorAll('.pages').forEach(el => el.textContent = '1');
  </script>
</body>
</html>`;
}

export async function generatePdf(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer");
  const browser = await (puppeteer as any).launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", landscape: true, printBackground: true, margin: { top: "12mm", bottom: "14mm", left: "10mm", right: "10mm" } });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
