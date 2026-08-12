import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { entities, auth } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AyuMark } from "@/components/ui/AyuLogo";
import { ChevronRight, Loader2, Clock } from "lucide-react";

const SPORTS = ["Football","Rugby","Basketball","Running","Tennis","Swimming","Cycling","Weightlifting","CrossFit","Gymnastics","Multi-sport","Other"];
const ROLES = ["Head Coach","Assistant Coach","Physiotherapist","Sports Therapist","S&C Coach","Athletic Trainer","Academy Coach","Club Manager","Other"];
const QUALS = ["UEFA A Licence","UEFA B Licence","Level 3 S&C","Level 4 S&C","BSc Sports Science","MSc Sports Science","HCPC Physiotherapist","Sports Therapy Degree","Other","None listed"];

export default function CoachOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", organisation: "", sport: "", role: "", qualification: "", bio: "",
  });

  const upd = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await auth.updateMe({
        full_name: form.full_name,
        subscription_plan: "coach",
        coach_profile: {
          organisation: form.organisation,
          sport: form.sport,
          role: form.role,
          qualification: form.qualification,
          bio: form.bio,
        }
      });
      navigate("/CoachDashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#1B7A4A]/4 rounded-full blur-[150px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">

        {/* Trial reminder */}
        <div className="bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#1B7A4A] flex-shrink-0" />
          <p className="text-[var(--text)]/60 text-xs font-body">
            <strong className="text-[#1B7A4A]">7-day free trial active.</strong> Full Coach access until your trial ends. £24.99/month after — cancel anytime before day 7.
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-[#1B7A4A]" : "bg-[var(--border)]"}`} />
            ))}
          </div>

          {/* Step 1 — Who you are */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="text-center mb-6">
                <AyuMark size={40} className="mx-auto mb-4" />
                <h1 className="font-display text-3xl text-[var(--text)] mb-1">Welcome, Coach.</h1>
                <p className="text-[var(--text)]/40 font-body text-sm">Let's set up your Kaya coach profile.</p>
              </div>
              <div className="space-y-1">
                <Label>Your full name</Label>
                <Input value={form.full_name} onChange={e => upd("full_name", e.target.value)}
                  placeholder="e.g. Marcus Johnson" className="h-12 mt-1 bg-[var(--surface)] border-[var(--border)] text-[var(--text)]" />
              </div>
              <div className="space-y-1">
                <Label>Club or Organisation</Label>
                <Input value={form.organisation} onChange={e => upd("organisation", e.target.value)}
                  placeholder="e.g. Bristol City FC Academy" className="h-12 mt-1 bg-[var(--surface)] border-[var(--border)] text-[var(--text)]" />
              </div>
              <div className="space-y-1">
                <Label>Your Role</Label>
                <Select value={form.role} onValueChange={v => upd("role", v)}>
                  <SelectTrigger className="h-12 mt-1 bg-[var(--surface)] border-[var(--border)] text-[var(--text)]">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setStep(2)} disabled={!form.full_name || !form.role}
                className="w-full h-12 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-xl">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 2 — Sport & credentials */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="mb-2">
                <h2 className="font-display text-2xl text-[var(--text)] mb-1">Your sport & credentials.</h2>
                <p className="text-[var(--text)]/40 font-body text-sm">Athletes will see this when they connect to you.</p>
              </div>
              <div className="space-y-1">
                <Label>Primary Sport</Label>
                <Select value={form.sport} onValueChange={v => upd("sport", v)}>
                  <SelectTrigger className="h-12 mt-1 bg-[var(--surface)] border-[var(--border)] text-[var(--text)]">
                    <SelectValue placeholder="Select sport..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Qualification <span className="text-[var(--text)]/20 normal-case font-normal tracking-normal">(optional)</span></Label>
                <Select value={form.qualification} onValueChange={v => upd("qualification", v)}>
                  <SelectTrigger className="h-12 mt-1 bg-[var(--surface)] border-[var(--border)] text-[var(--text)]">
                    <SelectValue placeholder="Select qualification..." />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="text-[var(--text)]/40">Back</Button>
                <Button onClick={() => setStep(3)} disabled={!form.sport}
                  className="flex-1 h-12 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-xl">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Bio and finish */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="mb-2">
                <h2 className="font-display text-2xl text-[var(--text)] mb-1">Your coaching approach.</h2>
                <p className="text-[var(--text)]/40 font-body text-sm">A short bio athletes see when they connect to you. Optional but recommended.</p>
              </div>
              <div className="space-y-1">
                <Label>Bio <span className="text-[var(--text)]/20 normal-case font-normal tracking-normal">(optional)</span></Label>
                <textarea
                  value={form.bio}
                  onChange={e => upd("bio", e.target.value)}
                  placeholder="e.g. S&C coach with 8 years experience working with semi-professional football clubs. Focus on injury prevention and return-to-sport protocols."
                  rows={4}
                  className="w-full mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text)]/20 focus:outline-none focus:border-[#1B7A4A] resize-none font-body"
                />
              </div>

              {/* Summary card */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-2">
                <p className="kaya-label mb-3">Your Profile</p>
                {[
                  { label: "Name", value: form.full_name },
                  { label: "Organisation", value: form.organisation || "—" },
                  { label: "Role", value: form.role },
                  { label: "Sport", value: form.sport },
                  { label: "Qualification", value: form.qualification || "—" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[var(--text)]/30 text-xs font-body">{item.label}</span>
                    <span className="text-[var(--text)]/70 text-xs font-body">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)} className="text-[var(--text)]/40">Back</Button>
                <Button onClick={handleComplete} disabled={isLoading}
                  className="flex-1 h-12 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-xl">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Command Centre <ChevronRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
