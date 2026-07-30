import { useState } from "react";
import { ai } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TestBenchmarks({ tests, profile }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const latestTest = [...tests].sort((a, b) => new Date(b.test_date) - new Date(a.test_date))[0];

  const analyze = async () => {
    if (!latestTest) return;
    setLoading(true);
    const result = await ai.invoke({
      prompt: `Analyze athletic test results for a ${profile?.age || "unknown"}-year-old ${profile?.experience_level || ""} ${profile?.sport || "athlete"}.
Latest results:
${latestTest.mile_time_seconds ? `- 1 Mile: ${Math.floor(latestTest.mile_time_seconds/60)}:${(latestTest.mile_time_seconds%60).toString().padStart(2,"0")}` : ""}
${latestTest.sprint_100m_seconds ? `- 100m Sprint: ${latestTest.sprint_100m_seconds}s` : ""}
${latestTest.broad_jump_cm ? `- Broad Jump: ${latestTest.broad_jump_cm}cm` : ""}
${latestTest.vertical_jump_cm ? `- Vertical Jump: ${latestTest.vertical_jump_cm}cm` : ""}
${latestTest.pushups ? `- Push-ups: ${latestTest.pushups}` : ""}
${latestTest.situps ? `- Sit-ups: ${latestTest.situps}` : ""}
Provide ratings (excellent/good/average/below_average), top 2 strengths, top 2 areas to improve, and training recommendations.`,
      response_json_schema: {
        type: "object",
        properties: {
          ratings: { type: "array", items: { type: "object", properties: { test: { type: "string" }, value: { type: "string" }, rating: { type: "string", enum: ["excellent","good","average","below_average"] }, benchmark: { type: "string" } } } },
          strengths: { type: "array", items: { type: "string" } },
          improvements: { type: "array", items: { type: "string" } },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    });
    setAnalysis(result);
    setLoading(false);
  };

  const ratingColors = { excellent: "bg-[#1E5C3A]/20 text-emerald-400 border-[#1E5C3A]/30", good: "bg-[#B8960C]/10 text-[#B8960C] border-[#B8960C]/20", average: "bg-[#C44A1A]/10 text-[#C44A1A] border-[#C44A1A]/20", below_average: "bg-red-900/20 text-red-400 border-red-800/30" };
  const ratingIcons = { excellent: <TrendingUp className="w-3.5 h-3.5" />, good: <TrendingUp className="w-3.5 h-3.5" />, average: <Minus className="w-3.5 h-3.5" />, below_average: <TrendingDown className="w-3.5 h-3.5" /> };

  if (!latestTest) return null;

  return (
    <div className="space-y-4">
      {!analysis && (
        <div className="bg-[#162232] border border-[#B8960C]/20 rounded-2xl p-5 text-center">
          <Sparkles className="w-8 h-8 text-[#B8960C] mx-auto mb-2" />
          <p className="font-semibold text-[#F8F8F8] mb-1">AI Performance Analysis</p>
          <p className="text-sm text-slate-500 mb-4">Get benchmarked against age and sport norms.</p>
          <Button onClick={analyze} disabled={loading} className="bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] rounded-xl">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analysing...</> : <><Sparkles className="w-4 h-4 mr-2" />Analyse My Results</>}
          </Button>
        </div>
      )}
      {analysis && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.ratings?.map((r, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${ratingColors[r.rating]}`}>
                <div><p className="font-semibold text-sm">{r.test}</p><p className="text-xs opacity-75">{r.value} — {r.benchmark}</p></div>
                <div className="flex items-center gap-1 text-xs font-bold capitalize">{ratingIcons[r.rating]}{r.rating.replace("_"," ")}</div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#1E5C3A]/10 border border-[#1E5C3A]/20 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">💪 Strengths</p>
              <ul className="space-y-1.5">{analysis.strengths?.map((s,i) => <li key={i} className="text-sm text-[#F8F8F8]/70 flex gap-2"><span className="text-emerald-500">✓</span>{s}</li>)}</ul>
            </div>
            <div className="bg-[#C44A1A]/10 border border-[#C44A1A]/20 rounded-2xl p-4">
              <p className="text-xs font-bold text-[#C44A1A] uppercase tracking-wide mb-2">🎯 Areas to Improve</p>
              <ul className="space-y-1.5">{analysis.improvements?.map((s,i) => <li key={i} className="text-sm text-[#F8F8F8]/70 flex gap-2"><span className="text-amber-500">→</span>{s}</li>)}</ul>
            </div>
          </div>
          <div className="bg-[#162232] border border-[#2A3F58] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#B8960C] uppercase tracking-wide mb-2">📋 Training Recommendations</p>
            <ul className="space-y-1.5">{analysis.recommendations?.map((r,i) => <li key={i} className="text-sm text-[#F8F8F8]/70 flex gap-2"><span className="text-blue-500">{i+1}.</span>{r}</li>)}</ul>
          </div>
          <Button variant="outline" onClick={() => setAnalysis(null)} size="sm" className="rounded-xl">Refresh Analysis</Button>
        </div>
      )}
    </div>
  );
}
