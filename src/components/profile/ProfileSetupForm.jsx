import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChevronRight, Shield, Activity, AlertTriangle } from "lucide-react";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";

const SPORTS = ["running","basketball","football","tennis","swimming","cycling","weightlifting","crossfit","baseball","volleyball","rugby","golf","martial_arts","gymnastics","other"];
const SPORT_LABELS = { running:"Running",basketball:"Basketball",football:"Football",tennis:"Tennis",swimming:"Swimming",cycling:"Cycling",weightlifting:"Weightlifting",crossfit:"CrossFit",baseball:"Baseball",volleyball:"Volleyball",rugby:"Rugby",golf:"Golf",martial_arts:"Martial Arts",gymnastics:"Gymnastics",other:"Other" };
const CONCERNS = ["Knee pain","Lower back pain","Shoulder tightness","Hip tightness","Ankle instability","Muscle soreness","Hamstring tightness","Poor flexibility","Balance issues","Wrist/elbow discomfort"];
const GOALS = ["Prevent injuries","Recover from injury","Improve flexibility","Build strength","Reduce chronic pain","Improve mobility","Enhance performance","Improve recovery speed"];
const INJURY_AREAS = ["Neck","Shoulder (Left)","Shoulder (Right)","Elbow (Left)","Elbow (Right)","Wrist","Upper Back","Lower Back","Hip (Left)","Hip (Right)","Knee (Left)","Knee (Right)","Ankle (Left)","Ankle (Right)","Foot","Hamstring","Calf","Other"];

const StepDot = ({ step, current }) => (
  <div className={`w-2 h-2 rounded-full transition-all ${step <= current ? "bg-[#B8960C]" : "bg-[#2A3F58]"}`} />
);

function Disclaimer() {
  return (
    <div className="bg-[#162232] border border-[#2A3F58] rounded-xl p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[#C44A1A] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#F8F8F8]/40 font-body leading-relaxed">
          <strong className="text-[#F8F8F8]/60">Medical Disclaimer:</strong> Kaya is a fitness companion app, not a medical product. Programmes are for general fitness and injury prevention only — not a replacement for physiotherapy, medical diagnosis, or professional healthcare advice. Results are not guaranteed. By continuing you accept full responsibility for your health decisions.
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
      className={`px-3 py-2 rounded-xl text-sm font-body transition-all border ${selected ? "bg-[#B8960C]/10 text-[#B8960C] border-[#B8960C]/30" : "bg-[#162232] text-[#F8F8F8]/40 border-[#2A3F58] hover:border-[#B8960C]/20 hover:text-[#F8F8F8]/60"}`}>
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => <StepDot key={i} step={i + 1} current={step} />)}
      </div>

      {/* Step 1 - Mode */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <h2 className="font-display text-3xl text-[#F8F8F8] mb-1">Welcome to Kaya.</h2>
            <p className="text-[#F8F8F8]/40 font-body text-sm">Your body intelligence platform begins here.</p>
          </div>
          <div className="space-y-3">
            {[{ mode: "prehab", icon: Shield, title: "Injury Prevention", desc: "I want to prevent injuries and stay at my best." }, { mode: "injury", icon: Activity, title: "Injury Management", desc: "I have a current injury and need a safe programme." }].map(({ mode, icon: Icon, title, desc }) => (
              <button key={mode} onClick={() => { upd("mode", mode); setStep(2); }}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:border-[#B8960C]/50 ${formData.mode === mode ? "border-[#B8960C]/50 bg-[#B8960C]/5" : "border-[#2A3F58] bg-[#162232]"}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B8960C]/10 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-[#B8960C]" /></div>
                  <div><h3 className="font-display text-lg text-[#F8F8F8] mb-0.5">{title}</h3><p className="text-sm text-[#F8F8F8]/40 font-body">{desc}</p></div>
                </div>
              </button>
            ))}
          </div>
          <Disclaimer />
        </motion.div>
      )}

      {/* Step 2 - Sport & basics */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div><h2 className="font-display text-2xl text-[#F8F8F8] mb-1">Your profile.</h2><p className="text-[#F8F8F8]/40 font-body text-sm">Help Kaya understand your body and sport.</p></div>
          <div className="space-y-1"><Label>Primary Sport</Label>
            <Select value={formData.sport} onValueChange={v => upd("sport", v)}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select your sport..." /></SelectTrigger>
              <SelectContent>{SPORTS.map(s => <SelectItem key={s} value={s}>{SPORT_LABELS[s]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Age</Label><Input type="number" value={formData.age} onChange={e => upd("age", parseInt(e.target.value) || "")} placeholder="e.g. 24" className="h-12" /></div>
            <div className="space-y-1"><Label>Experience</Label>
              <Select value={formData.experience_level} onValueChange={v => upd("experience_level", v)}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Level..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem><SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label>Training Days/Wk</Label><Input type="number" min={1} max={7} value={formData.training_days_per_week} onChange={e => upd("training_days_per_week", parseInt(e.target.value) || 3)} className="h-12" /></div>
            <div className="space-y-1"><Label>Height (cm)</Label><Input type="number" value={formData.height_cm} onChange={e => upd("height_cm", parseInt(e.target.value) || "")} placeholder="175" className="h-12" /></div>
            <div className="space-y-1"><Label>Weight (kg)</Label><Input type="number" value={formData.weight_kg} onChange={e => upd("weight_kg", parseInt(e.target.value) || "")} placeholder="75" className="h-12" /></div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(formData.mode === "injury" ? 3 : 4)} disabled={!formData.sport || !formData.age || !formData.experience_level} className="flex-1 bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10]">
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3 - Injury (injury mode only) */}
      {step === 3 && formData.mode === "injury" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div><h2 className="font-display text-2xl text-[#F8F8F8] mb-1">Your injury.</h2><p className="text-[#F8F8F8]/40 font-body text-sm">Kaya will build a safe programme around it.</p></div>
          <div className="space-y-1"><Label>Where is the injury?</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {INJURY_AREAS.map(area => (
                <button key={area} onClick={() => upd("injured_area", area)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-body transition-all border text-left ${formData.injured_area === area ? "bg-[#B8960C]/10 text-[#B8960C] border-[#B8960C]/30" : "bg-[#162232] text-[#F8F8F8]/40 border-[#2A3F58] hover:border-[#B8960C]/20"}`}>
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1"><Label>Severity</Label>
            <div className="flex gap-3 mt-2">
              {[{ v: "mild", label: "Mild", desc: "Some discomfort" }, { v: "moderate", label: "Moderate", desc: "Limits training" }, { v: "severe", label: "Severe", desc: "Cannot train" }].map(({ v, label, desc }) => (
                <button key={v} onClick={() => upd("injury_severity", v)}
                  className={`flex-1 p-3 rounded-xl border text-center transition-all ${formData.injury_severity === v ? "border-[#B8960C]/50 bg-[#B8960C]/5 text-[#B8960C]" : "border-[#2A3F58] bg-[#162232] text-[#F8F8F8]/40 hover:border-[#B8960C]/20"}`}>
                  <p className="font-display text-base">{label}</p><p className="text-[10px] font-body mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1"><Label>Description (optional)</Label><Input value={formData.injury_description} onChange={e => upd("injury_description", e.target.value)} placeholder="e.g. ACL sprain from pivoting" className="h-12 mt-1" /></div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)} disabled={!formData.injured_area || !formData.injury_severity} className="flex-1 bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10]">Continue <ChevronRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </motion.div>
      )}

      {/* Step 4 - Goals */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div><h2 className="font-display text-2xl text-[#F8F8F8] mb-1">Your goals.</h2><p className="text-[#F8F8F8]/40 font-body text-sm">Select everything that applies.</p></div>
          {formData.mode === "prehab" && (
            <div className="space-y-2">
              <Label>Areas of concern</Label>
              <div className="flex flex-wrap gap-2 mt-2">{CONCERNS.map(c => <TagButton key={c} selected={formData.current_concerns.includes(c)} onClick={() => toggle("current_concerns", c)}>{c}</TagButton>)}</div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Goals</Label>
            <div className="flex flex-wrap gap-2 mt-2">{GOALS.map(g => <TagButton key={g} selected={formData.goals.includes(g)} onClick={() => toggle("goals", g)}>{g}</TagButton>)}</div>
          </div>
          <Disclaimer />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(formData.mode === "injury" ? 3 : 2)}>Back</Button>
            <Button onClick={handleSubmit} disabled={isLoading || formData.goals.length === 0} className="flex-1 bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] h-12">
              {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Building your programme…</> : "Generate My Programme"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
