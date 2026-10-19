"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ReportDef } from "@/lib/reports/registry";

export default function ReportFilters({ def, current }: { def: ReportDef; current: Record<string, string> }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [from, setFrom] = useState(current.from || "");
  const [to, setTo] = useState(current.to || "");
  const [projectId, setProjectId] = useState(current.projectId || "");
  const [partnerId, setPartnerId] = useState(current.partnerId || "");
  const [bankAccountId, setBankAccountId] = useState(current.bankAccountId || "");
  const [status, setStatus] = useState(current.status || "");

  function applyFilters(preset?: string) {
    const params = new URLSearchParams();
    if (preset) params.set("preset", preset);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (projectId) params.set("projectId", projectId);
    if (partnerId) params.set("partnerId", partnerId);
    if (bankAccountId) params.set("bankAccountId", bankAccountId);
    if (status) params.set("status", status);
    router.push(`/reports/${def.key}?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-xl shadow border p-4 space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs font-semibold text-slate-600">Preset</label>
          <select onChange={(e) => applyFilters(e.target.value)} defaultValue={current.preset || "this_month"}
            className="block border rounded px-3 py-2 text-sm mt-1">
            <option value="today">Today</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_fy">This Fiscal Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="block border rounded px-3 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="block border rounded px-3 py-2 text-sm mt-1" />
        </div>
        {def.filters.includes("project") && (
          <div>
            <label className="text-xs font-semibold text-slate-600">Project</label>
            <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project ID"
              className="block border rounded px-3 py-2 text-sm mt-1" />
          </div>
        )}
        {def.filters.includes("status") && (
          <div>
            <label className="text-xs font-semibold text-slate-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="block border rounded px-3 py-2 text-sm mt-1">
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        )}
        <button onClick={() => applyFilters()} className="bg-brand-700 text-white px-4 py-2 rounded text-sm">Apply</button>
      </div>
    </div>
  );
}
