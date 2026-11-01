"use client";
import React, { useEffect, useState, useCallback } from "react";
import { WIDGET_REGISTRY, type WidgetRegistryEntry } from "@/lib/dashboard/widgets";
import WidgetRenderer from "./WidgetRenderer";
import { useLang } from "@/lib/i18n";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { FilterState } from "./FilterBar";

export default function WidgetContainer({
  widgetKey,
  filters,
  privacyMode,
  refreshSignal,
}: {
  widgetKey: string;
  filters: FilterState;
  privacyMode: boolean;
  refreshSignal: number;
}) {
  const { lang } = useLang();
  const widget = WIDGET_REGISTRY[widgetKey];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [canDrillDown, setCanDrillDown] = useState(true);

  const fetchData = useCallback(async () => {
    if (!widget) return;
    setLoading(true);
    setError(null);

    try {
      const q = new URLSearchParams();
      if (filters.preset) q.set("preset", filters.preset);
      if (filters.fiscalYear) q.set("fy", filters.fiscalYear);
      if (filters.projectIds.length > 0) q.set("projects", filters.projectIds.join(","));

      const res = await fetch(`/api/dashboard/widgets/${widgetKey}?${q.toString()}`);
      if (res.status === 403) {
        // Forbidden: widget revoked or unauthorized
        setError("Access not permitted");
        return;
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json.data);
      setCanDrillDown(json.canDrillDown ?? true);
    } catch (err: any) {
      console.warn(`Widget ${widgetKey} failed to load:`, err.message);
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [widgetKey, filters, widget]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshSignal]);

  if (!widget) {
    return null;
  }

  // Card container wrapper
  const isKpi = widget.type === "kpi";
  const cardPadding = isKpi ? "p-4" : "p-4";

  return (
    <div
      className={`bg-white rounded-xl shadow-xs border border-gray-200/90 ${cardPadding} flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden h-full`}
    >
      {/* Title Header for Non-KPI widgets */}
      {!isKpi && widget.type !== "alerts" && (
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm tracking-tight">
              {widget.title[lang] || widget.title.en}
            </h3>
            <p className="text-[11px] text-gray-400 truncate max-w-sm">
              {widget.description[lang] || widget.description.en}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
              title="Reload widget data"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      )}

      {/* Body / Content */}
      <div className="flex-1 min-h-[70px]">
        {loading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            <div className="h-8 bg-gray-100 rounded w-2/3"></div>
            <div className="h-3 bg-gray-50 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="py-6 flex flex-col items-center justify-center text-center text-xs text-rose-600">
            <AlertCircle className="w-5 h-5 text-rose-500 mb-1" />
            <span className="font-medium">{error}</span>
            <button
              onClick={() => fetchData()}
              className="mt-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <WidgetRenderer
            widget={widget}
            data={data}
            canDrillDown={canDrillDown}
            privacyMode={privacyMode}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}

