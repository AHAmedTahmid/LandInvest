"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatBDT, formatCompactBDT } from "@/lib/format";

const COLORS = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

export function PartnerEquityDonut({ data }: { data: Array<{ name: string; value: number }> }) {
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No partner equity recorded yet</div>;
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [
              `${formatBDT(Number(value))} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
              "Equity Injected",
            ]}
            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CapitalHistoryBarChart({ data }: { data: Array<{ month: string; amount: number }> }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No historical capital deposits</div>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis
            tickFormatter={(v) => formatCompactBDT(Number(v))}
            tick={{ fontSize: 11, fill: "#64748b" }}
            width={65}
          />
          <Tooltip
            formatter={(value: any) => [formatBDT(Number(value)), "Capital Inflow"]}
            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
          <Bar dataKey="amount" fill="#047857" radius={[4, 4, 0, 0]} name="Inflow Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
