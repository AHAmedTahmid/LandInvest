"use client";
import React, { useState } from "react";
import { useLang } from "@/lib/i18n";
import { WIDGET_REGISTRY, DASHBOARD_TABS, type DashboardTabKey } from "@/lib/dashboard/widgets";
import type { TabbedLayout, WidgetLayoutItem } from "@/lib/dashboard/layout";
import { X, ArrowUp, ArrowDown, Eye, EyeOff, RotateCcw, Check, Save } from "lucide-react";

export default function LayoutEditorModal({
  isOpen,
  onClose,
  activeTab,
  currentLayout,
  onSaveLayout,
  onResetLayout,
  canManageRoleLayout,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DashboardTabKey;
  currentLayout: TabbedLayout;
  onSaveLayout: (updated: TabbedLayout, scope: "USER" | "ROLE") => Promise<void>;
  onResetLayout: (scope: "USER" | "ROLE") => Promise<void>;
  canManageRoleLayout: boolean;
}) {
  const { lang } = useLang();
  const [draftLayout, setDraftLayout] = useState<TabbedLayout>(() => JSON.parse(JSON.stringify(currentLayout)));
  const [saveScope, setSaveScope] = useState<"USER" | "ROLE">("USER");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const currentTabItems: WidgetLayoutItem[] = draftLayout[activeTab] || [];

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentTabItems.length) return;

    const copy = [...currentTabItems];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    setDraftLayout({
      ...draftLayout,
      [activeTab]: copy,
    });
  };

  const toggleHide = (key: string) => {
    const copy = currentTabItems.map((item) => {
      if (item.key === key) {
        return { ...item, hidden: !item.hidden };
      }
      return item;
    });
    setDraftLayout({
      ...draftLayout,
      [activeTab]: copy,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveLayout(draftLayout, saveScope);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm(lang === "bn" ? "আপনি কি ডিফল্ট লেআউটে ফিরে যেতে চান?" : "Reset dashboard to role default layout?")) return;
    setSaving(true);
    try {
      await onResetLayout(saveScope);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const currentTabDef = DASHBOARD_TABS.find((t) => t.key === activeTab);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              {lang === "bn" ? "ড্যাশবোর্ড লেআউট সম্পাদনা" : "Customize Dashboard Layout"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tab: <span className="font-semibold text-gray-800">{currentTabDef?.title[lang] || currentTabDef?.title.en}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Widgets list with re-order buttons */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {currentTabItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No widgets assigned to this tab.
            </div>
          ) : (
            currentTabItems.map((item, idx) => {
              const widget = WIDGET_REGISTRY[item.key];
              const isHidden = !!item.hidden;
              return (
                <div
                  key={item.key}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isHidden
                      ? "bg-gray-100/60 border-gray-200 text-gray-400 opacity-60"
                      : "bg-white border-gray-200 shadow-2xs text-gray-800 hover:border-olive-500"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate">
                      {widget ? widget.title[lang] || widget.title.en : item.key}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">
                      Type: {widget?.type || "widget"} • Category: {widget?.category || "general"}
                    </div>
                  </div>

                  {/* Actions: Move up, Move down, Hide/Show */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, "down")}
                      disabled={idx === currentTabItems.length - 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleHide(item.key)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 ml-1"
                      title={isHidden ? "Unhide Widget" : "Hide Widget"}
                    >
                      {isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {canManageRoleLayout && (
            <div className="flex items-center gap-2">
              <label className="text-gray-600 font-medium">Apply To:</label>
              <select
                value={saveScope}
                onChange={(e: any) => setSaveScope(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold"
              >
                <option value="USER">My Dashboard (Personal)</option>
                <option value="ROLE">Role Default (All users of role)</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "রিসেট" : "Reset Default"}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-olive-700 hover:bg-olive-800 text-white font-semibold transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? (lang === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (lang === "bn" ? "সংরক্ষণ করুন" : "Save Layout")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
