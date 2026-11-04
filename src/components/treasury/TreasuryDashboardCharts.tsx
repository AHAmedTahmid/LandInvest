"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatBDT, formatCompactBDT } from "@/lib/format";

const PALETTE = [
  "#059669", // Emerald (Cash)
  "#2563eb", // Blue (Bank 1)
  "#d97706", // Amber (Bank 2)
  "#7c3aed", // Purple (MFS 1 - bKash)
  "#e11d48", // Rose (Nagad)
  "#0891b2", // Cyan
  "#435334", // Olive
  "#475569", // Slate
];

interface AccountShare {
  name: string;
  type: string;
  balance: number;
}

export function AccountDistributionDonut({ data }: { data: AccountShare[] }) {
  const total = data.reduce((s, d) => s + Math.max(0, d.balance), 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400">
        <p>No liquidity recorded across cash or bank accounts.</p>
      </div>
    );
  }

  const chartData = data
    .filter((d) => d.balance > 0)
    .map((d) => ({
      name: d.name,
      value: d.balance,
      percent: ((d.balance / total) * 100).toFixed(1),
      type: d.type,
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any, props: any) => [
              `${formatBDT(Number(value))} (${props.payload.percent}%)`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
            formatter={(value, entry: any) => (
              <span className="text-slate-700 font-medium">
                {value} ({entry.payload.percent}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MonthlyFlow {
  month: string;
  inflow: number;
  outflow: number;
}

export function CashFlowTrendBarChart({ data }: { data: MonthlyFlow[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400">
        <p>No monthly flow history available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCompactBDT(val)}
            width={70}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              formatBDT(Number(value)),
              name === "inflow" ? "Total Inflows" : "Total Outflows",
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            formatter={(value) => (
              <span className="text-slate-700 font-medium">
                {value === "inflow" ? "Inflows (Receipts/Deposits)" : "Outflows (Expenses/Payouts)"}
              </span>
            )}
          />
          <Bar dataKey="inflow" fill="#059669" radius={[4, 4, 0, 0]} name="inflow" />
          <Bar dataKey="outflow" fill="#e11d48" radius={[4, 4, 0, 0]} name="outflow" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

