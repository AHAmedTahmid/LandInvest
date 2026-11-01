"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { AlertCircle, AlertTriangle, Info, X, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { DashboardInsight } from "@/lib/dashboard/insights";

export default function InsightsDrawer({
  isOpen,
  onClose,
  onCountChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}) {
  const { lang } = useLang();
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/insights");
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
        if (onCountChange) onCountChange(data.count || 0);
      }
    } catch (e) {
      console.error("Failed to load insights:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              💡
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-base">
                {lang === "bn" ? "স্মার্ট ইনসাইট ও অ্যালার্ট" : "Smart Insights & Alerts"}
              </h2>
              <p className="text-xs text-gray-500">
                {lang === "bn" ? `${insights.length}টি সক্রিয় ব্যবসায়িক সতর্কতা` : `${insights.length} active business insights`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 rounded-md transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {insights.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm font-medium text-gray-600">
                {lang === "bn" ? "কোনো সক্রিয় সমস্যা পাওয়া যায়নি" : "All operations running smoothly"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "bn" ? "আপনার ক্যাশ ও প্রকল্প নিরাপদ সীমায় রয়েছে" : "No liquidity, overdue, or approval bottlenecks detected"}
              </p>
            </div>
          ) : (
            insights.map((item) => {
              const isCrit = item.level === "critical";
              const isWarn = item.level === "warning";
              const bgClass = isCrit
                ? "bg-rose-50/80 border-rose-200 text-rose-900"
                : isWarn
                ? "bg-amber-50/80 border-amber-200 text-amber-900"
                : "bg-blue-50/80 border-blue-200 text-blue-900";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border ${bgClass} shadow-xs transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCrit ? (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm tracking-tight">
                          {item.title[lang] || item.title.en}
                        </span>
                        {item.metric && (
                          <span className="font-mono font-semibold px-2 py-0.5 rounded text-[11px] bg-white/80 border border-current/15">
                            {item.metric}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-2.5">
                        {item.message[lang] || item.message.en}
                      </p>
                      {item.actionUrl && item.actionLabel && (
                        <Link
                          href={item.actionUrl}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 font-semibold text-xs text-gray-900 bg-white hover:bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs transition-colors"
                        >
                          <span>{item.actionLabel[lang] || item.actionLabel.en}</span>
                          <ExternalLink className="w-3 h-3 text-gray-500" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

