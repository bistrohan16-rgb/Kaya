import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { entities, ai } from "@/api/supabaseClient";
import { Loader2, Sparkles, Trophy, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const TEST_LABELS = {
  mile_time_seconds: { label: "1 Mile", lowerIsBetter: true }, sprint_100m_seconds: { label: "100m Sprint", lowerIsBetter: true },
  broad_jump_cm: { label: "Broad Jump", lowerIsBetter: false }, vertical_jump_cm: { label: "Vertical Jump", lowerIsBetter: false },
  bronco_time_seconds: { label: "Bronco", lowerIsBetter: true }, beep_test_level: { label: "Beep Test", lowerIsBetter: false },
  pushups: { label: "Push-ups", lowerIsBetter: false }, situps: { label: "Sit-ups", lowerIsBetter: false }, flexibility_cm: { label: "Flexibility", lowerIsBetter: false },
};

function fmtVal(key, val) {
  if (val == null) return "—";
  if (key.includes("time") || key.includes("seconds")) { if (val >= 60) return `${Math.floor(val/60)}:${String(Math.round(val%60)).padStart(2,"0")}`; return `${val}s`; }
  if (key === "beep_test_level") return `Lvl ${val}`;
  if (key.includes("cm")) return `${val}cm`;
  return String(val);
}

const TIER_COLORS = {
  "Starting Lineup": { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-500", text: "text-emerald-800", icon: Trophy },
  "Strong Squad Pick": { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", text: "text-blue-800", icon: TrendingUp },
  "Development Player": { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-400", text: "text-amber-800", icon: TrendingUp },
  "Needs Improvement": { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-400", text: "text-red-800", icon: AlertTriangle },
};

function AthleteReportCard({ report, index }) {
  const [expanded, setExpanded] = useState(false);
  const tier = report.selection_tier || "Development Player";
  const colors = TIER_COLORS[tier] || TIER_COLORS["Development Player"];
  const TierIcon = colors.icon;
  return (
    <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
      <div className="p-4 flex items-start gap-3 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-slate-700 text-base flex-shrink-0 shadow-sm">#{index+1}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-900">{report.athlete_name || report.athlete_email}</p>
            <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full flex items-center gap-1 ${colors.badge}`}><TierIcon className="w-3 h-3" />{tier}</span>
          </div>
          <p className={`text-sm mt-0.5 ${colors.text}`}>{report.summary}</p>
        </div>
        <span className="text-slate-400 text-xs mt-1 flex-shrink-0">{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/60 pt-3">
          {report.strengths?.length > 0 && <div><p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5">💪 Strengths</p><ul className="space-y-1">{report.strengths.map((s,i) => <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">✓</span>{s}</li>)}</ul></div>}
          {report.weaknesses?.length > 0 && <div><p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">⚠️ Areas to Improve</p><ul className="space-y-1">{report.weaknesses.map((s,i) => <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">→</span>{s}</li>)}</ul></div>}
          {report.selection_advice && <div className="bg-white/70 rounded-xl p-3"><p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">📋 Selection Advice</p><p className="text-sm text-slate-700">{report.selection_advice}</p></div>}
          {report.training_focus && <div className="bg-white/70 rounded-xl p-3"><p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">🎯 Training Focus</p><p className="text-sm text-slate-700">{report.training_focus}</p></div>}
        </div>
      )}
    </div>
  );
}

export default function TeamSelectionReport({ athletes, coachId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sport, setSport] = useState("");

  const { data: allTests = [] } = useQuery({
    queryKey: ["allTeamTests", athletes.map(a => a.athlete_email).join(",")],
    queryFn: async () => { const results = await Promise.all(athletes.map(a => entities.AthleteTest.filter({ athlete_email: a.athlete_email }))); return results.flat(); },
    enabled: athletes.length > 0,
  });

  const generateReport = async () => {
    setLoading(true);
    const athleteData = athletes.map(a => {
      const tests = allTests.filter(t => t.athlete_email === a.athlete_email).sort((x,y) => new Date(y.test_date) - new Date(x.test_date));
      const latest = tests[0];
      const metrics = latest ? Object.keys(TEST_LABELS).filter(k => latest[k] != null).map(k => `${TEST_LABELS[k].label}: ${fmtVal(k, latest[k])}`).join(", ") : "No test data";
      return { name: a.athlete_name || a.athlete_email, email: a.athlete_email, metrics, testCount: tests.length };
    });

    const result = await ai.invoke({
      prompt: `You are an experienced sports coach. Analyse this team's fitness test results and produce a selection report.
${sport ? `Sport: ${sport}` : "Sport not specified."}
Team data:
${athleteData.map((a,i) => `${i+1}. ${a.name} (${a.testCount} test session(s)):\n   ${a.metrics}`).join("\n\n")}
For EACH athlete provide: summary, 2 strengths, 2 weaknesses, selection_tier (exactly one of: "Starting Lineup", "Strong Squad Pick", "Development Player", "Needs Improvement"), selection_advice, training_focus. Return ranked with strongest first.`,
      response_json_schema: {
        type: "object",
        properties: {
          team_summary: { type: "string" },
          players: { type: "array", items: { type: "object", properties: { athlete_email: { type: "string" }, athlete_name: { type: "string" }, summary: { type: "string" }, strengths: { type: "array", items: { type: "string" } }, weaknesses: { type: "array", items: { type: "string" } }, selection_tier: { type: "string" }, selection_advice: { type: "string" }, training_focus: { type: "string" } } } }
        }
      }
    });
    setReport(result);
    setLoading(false);
  };

  const athletesWithTests = athletes.filter(a => allTests.some(t => t.athlete_email === a.athlete_email));

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-violet-200" /><span className="font-bold">AI Team Selection Report</span></div>
        <p className="text-violet-200 text-sm">The AI analyses each athlete's fitness test data and produces a ranked selection report.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input type="text" placeholder="Sport (optional)" value={sport} onChange={e => setSport(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
          <Button onClick={generateReport} disabled={loading || athletes.length === 0} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex-shrink-0">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analysing…</> : <><Sparkles className="w-4 h-4 mr-2" />{report ? "Re-run Report" : "Generate Report"}</>}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5" />
          <span>{athletes.length} athlete(s) · {athletesWithTests.length} with test data</span>
        </div>
      </div>
      {report && (
        <div className="space-y-4">
          {report.team_summary && <div className="bg-slate-900 text-white rounded-2xl p-5"><p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Overall Team Assessment</p><p className="text-sm leading-relaxed">{report.team_summary}</p></div>}
          <div className="space-y-3">{(report.players || []).map((player, i) => <AthleteReportCard key={player.athlete_email || i} report={player} index={i} />)}</div>
          <button onClick={() => setReport(null)} className="text-xs text-slate-400 underline">Clear report</button>
        </div>
      )}
    </div>
  );
}
