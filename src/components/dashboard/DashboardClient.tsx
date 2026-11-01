"use client";
import React, { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { DASHBOARD_TABS, type DashboardTabKey, WIDGET_REGISTRY } from "@/lib/dashboard/widgets";
import type { TabbedLayout } from "@/lib/dashboard/layout";
import FilterBar, { type FilterState } from "./FilterBar";
import WidgetContainer from "./WidgetContainer";
import InsightsDrawer from "./InsightsDrawer";
import LayoutEditorModal from "./LayoutEditorModal";
import { ShieldAlert } from "lucide-react";

export default function DashboardClient({
  initialLayout,
  visibleTabs,
  canCustomize,
  canManageRoleLayout,
  canExport,
  projects,
}: {
  initialLayout: TabbedLayout;
  visibleTabs: DashboardTabKey[];
  canCustomize: boolean;
  canManageRoleLayout: boolean;
  canExport: boolean;
  projects: { id: string; projectName: string }[];
}) {
  const { lang } = useLang();

  // Active tab state
  const [activeTab, setActiveTab] = useState<DashboardTabKey>(
    visibleTabs[0] || "overview"
  );

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    fiscalYear: "FY 2026-2027",
    preset: "fy",
    projectIds: [],
    compareWithPrevious: false,
  });

  // UX features
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshSignal, setRefreshSignal] = useState<number>(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [insightsCount, setInsightsCount] = useState<number>(0);
  const [insightsOpen, setInsightsOpen] = useState<boolean>(false);
  const [layoutEditorOpen, setLayoutEditorOpen] = useState<boolean>(false);

  // Live effective layout
  const [layout, setLayout] = useState<TabbedLayout>(initialLayout);

  // 60s Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setRefreshSignal((s) => s + 1);
      setLastRefreshedAt(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Layout save handler
  const handleSaveLayout = async (updated: TabbedLayout, scope: "USER" | "ROLE") => {
    const res = await fetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope, layout: updated }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.layout) setLayout(data.layout);
    }
  };

  // Layout reset handler
  const handleResetLayout = async (scope: "USER" | "ROLE") => {
    const res = await fetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset", scope }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.layout) setLayout(data.layout);
    }
  };

  // Active items in current tab
  const activeItems = (layout[activeTab] || []).filter((item) => !item.hidden);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header Bar with Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200/80 pb-3">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {DASHBOARD_TABS.filter((tab) => visibleTabs.includes(tab.key)).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-olive-800 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.title[lang] || tab.title.en}
              </button>
            );
          })}
        </div>

        {/* Tab Description badge */}
        <div className="hidden lg:flex items-center text-xs text-gray-400">
          {DASHBOARD_TABS.find((t) => t.key === activeTab)?.description[lang] ||
            DASHBOARD_TABS.find((t) => t.key === activeTab)?.description.en}
        </div>
      </div>

      {/* Global Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setRefreshSignal((s) => s + 1);
        }}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
        lastRefreshedAt={lastRefreshedAt}
        insightsCount={insightsCount}
        onOpenInsights={() => setInsightsOpen(true)}
        onOpenLayoutEditor={() => setLayoutEditorOpen(true)}
        canCustomize={canCustomize}
        canExport={canExport}
        projects={projects}
      />

      {/* Main Widgets Grid */}
      {visibleTabs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-base mb-1">
            {lang === "bn" ? "ড্যাশবোর্ড অ্যাক্সেস সংরক্ষিত" : "No Dashboard Views Granted"}
          </h3>
          <p className="text-xs max-w-md mx-auto text-gray-400">
            {lang === "bn"
              ? "আপনার বর্তমান ভূমিকায় কোনো ড্যাশবোর্ড উইজেট দেখার অনুমতি দেওয়া হয়নি। প্রশাসকের সাথে যোগাযোগ করুন।"
              : "Your role has not been granted view access to any dashboard widgets. Contact your system owner to configure dashboard permissions."}
          </p>
        </div>
      ) : activeItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-xs">
          {lang === "bn"
            ? "এই ট্যাবের অধীনে কোনো দৃশ্যমান উইজেট সক্রিয় নেই।"
            : "No active widgets in this view. Use the layout editor to show widgets."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {activeItems.map((item) => {
            const widget = WIDGET_REGISTRY[item.key];
            if (!widget) return null;

            // Responsive col-span based on widget type and defaultSize
            let spanClass = "col-span-12";
            if (widget.type === "kpi") {
              // 4 per row on desktop, 2 on tablet, 1 on mobile
              spanClass = "col-span-12 sm:col-span-6 lg:col-span-3";
            } else if (widget.defaultSize.w <= 6) {
              spanClass = "col-span-12 lg:col-span-6";
            }

            return (
              <div key={item.key} className={spanClass}>
                <WidgetContainer
                  widgetKey={item.key}
                  filters={filters}
                  privacyMode={privacyMode}
                  refreshSignal={refreshSignal}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over Insights Drawer */}
      <InsightsDrawer
        isOpen={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        onCountChange={(cnt) => setInsightsCount(cnt)}
      />

      {/* Layout Customization Modal */}
      <LayoutEditorModal
        isOpen={layoutEditorOpen}
        onClose={() => setLayoutEditorOpen(false)}
        activeTab={activeTab}
        currentLayout={layout}
        onSaveLayout={handleSaveLayout}
        onResetLayout={handleResetLayout}
        canManageRoleLayout={canManageRoleLayout}
      />
    </div>
  );
}

