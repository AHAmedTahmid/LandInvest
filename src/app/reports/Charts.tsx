"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
export default function ReportsCharts({data}:{data:any[]}){
  return <div className="bg-white rounded-xl shadow border p-4 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><XAxis dataKey="projectName"/><YAxis/><Tooltip/><Legend/><Bar dataKey="revenue" fill="#22c55e"/><Bar dataKey="totalCost" fill="#ef4444"/><Bar dataKey="netProfit" fill="#3b82f6"/></BarChart></ResponsiveContainer></div>;
}
