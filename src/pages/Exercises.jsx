import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronLeft, Clock, Repeat, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { EXERCISE_LIBRARY } from "@/lib/exerciseLibrary";

const TYPES = [
  { value: "all", label: "All" }, { value: "stretch", label: "Stretch" },
  { value: "strength", label: "Strength" }, { value: "mobility", label: "Mobility" },
  { value: "activation", label: "Activation" }, { value: "balance", label: "Balance" }, { value: "foam_roll", label: "Foam Roll" },
];
const BODY_PARTS = ["All", "Shoulders", "Back", "Hips", "Knees", "Ankles", "Core", "Hamstrings", "Calves", "Glutes", "Neck", "Chest", "Quads", "Groin"];
const TYPE_COLORS = { stretch: "default", strength: "amber", mobility: "default", balance: "emerald", activation: "default", foam_roll: "amber" };
const TYPE_LABELS = { stretch: "Stretch", strength: "Strength", mobility: "Mobility", balance: "Balance", activation: "Activation", foam_roll: "Foam Roll" };

export default function Exercises() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBodyPart, setSelectedBodyPart] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const filtered = EXERCISE_LIBRARY.filter(ex => {
    const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase()) || ex.target_areas?.some(a => a.toLowerCase().includes(search.toLowerCase()));
    const matchType = selectedType === "all" || ex.type === selectedType;
    const matchBody = selectedBodyPart === "All" || ex.target_areas?.some(a => a.toLowerCase().includes(selectedBodyPart.toLowerCase()));
    return matchSearch && matchType && matchBody;
  });

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="bg-[#0E0E0E] border-b border-[#2A2A2A]/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))} className="rounded-xl">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl text-[#F8F8F8]">Exercise Library</h1>
              <p className="text-[#B8960C] text-xs font-body tracking-widest uppercase">{filtered.length} exercises</p>
            </div>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F8F8F8]/30" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exercises, muscles..."
              className="pl-10 bg-[#141414] border-[#2A2A2A]" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F8F8F8]/30 hover:text-[#B8960C]"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setSelectedType(t.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold whitespace-nowrap transition-all flex-shrink-0 ${selectedType === t.value ? "bg-[#B8960C] text-[#080808]" : "bg-[#141414] text-[#F8F8F8]/50 border border-[#2A2A2A] hover:border-[#B8960C]/30 hover:text-[#F8F8F8]"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {BODY_PARTS.map(p => (
              <button key={p} onClick={() => setSelectedBodyPart(p)}
                className={`px-3 py-1 rounded-full text-xs font-body whitespace-nowrap flex-shrink-0 transition-all ${selectedBodyPart === p ? "text-[#B8960C] bg-[#B8960C]/10 border border-[#B8960C]/30" : "text-[#F8F8F8]/30 hover:text-[#F8F8F8]/60"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#F8F8F8]/30 font-body">No exercises found for "{search}"</p>
            <button onClick={() => { setSearch(""); setSelectedType("all"); setSelectedBodyPart("All"); }} className="text-[#B8960C] text-sm mt-2 font-body underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((ex, i) => (
              <motion.div key={ex.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}
                onClick={() => setSelectedExercise(ex)}
                className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#B8960C]/30 hover:bg-[#1C1C1C] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={TYPE_COLORS[ex.type]}>{TYPE_LABELS[ex.type]}</Badge>
                  {ex.difficulty && <span className="text-xs text-[#F8F8F8]/30 font-body capitalize">{ex.difficulty}</span>}
                </div>
                <h3 className="font-display text-base text-[#F8F8F8] mb-2 group-hover:text-[#B8960C] transition-colors leading-tight">{ex.name}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {ex.target_areas?.slice(0, 2).map(area => (
                    <span key={area} className="text-[10px] text-[#F8F8F8]/30 bg-[#2A2A2A]/50 px-2 py-0.5 rounded-full font-body">{area}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-[#B8960C]/60 font-mono">
                  {ex.duration_seconds && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ex.duration_seconds}s</span>}
                  {ex.reps && <span className="flex items-center gap-1"><Repeat className="w-3 h-3" />{ex.sets || 3}×{ex.reps}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Sheet open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <SheetContent>
          {selectedExercise && (
            <div>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={TYPE_COLORS[selectedExercise.type]}>{TYPE_LABELS[selectedExercise.type]}</Badge>
                  {selectedExercise.difficulty && <span className="text-xs text-[#F8F8F8]/30 font-body capitalize">{selectedExercise.difficulty}</span>}
                </div>
                <SheetTitle>{selectedExercise.name}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5">
                {selectedExercise.target_areas?.length > 0 && (
                  <div>
                    <p className="kaya-label mb-2">Target Areas</p>
                    <div className="flex flex-wrap gap-2">{selectedExercise.target_areas.map(a => <span key={a} className="px-3 py-1.5 bg-[#2A2A2A] text-[#F8F8F8]/70 rounded-lg text-sm font-body">{a}</span>)}</div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {selectedExercise.duration_seconds && <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 text-center"><p className="text-2xl font-mono text-[#B8960C]">{selectedExercise.duration_seconds}s</p><p className="text-xs text-[#F8F8F8]/30 mt-1 font-body">Duration</p></div>}
                  {selectedExercise.reps && <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 text-center"><p className="text-2xl font-mono text-[#B8960C]">{selectedExercise.reps}</p><p className="text-xs text-[#F8F8F8]/30 mt-1 font-body">Reps</p></div>}
                  {selectedExercise.sets && <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 text-center"><p className="text-2xl font-mono text-[#B8960C]">{selectedExercise.sets}</p><p className="text-xs text-[#F8F8F8]/30 mt-1 font-body">Sets</p></div>}
                </div>
                {selectedExercise.description && (
                  <div>
                    <p className="kaya-label mb-2">How to Perform</p>
                    <p className="text-[#F8F8F8]/60 text-sm font-body leading-relaxed">{selectedExercise.description}</p>
                  </div>
                )}
                {selectedExercise.injury_prevention_for?.length > 0 && (
                  <div>
                    <p className="kaya-label mb-2">Helps Prevent</p>
                    <div className="flex flex-wrap gap-2">{selectedExercise.injury_prevention_for.map(i => <span key={i} className="px-3 py-1.5 bg-[#B8960C]/10 text-[#B8960C] border border-[#B8960C]/20 rounded-lg text-sm font-body">{i}</span>)}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
