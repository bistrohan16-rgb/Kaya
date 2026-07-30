import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
const METRICS = [
  { key: "mile_time_seconds", label: "1 Mile Run", unit: "s", lowerIsBetter: true, color: "#6366f1" },
  { key: "sprint_100m_seconds", label: "100m Sprint", unit: "s", lowerIsBetter: true, color: "#f59e0b" },
  { key: "broad_jump_cm", label: "Broad Jump", unit: "cm", lowerIsBetter: false, color: "#10b981" },
  { key: "vertical_jump_cm", label: "Vertical Jump", unit: "cm", lowerIsBetter: false, color: "#3b82f6" },
  { key: "bronco_time_seconds", label: "Bronco Shuttle", unit: "s", lowerIsBetter: true, color: "#ef4444" },
  { key: "beep_test_level", label: "Beep Test", unit: "lvl", lowerIsBetter: false, color: "#8b5cf6" },
  { key: "pushups", label: "Push-ups", unit: "reps", lowerIsBetter: false, color: "#ec4899" },
  { key: "situps", label: "Sit-ups", unit: "reps", lowerIsBetter: false, color: "#14b8a6" },
  { key: "flexibility_cm", label: "Flexibility", unit: "cm", lowerIsBetter: false, color: "#f97316" },
];
function formatSeconds(s) { if (s >= 60) { const m = Math.floor(s/60); const sec = Math.round(s%60); return `${m}:${sec.toString().padStart(2,"0")}`; } return `${s}s`; }
export default function TestProgressCharts({ tests }) {
  const [selected, setSelected] = useState("sprint_100m_seconds");
  const availableMetrics = METRICS.filter(m => tests.some(t => t[m.key] != null));
  if (availableMetrics.length === 0) return null;
  const metric = METRICS.find(m => m.key === selected) || availableMetrics[0];
  const chartData = [...tests].filter(t => t[metric.key] != null).sort((a,b) => new Date(a.test_date) - new Date(b.test_date)).map(t => ({ date: format(new Date(t.test_date), "MMM d"), value: t[metric.key] }));
  const first = chartData[0]?.value; const last = chartData[chartData.length-1]?.value;
  const improved = last != null && first != null ? metric.lowerIsBetter ? last < first : last > first : null;
  const delta = last != null && first != null ? Math.abs(last - first).toFixed(1) : null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableMetrics.map(m => (
          <button key={m.key} onClick={() => setSelected(m.key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selected === m.key ? "text-white shadow-sm" : "bg-[#162232] border border-[#2A3F58] text-[#F8F8F8]/50 hover:bg-[#2A3F58]"}`} style={selected === m.key ? { backgroundColor: m.color } : {}}>{m.label}</button>
        ))}
      </div>
      <div className="bg-[#162232] border border-[#2A3F58] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-[#F8F8F8]">{metric.label}</h4>
            {delta && <p className={`text-sm mt-0.5 font-medium ${improved ? "text-emerald-400" : "text-red-400"}`}>{improved ? "▲" : "▼"} {delta} {metric.unit} since first test</p>}
          </div>
          {last != null && <div className="text-right"><p className="text-2xl font-bold text-[#F8F8F8]">{metric.key.includes("time") || metric.key.includes("seconds") ? formatSeconds(last) : `${last} ${metric.unit}`}</p><p className="text-xs text-[#F8F8F8]/30">Latest</p></div>}
        </div>
        {chartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3F58" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#B8960C" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#B8960C" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2A3F58", backgroundColor: "#162232", color: "#F8F8F8", fontSize: 12 }} formatter={v => [`${v} ${metric.unit}`, metric.label]} />
              <Line type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2.5} dot={{ r: 4, fill: metric.color, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="h-[180px] flex items-center justify-center"><p className="text-[#F8F8F8]/30 text-sm">Log at least 2 tests to see your progress chart</p></div>}
      </div>
    </div>
  );
}
