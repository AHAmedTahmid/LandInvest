import { formatBDT, formatDate, formatDateTime } from "./format";
import type { ReportColumn, ReportData } from "./pdf";

function escapeCsv(v: any): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildCsv(data: ReportData, lang: "en" | "bn"): string {
  const headers = data.columns.map((c) => lang === "bn" ? c.labelBn : c.labelEn);
  const lines = [headers.map(escapeCsv).join(",")];
  for (const row of data.rows) {
    lines.push(data.columns.map((c) => escapeCsv(row[c.key])).join(","));
  }
  if (data.totals) {
    const totalCells = data.columns.map((c) => {
      if (data.totals![c.key] !== undefined) return formatBDT(data.totals![c.key]);
      return lang === "bn" ? c.labelBn : c.labelEn;
    });
    lines.push(totalCells.map(escapeCsv).join(","));
  }
  return lines.join("\n");
}

export function buildXlsxHtml(data: ReportData, lang: "en" | "bn"): string {
  const headers = data.columns.map((c) => `<th>${lang === "bn" ? c.labelBn : c.labelEn}</th>`).join("");
  const rows = data.rows.map((row) =>
    `<tr>${data.columns.map((c) => {
      const val = row[c.key];
      if (c.type === "number" && val !== null && val !== undefined) {
        const num = Number(val);
        return `<td style="number-format: #,##0.00;${num < 0 ? "color: #dc2626;" : ""}">${num}</td>`;
      }
      return `<td>${val !== null && val !== undefined ? String(val) : ""}</td>`;
    }).join("")}</tr>`
  ).join("");
  const totals = data.totals
    ? `<tr style="font-weight:bold;background:#f0fdf4">${data.columns.map((c) =>
        data.totals![c.key] !== undefined
          ? `<td style="number-format: #,##0.00">${data.totals![c.key]}</td>`
          : `<td>${lang === "bn" ? c.labelBn : c.labelEn}</td>`
      ).join("")}</tr>`
    : "";
  return `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>
    <table><thead><tr>${headers}</tr></thead><tbody>${rows}${totals}</tbody></table></body></html>`;
}
