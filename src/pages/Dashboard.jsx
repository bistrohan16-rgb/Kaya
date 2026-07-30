import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { entities, ai } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, Target, TrendingUp, ChevronRight, Sparkles, Loader2, Crown, FlaskConical, BookOpen, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";
import WorkoutPlayer from "@/components/workout/WorkoutPlayer";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isCoach, user } = useSubscription();
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [activeExercises, setActiveExercises] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({ queryKey: ["athleteProfile"], queryFn: async () => { const p = await entities.AthleteProfile.list(); return p[0] || null; } });
  const { data: routines = [] } = useQuery({ queryKey: ["routines"], queryFn: () => entities.Routine.list(), enabled: !!profile });
  const { data: exercises = [] } = useQuery({ queryKey: ["exercises"], queryFn: () => entities.Exercise.list(), enabled: !!profile });
  const { data: workoutLogs = [] } = useQuery({ queryKey: ["workoutLogs"], queryFn: () => entities.WorkoutLog.list("-completed_at", 50), enabled: !!profile });

  const createProfileMutation = useMutation({ mutationFn: d => entities.AthleteProfile.create(d), onSuccess: () => queryClient.invalidateQueries(["athleteProfile"]) });
  const createLogMutation = useMutation({ mutationFn: d => entities.WorkoutLog.create(d), onSuccess: () => { queryClient.invalidateQueries(["workoutLogs"]); setShowPlayer(false); setActiveRoutine(null); } });

  const handleProfileComplete = async (data) => {
    await createProfileMutation.mutateAsync(data);
    await generateContent(data);
  };

  const generateContent = async (profileData) => {
    setIsGenerating(true);
    const isInjury = profileData.mode === "injury";
    const context = isInjury
      ? `Injured area: ${profileData.injured_area}, Severity: ${profileData.injury_severity}${profileData.injury_description ? ", " + profileData.injury_description : ""}`
      : `Concerns: ${profileData.current_concerns?.join(", ") || "general"}, Goals: ${profileData.goals?.join(", ") || "performance"}`;
    try {
      const result = await ai.invoke({
        prompt: isInjury
          ? `You are a physiotherapist. Create a rehabilitation programme for a ${profileData.age}-year-old ${profileData.sport} athlete (${profileData.experience_level}). ${context}. Return JSON with exercises array (20 items, all safe with this injury). IMPORTANT: for every exercise, if it involves holding or timing (stretches, foam rolling, mobility), set duration_seconds as a number (e.g. 30, 45, 60). For rep-based exercises set reps and sets. Never leave both null. Also return routines array (5 items). Each routine has name, description, type (rehab/recovery/prehab/warmup/cooldown), difficulty, estimated_duration_minutes, and exercises_data array (4-8 exercises from the exercises list with full exercise data).`
          : `You are a sports physiotherapist. Create an injury prevention programme for a ${profileData.age}-year-old ${profileData.sport} athlete (${profileData.experience_level}, ${profileData.training_days_per_week || 4} days/week). ${context}. Return JSON with exercises array (20 sport-specific items). IMPORTANT: for every exercise, if it involves holding or timing (stretches, foam rolling, planks, balance), set duration_seconds as a number (e.g. 30, 45, 60). For rep-based exercises set reps and sets. Never leave both null. Also return routines array (5 items). Each routine has name, description, type (prehab/warmup/cooldown/recovery/rehab), difficulty, estimated_duration_minutes, and exercises_data array (4-8 exercises from the exercises list with full exercise data).`,
        response_json_schema: {
          type: "object",
          properties: {
            exercises: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, type: { type: "string" }, target_areas: { type: "array", items: { type: "string" } }, difficulty: { type: "string" }, duration_seconds: { type: "number" }, reps: { type: "number" }, sets: { type: "number" } } } },
            routines: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, type: { type: "string" }, difficulty: { type: "string" }, estimated_duration_minutes: { type: "number" }, exercises_data: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, type: { type: "string" }, target_areas: { type: "array", items: { type: "string" } }, duration_seconds: { type: "number" }, reps: { type: "number" }, sets: { type: "number" } } } } } } }
          }
        }
      });
      if (!result?.exercises || !result?.routines) throw new Error("AI returned invalid data");
      const createdExercises = await Promise.all(result.exercises.map(ex => entities.Exercise.create({ ...ex, sports: [profileData.sport] })));
      await Promise.all(result.routines.map(routine => {
        const routineExercises = (routine.exercises_data || []).map((ex, order) => {
          const match = createdExercises.find(ce => ce.name === ex.name);
          return { exercise_id: match?.id || null, order, name: ex.name, description: ex.description, type: ex.type, target_areas: ex.target_areas || [], duration_seconds: ex.duration_seconds || null, reps: ex.reps || null, sets: ex.sets || null };
        });
        return entities.Routine.create({ name: routine.name, description: routine.description, type: routine.type, sport: profileData.sport, difficulty: routine.difficulty, estimated_duration_minutes: routine.estimated_duration_minutes, exercises: routineExercises, focus_areas: profileData.current_concerns || [] });
      }));
      queryClient.invalidateQueries(["routines"]); queryClient.invalidateQueries(["exercises"]);
    } catch (error) { console.error("Generation error:", error); alert("There was an error generating your programme. Please try again."); }
    finally { setIsGenerating(false); }
  };

  const startRoutine = (routine) => {
    const embedded = (routine.exercises || []).map(re => ({ id: re.exercise_id || re.name, name: re.name, description: re.description, type: re.type, target_areas: re.target_areas || [], difficulty: re.difficulty, duration_seconds: re.duration_seconds || null, reps: re.reps || null, sets: re.sets || null })).filter(ex => ex.name);
    setActiveExercises(embedded.length > 0 ? embedded : exercises.slice(0, 5));
    setActiveRoutine(routine); setShowPlayer(true);
  };

  const handleWorkoutComplete = async (logData) => { await createLogMutation.mutateAsync({ ...logData, athlete_email: user?.email || null }); };

  const thisWeekLogs = workoutLogs.filter(l => { const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); return new Date(l.completed_at) >= weekAgo; });
  const totalMinutes = thisWeekLogs.reduce((s, l) => s + (l.duration_minutes || 15), 0);

  if (profileLoading) return <div className="min-h-screen bg-[#080808] flex items-center justify-center"><KayaMark size={48} pulse /></div>;

  if (!profile) return (
    <div className="min-h-screen bg-[#080808] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <KayaMark size={56} pulse className="mx-auto mb-5" />
          <h1 className="font-display text-4xl text-[#F8F8F8]">Begin your protection.</h1>
          <p className="text-[#F8F8F8]/40 font-body mt-2">Tell Kaya about your body and sport.</p>
        </div>
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8"><ProfileSetupForm onComplete={handleProfileComplete} /></div>
      </div>
    </div>
  );

  if (isGenerating) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4">
      <KayaMark size={64} pulse className="mb-8" />
      <h2 className="font-display text-2xl text-[#F8F8F8] mb-2">Building your programme.</h2>
      <p className="text-[#F8F8F8]/40 font-body text-center max-w-md mb-8">Kaya is analysing your profile and generating personalised exercises and routines.</p>
      <div className="space-y-2 w-full max-w-xs">
        {["Analysing your profile...", "Generating exercises...", "Building routines...", "Saving to your account..."].map((s, i) => (
          <motion.div key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
            className="flex items-center gap-3 bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3">
            <div className="w-1.5 h-1.5 bg-[#B8960C] rounded-full animate-pulse flex-shrink-0" />
            <p className="text-sm font-body text-[#F8F8F8]/60">{s}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const SPORT_LABELS = { running:"Running",basketball:"Basketball",football:"Football",tennis:"Tennis",swimming:"Swimming",cycling:"Cycling",weightlifting:"Weightlifting",crossfit:"CrossFit",baseball:"Baseball",volleyball:"Volleyball",rugby:"Rugby",golf:"Golf",martial_arts:"Martial Arts",gymnastics:"Gymnastics",other:"Other" };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="bg-[#0E0E0E] border-b border-[#2A2A2A]/50 px-5 pt-6 pb-5">
        <div className="max-w-5xl mx-auto">
          <p className="kaya-label mb-1">{SPORT_LABELS[profile.sport]} · {profile.experience_level}</p>
          <h1 className="font-display text-3xl text-[#F8F8F8]">Good morning.</h1>
          <p className="text-[#F8F8F8]/30 font-body text-sm mt-1">Your body. Your season.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[{ icon: Calendar, label: "This week", value: thisWeekLogs.length, unit: "sessions" }, { icon: Clock, label: "Total time", value: totalMinutes, unit: "minutes" }, { icon: Target, label: "Streak", value: Math.min(thisWeekLogs.length, 7), unit: "days" }, { icon: TrendingUp, label: "All time", value: workoutLogs.length, unit: "sessions" }].map(s => (
            <div key={s.label} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
              <s.icon className="w-4 h-4 text-[#B8960C] mb-2" />
              <p className="text-2xl font-mono text-[#B8960C]">{s.value}</p>
              <p className="text-xs font-body text-[#F8F8F8]/30 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick start */}
        {routines.length > 0 && (
          <div className="bg-[#141414] border border-[#B8960C]/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="kaya-label mb-1">Today's recommendation</p>
              <h3 className="font-display text-xl text-[#F8F8F8]">{routines.find(r => r.type === "warmup" || r.type === "prehab")?.name || routines[0]?.name}</h3>
              <p className="text-[#F8F8F8]/40 text-sm font-body mt-0.5">{routines.find(r => r.type === "warmup" || r.type === "prehab")?.estimated_duration_minutes || routines[0]?.estimated_duration_minutes || 15} minutes</p>
            </div>
            <Button onClick={() => { const r = routines.find(r => r.type === "warmup" || r.type === "prehab") || routines[0]; startRoutine(r); }} className="bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] flex-shrink-0">
              Begin <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Routines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="kaya-label">Your Routines</p>
            <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl("Routines"))} className="text-[#B8960C] text-xs">
              See all <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          {routines.length === 0 ? (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-10 text-center">
              <KayaMark size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-[#F8F8F8]/30 font-body mb-4">No routines yet. Generate your programme.</p>
              <Button onClick={() => generateContent(profile)} className="bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10]"><Sparkles className="w-4 h-4 mr-2" />Generate Programme</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {routines.slice(0, 4).map((routine, i) => (
                <motion.div key={routine.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#B8960C]/30 transition-all group cursor-pointer" onClick={() => startRoutine(routine)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-2 capitalize">{routine.type?.replace("_", " ")}</Badge>
                      <h3 className="font-display text-base text-[#F8F8F8] group-hover:text-[#B8960C] transition-colors">{routine.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs font-mono text-[#B8960C]/50">
                        <span>{routine.estimated_duration_minutes || 15}m</span>
                        <span>{routine.exercises?.length || 0} exercises</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#2A2A2A] group-hover:text-[#B8960C] flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Exercise Library", icon: Dumbbell, path: "Exercises" }, { label: "Sport Plans", icon: BookOpen, path: "SportPlans" }, { label: "Performance Testing", icon: FlaskConical, path: "Testing" }].map(({ label, icon: Icon, path }) => (
            <Link key={path} to={createPageUrl(path)}>
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#B8960C]/30 transition-all group text-center">
                <Icon className="w-5 h-5 text-[#B8960C]/50 group-hover:text-[#B8960C] mx-auto mb-2 transition-colors" />
                <p className="text-xs font-body text-[#F8F8F8]/40 group-hover:text-[#F8F8F8]/70 transition-colors">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showPlayer && activeRoutine && (
        <WorkoutPlayer routine={activeRoutine} exercises={activeExercises} onComplete={handleWorkoutComplete} onClose={() => { setShowPlayer(false); setActiveRoutine(null); }} />
      )}
    </div>
  );
}
