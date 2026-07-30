import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChevronRight, Shield, Activity, AlertTriangle } from "lucide-react";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";

// Sport icons as SVG paths — minimal silhouettes
const SPORT_ICONS = {
  running: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="13" cy="4" r="1.5"/><path d="M7 17l2-4 3 2 2-5 3 4"/><path d="M5 21l4-4"/>
    </svg>
  ),
  football: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M12 3l3 4-3 4-3-4z"/><path d="M3 12h4m10 0h4"/>
    </svg>
  ),
  basketball: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><path d="M5 6.5C8 9 8 15 5 17.5M19 6.5C16 9 16 15 19 17.5"/>
    </svg>
  ),
  tennis: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M3 9c3 0 6 3 6 3s-3 3-6 3M21 9c-3 0-6 3-6 3s3 3 6 3"/>
    </svg>
  ),
  swimming: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M2 18c3-3 5-3 8 0s5 3 8 0M2 13c3-3 5-3 8 0s5 3 8 0"/><circle cx="12" cy="7" r="2"/><path d="M12 9v4"/>
    </svg>
  ),
  cycling: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l4-8h4l2 4-6 4"/><circle cx="14" cy="6" r="1.5"/>
    </svg>
  ),
  weightlifting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M2 12h3M19 12h3M5 12h14M5 9v6M19 9v6M2 10v4M22 10v4"/>
    </svg>
  ),
  rugby: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(35 12 12)"/><path d="M8 8l8 8M8 12l4 4M12 8l4 4"/>
    </svg>
  ),
  crossfit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>
    </svg>
  ),
  gymnastics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="4" r="1.5"/><path d="M12 6v5l-3 4M12 11l3 4M9 10H6M15 10h3"/>
    </svg>
  ),
  baseball: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M7 4.5C9 7 9 17 7 19.5M17 4.5C15 7 15 17 17 19.5"/>
    </svg>
  ),
  golf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M12 2v15"/><path d="M12 2l6 4-6 4"/><circle cx="12" cy="20" r="2"/>
    </svg>
  ),
  martial_arts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="4" r="1.5"/><path d="M12 6l-4 6 4 2 4-2-4-6z"/><path d="M8 12l-3 6M16 12l3 6"/>
    </svg>
  ),
  other: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
};

const SPORTS = ["running","basketball","football","tennis","swimming","cycling","weightlifting","crossfit","baseball","rugby","golf","martial_arts","gymnastics","other"];
const SPORT_LABELS = { running:"Running",basketball:"Basketball",football:"Football",tennis:"Tennis",swimming:"Swimming",cycling:"Cycling",weightlifting:"Weightlifting",crossfit:"CrossFit",baseball:"Baseball",rugby:"Rugby",golf:"Golf",martial_arts:"Martial Arts",gymnastics:"Gymnastics",other:"Other" };
const CONCERNS = ["Knee pain","Lower back pain","Shoulder tightness","Hip tightness","Ankle instability","Muscle soreness","Hamstring tightness","Poor flexibility","Balance issues","Wrist/elbow discomfort"];
const GOALS = ["Prevent injuries","Recover from injury","Improve flexibility","Build strength","Reduce chronic pain","Improve mobility","Enhance performance","Improve recovery speed"];
const INJURY_AREAS = ["Neck","Shoulder (Left)","Shoulder (Right)","Elbow (Left)","Elbow (Right)","Wrist","Upper Back","Lower Back","Hip (Left)","Hip (Right)","Knee (Left)","Knee (Right)","Ankle (Left)","Ankle (Right)","Foot","Hamstring","Calf","Other"];

const StepBar = ({ total, current }) => (
  <div className="flex gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i < current ? "bg-[#B8960C]" : "bg-[#2A2A2A]"}`} />
    ))}
  </div>
);

function Disclaimer() {
  return (
    <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[#B8960C]/60 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#F8F8F8]/30 font-body leading-relaxed">
          <strong className="text-[#F8F8F8]/50">Medical Disclaimer:</strong> Kaya is a fitness companion app, not a medical product. Programmes are for general fitness and injury prevention only — not a replacement for physiotherapy, medical diagnosis, or professional healthcare advice. Results are not guaranteed. By continuing you accept full responsibility for your health decisions.
        </p>
      </div>
    </div>
  );
}

export default function ProfileSetupForm({ onComplete }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mode: "prehab", sport: "", age: "", experience_level: "", training_days_per_week: 4,
    height_cm: "", weight_kg: "", position: "", injured_area: "", injury_severity: "",
    injury_description: "", return_to_sport_date: "", current_concerns: [], goals: [], injury_history: []
  });

  const upd = (f, v) => setFormData(p => ({ ...p, [f]: v }));
  const toggle = (f, item) => setFormData(p => ({ ...p, [f]: p[f].includes(item) ? p[f].filter(i => i !== item) : [...p[f], item] }));
  const totalSteps = formData.mode === "injury" ? 4 : 3;

  const handleSubmit = async () => {
    setIsLoading(true);
    await onComplete(formData);
    setIsLoading(false);
  };

  const TagButton = ({ selected, onClick, children }) => (
    <button onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm font-body transition-all border ${
        selected
          ? "bg-[#B8960C]/10 text-[#B8960C] border-[#B8960C]/30"
          : "bg-[#0E0E0E] text-[#F8F8F8]/40 border-[#2A2A2A] hover:border-[#B8960C]/20 hover:text-[#F8F8F8]/60"
      }`}>
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <StepBar total={totalSteps} current={step} />

      {/* Step 1 — Mode */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <h2 className="font-display text-3xl text-[#F8F8F8] mb-1">Welcome to Kaya.</h2>
            <p className="text-[#F8F8F8]/40 font-body text-sm">Your body intelligence platform begins here.</p>
          </div>
          <div className="space-y-3">
            {[
              { mode: "prehab", icon: Shield, title: "Injury Prevention", desc: "I want to prevent injuries and stay at my best." },
              { mode: "injury", icon: Activity, title: "Injury Management", desc: "I have a current injury and need a safe programme." }
            ].map(({ mode, icon: Icon, title, desc }) => (
              <button key={mode} onClick={() => { upd("mode", mode); setStep(2); }}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-[#B8960C]/40 ${
                  formData.mode === mode ? "border-[#B8960C]/40 bg-[#B8960C]/5" : "border-[#2A2A2A] bg-[#0E0E0E]"
                }`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B8960C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#B8960C]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-[#F8F8F8] mb-0.5">{title}</h3>
                    <p className="text-sm text-[#F8F8F8]/40 font-body">{desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Disclaimer />
        </motion.div>
      )}

      {/* Step 2 — Sport selection with icons */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <h2 className="font-display text-2xl text-[#F8F8F8] mb-1">Your sport.</h2>
            <p className="text-[#F8F8F8]/40 font-body text-sm">Kaya builds your programme around this.</p>
          </div>

          {/* Sport icon grid */}
          <div className="grid grid-cols-4 gap-2">
            {SPORTS.map(sport => (
              <button key={sport} onClick={() => upd("sport", sport)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  formData.sport === sport
                    ? "border-[#B8960C]/50 bg-[#B8960C]/10 text-[#B8960C]"
                    : "border-[#2A2A2A] bg-[#0E0E0E] text-[#F8F8F8]/30 hover:border-[#B8960C]/20 hover:text-[#F8F8F8]/60"
                }`}>
                {SPORT_ICONS[sport]}
                <span className="text-[9px] font-body font-medium text-center leading-tight">{SPORT_LABELS[sport]}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Age</Label>
              <Input type="number" value={formData.age} onChange={e => upd("age", parseInt(e.target.value) || "")}
                placeholder="e.g. 24" className="h-11 bg-[#0E0E0E] border-[#2A2A2A] text-[#F8F8F8]" />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Experience Level</Label>
              <Select value={formData.experience_level} onValueChange={v => upd("experience_level", v)}>
                <SelectTrigger className="h-11 bg-[#0E0E0E] border-[#2A2A2A] text-[#F8F8F8]">
                  <SelectValue placeholder="Select level..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Days/week</Label>
              <Input type="number" min={1} max={7} value={formData.training_days_per_week}
                onChange={e => upd("training_days_per_week", parseInt(e.target.value) || 3)}
                className="h-11 bg-[#0E0E0E] border-[#2A2A2A] text-[#F8F8F8]" />
            </div>
            <div className="space-y-1">
              <Label>Height (cm)</Label>
              <Input type="number" value={formData.height_cm} onChange={e => upd("height_cm", parseInt(e.target.value) || "")}
                placeholder="175" className="h-11 bg-[#0E0E0E] border-[#2A2A2A] text-[#F8F8F8]" />
            </div>
            <div className="space-y-1">
              <Label>Weight (kg)</Label>
              <Input type="number" value={formData.weight_kg} onChange={e => upd("weight_kg", parseInt(e.target.value) || "")}
                placeholder="75" className="h-11 bg-[#0E0E0E] border-[#2A2A2A] text-[#F8F8F8]" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)} className="text-[#F8F8F8]/30">Back</Button>
            <Button onClick={() => setStep(formData.mode === "injury" ? 3 : 4)}
              disabled={!formData.sport || !formData.age || !formData.experience_level}
              className="flex-1 bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] h-11 font-semibold rounded-xl">
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3 — Injury details */}
      {step === 3 && formData.mode === "injury" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <h2 className="font-display text-2xl text-[#F8F8F8] mb-1">Your injury.</h2>
            <p className="text-[#F8F8F8]/40 font-body text-sm">Kaya will build a safe programme around it.</p>
          </div>
          <div className="space-y-1">
            <Label>Where is the injury?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {INJURY_AREAS.map(area => (
                <button key={area} onClick={() => upd("injured_area", area)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-body text-left transition-all border ${
                    formData.injured_area === area
                      ? "bg-[#B8960C]/10 text-[#B8960C] border-[#B8960C]/30"
                      : "bg-[#0E0E0E] text-[#F8F8F8]/40 border-[#2A2A2A] hover:border-[#B8960C]/20"
                  }`}>
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Severity</Label>
            <div className="flex gap-3 mt-2">
              {[{ v: "mild", label: "Mild" }, { v: "moderate", label: "Moderate" }, { v: "severe", label: "Severe" }].map(({ v, label }) => (
                <button key={v} onClick={() => upd("injury_severity", v)}
                  className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                    formData.injury_severity === v
                      ? "border-[#B8960C]/50 bg-[#B8960C]/5 text-[#B8960C]"
                      : "border-[#2A2A2A] bg-[#0E0E0E] text-[#F8F8F8]/40"
                  }`}>
                  <p className="font-display text-base">{label}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description <span className="text-[#F8F8F8]/20 normal-case font-normal tracking-normal">(optional)</span></Label>
            <Input value={formData.injury_description} onChange={e => upd("injury_description", e.target.value)}
              placeholder="e.g. ACL sprain from pivoting" className="h-11 bg-[#0E0E0E] border-[#2A2A2A] text-[#F8F8F8]" />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)} className="text-[#F8F8F8]/30">Back</Button>
            <Button onClick={() => setStep(4)} disabled={!formData.injured_area || !formData.injury_severity}
              className="flex-1 bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] h-11 font-semibold rounded-xl">
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4 — Goals */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <h2 className="font-display text-2xl text-[#F8F8F8] mb-1">Your goals.</h2>
            <p className="text-[#F8F8F8]/40 font-body text-sm">Select everything that applies.</p>
          </div>
          {formData.mode === "prehab" && (
            <div className="space-y-2">
              <Label>Areas of concern</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {CONCERNS.map(c => <TagButton key={c} selected={formData.current_concerns.includes(c)} onClick={() => toggle("current_concerns", c)}>{c}</TagButton>)}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Goals</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {GOALS.map(g => <TagButton key={g} selected={formData.goals.includes(g)} onClick={() => toggle("goals", g)}>{g}</TagButton>)}
            </div>
          </div>
          <Disclaimer />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(formData.mode === "injury" ? 3 : 2)} className="text-[#F8F8F8]/30">Back</Button>
            <Button onClick={handleSubmit} disabled={isLoading || formData.goals.length === 0}
              className="flex-1 bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] h-12 font-semibold rounded-xl">
              {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Building your programme…</> : "Generate My Programme"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
