"use client";
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
} from "recharts";
import { formatBDT, formatCompactBDT } from "@/lib/format";
import { useLang } from "@/lib/i18n";

const COLORS = ["#435334", "#5B8FB9", "#D27685", "#E8AA42", "#7EAA92", "#9C27B0"];

export default function DashboardCharts({ costByProject }: { costByProject: any[] }) {
  const { lang } = useLang();
  const totalCost = costByProject.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

  const formattedData = costByProject.map((item) => {
    const cost = Number(item.cost) || 0;
    const pct = totalCost > 0 ? ((cost / totalCost) * 100).toFixed(1) : "0";
    return {
      ...item,
      cost,
      pct,
      displayName: `${item.name} (${pct}%)`,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
            {lang === "bn" ? "প্রকল্পভিত্তিক মোট খরচ (বার চার্ট)" : "Project-wise Cost (Bar Chart)"}
          </h3>
          <span className="text-xs text-gray-500 font-mono">
            {formatCompactBDT(totalCost, { lang })}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 20, left: 15, bottom: 25 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748b" }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              tickFormatter={(v) => formatCompactBDT(v, { lang, showCurrency: false })}
              width={65}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              formatter={(v: any) => [formatBDT(v, { lang }), lang === "bn" ? "মোট খরচ" : "Total Cost"]}
              contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Bar dataKey="cost" fill="#435334" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart with Legend and Percentages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
            {lang === "bn" ? "প্রকল্পভিত্তিক খরচ বণ্টন (ডোনাট চার্ট)" : "Project-wise Cost Share (Donut Chart)"}
          </h3>
          <span className="text-xs text-gray-500">
            {lang === "bn" ? "শেয়ার অনুপাত" : "Share Ratio"}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="cost"
              nameKey="displayName"
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
            >
              {formattedData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: any, name: any) => [
                formatBDT(v, { lang }),
                name,
              ]}
              contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
