import { useState } from "react";
import { entities } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Plus, Trash2, BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TestEntryForm from "@/components/testing/TestEntryForm";
import TestProgressCharts from "@/components/testing/TestProgressCharts";
import TestBenchmarks from "@/components/testing/TestBenchmarks";

const TEST_LABELS = {
  mile_time_seconds: "1 Mile", sprint_100m_seconds: "100m Sprint", broad_jump_cm: "Broad Jump",
  vertical_jump_cm: "Vertical Jump", bronco_time_seconds: "Bronco", beep_test_level: "Beep Test",
  pushups: "Push-ups", situps: "Sit-ups", flexibility_cm: "Flexibility",
};

function formatValue(key, val) {
  if (key.includes("time") || key.includes("seconds")) {
    if (val >= 60) return `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, "0")}`;
    return `${val}s`;
  }
  if (key === "beep_test_level") return `Lvl ${val}`;
  if (key.includes("cm")) return `${val}cm`;
  return `${val}`;
}

export default function Testing() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["athleteTests"],
    queryFn: () => entities.AthleteTest.list("-test_date", 50),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["athleteProfile"],
    queryFn: () => entities.AthleteProfile.list(),
  });
  const profile = profiles[0] || null;

  const createMutation = useMutation({
    mutationFn: d => entities.AthleteTest.create(d),
    onSuccess: () => { queryClient.invalidateQueries(["athleteTests"]); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: id => entities.AthleteTest.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["athleteTests"]),
  });

  const sortedTests = [...tests].sort((a, b) => new Date(b.test_date) - new Date(a.test_date));

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]/50 px-5 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <p className="kaya-label mb-2">Performance</p>
          <h1 className="font-display text-3xl text-[var(--text)]">Testing Tracker</h1>
          <p className="text-[var(--text)]/40 text-sm font-body mt-1">Log monthly tests, track progress and benchmark against sport norms.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(v => !v)} variant={showForm ? "ghost" : "default"}
            className={showForm ? "text-[var(--text)]/40" : "bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E]"}>
            {showForm ? <><X className="w-4 h-4 mr-2" />Cancel</> : <><Plus className="w-4 h-4 mr-2" />Log New Test</>}
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="font-display text-xl text-[var(--text)] mb-5">New Test Session</h3>
                <TestEntryForm onSubmit={d => createMutation.mutate(d)} isLoading={createMutation.isPending} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {tests.length === 0 && !isLoading && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-16 text-center">
            <FlaskConical className="w-12 h-12 text-[var(--border)] mx-auto mb-4" />
            <p className="font-display text-xl text-[var(--text)] mb-2">No test results yet</p>
            <p className="text-[var(--text)]/40 text-sm font-body mb-6">Log your first session to start tracking performance.</p>
            <Button onClick={() => setShowForm(true)} className="bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E]">
              <Plus className="w-4 h-4 mr-2" />Log First Test
            </Button>
          </div>
        )}

        {tests.length > 0 && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-1">
              {[{ id: "history", label: "History" }, { id: "charts", label: "Progress Charts" }, { id: "analysis", label: "AI Analysis" }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-body font-medium transition-all ${activeTab === tab.id ? "bg-[#1B7A4A] text-[var(--bg)]" : "text-[var(--text)]/40 hover:text-[var(--text)]/70"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* History */}
            {activeTab === "history" && (
              <div className="space-y-3">
                {sortedTests.map((test, i) => {
                  const keys = Object.keys(TEST_LABELS).filter(k => test[k] != null);
                  return (
                    <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[#1B7A4A]/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-display text-lg text-[var(--text)]">{format(new Date(test.test_date), "d MMMM yyyy")}</p>
                          <p className="kaya-label mt-0.5">{keys.length} metrics recorded</p>
                        </div>
                        <button onClick={() => window.confirm("Delete this test?") && deleteMutation.mutate(test.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--border)] hover:text-red-400 hover:bg-red-900/20 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {keys.map(k => (
                          <span key={k} className="inline-flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] text-xs font-mono text-[#1B7A4A] px-3 py-1.5 rounded-xl">
                            {TEST_LABELS[k]}: <strong>{formatValue(k, test[k])}</strong>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Charts */}
            {activeTab === "charts" && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 className="w-5 h-5 text-[#1B7A4A]" />
                  <h3 className="font-display text-xl text-[var(--text)]">Progress Over Time</h3>
                </div>
                <TestProgressCharts tests={tests} />
              </div>
            )}

            {/* AI Analysis */}
            {activeTab === "analysis" && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <TestBenchmarks tests={tests} profile={profile} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
