import { useState } from "react";
import { entities, ai } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CheckCircle, Users, Activity, ClipboardList,
  ChevronRight, ChevronDown, Copy, Mail, Plus, X, Loader2,
  TrendingUp, Shield, BarChart3, Bell, Check, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";

// Compliance bar component
function ComplianceBar({ value }) {
  const pct = Math.min(Math.max(value, 0), 100);
  const color = pct >= 80 ? "#16A34A" : pct >= 50 ? "#D97706" : "#DC2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono" style={{ color }}>{pct}%</span>
    </div>
  );
}

// Pain indicator dot
function PainDot({ level }) {
  const color = level === 0 ? "#16A34A" : level <= 2 ? "#1B7A4A" : level <= 3 ? "#D97706" : "#DC2626";
  const label = level === 0 ? "No pain" : level <= 2 ? "Mild" : level <= 3 ? "Moderate" : "High";
  return (
    <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

// Alert card component
function AlertCard({ alert, onDismiss }) {
  const isRed = alert.pain_level >= 4;
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border-l-4"
      style={{
        background: isRed ? "rgba(220,38,38,0.06)" : "rgba(217,119,6,0.06)",
        borderLeftColor: isRed ? "#DC2626" : "#D97706",
        border: `1px solid ${isRed ? "rgba(220,38,38,0.2)" : "rgba(217,119,6,0.2)"}`,
        borderLeft: `4px solid ${isRed ? "#DC2626" : "#D97706"}`,
      }}>
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: isRed ? "#DC2626" : "#D97706" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-semibold" style={{ color: "var(--text)" }}>
          {alert.athlete_name || alert.athlete_email}
        </p>
        <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-60)" }}>
          Pain {alert.pain_level}/5 during <span style={{ color: "var(--text)" }}>{alert.exercise_name}</span>
        </p>
        {alert.session_date && (
          <p className="text-[10px] font-body mt-0.5" style={{ color: "var(--text-35)" }}>
            {format(new Date(alert.session_date), "d MMM · HH:mm")}
          </p>
        )}
      </div>
      <button onClick={() => onDismiss(alert.id)}
        className="text-xs font-body hover:opacity-70 transition-opacity flex-shrink-0"
        style={{ color: "var(--text-35)" }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Athlete row in the squad table
function AthleteRow({ connection, onClick, isExpanded }) {
  const sessions = connection.sessions_this_week || 0;
  const lastPain = connection.last_pain_level ?? 0;
  const compliance = Math.min(Math.round((sessions / 4) * 100), 100);
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-4 px-5 py-4 transition-all hover:bg-[rgba(27,122,74,0.04)]"
        style={{ borderBottom: "1px solid var(--border)" }}>
        {/* Status dot */}
        <div className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: lastPain >= 4 ? "#DC2626" : lastPain >= 3 ? "#D97706" : "#16A34A" }} />
        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body font-semibold" style={{ color: "var(--text)" }}>
            {connection.athlete_name || connection.athlete_email}
          </p>
          <p className="text-[10px] font-body" style={{ color: "var(--text-35)" }}>
            {connection.athlete_email}
          </p>
        </div>
        {/* Sessions */}
        <div className="hidden md:block w-24 text-center">
          <p className="text-sm font-mono" style={{ color: "#1B7A4A" }}>{sessions}</p>
          <p className="text-[9px] font-body" style={{ color: "var(--text-35)" }}>sessions/wk</p>
        </div>
        {/* Pain */}
        <div className="hidden md:block w-24">
          <PainDot level={lastPain} />
        </div>
        {/* Compliance */}
        <div className="hidden lg:block w-28">
          <ComplianceBar value={compliance} />
        </div>
        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0`}
          style={{ color: "var(--text-20)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
      {/* Expanded athlete detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
            <div className="px-5 py-5 grid md:grid-cols-3 gap-4">
              {/* Stats */}
              <div className="space-y-3">
                <p className="k-label">This Week</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Sessions", value: sessions },
                    { label: "Peak Pain", value: `${lastPain}/5` },
                    { label: "Compliance", value: `${compliance}%` },
                    { label: "Streak", value: `${sessions}d` },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <p className="text-lg font-mono" style={{ color: "#1B7A4A" }}>{s.value}</p>
                      <p className="text-[9px] font-body" style={{ color: "var(--text-35)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Session log */}
              <div className="space-y-3">
                <p className="k-label">Recent Sessions</p>
                {(connection.recent_logs || []).length === 0 ? (
                  <p className="text-xs font-body" style={{ color: "var(--text-35)" }}>No sessions logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(connection.recent_logs || []).slice(0, 3).map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div>
                          <p className="text-xs font-body font-medium" style={{ color: "var(--text)" }}>{log.routine_name}</p>
                          <p className="text-[9px] font-body" style={{ color: "var(--text-35)" }}>{log.duration_minutes}m · {format(new Date(log.completed_at), "d MMM")}</p>
                        </div>
                        <PainDot level={log.max_pain || 0} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className="space-y-3">
                <p className="k-label">Actions</p>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body transition-all hover:opacity-80"
                    style={{ background: "rgba(27,122,74,0.1)", color: "#1B7A4A", border: "1px solid rgba(27,122,74,0.2)" }}>
                    <ClipboardList className="w-4 h-4" /> Assign Routine
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body transition-all hover:opacity-80"
                    style={{ background: "var(--surface)", color: "var(--text-60)", border: "1px solid var(--border)" }}>
                    <BarChart3 className="w-4 h-4" /> View Test Data
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CoachDashboard() {
  const queryClient = useQueryClient();
  const { user } = useSubscription();
  const [expandedAthlete, setExpandedAthlete] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("squad");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState(null);

  const coachCode = `KAYA-${(user?.email || "COACH").split("@")[0].toUpperCase().slice(0, 6)}`;

  const { data: connections = [] } = useQuery({
    queryKey: ["coachConnections"],
    queryFn: () => entities.CoachConnection.filter({ status: "active" }),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ["coachAlerts"],
    queryFn: () => entities.CoachAlert.filter({ coach_id: user?.id, is_read: false }),
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coachCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(""); setShowInvite(false); }, 2000);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const result = await ai.invoke({
        prompt: `You are a sports performance analyst. Generate a team selection report for a squad of ${connections.length} athletes. For each athlete rank them: Starting, Squad, Development, or Review. Return as JSON with athletes array, each having: name, tier, strengths (array), areas_to_improve (array), recommendation (string).`,
        response_json_schema: {
          type: "object",
          properties: {
            athletes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  tier: { type: "string" },
                  strengths: { type: "array", items: { type: "string" } },
                  areas_to_improve: { type: "array", items: { type: "string" } },
                  recommendation: { type: "string" }
                }
              }
            }
          }
        }
      });
      setReport(result);
    } catch (err) { console.error(err); }
    finally { setIsGeneratingReport(false); }
  };

  const dismissAlert = useMutation({
    mutationFn: id => entities.CoachAlert.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries(["coachAlerts"]),
  });

  const activeAthletes = connections.filter(c => c.status === "active");
  const pendingAthletes = connections.filter(c => c.status === "pending");
  const avgCompliance = activeAthletes.length
    ? Math.round(activeAthletes.reduce((s, c) => s + Math.min(((c.sessions_this_week || 0) / 4) * 100, 100), 0) / activeAthletes.length)
    : 0;

  const TIER_STYLES = {
    "Starting": { bg: "rgba(22,163,74,0.1)", color: "#16A34A", border: "rgba(22,163,74,0.25)" },
    "Squad": { bg: "rgba(27,122,74,0.1)", color: "#1B7A4A", border: "rgba(27,122,74,0.25)" },
    "Development": { bg: "rgba(217,119,6,0.1)", color: "#D97706", border: "rgba(217,119,6,0.25)" },
    "Review": { bg: "rgba(220,38,38,0.08)", color: "#DC2626", border: "rgba(220,38,38,0.2)" },
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Coach header — clinical, data-focused */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="k-label mb-1">Command Centre</p>
              <h1 className="font-display text-3xl" style={{ color: "var(--text)" }}>Squad Overview</h1>
            </div>
            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { icon: Users, label: "Active", value: activeAthletes.length },
                { icon: Activity, label: "Avg Compliance", value: `${avgCompliance}%` },
                { icon: Bell, label: "Alerts", value: alerts.length, alert: alerts.length > 0 },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: s.alert ? "rgba(220,38,38,0.08)" : "var(--card)",
                    border: `1px solid ${s.alert ? "rgba(220,38,38,0.2)" : "var(--border)"}`,
                  }}>
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.alert ? "#DC2626" : "#1B7A4A" }} />
                  <span className="text-xs font-mono font-bold" style={{ color: s.alert ? "#DC2626" : "#1B7A4A" }}>{s.value}</span>
                  <span className="text-[10px] font-body hidden sm:block" style={{ color: "var(--text-35)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-5">

        {/* ALERTS — prominent if any */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <p className="k-label flex items-center gap-2"><Bell className="w-3 h-3" />Pain Alerts</p>
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onDismiss={id => dismissAlert.mutate(id)} />
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {[
            { id: "squad", label: "My Squad" },
            { id: "invite", label: "Invite Athletes" },
            { id: "report", label: "Selection Report" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-body font-medium transition-all"
              style={{
                background: activeTab === tab.id ? "#1B7A4A" : "transparent",
                color: activeTab === tab.id ? "#FFFFFF" : "var(--text-35)",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* SQUAD TAB */}
        {activeTab === "squad" && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[auto_1fr_100px_100px_120px_40px] gap-4 px-5 py-3"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
              <div className="w-2" />
              <p className="text-[10px] font-body font-semibold tracking-widest uppercase" style={{ color: "var(--text-35)" }}>Athlete</p>
              <p className="text-[10px] font-body font-semibold tracking-widest uppercase text-center" style={{ color: "var(--text-35)" }}>Sessions</p>
              <p className="text-[10px] font-body font-semibold tracking-widest uppercase" style={{ color: "var(--text-35)" }}>Pain</p>
              <p className="text-[10px] font-body font-semibold tracking-widest uppercase" style={{ color: "var(--text-35)" }}>Compliance</p>
              <div />
            </div>
            {activeAthletes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-5">
                <Users className="w-12 h-12 mb-4" style={{ color: "var(--border)" }} />
                <p className="font-display text-xl mb-1" style={{ color: "var(--text)" }}>No athletes connected yet</p>
                <p className="text-sm font-body mb-4" style={{ color: "var(--text-35)" }}>Share your coach code or invite athletes by email.</p>
                <button onClick={() => setActiveTab("invite")}
                  className="px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all"
                  style={{ background: "#1B7A4A", color: "#FFFFFF" }}>
                  Invite Athletes
                </button>
              </div>
            ) : (
              <div>
                {activeAthletes.map(connection => (
                  <AthleteRow key={connection.id} connection={connection}
                    isExpanded={expandedAthlete === connection.id}
                    onClick={() => setExpandedAthlete(expandedAthlete === connection.id ? null : connection.id)} />
                ))}
              </div>
            )}
            {pendingAthletes.length > 0 && (
              <div className="px-5 py-3" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
                <p className="k-label mb-2">Pending Requests ({pendingAthletes.length})</p>
                {pendingAthletes.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2">
                    <span className="text-sm font-body" style={{ color: "var(--text-60)" }}>{p.athlete_email}</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-body" style={{ background: "rgba(27,122,74,0.1)", color: "#1B7A4A" }}>Accept</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-body" style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626" }}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVITE TAB */}
        {activeTab === "invite" && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Coach code */}
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="k-label mb-3">Your Coach Code</p>
              <p className="text-sm font-body mb-4" style={{ color: "var(--text-60)" }}>
                Athletes enter this code in their Profile to connect to your squad.
              </p>
              <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <span className="font-mono text-xl font-bold flex-1" style={{ color: "#1B7A4A" }}>{coachCode}</span>
                <button onClick={handleCopyCode}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body transition-all"
                  style={{ background: copied ? "rgba(22,163,74,0.1)" : "var(--bg)", color: copied ? "#16A34A" : "var(--text-35)", border: "1px solid var(--border)" }}>
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
              {/* QR placeholder */}
              <div className="flex items-center justify-center h-24 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-body" style={{ color: "var(--text-35)" }}>QR Code — coming soon</p>
              </div>
            </div>
            {/* Email invite */}
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="k-label mb-3">Invite by Email</p>
              <p className="text-sm font-body mb-4" style={{ color: "var(--text-60)" }}>
                Send a direct invitation to an athlete's email address.
              </p>
              <div className="space-y-3">
                <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="athlete@email.com" type="email"
                  className="h-12" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} />
                <button onClick={handleInvite} disabled={!inviteEmail || inviteSent}
                  className="w-full h-11 rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{ background: inviteSent ? "rgba(22,163,74,0.15)" : "#1B7A4A", color: inviteSent ? "#16A34A" : "#FFFFFF" }}>
                  {inviteSent ? <><Check className="w-4 h-4" /> Invite Sent</> : <><Send className="w-4 h-4" /> Send Invitation</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SELECTION REPORT TAB */}
        {activeTab === "report" && (
          <div>
            {!report ? (
              <div className="rounded-2xl p-10 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--border)" }} />
                <p className="font-display text-xl mb-2" style={{ color: "var(--text)" }}>AI Team Selection Report</p>
                <p className="text-sm font-body mb-6 max-w-md mx-auto" style={{ color: "var(--text-35)" }}>
                  Kaya's AI analyses your squad's compliance, pain data and performance to generate a selection ranking.
                </p>
                {activeAthletes.length === 0 ? (
                  <p className="text-sm font-body" style={{ color: "var(--text-35)" }}>Connect athletes first to generate a report.</p>
                ) : (
                  <button onClick={handleGenerateReport} disabled={isGeneratingReport}
                    className="px-8 py-3 rounded-xl text-sm font-body font-semibold flex items-center gap-2 mx-auto transition-all"
                    style={{ background: "#1B7A4A", color: "#FFFFFF" }}>
                    {isGeneratingReport ? <><Loader2 className="w-4 h-4 animate-spin" />Analysing squad…</> : <><BarChart3 className="w-4 h-4" />Generate Report</>}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="k-label">Selection Rankings</p>
                  <button onClick={() => setReport(null)} className="text-xs font-body hover:opacity-70" style={{ color: "var(--text-35)" }}>
                    Regenerate
                  </button>
                </div>
                {(report.athletes || []).map((athlete, i) => {
                  const style = TIER_STYLES[athlete.tier] || TIER_STYLES["Development"];
                  return (
                    <div key={i} className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-body font-semibold" style={{ color: "var(--text)" }}>{athlete.name}</p>
                          <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-35)" }}>{athlete.recommendation}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-full text-xs font-body font-bold flex-shrink-0"
                          style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                          {athlete.tier}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {athlete.strengths?.length > 0 && (
                          <div>
                            <p className="text-[9px] font-body tracking-widest uppercase mb-1.5" style={{ color: "#16A34A" }}>Strengths</p>
                            <ul className="space-y-1">{athlete.strengths.map((s, j) => <li key={j} className="text-xs font-body flex items-center gap-1.5" style={{ color: "var(--text-60)" }}><Check className="w-3 h-3" style={{ color: "#16A34A" }} />{s}</li>)}</ul>
                          </div>
                        )}
                        {athlete.areas_to_improve?.length > 0 && (
                          <div>
                            <p className="text-[9px] font-body tracking-widest uppercase mb-1.5" style={{ color: "#D97706" }}>Develop</p>
                            <ul className="space-y-1">{athlete.areas_to_improve.map((s, j) => <li key={j} className="text-xs font-body flex items-center gap-1.5" style={{ color: "var(--text-60)" }}><ChevronRight className="w-3 h-3" style={{ color: "#D97706" }} />{s}</li>)}</ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
