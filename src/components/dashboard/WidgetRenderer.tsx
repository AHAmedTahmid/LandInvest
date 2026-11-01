"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { formatBDT, formatCompactBDT, formatDate, toBnNum } from "@/lib/format";
import type { WidgetRegistryEntry } from "@/lib/dashboard/widgets";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Receipt,
  FileText,
  CreditCard,
  ArrowLeftRight,
  DollarSign,
  AlertCircle,
  Table as TableIcon,
  BarChart2,
  Phone,
  CheckCircle2,
} from "lucide-react";

const CHART_PALETTE = [
  "#435334", // Olive green primary
  "#2563eb", // Navy/Blue
  "#059669", // Emerald
  "#d97706", // Amber
  "#dc2626", // Rose
  "#7c3aed", // Purple
  "#0891b2", // Cyan
  "#475569", // Slate
];

const ICONS_MAP: Record<string, any> = {
  Receipt,
  FileText,
  CreditCard,
  ArrowLeftRight,
  DollarSign,
};

export default function WidgetRenderer({
  widget,
  data,
  canDrillDown,
  privacyMode,
  lang,
}: {
  widget: WidgetRegistryEntry;
  data: any;
  canDrillDown: boolean;
  privacyMode: boolean;
  lang: "en" | "bn";
}) {
  const [showTable, setShowTable] = useState(false);

  if (!data) {
    return <div className="text-gray-400 text-xs py-4 text-center">No data available</div>;
  }

  const maskMoney = (amount: number | string) => {
    if (privacyMode) return "৳ ••••••";
    return formatBDT(amount, { lang });
  };

  const maskCompact = (amount: number | string) => {
    if (privacyMode) return "••••••";
    return formatCompactBDT(amount, { lang });
  };

  // -------------------------------------------------------------
  // 1. KPI CARDS
  // -------------------------------------------------------------
  if (widget.type === "kpi") {
    const isPct = data.isPercentage;
    const displayVal = isPct
      ? `${lang === "bn" ? toBnNum(data.value) : data.value}%`
      : maskCompact(data.value);
    const fullVal = isPct ? `${data.value}%` : maskMoney(data.value);

    const hasDelta = typeof data.deltaPercent === "number" && !isNaN(data.deltaPercent);
    const isDeltaPositive = (data.deltaPercent || 0) >= 0;

    return (
      <div className="flex flex-col justify-between h-full group" title={`${widget.title[lang] || widget.title.en}: ${fullVal}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block truncate">
              {widget.title[lang] || widget.title.en}
            </span>
            <div className="text-2xl font-bold text-gray-900 font-mono tabular-nums mt-1 tracking-tight">
              {displayVal}
            </div>
            {!privacyMode && !isPct && (
              <div className="text-[11px] text-gray-400 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {fullVal}
              </div>
            )}
          </div>

          {/* Delta Tag */}
          {hasDelta && (
            <div
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isDeltaPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {isDeltaPositive ? (
                <TrendingUp className="w-3 h-3 shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 shrink-0" />
              )}
              <span>{Math.abs(data.deltaPercent)}%</span>
            </div>
          )}
        </div>

        {/* Secondary metric or popover detail */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          {data.accounts ? (
            <span className="truncate">
              {data.accounts.length} {lang === "bn" ? "অ্যাকাউন্ট" : "Active Accounts"}
            </span>
          ) : data.activeProjects ? (
            <span>{data.activeProjects} {lang === "bn" ? "টি সক্রিয় প্রকল্প" : "Active Projects"}</span>
          ) : data.overdueCount ? (
            <span className="text-rose-600 font-medium">
              {data.overdueCount} {lang === "bn" ? "টি কিস্তি মেয়াদোত্তীর্ণ" : "Overdue Dues"}
            </span>
          ) : data.pendingCount ? (
            <span className="text-amber-600 font-medium">
              {data.pendingCount} {lang === "bn" ? "টি ভাউচার অপেক্ষমাণ" : "Pending Vouchers"}
            </span>
          ) : data.realizedProfit !== undefined ? (
            <span>{lang === "bn" ? "নগদ অর্জিত: " : "Realized: "}{maskCompact(data.realizedProfit)}</span>
          ) : (
            <span className="text-gray-400 truncate">{widget.description[lang] || widget.description.en}</span>
          )}

          {canDrillDown && widget.requiresModules && (
            <span className="text-olive-700 hover:text-olive-900 font-medium flex items-center gap-0.5 cursor-pointer ml-auto">
              <span>{lang === "bn" ? "বিস্তারিত" : "Details"}</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. QUICK ACTIONS
  // -------------------------------------------------------------
  if (widget.type === "quick_actions") {
    const actions = data.actions || [];
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 h-full items-center">
        {actions.map((act: any, i: number) => {
          const IconComp = ICONS_MAP[act.icon] || FileText;
          return (
            <Link
              key={i}
              href={act.url}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:border-olive-600 hover:bg-olive-50/50 transition-all text-xs font-semibold text-gray-800 shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-md bg-olive-100 text-olive-800 flex items-center justify-center shrink-0 group-hover:bg-olive-700 group-hover:text-white transition-colors">
                <IconComp className="w-4 h-4" />
              </div>
              <span className="truncate">{act.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. ALERTS BANNER WIDGET
  // -------------------------------------------------------------
  if (widget.type === "alerts") {
    return (
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">
              {lang === "bn" ? "সিস্টেম রিয়েল-টাইম অডিট ও নজরদারি" : "Real-time Syndicate Health Monitoring"}
            </h4>
            <p className="text-emerald-700 text-[11px] mt-0.5">
              {lang === "bn"
                ? "তারল্য, ভাউচার অনুমোদন, বায়না চুক্তি এবং কিস্তি আদায় স্বয়ংক্রিয়ভাবে ট্র্যাক করা হচ্ছে।"
                : "Continuous tracking of liquidity reserves, pending approvals, bayna deadlines, and installment dues."}
            </p>
          </div>
        </div>
        <Link
          href="/reports"
          className="shrink-0 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          {lang === "bn" ? "অডিট রিপোর্ট" : "Audit Reports"}
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. CHARTS (with Table Toggle)
  // -------------------------------------------------------------
  if (widget.type === "chart") {
    const toggleButton = (
      <button
        onClick={() => setShowTable(!showTable)}
        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition-colors"
        title={showTable ? "View Chart" : "View Data Table"}
      >
        {showTable ? <BarChart2 className="w-3.5 h-3.5" /> : <TableIcon className="w-3.5 h-3.5" />}
      </button>
    );

    // If table view is toggled for chart:
    if (showTable) {
      const items = Array.isArray(data) ? data : [];
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Data View</span>
            {toggleButton}
          </div>
          <div className="overflow-auto max-h-56 text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400">
                  {items[0] &&
                    Object.keys(items[0]).map((k) => (
                      <th key={k} className="pb-1 font-medium capitalize">
                        {k}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((row: any, idx: number) => (
                  <tr key={idx}>
                    {Object.values(row).map((val: any, vi: number) => (
                      <td key={vi} className="py-1 font-mono">
                        {typeof val === "number" ? maskMoney(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Chart: Cash Flow Trend
    if (widget.key === "cash_flow_trend") {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-mono">12-Month Inflow / Outflow</span>
            {toggleButton}
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} interval={1} />
              <YAxis
                tickFormatter={(v) => maskCompact(v)}
                width={55}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(v: any) => [maskMoney(v), ""]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
              <Bar dataKey="inflow" name="Inflow" fill="#059669" radius={[3, 3, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill="#dc2626" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Chart: Donut (Cost Share or Plot Status or Partner Equity)
    if (
      widget.key === "project_cost_share" ||
      widget.key === "plot_inventory_status" ||
      widget.key === "partner_equity_dist"
    ) {
      const items = Array.isArray(data) ? data : [];
      const valKey = widget.key === "plot_inventory_status" ? "count" : widget.key === "partner_equity_dist" ? "equity" : "cost";
      const total = items.reduce((s, it) => s + (Number(it[valKey]) || 0), 0);

      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-mono">
              Total: {widget.key === "plot_inventory_status" ? `${total} Plots` : maskCompact(total)}
            </span>
            {toggleButton}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={items}
                dataKey={valKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
              >
                {items.map((entry: any, i: number) => (
                  <Cell
                    key={i}
                    fill={entry.fill || CHART_PALETTE[i % CHART_PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any, name: any) => [
                  widget.key === "plot_inventory_status" ? `${v} Plots` : maskMoney(v),
                  name,
                ]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Chart: Cash Flow Forecast (90 Days)
    if (widget.key === "cash_flow_forecast") {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-mono">Threshold: ৳ 5 Lakh min</span>
            {toggleButton}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis
                tickFormatter={(v) => maskCompact(v)}
                width={60}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(v: any) => [maskMoney(v), "Projected"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <ReferenceLine y={500000} stroke="#dc2626" strokeDasharray="3 3" label={{ value: "Min Buffer", fill: "#dc2626", fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="projectedLiquidity"
                name="Projected Funds"
                stroke="#435334"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Default Grouped / Horizontal Bar Chart
    const barData = Array.isArray(data) ? data : [];
    const isMultiBar = barData[0] && ("cost" in barData[0] && "sales" in barData[0]);

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-mono">{widget.title[lang] || widget.title.en}</span>
          {toggleButton}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey={barData[0]?.category ? "category" : barData[0]?.bucket ? "bucket" : barData[0]?.month ? "month" : "name"}
              tick={{ fontSize: 10, fill: "#64748b" }}
              interval={0}
              angle={-10}
              textAnchor="end"
            />
            <YAxis
              tickFormatter={(v) => maskCompact(v)}
              width={55}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            <Tooltip
              formatter={(v: any) => [maskMoney(v), ""]}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            {isMultiBar ? (
              <>
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="cost" name="Cost" fill="#dc2626" radius={[3, 3, 0, 0]} />
                <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#059669" radius={[3, 3, 0, 0]} />
              </>
            ) : (
              <Bar
                dataKey={barData[0]?.amount ? "amount" : barData[0]?.profit ? "profit" : "cost"}
                fill="#435334"
                radius={[3, 3, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. TABLES
  // -------------------------------------------------------------
  if (widget.type === "table") {
    const rows = Array.isArray(data) ? data : [];
    if (rows.length === 0) {
      return <div className="text-gray-400 text-xs py-6 text-center">No records recorded</div>;
    }

    // Recent Transactions Table
    if (widget.key === "recent_transactions") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Purpose</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Flow</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50/75 transition-colors">
                  <td className="py-2.5 font-mono text-gray-600 whitespace-nowrap">
                    <span>{formatDate(r.txnDate, { lang })}</span>
                    {r.isFutureDated && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-semibold bg-amber-100 text-amber-800 rounded-sm border border-amber-200">
                        {lang === "bn" ? "ভবিষ্যতের তারিখ" : "Future"}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 font-medium text-gray-900 truncate max-w-xs">{r.purpose}</td>
                  <td className="py-2.5 text-gray-500 font-mono text-[11px]">{r.accountType}</td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        r.flowType === "IN"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {r.flowType}
                    </span>
                  </td>
                  <td
                    className={`py-2.5 text-right font-mono font-semibold tabular-nums ${
                      r.flowType === "IN" ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {r.flowType === "OUT" ? "-" : "+"}
                    {maskMoney(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Projects Summary Table
    if (widget.key === "project_summary") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="pb-2 font-medium">Project</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Cost</th>
                <th className="pb-2 font-medium text-right">Sales</th>
                <th className="pb-2 font-medium text-right">Recovery %</th>
                <th className="pb-2 font-medium text-right">Plots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50/75">
                  <td className="py-2.5 font-semibold text-gray-900">{p.projectName}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-gray-700">{maskMoney(p.totalCost)}</td>
                  <td className="py-2.5 text-right font-mono text-gray-900 font-semibold">{maskMoney(p.totalSales)}</td>
                  <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">{p.collectionPercent}%</td>
                  <td className="py-2.5 text-right font-mono text-gray-500">
                    {p.availablePlots}/{p.totalPlots} avail
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Partner Summary Table
    if (widget.key === "partner_summary") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="pb-2 font-medium">Partner Name</th>
                <th className="pb-2 font-medium">Phone</th>
                <th className="pb-2 font-medium text-right">Deposited</th>
                <th className="pb-2 font-medium text-right">Withdrawn</th>
                <th className="pb-2 font-medium text-right">Live Balance</th>
                <th className="pb-2 font-medium text-right">Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((pr: any) => (
                <tr key={pr.id} className="hover:bg-gray-50/75">
                  <td className="py-2.5 font-semibold text-gray-900">{pr.name}</td>
                  <td className="py-2.5 font-mono text-gray-500">{pr.phone}</td>
                  <td className="py-2.5 text-right font-mono text-emerald-700 font-medium">{maskMoney(pr.deposited)}</td>
                  <td className="py-2.5 text-right font-mono text-rose-600">{maskMoney(pr.withdrawn)}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-gray-900">{maskMoney(pr.liveBalance)}</td>
                  <td className="py-2.5 text-right font-mono text-gray-600 font-medium">{pr.avgShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  // -------------------------------------------------------------
  // 6. LISTS
  // -------------------------------------------------------------
  if (widget.type === "list") {
    const list = Array.isArray(data) ? data : [];
    if (list.length === 0) {
      return (
        <div className="text-gray-400 text-xs py-6 text-center">
          {lang === "bn" ? "কোনো পেন্ডিং রেকর্ড নেই" : "No pending items"}
        </div>
      );
    }

    // Overdue Installments List
    if (widget.key === "overdue_installments") {
      return (
        <div className="divide-y divide-gray-100 text-xs">
          {list.map((item: any) => (
            <div key={item.id} className="py-2 flex items-center justify-between gap-2 hover:bg-gray-50/60 p-1.5 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 truncate">{item.buyerName}</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-medium">
                    {item.daysOverdue}d overdue
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">
                  {item.projectName} • Plot {item.plotNumber}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-rose-700 tabular-nums">
                  {maskMoney(item.dueAmount)}
                </div>
                <a
                  href={`tel:${item.buyerPhone}`}
                  className="inline-flex items-center gap-1 text-[10px] text-olive-700 hover:text-olive-900 font-semibold mt-0.5"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>{item.buyerPhone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Pending Vouchers List
    if (widget.key === "pending_vouchers") {
      return (
        <div className="divide-y divide-gray-100 text-xs">
          {list.map((v: any) => (
            <div key={v.id} className="py-2 flex items-center justify-between gap-2 hover:bg-gray-50/60 p-1.5 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">{v.purpose}</div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">
                  {v.projectName} • {v.expenseCategory}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-amber-700 tabular-nums">
                  {maskMoney(v.amount)}
                </div>
                <Link
                  href="/vouchers"
                  className="inline-flex items-center gap-0.5 text-[10px] text-olive-700 hover:text-olive-900 font-semibold mt-0.5"
                >
                  <span>{lang === "bn" ? "অনুমোদন" : "Review"}</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  return <div className="text-gray-400 text-xs py-4 text-center">Unsupported widget type</div>;
}

