import { useState } from "react";
import { entities, ai, auth } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, User, Activity, Target, Calendar, Edit2, Save, X, Loader2, AlertCircle, LogOut, RefreshCw, Sparkles, Crown, Link2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { supabase } from "@/api/supabaseClient";

const SPORTS = [
  { value: "running", label: "Running" }, { value: "basketball", label: "Basketball" },
  { value: "football", label: "Football" }, { value: "tennis", label: "Tennis" },
  { value: "swimming", label: "Swimming" }, { value: "cycling", label: "Cycling" },
  { value: "weightlifting", label: "Weightlifting" }, { value: "crossfit", label: "CrossFit" },
  { value: "baseball", label: "Baseball" }, { value: "volleyball", label: "Volleyball" },
  { value: "rugby", label: "Rugby" }, { value: "golf", label: "Golf" },
  { value: "martial_arts", label: "Martial Arts" }, { value: "gymnastics", label: "Gymnastics" },
  { value: "other", label: "Other" }
];
const BODY_PARTS = ["Neck", "Shoulders", "Upper Back", "Lower Back", "Hips", "Knees", "Ankles", "Wrists", "Elbows", "Core", "Hamstrings", "Calves"];
const GOALS = ["Prevent injuries", "Recover from injury", "Improve flexibility", "Build strength", "Reduce pain", "Improve mobility", "Enhance performance"];

function ConnectCoachButton({ coachCodeInput, user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!coachCodeInput || !user) return;
    setLoading(true);
    setError("");
    const { data: coaches } = await supabase.from('users').select('*').eq('coach_code', coachCodeInput).limit(1);
    const coach = coaches?.[0];
    if (!coach) { setError("Coach code not found."); setLoading(false); return; }
    await entities.CoachConnection.create({ coach_id: coach.id, athlete_id: user.id, athlete_email: user.email, athlete_name: user.full_name || user.email.split("@")[0], status: "pending" });
    setLoading(false);
    onSuccess();
  };

  return (
    <div>
      <Button onClick={handleConnect} disabled={loading || !coachCodeInput} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, plan, isPremium, isCoach } = useSubscription();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [coachCodeInput, setCoachCodeInput] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ['athleteProfile'],
    queryFn: async () => { const profiles = await entities.AthleteProfile.list(); return profiles[0] || null; }
  });

  const { data: workoutLogs = [] } = useQuery({
    queryKey: ['workoutLogs'],
    queryFn: () => entities.WorkoutLog.list('-completed_at', 100)
  });

  const { data: coachConnections = [] } = useQuery({
    queryKey: ['myCoachConnections', user?.id],
    queryFn: () => entities.CoachConnection.filter({ athlete_id: user.id }),
    enabled: !!user?.id,
  });
  const activeCoachConnection = coachConnections.find(c => c.status === "active");
  const pendingCoachConnection = coachConnections.find(c => c.status === "pending");

  const updateMutation = useMutation({
    mutationFn: (data) => entities.AthleteProfile.update(profile.id, data),
    onSuccess: () => { queryClient.invalidateQueries(['athleteProfile']); setIsEditing(false); }
  });

  const resetMutation = useMutation({
    mutationFn: async () => { await entities.AthleteProfile.delete(profile.id); },
    onSuccess: () => { queryClient.removeQueries(['athleteProfile']); queryClient.removeQueries(['routines']); queryClient.removeQueries(['exercises']); navigate(createPageUrl("Dashboard")); }
  });

  const startEditing = () => { setEditData({ ...profile }); setIsEditing(true); };
  const handleSave = () => updateMutation.mutate(editData);
  const toggleArrayItem = (field, item) => {
    setEditData(prev => ({ ...prev, [field]: prev[field]?.includes(item) ? prev[field].filter(i => i !== item) : [...(prev[field] || []), item] }));
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  if (!profile) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <User className="w-12 h-12 text-slate-300 mb-4" />
      <p className="text-slate-500 mb-4">No profile found</p>
      <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">Create Profile</Button>
    </div>
  );

  const data = isEditing ? editData : profile;
  const sportLabel = SPORTS.find(s => s.value === data.sport)?.label || data.sport;
  const totalSessions = workoutLogs.length;
  const totalMinutes = workoutLogs.reduce((sum, log) => sum + (log.duration_minutes || 15), 0);
  const thisMonthLogs = workoutLogs.filter(log => { const logDate = new Date(log.completed_at); const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1); return logDate >= monthAgo; });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))} className="rounded-xl"><ChevronLeft className="w-5 h-5" /></Button>
              <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
            </div>
            {!isEditing ? (
              <Button onClick={startEditing} variant="outline" className="rounded-xl"><Edit2 className="w-4 h-4 mr-2" />Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(false)} variant="ghost" className="rounded-xl"><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><Activity className="w-8 h-8" /></div>
            <div><h2 className="text-xl font-bold">{sportLabel} Athlete</h2><p className="text-emerald-100 capitalize">{data.experience_level} Level</p></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center"><p className="text-2xl font-bold">{totalSessions}</p><p className="text-xs text-emerald-100">Total Sessions</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{Math.round(totalMinutes / 60)}h</p><p className="text-xs text-emerald-100">Total Time</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{thisMonthLogs.length}</p><p className="text-xs text-emerald-100">This Month</p></div>
          </div>
        </motion.div>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-slate-400" />Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-500 text-xs">Sport</Label>
                {isEditing ? (
                  <Select value={data.sport} onValueChange={v => setEditData(p => ({ ...p, sport: v }))}>
                    <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{SPORTS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                ) : <p className="font-medium text-slate-900">{sportLabel}</p>}
              </div>
              <div>
                <Label className="text-slate-500 text-xs">Age</Label>
                {isEditing ? <Input type="number" value={data.age || ""} onChange={e => setEditData(p => ({ ...p, age: parseInt(e.target.value) || "" }))} className="mt-1 rounded-xl" /> : <p className="font-medium text-slate-900">{data.age} years</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {!isCoach && (
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Link2 className="w-5 h-5 text-violet-500" />Connect to a Coach</CardTitle></CardHeader>
            <CardContent>
              {activeCoachConnection ? (
                <div className="flex items-center gap-2 bg-violet-50 text-violet-700 rounded-xl px-4 py-3 text-sm font-medium"><Crown className="w-4 h-4" />Connected to coach</div>
              ) : pendingCoachConnection ? (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 rounded-xl px-4 py-3 text-sm font-medium"><Loader2 className="w-4 h-4" />Connection request sent — awaiting coach approval</div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Enter your coach code to link your account.</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="COACH-XXXXX" value={coachCodeInput} onChange={e => setCoachCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-300" />
                    <ConnectCoachButton coachCodeInput={coachCodeInput} user={user} onSuccess={() => { setCoachCodeInput(""); queryClient.invalidateQueries(["currentUser"]); }} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6 space-y-3">
            <div>
              <p className="font-medium text-slate-900 text-sm mb-1">Reset Profile</p>
              <p className="text-xs text-slate-500 mb-3">This will delete your profile and let you start over.</p>
              <Button onClick={() => { if (window.confirm("Are you sure?")) resetMutation.mutate(); }} disabled={resetMutation.isPending} variant="outline" className="w-full rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50">
                {resetMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}Reset & Start Over
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:hidden">
          <Button onClick={async () => { try { await auth.logout(); } catch (_) {} navigate("/"); }} variant="outline" className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
