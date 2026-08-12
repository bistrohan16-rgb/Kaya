import { useState } from "react";
import { entities } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2, BookOpen, Clock, Dumbbell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import WorkoutPlayer from "@/components/workout/WorkoutPlayer";

const TYPES = [
  { value: "all", label: "All" }, { value: "prehab", label: "Prehab" }, { value: "rehab", label: "Rehab" },
  { value: "warmup", label: "Warm Up" }, { value: "cooldown", label: "Cool Down" }, { value: "recovery", label: "Recovery" },
];
const TYPE_BADGE = { prehab: "default", rehab: "amber", warmup: "emerald", cooldown: "default", recovery: "default" };

export default function Routines() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [activeExercises, setActiveExercises] = useState([]);

  const { data: routines = [], isLoading } = useQuery({ queryKey: ["routines"], queryFn: () => entities.Routine.list() });
  const { data: exercises = [] } = useQuery({ queryKey: ["exercises"], queryFn: () => entities.Exercise.list() });

  const filtered = selectedType === "all" ? routines : routines.filter(r => r.type === selectedType);

  const startRoutine = (routine) => {
    const embedded = (routine.exercises || []).map(re => ({
      id: re.exercise_id || re.name, name: re.name, description: re.description,
      type: re.type, target_areas: re.target_areas || [], difficulty: re.difficulty,
      duration_seconds: re.duration_seconds || null, reps: re.reps || null, sets: re.sets || null,
    })).filter(ex => ex.name);
    setActiveExercises(embedded.length > 0 ? embedded : exercises.slice(0, 5));
    setActiveRoutine(routine);
    setShowPlayer(true);
  };

  const handleWorkoutComplete = async (logData) => {
    await entities.WorkoutLog.create(logData);
    setShowPlayer(false);
    setActiveRoutine(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-[var(--surface)] border-b border-[var(--border)]/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))}><ChevronLeft className="w-5 h-5" /></Button>
            <div>
              <h1 className="font-display text-2xl text-[var(--text)]">My Routines</h1>
              <p className="text-[#1B7A4A] text-xs font-body tracking-widest uppercase">{routines.length} programmes</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setSelectedType(t.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold whitespace-nowrap flex-shrink-0 transition-all ${selectedType === t.value ? "bg-[#1B7A4A] text-[var(--bg)]" : "bg-[var(--card)] border border-[var(--border)] text-[var(--text)]/50 hover:border-[#1B7A4A]/30"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#1B7A4A]" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-[var(--border)] mx-auto mb-4" />
            <p className="text-[var(--text)]/30 font-body mb-4">No routines in this category</p>
            <Button onClick={() => navigate(createPageUrl("Dashboard"))} variant="outline">Go to Dashboard</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((routine, i) => (
                <motion.div key={routine.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[#1B7A4A]/30 transition-all group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={TYPE_BADGE[routine.type] || "default"} className="capitalize">{routine.type?.replace("_", " ")}</Badge>
                        {routine.difficulty && <span className="text-xs text-[var(--text)]/30 font-body capitalize">{routine.difficulty}</span>}
                      </div>
                      <h3 className="font-display text-lg text-[var(--text)] group-hover:text-[#1B7A4A] transition-colors">{routine.name}</h3>
                      {routine.description && <p className="text-[var(--text)]/40 text-sm font-body mt-1 line-clamp-1">{routine.description}</p>}
                      <div className="flex items-center gap-4 mt-3 text-xs font-mono text-[#1B7A4A]/60">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{routine.estimated_duration_minutes || 15}m</span>
                        <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{routine.exercises?.length || 0} exercises</span>
                      </div>
                    </div>
                    <Button onClick={() => startRoutine(routine)} variant="outline" className="flex-shrink-0 group-hover:bg-[#1B7A4A] group-hover:text-[var(--bg)] group-hover:border-[#1B7A4A] transition-all">
                      Begin <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {showPlayer && activeRoutine && (
        <WorkoutPlayer routine={activeRoutine} exercises={activeExercises} onComplete={handleWorkoutComplete} onClose={() => { setShowPlayer(false); setActiveRoutine(null); }} />
      )}
    </div>
  );
}
