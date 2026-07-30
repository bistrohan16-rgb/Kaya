import { useState } from "react";
import { entities, ai } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Activity, TrendingUp, Copy, Check, Loader2, Crown, AlertCircle, X, Trash2, Clock, BookOpen, ChevronDown, ChevronUp, Send, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscription } from "@/hooks/useSubscription";
import PremiumGate from "@/components/premium/PremiumGate";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TeamSelectionReport from "@/components/coach/TeamSelectionReport";
import { supabase } from "@/api/supabaseClient";

function generateCode(email) { return "COACH-" + email.split("@")[0].toUpperCase().slice(0,6) + Math.floor(1000 + Math.random() * 9000); }

const TEST_LABELS = {
  mile_time_seconds: { label: "1 Mile", icon: "🏃", unit: "s" }, sprint_100m_seconds: { label: "100m Sprint", icon: "⚡", unit: "s" },
  broad_jump_cm: { label: "Broad Jump", icon: "🦘", unit: "cm" }, vertical_jump_cm: { label: "Vertical Jump", icon: "📏", unit: "cm" },
  bronco_time_seconds: { label: "Bronco", icon: "🔄", unit: "s" }, beep_test_level: { label: "Beep Test", icon: "🔊", unit: "lvl" },
  pushups: { label: "Push-ups", icon: "💪", unit: "reps" }, situps: { label: "Sit-ups", icon: "🧘", unit: "reps" }, flexibility_cm: { label: "Flexibility", icon: "🤸", unit: "cm" },
};

function fmtVal(key, val) {
  if (val == null) return "—";
  if (key.includes("time") || key.includes("seconds")) { if (val >= 60) return `${Math.floor(val/60)}:${String(Math.round(val%60)).padStart(2,"0")}`; return `${val}s`; }
  if (key === "beep_test_level") return `Lvl ${val}`;
  if (key.includes("cm")) return `${val}cm`;
  return String(val);
}

function AthleteTestPanel({ athleteEmail, coachId }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMetric, setSelectedMetric] = useState("sprint_100m_seconds");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const { data: tests = [] } = useQuery({ queryKey: ["athleteTests", athleteEmail], queryFn: () => entities.AthleteTest.filter({ athlete_email: athleteEmail }), enabled: !!athleteEmail });
  const createMutation = useMutation({ mutationFn: (data) => entities.AthleteTest.create({ ...data, athlete_email: athleteEmail, coach_id: coachId }), onSuccess: () => { queryClient.invalidateQueries(["athleteTests", athleteEmail]); setShowForm(false); setForm({}); } });

  const sortedTests = [...tests].sort((a,b) => new Date(b.test_date) - new Date(a.test_date));
  const availableMetrics = Object.keys(TEST_LABELS).filter(k => tests.some(t => t[k] != null));
  const chartData = [...tests].filter(t => t[selectedMetric] != null).sort((a,b) => new Date(a.test_date) - new Date(b.test_date)).map(t => ({ date: format(new Date(t.test_date), "MMM d"), value: t[selectedMetric] }));

  const analyzeAthlete = async () => {
    const latest = sortedTests[0]; if (!latest) return;
    setAnalyzing(true);
    const result = await ai.invoke({ prompt: `Analyze athletic test results for ${athleteEmail}.\nLatest:\n${Object.keys(TEST_LABELS).filter(k => latest[k] != null).map(k => `- ${TEST_LABELS[k].label}: ${fmtVal(k, latest[k])}`).join("\n")}\nGive: top 2 strengths, top 2 areas needing work, 2 training recommendations.`, response_json_schema: { type: "object", properties: { strengths: { type: "array", items: { type: "string" } }, improvements: { type: "array", items: { type: "string" } }, recommendations: { type: "array", items: { type: "string" } } } } });
    setAnalysis(result); setAnalyzing(false);
  };

  const submitTest = () => { const payload = { test_date: date }; Object.entries(form).forEach(([k,v]) => { if (v !== "" && v != null) payload[k] = parseFloat(v); }); createMutation.mutate(payload); };

  return (
    <div className="space-y-4">
      <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
        <FlaskConical className="w-4 h-4" />{showForm ? "Cancel" : "Log Test Results"}{showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100 space-y-3">
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl max-w-xs text-sm" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(TEST_LABELS).map(([k,t]) => (
                  <div key={k} className="bg-white rounded-lg p-2 border border-slate-100">
                    <p className="text-[10px] text-slate-500 mb-1">{t.icon} {t.label} ({t.unit})</p>
                    <Input type="number" step="0.01" value={form[k] ?? ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder="—" className="h-7 text-xs rounded-lg px-2" />
                  </div>
                ))}
              </div>
              <Button onClick={submitTest} disabled={createMutation.isPending} size="sm" className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white">
                {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Send className="w-3.5 h-3.5 mr-1" />}Save Results
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {tests.length === 0 && <p className="text-xs text-slate-400 italic">No test results recorded yet.</p>}
      {tests.length > 0 && (
        <>
          {availableMetrics.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {availableMetrics.map(k => <button key={k} onClick={() => setSelectedMetric(k)} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${selectedMetric === k ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{TEST_LABELS[k]?.icon} {TEST_LABELS[k]?.label}</button>)}
              </div>
              {chartData.length >= 2 ? <ResponsiveContainer width="100%" height={100}><LineChart data={chartData}><XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} /><Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }} /></LineChart></ResponsiveContainer> : <p className="text-[10px] text-slate-400">Log 2+ tests to see chart</p>}
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Latest ({format(new Date(sortedTests[0].test_date), "d MMM yyyy")})</p>
            <div className="flex flex-wrap gap-1.5">{Object.keys(TEST_LABELS).filter(k => sortedTests[0][k] != null).map(k => <span key={k} className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{TEST_LABELS[k].icon} {fmtVal(k, sortedTests[0][k])}</span>)}</div>
          </div>
          {!analysis ? <Button onClick={analyzeAthlete} disabled={analyzing} variant="outline" size="sm" className="rounded-xl text-xs">{analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />}AI Coaching Notes</Button>
          : <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs">{analysis.strengths?.map((s,i) => <span key={i} className="block text-emerald-700">✓ {s}</span>)}{analysis.improvements?.map((s,i) => <span key={i} className="block text-amber-700">→ {s}</span>)}{analysis.recommendations?.map((s,i) => <span key={i} className="block text-blue-700">{i+1}. {s}</span>)}<button onClick={() => setAnalysis(null)} className="text-slate-400 underline text-[10px]">Refresh</button></div>}
        </>
      )}
    </div>
  );
}

export default function CoachDashboard() {
  const queryClient = useQueryClient();
  const { user, isCoach, isLoading: subLoading } = useSubscription();
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [assigningTo, setAssigningTo] = useState(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [expandedAthlete, setExpandedAthlete] = useState(null);
  const [expandedSection, setExpandedSection] = useState({});
  const [activeTab, setActiveTab] = useState("athletes");

  const coachCode = user?.coach_code || null;

  const ensureCoachCode = useMutation({ mutationFn: async () => { const { data } = await supabase.from('users').update({ coach_code: generateCode(user.email) }).eq('id', user.id).select().single(); return data; }, onSuccess: () => queryClient.invalidateQueries(["currentUser"]) });
  if (user && !user.coach_code && isCoach && !ensureCoachCode.isPending) ensureCoachCode.mutate();

  const { data: connections = [], isLoading: connectionsLoading } = useQuery({ queryKey: ["coachConnections", user?.id], queryFn: () => entities.CoachConnection.filter({ coach_id: user.id }), enabled: !!user?.id && isCoach });
  const { data: allWorkoutLogs = [] } = useQuery({ queryKey: ["allAthleteLogs"], queryFn: () => entities.WorkoutLog.list("-completed_at", 200), enabled: isCoach });
  const { data: routines = [] } = useQuery({ queryKey: ["routines"], queryFn: () => entities.Routine.list(), enabled: isCoach });

  const activeAthletes = connections.filter(c => c.status === "active");
  const pendingAthletes = connections.filter(c => c.status === "pending");
  const getAthleteStats = (email) => { const logs = allWorkoutLogs.filter(l => l.athlete_email === email); const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); const weekly = logs.filter(l => new Date(l.completed_at) >= weekAgo).length; return { total: logs.length, weekly, lastActivity: logs[0]?.completed_at }; };

  const approveMutation = useMutation({ mutationFn: (id) => entities.CoachConnection.update(id, { status: "active", connected_at: new Date().toISOString() }), onSuccess: () => queryClient.invalidateQueries(["coachConnections"]) });
  const inviteMutation = useMutation({ mutationFn: async (email) => entities.CoachConnection.create({ coach_id: user.id, athlete_email: email, athlete_name: email.split("@")[0], status: "active", connected_at: new Date().toISOString(), athlete_id: email }), onSuccess: () => { queryClient.invalidateQueries(["coachConnections"]); setInviteEmail(""); setShowInviteForm(false); } });
  const removeMutation = useMutation({ mutationFn: (id) => entities.CoachConnection.delete(id), onSuccess: () => queryClient.invalidateQueries(["coachConnections"]) });
  const assignRoutineMutation = useMutation({ mutationFn: async ({ connection, routineId, note }) => { const routine = routines.find(r => r.id === routineId); const updated = [...(connection.assigned_routines || []), { routine_id: routineId, routine_name: routine?.name || "Routine", assigned_at: new Date().toISOString(), note: note || "" }]; return entities.CoachConnection.update(connection.id, { assigned_routines: updated }); }, onSuccess: () => { queryClient.invalidateQueries(["coachConnections"]); setAssigningTo(null); setSelectedRoutineId(""); setAssignNote(""); } });
  const removeRoutine = useMutation({ mutationFn: async ({ connection, routineId }) => entities.CoachConnection.update(connection.id, { assigned_routines: (connection.assigned_routines || []).filter(r => r.routine_id !== routineId) }), onSuccess: () => queryClient.invalidateQueries(["coachConnections"]) });

  const copyCode = () => { navigator.clipboard.writeText(coachCode); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); };
  const toggleSection = (athleteId, section) => setExpandedSection(prev => ({ ...prev, [athleteId]: prev[athleteId] === section ? null : section }));
  const weekSessions = allWorkoutLogs.filter(l => { const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); return new Date(l.completed_at) >= weekAgo; }).length;

  if (subLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  if (!isCoach) return <div className="min-h-screen bg-slate-50 p-6"><div className="max-w-2xl mx-auto pt-12"><PremiumGate feature="Coach Dashboard" requiredPlan="coach" isUnlocked={false}><div className="bg-white rounded-2xl p-8 h-64" /></PremiumGate><p className="text-center text-sm text-slate-400 mt-4">Upgrade to the Coach plan. <Link to={createPageUrl("Pricing")} className="text-violet-600 font-medium underline">View Plans</Link></p></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-violet-700 to-violet-600 px-4 pt-8 pb-14">
        <div className="max-w-5xl mx-auto"><div className="flex items-center gap-2 mb-2"><Crown className="w-4 h-4 text-violet-300" /><span className="text-violet-300 text-xs font-semibold uppercase tracking-widest">Coach Dashboard</span></div><h1 className="text-3xl font-bold text-white">My Athletes</h1><p className="text-violet-200 text-sm mt-1">Manage connections, assign routines, and track performance.</p></div>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-12 space-y-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex overflow-hidden">
          {[{ id: "athletes", label: "My Athletes", icon: Users }, { id: "selection", label: "AI Selection Report", icon: Sparkles }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${activeTab === id ? id === "selection" ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 border-b-2 border-violet-500" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {activeTab === "selection" && <TeamSelectionReport athletes={activeAthletes} coachId={user?.id} />}

        {activeTab === "athletes" && <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{ icon: Users, label: "Active Athletes", value: activeAthletes.length, color: "bg-violet-100 text-violet-600" }, { icon: AlertCircle, label: "Pending Invites", value: pendingAthletes.length, color: "bg-amber-100 text-amber-600" }, { icon: Activity, label: "Team Sessions (week)", value: weekSessions, color: "bg-emerald-100 text-emerald-600" }, { icon: TrendingUp, label: "Total Connected", value: connections.length, color: "bg-blue-100 text-blue-600" }].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center"><div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${s.color}`}><s.icon className="w-4 h-4" /></div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{s.label}</p></div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-1">Your Coach Code</h3><p className="text-violet-200 text-xs mb-3">Share with athletes to connect.</p>
              <div className="flex items-center gap-3"><div className="bg-white/10 rounded-xl px-4 py-2.5 font-mono font-bold text-lg tracking-widest flex-1 text-center">{coachCode || "…"}</div><button onClick={copyCode} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition">{copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button></div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-slate-900">Invite by Email</h3><Button size="sm" onClick={() => setShowInviteForm(v => !v)} className="bg-violet-600 hover:bg-violet-700 rounded-xl text-white text-xs"><UserPlus className="w-3.5 h-3.5 mr-1" />Invite</Button></div>
              <AnimatePresence>{showInviteForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><div className="flex gap-2 pb-3"><Input placeholder="athlete@email.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="rounded-xl text-sm" /><Button onClick={() => inviteEmail && inviteMutation.mutate(inviteEmail)} disabled={!inviteEmail || inviteMutation.isPending} className="bg-violet-600 hover:bg-violet-700 rounded-xl text-white flex-shrink-0">{inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}</Button></div></motion.div>}</AnimatePresence>
              <p className="text-xs text-slate-400">Athletes can also connect by entering your code in their Profile.</p>
            </div>
          </div>

          {pendingAthletes.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-amber-600" /><h3 className="font-semibold text-amber-800 text-sm">Awaiting Approval ({pendingAthletes.length})</h3></div>
              <div className="space-y-2">{pendingAthletes.map(c => <div key={c.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5"><div><p className="text-sm font-medium text-slate-800">{c.athlete_email}</p><p className="text-xs text-slate-400">Requested via Coach Code</p></div><div className="flex gap-1.5"><button onClick={() => approveMutation.mutate(c.id)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" />Approve</button><button onClick={() => removeMutation.mutate(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></button></div></div>)}</div>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-slate-900 mb-3">Active Athletes ({activeAthletes.length})</h2>
            {connectionsLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
            : activeAthletes.length === 0 ? <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm"><Users className="w-12 h-12 text-slate-200 mx-auto mb-3" /><p className="font-medium text-slate-600 mb-1">No athletes connected yet</p><p className="text-sm text-slate-400">Share your Coach Code or send an invite above.</p></div>
            : <div className="space-y-3">
                {activeAthletes.map((athlete, i) => {
                  const stats = getAthleteStats(athlete.athlete_email);
                  const assignedRoutines = athlete.assigned_routines || [];
                  const isExpanded = expandedAthlete === athlete.id;
                  const openSection = expandedSection[athlete.id];
                  return (
                    <motion.div key={athlete.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-base flex-shrink-0">{(athlete.athlete_name || athlete.athlete_email)?.[0]?.toUpperCase()}</div>
                          <div className="flex-1 min-w-0"><p className="font-semibold text-slate-900 truncate">{athlete.athlete_name || athlete.athlete_email}</p><p className="text-xs text-slate-400 truncate">{athlete.athlete_email}</p></div>
                          <div className="hidden sm:flex items-center gap-4 text-center"><div><p className="text-lg font-bold text-slate-900">{stats.total}</p><p className="text-[10px] text-slate-400">Sessions</p></div><div><p className="text-lg font-bold text-slate-900">{stats.weekly}</p><p className="text-[10px] text-slate-400">This week</p></div></div>
                          {stats.lastActivity && <div className="hidden md:flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" />{format(new Date(stats.lastActivity), "d MMM")}</div>}
                          <button onClick={() => setExpandedAthlete(isExpanded ? null : athlete.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 ml-1">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                          <button onClick={() => window.confirm(`Remove ${athlete.athlete_email}?`) && removeMutation.mutate(athlete.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="border-t border-slate-100">
                              <div className="flex">
                                {[{ id: "routines", label: "Routines", icon: BookOpen }, { id: "testing", label: "Test Data", icon: FlaskConical }].map(({ id, label, icon: Icon }) => (
                                  <button key={id} onClick={() => toggleSection(athlete.id, id)} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all border-b-2 ${openSection === id ? id === "testing" ? "border-indigo-500 text-indigo-600 bg-indigo-50/50" : "border-violet-500 text-violet-600 bg-violet-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                                    <Icon className="w-4 h-4" />{label}
                                  </button>
                                ))}
                              </div>
                              <AnimatePresence>
                                {openSection === "routines" && (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-4">
                                    <div className="flex gap-3 flex-col sm:flex-row">
                                      <select value={assigningTo === athlete.id ? selectedRoutineId : ""} onChange={e => { setAssigningTo(athlete.id); setSelectedRoutineId(e.target.value); }} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                                        <option value="">— Assign a routine —</option>{routines.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                                      </select>
                                      <Input placeholder="Note (optional)" value={assigningTo === athlete.id ? assignNote : ""} onChange={e => { setAssigningTo(athlete.id); setAssignNote(e.target.value); }} className="rounded-xl text-sm sm:max-w-[180px]" />
                                      <Button onClick={() => selectedRoutineId && assigningTo === athlete.id && assignRoutineMutation.mutate({ connection: athlete, routineId: selectedRoutineId, note: assignNote })} disabled={!selectedRoutineId || assigningTo !== athlete.id || assignRoutineMutation.isPending} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">{assignRoutineMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
                                    </div>
                                    {assignedRoutines.length === 0 ? <p className="text-xs text-slate-400 italic">No routines assigned yet.</p>
                                    : <div className="space-y-2">{assignedRoutines.map((ar, idx) => <div key={idx} className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-2.5"><div><p className="text-sm font-medium text-emerald-800">{ar.routine_name}</p>{ar.note && <p className="text-xs text-emerald-600">"{ar.note}"</p>}<p className="text-[10px] text-slate-400">Assigned {format(new Date(ar.assigned_at), "d MMM yyyy")}</p></div><button onClick={() => removeRoutine.mutate({ connection: athlete, routineId: ar.routine_id })} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50"><X className="w-3.5 h-3.5" /></button></div>)}</div>}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {openSection === "testing" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5"><AthleteTestPanel athleteEmail={athlete.athlete_email} coachId={user?.id} /></motion.div>}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>}
          </div>
        </>}
      </div>
    </div>
  );
}
