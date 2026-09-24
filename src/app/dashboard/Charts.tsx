"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const COLORS=["#2563eb","#16a34a","#f59e0b","#ef4444","#8b5cf6"];
export default function DashboardCharts({costByProject}:{costByProject:any[]}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow border p-4">
        <h3 className="font-semibold mb-2">Project-wise Cost (Bar)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costByProject}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="cost" fill="#2563eb"/></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl shadow border p-4">
        <h3 className="font-semibold mb-2">Project-wise Cost (Pie)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart><Pie data={costByProject} dataKey="cost" nameKey="name" label>{costByProject.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
