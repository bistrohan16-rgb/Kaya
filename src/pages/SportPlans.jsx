import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const PLANS_DATA = {
  running: { name: "Running", plans: [
    { name: "Runner's Knee Prevention", type: "prehab", duration: 15, exercises: [{ name: "Hip Flexor Stretch", sets: 2, duration: 30, area: "Hips" }, { name: "IT Band Foam Roll", sets: 2, duration: 60, area: "Knees" }, { name: "Calf Raises", sets: 3, reps: 15, area: "Calves" }, { name: "Glute Bridge", sets: 3, reps: 12, area: "Glutes" }] },
    { name: "Post-Run Recovery", type: "cooldown", duration: 10, exercises: [{ name: "Quad Stretch", sets: 2, duration: 30, area: "Quads" }, { name: "Hamstring Stretch", sets: 2, duration: 30, area: "Hamstrings" }, { name: "Pigeon Pose", sets: 2, duration: 45, area: "Hips" }] }
  ]},
  basketball: { name: "Basketball", plans: [
    { name: "Jump Training Prep", type: "warmup", duration: 15, exercises: [{ name: "Ankle Circles", sets: 2, duration: 30, area: "Ankles" }, { name: "Lateral Band Walks", sets: 3, reps: 12, area: "Hips" }, { name: "Box Step-Ups", sets: 3, reps: 10, area: "Knees" }] },
    { name: "Ankle Stability", type: "prehab", duration: 12, exercises: [{ name: "Single-Leg Balance", sets: 3, duration: 30, area: "Ankles" }, { name: "Calf Raises", sets: 3, reps: 20, area: "Calves" }] }
  ]},
  football: { name: "Football", plans: [
    { name: "Hamstring Prevention", type: "prehab", duration: 12, exercises: [{ name: "Nordic Curls", sets: 3, reps: 8, area: "Hamstrings" }, { name: "Hamstring Stretch", sets: 3, duration: 40, area: "Hamstrings" }, { name: "Hip Flexor Stretch", sets: 2, duration: 30, area: "Hips" }] },
    { name: "Groin & Adductor Care", type: "prehab", duration: 10, exercises: [{ name: "Copenhagen Plank", sets: 3, duration: 20, area: "Groin" }, { name: "Adductor Stretch", sets: 3, duration: 30, area: "Groin" }] }
  ]},
  rugby: { name: "Rugby", plans: [
    { name: "Neck & Upper Body Prep", type: "prehab", duration: 15, exercises: [{ name: "Neck Strengthening", sets: 3, reps: 10, area: "Neck" }, { name: "Trap Stretch", sets: 2, duration: 30, area: "Neck" }, { name: "Shoulder Stability", sets: 3, reps: 12, area: "Shoulders" }] }
  ]},
  tennis: { name: "Tennis", plans: [
    { name: "Shoulder Maintenance", type: "prehab", duration: 15, exercises: [{ name: "Internal Rotation", sets: 3, reps: 15, area: "Shoulders" }, { name: "Sleeper Stretch", sets: 3, duration: 30, area: "Shoulders" }, { name: "Scapular Squeezes", sets: 3, reps: 15, area: "Upper Back" }] }
  ]},
  swimming: { name: "Swimming", plans: [
    { name: "Shoulder Mobility", type: "mobility", duration: 15, exercises: [{ name: "Band Pull-Aparts", sets: 3, reps: 15, area: "Shoulders" }, { name: "Thoracic Rotation", sets: 3, duration: 30, area: "Upper Back" }, { name: "Lat Stretch", sets: 2, duration: 40, area: "Back" }] }
  ]},
  cycling: { name: "Cycling", plans: [
    { name: "Cyclist Hip Opener", type: "prehab", duration: 12, exercises: [{ name: "Hip Flexor Stretch", sets: 3, duration: 40, area: "Hips" }, { name: "Pigeon Pose", sets: 2, duration: 45, area: "Hips" }, { name: "Quad Stretch", sets: 2, duration: 30, area: "Quads" }] }
  ]},
  weightlifting: { name: "Weightlifting", plans: [
    { name: "Powerlifting Warm-Up", type: "warmup", duration: 15, exercises: [{ name: "Hip Mobility Flow", sets: 2, duration: 40, area: "Hips" }, { name: "Thoracic Extension", sets: 3, duration: 30, area: "Upper Back" }, { name: "Ankle Mobility", sets: 2, duration: 30, area: "Ankles" }] }
  ]},
};

const ALL_SPORTS = Object.keys(PLANS_DATA);
const TYPE_BADGE = { prehab: "default", warmup: "emerald", cooldown: "secondary", mobility: "default", rehab: "amber" };

export default function SportPlans() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const sportData = selected ? PLANS_DATA[selected] : null;

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="bg-[#0F2035] border-b border-[#2A3F58]/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={selected ? () => { setSelected(null); setExpandedPlan(null); } : () => navigate(createPageUrl("Dashboard"))} className="rounded-xl flex-shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl text-[#F8F8F8]">{selected ? sportData?.name + " Plans" : "Sport Plans"}</h1>
            <p className="kaya-label">{selected ? `${sportData?.plans.length} programmes` : `${ALL_SPORTS.length} sports`}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ALL_SPORTS.map((sport, i) => (
                <motion.button key={sport} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(sport)}
                  className="bg-[#162232] border border-[#2A3F58] rounded-2xl p-5 text-left hover:border-[#B8960C]/40 hover:bg-[#1E2E42] transition-all group">
                  <h3 className="font-display text-lg text-[#F8F8F8] group-hover:text-[#B8960C] transition-colors mb-1">{PLANS_DATA[sport].name}</h3>
                  <p className="kaya-label">{PLANS_DATA[sport].plans.length} {PLANS_DATA[sport].plans.length === 1 ? "programme" : "programmes"}</p>
                  <ChevronRight className="w-4 h-4 text-[#2A3F58] group-hover:text-[#B8960C] mt-3 transition-colors" />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="plans" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {sportData?.plans.map((plan, i) => (
                <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-[#162232] border border-[#2A3F58] rounded-2xl overflow-hidden hover:border-[#B8960C]/20 transition-all">
                  <div className="p-5 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={TYPE_BADGE[plan.type] || "default"} className="capitalize">{plan.type}</Badge>
                        <span className="text-[#B8960C]/50 text-xs font-mono flex items-center gap-1"><Clock className="w-3 h-3" />{plan.duration}m</span>
                      </div>
                      <h3 className="font-display text-xl text-[#F8F8F8]">{plan.name}</h3>
                      <p className="text-[#F8F8F8]/30 text-xs font-body mt-1 flex items-center gap-1"><Dumbbell className="w-3 h-3" />{plan.exercises.length} exercises</p>
                    </div>
                    <button onClick={() => setExpandedPlan(expandedPlan === plan.name ? null : plan.name)}
                      className="text-[#2A3F58] hover:text-[#B8960C] transition-colors mt-1">
                      <ChevronRight className={`w-5 h-5 transition-transform ${expandedPlan === plan.name ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {expandedPlan === plan.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-[#2A3F58]/50">
                        <div className="p-5 space-y-3">
                          {plan.exercises.map((ex, j) => (
                            <div key={j} className="flex items-center gap-3 bg-[#0A1628] rounded-xl p-3 border border-[#2A3F58]/50">
                              <div className="w-7 h-7 bg-[#B8960C]/10 border border-[#B8960C]/20 rounded-lg flex items-center justify-center text-xs font-mono text-[#B8960C] flex-shrink-0">{j + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-body font-medium text-[#F8F8F8] text-sm">{ex.name}</p>
                                <p className="text-[#B8960C]/40 text-xs mt-0.5">{ex.area}</p>
                              </div>
                              <div className="text-xs font-mono text-[#F8F8F8]/30 flex-shrink-0">
                                {ex.duration ? `${ex.duration}s` : ex.reps ? `${ex.sets}×${ex.reps}` : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
