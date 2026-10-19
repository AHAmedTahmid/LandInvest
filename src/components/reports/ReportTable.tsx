"use client";
import { useState } from "react";
import { formatBDT, formatDate, formatDateTime } from "@/lib/reports/format";
import type { ReportColumn, ReportData } from "@/lib/reports/pdf";

export default function ReportTable({ data, lang }: { data: ReportData; lang: "en" | "bn" }) {
  const [page, setPage] = useState(0);
  const perPage = 50;
  const totalPages = Math.max(1, Math.ceil(data.rows.length / perPage));
  const start = page * perPage;
  const pageRows = data.rows.slice(start, start + perPage);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-xl shadow border">
          <thead>
            <tr className="border-b">
              {data.columns.map((c) => (
                <th key={c.key} className={`p-2 text-${c.align || "left"}`}>
                  {lang === "bn" ? c.labelBn : c.labelEn}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr><td colSpan={data.columns.length} className="p-6 text-center text-slate-400">No data for the selected filters</td></tr>
            )}
            {pageRows.map((row, i) => (
              <tr key={i} className="border-b hover:bg-slate-50">
                {data.columns.map((c) => {
                  const val = row[c.key];
                  let display = "-";
                  if (val !== null && val !== undefined && val !== "") {
                    if (c.type === "number") {
                      const num = Number(val);
                      display = formatBDT(num);
                      if (num < 0) return <td key={c.key} className="p-2 text-right text-red-600">{display}</td>;
                    } else if (c.type === "date") {
                      display = formatDate(val);
                    } else if (c.type === "datetime") {
                      display = formatDateTime(val);
                    } else {
                      display = String(val);
                    }
                  }
                  return <td key={c.key} className={`p-2 text-${c.align || "left"}`}>{display}</td>;
                })}
              </tr>
            ))}
          </tbody>
          {data.totals && (
            <tfoot>
              <tr className="border-t-2 border-brand-600 bg-emerald-50 font-semibold">
                {data.columns.map((c) => (
                  <td key={c.key} className={`p-2 text-${c.align || "left"}`}>
                    {data.totals![c.key] !== undefined
                      ? <span className={data.totals![c.key] < 0 ? "text-red-600" : ""}>{formatBDT(data.totals![c.key])}</span>
                      : <span className="text-slate-500">{lang === "bn" ? c.labelBn : c.labelEn}</span>}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {data.rows.length > perPage && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Showing {start + 1}–{Math.min(start + perPage, data.rows.length)} of {data.rows.length}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="border px-3 py-1 rounded disabled:opacity-30">Prev</button>
            <span className="py-1">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="border px-3 py-1 rounded disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
