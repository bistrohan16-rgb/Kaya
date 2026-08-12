import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AyuMark, KayaWordmark } from "@/components/ui/AyuLogo";
import { ChevronRight, Shield, Activity, BarChart3, Heart, Zap, Users, Check } from "lucide-react";

const SPORTS = ["Football","Rugby","Basketball","Running","Tennis","Swimming","Cycling","Weightlifting","CrossFit","Gymnastics","Baseball","Golf","Hockey","Athletics","Martial Arts"];

// Mock app screen components — show the app in action
function DashboardScreen() {
  const routines = [
    { name: "Rehab Knee Focus", type: "Rehab", duration: "18m", exercises: 4 },
    { name: "Recovery Session", type: "Recovery", duration: "25m", exercises: 5 },
    { name: "Post Match Cooldown", type: "Cooldown", duration: "12m", exercises: 3 },
    { name: "Tennis Warmup", type: "Warmup", duration: "15m", exercises: 4 },
  ];
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden w-full">
      {/* Dashboard header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-4">
        <p className="text-[#1B7A4A] text-[9px] font-body tracking-widest uppercase mb-0.5">Tennis · Intermediate</p>
        <p className="font-display text-xl text-[var(--text)]">Good morning.</p>
        <p className="text-[var(--text)]/30 text-[10px] font-body">Your body. Your season.</p>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 p-3 border-b border-[var(--border)]">
        {[{ label: "This week", value: "3" }, { label: "Total time", value: "47m" }, { label: "Streak", value: "5" }, { label: "All time", value: "12" }].map(s => (
          <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2 text-center">
            <p className="font-mono text-sm text-[#1B7A4A]">{s.value}</p>
            <p className="text-[var(--text)]/25 text-[8px] font-body mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Today recommendation */}
      <div className="mx-3 mt-3 mb-2 bg-[var(--surface)] border border-[#1B7A4A]/20 rounded-xl px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[#1B7A4A] text-[8px] font-body tracking-widest uppercase mb-0.5">Today's Recommendation</p>
          <p className="font-display text-sm text-[var(--text)]">Tennis Warmup</p>
          <p className="text-[var(--text)]/30 text-[9px] font-body">15 minutes</p>
        </div>
        <div className="bg-[#1B7A4A] rounded-lg px-2.5 py-1.5">
          <span className="text-[var(--bg)] text-[10px] font-semibold font-body">Begin →</span>
        </div>
      </div>
      {/* Routines */}
      <div className="px-3 pb-3">
        <p className="text-[#1B7A4A] text-[8px] font-body tracking-widest uppercase mb-2">Your Routines</p>
        <div className="grid grid-cols-2 gap-1.5">
          {routines.map((r, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2.5">
              <span className="text-[7px] font-body font-bold text-[#1B7A4A] bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 px-1.5 py-0.5 rounded-full">{r.type}</span>
              <p className="font-display text-[11px] text-[var(--text)] mt-1.5 mb-0.5">{r.name}</p>
              <p className="text-[var(--text)]/25 text-[8px] font-body">{r.duration} · {r.exercises} exercises</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PainTrackScreen() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden w-full">
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3">
        <p className="text-[var(--text)] text-sm font-display">Pain Check</p>
        <p className="text-[var(--text)]/40 text-[10px] font-body">After Nordic Curl</p>
      </div>
      <div className="p-4">
        <p className="text-[var(--text)]/60 text-xs font-body mb-3">Rate any pain or discomfort</p>
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {[0,1,2,3,4,5].map(n => (
            <div key={n} className={`rounded-lg py-2 text-center border ${n === 1 ? "border-[#1B7A4A] bg-[#1B7A4A]/10" : "border-[var(--border)] bg-[var(--surface)]"}`}>
              <p className={`font-mono text-sm font-bold ${n === 1 ? "text-[#1B7A4A]" : "text-[var(--text)]/30"}`}>{n}</p>
              <p className="text-[8px] font-body text-[var(--text)]/20 mt-0.5">{["None","V.Mild","Mild","Mod","High","Severe"][n]}</p>
            </div>
          ))}
        </div>
        <div className="bg-[var(--card-hover)] rounded-xl p-3 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <p className="text-emerald-400 text-[10px] font-body font-semibold">Low pain — great form</p>
          </div>
          <p className="text-[var(--text)]/30 text-[9px] font-body">Kaya is tracking your pain patterns across sessions.</p>
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
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden w-full">
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3">
        <p className="text-[var(--text)] text-sm font-display">My Routines</p>
        <p className="text-[#1B7A4A] text-[10px] font-body tracking-widest uppercase">AI Generated for you</p>
      </div>
      <div className="p-3 space-y-2">
        {routines.map((r, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[8px] font-body font-bold text-[#1B7A4A] bg-[#1B7A4A]/10 px-1.5 py-0.5 rounded-full border border-[#1B7A4A]/20">{r.type}</span>
                <span className="text-[var(--text)]/20 text-[8px] font-body">{r.sport}</span>
              </div>
              <p className="text-[var(--text)] text-xs font-display">{r.name}</p>
              <p className="text-[var(--text)]/30 text-[9px] font-body mt-0.5">{r.duration} · {r.exercises} exercises</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--border)]" />
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
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden w-full">
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[var(--text)] text-sm font-display">Command Centre</p>
          <p className="text-[#1B7A4A] text-[10px] font-body tracking-widest uppercase">3 active athletes</p>
        </div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Pain alert" />
      </div>
      <div className="p-3 space-y-2">
        {athletes.map((a, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === "green" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <div>
                <p className="text-[var(--text)] text-xs font-body font-medium">{a.name}</p>
                <p className="text-[var(--text)]/30 text-[9px] font-body">{a.sport} · {a.sessions} sessions this week</p>
              </div>
            </div>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${a.pain === 0 ? "bg-emerald-900/30 text-emerald-400" : a.pain <= 2 ? "bg-[#1B7A4A]/10 text-[#1B7A4A]" : "bg-red-900/30 text-red-400"}`}>
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
    <div className="min-h-screen bg-[var(--bg)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(#1B7A4A 1px, transparent 1px), linear-gradient(90deg, #1B7A4A 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#1B7A4A]/4 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between">
          <KayaWordmark />
          <div className="flex items-center gap-3">
            <Link to="/coaches"><Button variant="ghost" className="text-[var(--text)]/50 hover:text-[#1B7A4A] text-sm">For Coaches</Button></Link>
            <Link to="/login"><Button variant="ghost" className="text-[var(--text)]/50 hover:text-[var(--text)]">Sign In</Button></Link>
            <Link to="/login"><Button className="bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] rounded-xl font-semibold">Get Started</Button></Link>
          </div>
        </motion.nav>

        {/* HERO — two column. Left: copy. Right: app mockup */}
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-28 md:pt-24 md:pb-36">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left — headline and CTA */}
            <div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="text-[#1B7A4A] text-xs font-body font-semibold tracking-[0.4em] uppercase mb-8">
                AI-Powered Prehab & Rehabilitation
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="font-display text-6xl md:text-7xl text-[var(--text)] leading-[1.05] mb-8">
                Prevent Injuries.<br />
                <span className="text-[#1B7A4A]">Enhance Performance.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-[var(--text)]/45 text-lg font-body leading-relaxed mb-10 max-w-md">
                The AI prehab and rehabilitation platform recommended by coaches and physios to keep athletes at every level training harder and staying injury free.
              </motion.p>

              {/* Key points — elegant, spaced */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="space-y-3.5 mb-10">
                {[
                  "AI-generated prehab routines for your sport",
                  "Safe rehab programmes built around your injury",
                  "Pain tracking and coach monitoring tools",
                  "For juniors, recreational and elite athletes",
                ].map(point => (
                  <div key={point} className="flex items-center gap-3.5">
                    <div className="w-1 h-1 bg-[#1B7A4A] rounded-full flex-shrink-0" />
                    <span className="text-[var(--text)]/50 text-sm font-body tracking-wide">{point}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/login">
                  <Button size="lg" className="bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] rounded-xl px-10 h-14 font-semibold text-base">
                    Start Free <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/Pricing">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 border-[var(--border)] text-[var(--text)]/30 hover:border-[#1B7A4A]/30 hover:text-[var(--text)]/60">
                    View Plans
                  </Button>
                </Link>
              </motion.div>

              {/* Trust — minimal, elegant */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[var(--border)]/60 pt-6">
                {["Designed with physios", "15+ sports", "All levels", "Free to start"].map(t => (
                  <span key={t} className="text-[var(--text)]/20 text-xs font-body tracking-wide">{t}</span>
                ))}
              </motion.div>
            </div>

            {/* Right — live app mockup */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="relative">
              {/* Main screen — workout player */}
              <div className="relative z-10">
                <DashboardScreen />
              </div>
              {/* Floating routines card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="absolute -bottom-6 -left-8 w-44 z-20 hidden md:block">
                <div className="bg-[var(--card)] border border-[#1B7A4A]/20 rounded-xl p-3 shadow-xl shadow-black/50">
                  <p className="text-[#1B7A4A] text-[8px] font-body tracking-widest uppercase mb-2">Pain Alert</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                    <p className="text-[var(--text)]/60 text-[9px] font-body">Sarah M. — Pain 3/5 detected</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                    <p className="text-[var(--text)]/60 text-[9px] font-body">James T. — 4 sessions this week</p>
                  </div>
                </div>
              </motion.div>
              {/* Glow behind */}
              <div className="absolute inset-0 bg-[#1B7A4A]/5 rounded-2xl blur-[40px] -z-10" />
            </motion.div>
          </div>
        </div>

        {/* Sport ticker */}
        <div className="border-y border-[var(--border)]/50 bg-[var(--card)]/30 py-3 overflow-hidden mb-20">
          <motion.div animate={{ x: [0, -1800] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap">
            {[...SPORTS, ...SPORTS, ...SPORTS, ...SPORTS].map((sport, i) => (
              <span key={i} className="text-[#1B7A4A]/35 text-xs font-body font-bold tracking-[0.3em] uppercase flex items-center gap-4">
                {sport} <span className="text-[var(--border)]">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* APP IN ACTION — three screens side by side */}
        <div className="max-w-6xl mx-auto px-5 mb-32">
          <div className="text-center mb-16">
            <p className="kaya-label mb-4">See it in action</p>
            <h2 className="font-display text-5xl text-[var(--text)] leading-tight">Built for every part<br />of the athlete journey.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
              <p className="kaya-label mb-3 text-center">Prehab & Training</p>
              <RoutineScreen />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="kaya-label mb-3 text-center">Workout Player</p>
              <DashboardScreen />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <p className="kaya-label mb-3 text-center">Coach Dashboard</p>
              <CoachScreen />
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-5 mb-32">
          <div className="text-center mb-16">
            <p className="kaya-label mb-3">Everything you need</p>
            <h2 className="font-display text-5xl text-[var(--text)] leading-tight">From first session<br />to full recovery.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-7 hover:border-[#1B7A4A]/20 transition-all group">
                <div className="w-9 h-9 bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1B7A4A]/20 transition-all">
                  <f.icon className="w-4 h-4 text-[#1B7A4A]" />
                </div>
                <h3 className="font-display text-base text-[var(--text)] mb-1">{f.title}</h3>
                <p className="text-[var(--text)]/40 text-xs font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who it's for */}
        <div className="max-w-6xl mx-auto px-5 mb-32">
          <div className="text-center mb-16">
            <p className="kaya-label mb-4">For everyone</p>
            <h2 className="font-display text-5xl text-[var(--text)] leading-tight">Whoever you are.<br />Whatever your sport.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Athletes", desc: "From weekend warriors to academy players. Kaya builds around your sport, your body and your goals.", tag: "All levels" },
              { title: "Coaches & Physios", desc: "Recommend Kaya to your squad. Monitor compliance, pain data and performance from one dashboard.", tag: "Recommended by professionals" },
              { title: "Returning from Injury", desc: "Safe, structured rehab plans built around your injury. Get back to sport faster and stay there longer.", tag: "Recovery focused" },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#1B7A4A]/20 transition-all">
                <span className="text-[8px] font-body font-bold text-[#1B7A4A] bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 px-2 py-1 rounded-full tracking-widest uppercase">{card.tag}</span>
                <h3 className="font-display text-2xl text-[var(--text)] mt-3 mb-2">{card.title}</h3>
                <p className="text-[var(--text)]/40 text-sm font-body leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coach CTA */}
        <div className="max-w-6xl mx-auto px-5 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="kaya-label mb-2">Are you a coach or physio?</p>
              <h3 className="font-display text-2xl text-[var(--text)] mb-1">Manage your squad with Kaya.</h3>
              <p className="text-[var(--text)]/40 text-sm font-body">Monitor compliance, receive pain alerts and run AI team selection reports. 7-day free trial.</p>
            </div>
            <Link to="/coaches" className="flex-shrink-0">
              <Button className="bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] rounded-xl font-semibold h-12 px-8 whitespace-nowrap">
                Explore Coach Plan <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-5 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-[var(--card)] border border-[#1B7A4A]/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#1B7A4A]/5 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <AyuMark size={52} className="mx-auto mb-6 kaya-ring" />
              <h2 className="font-display text-4xl md:text-5xl text-[var(--text)] mb-4">
                Train smarter.<br /><span className="text-[#1B7A4A]">Last longer.</span>
              </h2>
              <p className="text-[var(--text)]/40 font-body mb-8 max-w-lg mx-auto leading-relaxed">
                Join athletes, coaches and physios across 15+ sports who use Kaya to prevent injuries, recover faster and stay in the game.
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] rounded-xl px-12 h-14 text-base font-semibold">
                  Start Free Today <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-[var(--text)]/20 text-xs font-body mt-4">Free to start · No credit card required</p>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-6xl mx-auto px-5 pb-12 text-center">
          <p className="text-[var(--text)]/15 text-xs font-body leading-relaxed max-w-2xl mx-auto">
            ⚕️ <strong className="text-[var(--text)]/25">Medical Disclaimer:</strong> Kaya is a fitness companion app, not a medical product. Not a replacement for physiotherapy, medical diagnosis or professional healthcare advice. Always consult a qualified healthcare professional before starting any exercise programme.
          </p>
        </div>
      </div>
    </div>
  );
}
