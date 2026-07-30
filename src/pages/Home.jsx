import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AyuMark, KayaWordmark } from "@/components/ui/AyuLogo";
import { ChevronRight, Shield, Activity, BarChart3, Heart, Zap, Users, Check } from "lucide-react";

const SPORTS = ["Football","Rugby","Basketball","Running","Tennis","Swimming","Cycling","Weightlifting","CrossFit","Gymnastics","Baseball","Golf","Hockey","Athletics","Martial Arts"];

// Mock app screen components — show the app in action
function WorkoutScreen() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden w-full">
      {/* Header */}
      <div className="bg-[#0E0E0E] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[#F8F8F8] text-sm font-display">Hamstring Prehab</p>
          <p className="text-[#B8960C] text-[10px] font-body tracking-widest uppercase">2 of 6 exercises</p>
        </div>
        <div className="text-[#B8960C] text-xs font-mono">04:12</div>
      </div>
      {/* Timer ring */}
      <div className="flex flex-col items-center py-6 px-4">
        <div className="relative flex items-center justify-center mb-4">
          <svg width="100" height="100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="#2A2A2A" strokeWidth="5" fill="none" />
            <circle cx="50" cy="50" r="42" stroke="#B8960C" strokeWidth="5" fill="none"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * 0.35} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-[#B8960C]">19</span>
            <span className="text-[#F8F8F8]/30 text-[9px] font-body">seconds</span>
          </div>
        </div>
        <p className="font-display text-lg text-[#F8F8F8] text-center mb-1">Nordic Curl</p>
        <p className="text-[#B8960C] text-[9px] font-body tracking-widest uppercase mb-3">Hamstrings · Knees</p>
        <p className="text-[#F8F8F8]/40 text-[10px] font-body text-center leading-relaxed mb-4">
          Kneel on pad, anchor feet, lower body slowly with control. The eccentric phase protects hamstring fibres.
        </p>
        <div className="w-full bg-[#B8960C] rounded-xl py-2.5 text-center">
          <span className="text-[#080808] text-xs font-semibold font-body">Done — Next Exercise</span>
        </div>
      </div>
    </div>
  );
}

function PainTrackScreen() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden w-full">
      <div className="bg-[#0E0E0E] border-b border-[#2A2A2A] px-4 py-3">
        <p className="text-[#F8F8F8] text-sm font-display">Pain Check</p>
        <p className="text-[#F8F8F8]/40 text-[10px] font-body">After Nordic Curl</p>
      </div>
      <div className="p-4">
        <p className="text-[#F8F8F8]/60 text-xs font-body mb-3">Rate any pain or discomfort</p>
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {[0,1,2,3,4,5].map(n => (
            <div key={n} className={`rounded-lg py-2 text-center border ${n === 1 ? "border-[#B8960C] bg-[#B8960C]/10" : "border-[#2A2A2A] bg-[#0E0E0E]"}`}>
              <p className={`font-mono text-sm font-bold ${n === 1 ? "text-[#B8960C]" : "text-[#F8F8F8]/30"}`}>{n}</p>
              <p className="text-[8px] font-body text-[#F8F8F8]/20 mt-0.5">{["None","V.Mild","Mild","Mod","High","Severe"][n]}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#1C1C1C] rounded-xl p-3 border border-[#2A2A2A]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <p className="text-emerald-400 text-[10px] font-body font-semibold">Low pain — great form</p>
          </div>
          <p className="text-[#F8F8F8]/30 text-[9px] font-body">Kaya is tracking your pain patterns across sessions.</p>
        </div>
      </div>
    </div>
  );
}

function RoutineScreen() {
  const routines = [
    { name: "Pre-Match Warmup", type: "Warmup", duration: "12m", exercises: 6, sport: "Football" },
    { name: "Knee Prehab", type: "Prehab", duration: "18m", exercises: 8, sport: "Running" },
    { name: "Shoulder Recovery", type: "Rehab", duration: "15m", exercises: 7, sport: "Swimming" },
  ];
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden w-full">
      <div className="bg-[#0E0E0E] border-b border-[#2A2A2A] px-4 py-3">
        <p className="text-[#F8F8F8] text-sm font-display">My Routines</p>
        <p className="text-[#B8960C] text-[10px] font-body tracking-widest uppercase">AI Generated for you</p>
      </div>
      <div className="p-3 space-y-2">
        {routines.map((r, i) => (
          <div key={i} className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[8px] font-body font-bold text-[#B8960C] bg-[#B8960C]/10 px-1.5 py-0.5 rounded-full border border-[#B8960C]/20">{r.type}</span>
                <span className="text-[#F8F8F8]/20 text-[8px] font-body">{r.sport}</span>
              </div>
              <p className="text-[#F8F8F8] text-xs font-display">{r.name}</p>
              <p className="text-[#F8F8F8]/30 text-[9px] font-body mt-0.5">{r.duration} · {r.exercises} exercises</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#2A2A2A]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachScreen() {
  const athletes = [
    { name: "James T.", sport: "Rugby", status: "green", sessions: 4, pain: 0 },
    { name: "Sarah M.", sport: "Running", status: "amber", sessions: 2, pain: 3 },
    { name: "Alex K.", sport: "Football", status: "green", sessions: 5, pain: 1 },
  ];
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden w-full">
      <div className="bg-[#0E0E0E] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[#F8F8F8] text-sm font-display">Command Centre</p>
          <p className="text-[#B8960C] text-[10px] font-body tracking-widest uppercase">3 active athletes</p>
        </div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Pain alert" />
      </div>
      <div className="p-3 space-y-2">
        {athletes.map((a, i) => (
          <div key={i} className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === "green" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <div>
                <p className="text-[#F8F8F8] text-xs font-body font-medium">{a.name}</p>
                <p className="text-[#F8F8F8]/30 text-[9px] font-body">{a.sport} · {a.sessions} sessions this week</p>
              </div>
            </div>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${a.pain === 0 ? "bg-emerald-900/30 text-emerald-400" : a.pain <= 2 ? "bg-[#B8960C]/10 text-[#B8960C]" : "bg-red-900/30 text-red-400"}`}>
              Pain: {a.pain}/5
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Shield, title: "AI Prehab", desc: "Personalised injury prevention routines built for your sport, position and physical profile." },
  { icon: Activity, title: "Rehab Plans", desc: "Safe structured return-to-sport programmes built around your injury and target return date." },
  { icon: Heart, title: "Pain Tracking", desc: "Log pain during every exercise. Kaya identifies patterns before they become injuries." },
  { icon: BarChart3, title: "Performance Testing", desc: "Track and benchmark sprint times, jumps and fitness tests against sport-specific norms." },
  { icon: Zap, title: "AI Coach", desc: "Expert answers on injury prevention, nutrition and recovery. Available 24/7." },
  { icon: Users, title: "Coach Dashboard", desc: "Manage athletes, monitor compliance, receive pain alerts and run team selection reports." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(#B8960C 1px, transparent 1px), linear-gradient(90deg, #B8960C 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#B8960C]/4 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between">
          <KayaWordmark />
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" className="text-[#F8F8F8]/50 hover:text-[#F8F8F8]">Sign In</Button></Link>
            <Link to="/login"><Button className="bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] rounded-xl font-semibold">Get Started</Button></Link>
          </div>
        </motion.nav>

        {/* HERO — two column. Left: copy. Right: app mockup */}
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-20 md:pt-16 md:pb-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left — headline and CTA */}
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-6">
                <AyuMark size={28} />
                <span className="text-[#B8960C] text-xs font-body font-semibold tracking-[0.3em] uppercase">
                  AI-Powered Prehab & Rehab
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="font-display text-5xl md:text-6xl text-[#F8F8F8] leading-tight mb-6">
                Stay injury free.<br />
                <span className="text-[#B8960C]">Perform longer.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-[#F8F8F8]/50 text-base font-body leading-relaxed mb-4">
                Kaya is the AI prehab and rehabilitation platform recommended by coaches and physios to keep athletes at every level training harder and staying injury free.
              </motion.p>

              {/* Key points */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="space-y-2 mb-8">
                {["AI-generated prehab routines for your sport", "Safe rehab programmes built around your injury", "Pain tracking and coach monitoring tools", "For juniors, recreational and elite athletes"].map(point => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#B8960C]/10 border border-[#B8960C]/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#B8960C]" />
                    </div>
                    <span className="text-[#F8F8F8]/60 text-sm font-body">{point}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/login">
                  <Button size="lg" className="bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] rounded-xl px-8 h-12 font-semibold">
                    Start Free <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/Pricing">
                  <Button size="lg" variant="outline" className="rounded-xl px-6 h-12 border-[#2A2A2A] text-[#F8F8F8]/40 hover:border-[#B8960C]/40 hover:text-[#B8960C]">
                    View Plans
                  </Button>
                </Link>
              </motion.div>

              {/* Trust signals */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-x-5 gap-y-1">
                {["Designed with physios", "15+ sports", "All levels", "Free to start"].map(t => (
                  <span key={t} className="text-[#F8F8F8]/25 text-xs font-body flex items-center gap-1.5">
                    <span className="text-[#B8960C]">·</span> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — live app mockup */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="relative">
              {/* Main screen — workout player */}
              <div className="relative z-10">
                <WorkoutScreen />
              </div>
              {/* Floating pain check card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="absolute -bottom-8 -left-6 w-48 z-20 hidden md:block">
                <PainTrackScreen />
              </motion.div>
              {/* Glow behind */}
              <div className="absolute inset-0 bg-[#B8960C]/5 rounded-2xl blur-[40px] -z-10" />
            </motion.div>
          </div>
        </div>

        {/* Sport ticker */}
        <div className="border-y border-[#2A2A2A]/50 bg-[#141414]/30 py-3 overflow-hidden mb-20">
          <motion.div animate={{ x: [0, -1800] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap">
            {[...SPORTS, ...SPORTS, ...SPORTS, ...SPORTS].map((sport, i) => (
              <span key={i} className="text-[#B8960C]/35 text-xs font-body font-bold tracking-[0.3em] uppercase flex items-center gap-4">
                {sport} <span className="text-[#2A2A2A]">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* APP IN ACTION — three screens side by side */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">See it in action</p>
            <h2 className="font-display text-4xl text-[#F8F8F8]">Built for every part<br />of the athlete journey.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
              <p className="kaya-label mb-3 text-center">Prehab & Training</p>
              <RoutineScreen />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="kaya-label mb-3 text-center">Workout Player</p>
              <WorkoutScreen />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <p className="kaya-label mb-3 text-center">Coach Dashboard</p>
              <CoachScreen />
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">Everything you need</p>
            <h2 className="font-display text-4xl text-[#F8F8F8]">From first session<br />to full recovery.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#B8960C]/30 transition-all group">
                <div className="w-9 h-9 bg-[#B8960C]/10 border border-[#B8960C]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#B8960C]/20 transition-all">
                  <f.icon className="w-4 h-4 text-[#B8960C]" />
                </div>
                <h3 className="font-display text-base text-[#F8F8F8] mb-1">{f.title}</h3>
                <p className="text-[#F8F8F8]/40 text-xs font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who it's for */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">For everyone</p>
            <h2 className="font-display text-4xl text-[#F8F8F8]">Whoever you are.<br />Whatever your sport.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Athletes", desc: "From weekend warriors to academy players. Kaya builds around your sport, your body and your goals.", tag: "All levels" },
              { title: "Coaches & Physios", desc: "Recommend Kaya to your squad. Monitor compliance, pain data and performance from one dashboard.", tag: "Recommended by professionals" },
              { title: "Returning from Injury", desc: "Safe, structured rehab plans built around your injury. Get back to sport faster and stay there longer.", tag: "Recovery focused" },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#B8960C]/20 transition-all">
                <span className="text-[8px] font-body font-bold text-[#B8960C] bg-[#B8960C]/10 border border-[#B8960C]/20 px-2 py-1 rounded-full tracking-widest uppercase">{card.tag}</span>
                <h3 className="font-display text-2xl text-[#F8F8F8] mt-3 mb-2">{card.title}</h3>
                <p className="text-[#F8F8F8]/40 text-sm font-body leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-5 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-[#141414] border border-[#B8960C]/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#B8960C]/5 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <AyuMark size={52} className="mx-auto mb-6 kaya-ring" />
              <h2 className="font-display text-4xl md:text-5xl text-[#F8F8F8] mb-4">
                Train smarter.<br /><span className="text-[#B8960C]">Last longer.</span>
              </h2>
              <p className="text-[#F8F8F8]/40 font-body mb-8 max-w-lg mx-auto leading-relaxed">
                Join athletes, coaches and physios across 15+ sports who use Kaya to prevent injuries, recover faster and stay in the game.
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10] rounded-xl px-12 h-14 text-base font-semibold">
                  Start Free Today <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-[#F8F8F8]/20 text-xs font-body mt-4">Free to start · No credit card required</p>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-6xl mx-auto px-5 pb-12 text-center">
          <p className="text-[#F8F8F8]/15 text-xs font-body leading-relaxed max-w-2xl mx-auto">
            ⚕️ <strong className="text-[#F8F8F8]/25">Medical Disclaimer:</strong> Kaya is a fitness companion app, not a medical product. Not a replacement for physiotherapy, medical diagnosis or professional healthcare advice. Always consult a qualified healthcare professional before starting any exercise programme.
          </p>
        </div>
      </div>
    </div>
  );
}
