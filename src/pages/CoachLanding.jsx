import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AyuMark, KayaWordmark } from "@/components/ui/AyuLogo";
import { ChevronRight, Users, Shield, BarChart3, AlertTriangle, Trophy, ClipboardList, Clock, Check } from "lucide-react";

const FEATURES = [
  { icon: Users, title: "Athlete Management", desc: "Connect your entire squad. See every athlete's training history, pain data and compliance from one screen." },
  { icon: AlertTriangle, title: "Pain Alert System", desc: "Get notified the moment an athlete logs significant pain. Amber and red alerts flag concerns before they become serious injuries." },
  { icon: ClipboardList, title: "Custom Routine Builder", desc: "Build your own prehab and rehab routines from scratch and push them directly to individual athletes or your whole squad." },
  { icon: BarChart3, title: "Performance Tracking", desc: "Log and monitor athlete test results — sprint times, jumps, broncos, beep tests. Track progress over time with AI benchmarking." },
  { icon: Trophy, title: "AI Team Selection Report", desc: "Generate an AI-powered selection report ranking your squad by fitness, compliance and performance data." },
  { icon: Shield, title: "Compliance Monitoring", desc: "See exactly which athletes are completing their assigned routines and which need a nudge." },
];

const STEPS = [
  { step: "01", title: "Create your coach account", desc: "Sign up in under a minute. No credit card needed for your free trial." },
  { step: "02", title: "Set up your profile", desc: "Add your sport, club and credentials so athletes know who they're connecting to." },
  { step: "03", title: "Invite your athletes", desc: "Share your unique coach code or invite athletes directly by email." },
  { step: "04", title: "Monitor and protect", desc: "Watch compliance, receive pain alerts and run team selection reports from your command centre." },
];

// Mock coach dashboard preview
function CoachPreview() {
  const athletes = [
    { name: "James T.", sport: "Rugby", sessions: 4, pain: 0, status: "green" },
    { name: "Sarah M.", sport: "Running", sessions: 2, pain: 3, status: "amber" },
    { name: "Alex K.", sport: "Football", sessions: 5, pain: 1, status: "green" },
    { name: "Maya R.", sport: "Tennis", sessions: 3, pain: 0, status: "green" },
  ];
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden w-full">
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[var(--text)] text-sm font-display">Command Centre</p>
          <p className="text-[#1B7A4A] text-[10px] font-body tracking-widest uppercase">4 active athletes</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-400 text-[9px] font-body">1 pain alert</span>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 border-b border-[var(--border)]">
        {[{ label: "Active athletes", value: "4" }, { label: "Sessions this week", value: "14" }, { label: "Avg compliance", value: "87%" }].map(s => (
          <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2 text-center">
            <p className="font-mono text-sm text-[#1B7A4A]">{s.value}</p>
            <p className="text-[var(--text)]/25 text-[8px] font-body mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Alert */}
      <div className="mx-3 mt-3 bg-amber-900/20 border border-amber-800/40 rounded-xl px-3 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <p className="text-amber-400 text-[9px] font-body font-semibold">Sarah M. reported pain 3/5 during Nordic Curl — review recommended</p>
        </div>
      </div>
      {/* Athletes */}
      <div className="p-3 space-y-1.5">
        {athletes.map((a, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === "green" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <div>
                <p className="text-[var(--text)] text-xs font-body">{a.name}</p>
                <p className="text-[var(--text)]/30 text-[8px] font-body">{a.sport} · {a.sessions} sessions</p>
              </div>
            </div>
            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full ${a.pain === 0 ? "bg-emerald-900/30 text-emerald-400" : a.pain <= 2 ? "bg-[#1B7A4A]/10 text-[#1B7A4A]" : "bg-amber-900/30 text-amber-400"}`}>
              Pain: {a.pain}/5
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoachLanding() {
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
          <Link to="/"><KayaWordmark /></Link>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" className="text-[var(--text)]/50 hover:text-[var(--text)]">Sign In</Button></Link>
            <Link to="/login?mode=signup&plan=coach">
              <Button className="bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] rounded-xl font-semibold">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </motion.nav>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-20 md:pt-16 md:pb-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-6">
                <AyuMark size={28} />
                <span className="text-[#1B7A4A] text-xs font-body font-semibold tracking-[0.3em] uppercase">
                  Kaya for Coaches
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="font-display text-5xl md:text-6xl text-[var(--text)] leading-tight mb-6">
                Protect your athletes.<br />
                <span className="text-[#1B7A4A]">Before they break.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-[var(--text)]/50 text-base font-body leading-relaxed mb-6">
                Kaya gives coaches, physios and S&C coaches a complete platform to manage athlete prehab, monitor pain levels and keep their squad on the pitch.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="space-y-2 mb-8">
                {[
                  "Monitor all your athletes from one dashboard",
                  "Receive instant pain alerts when athletes flag discomfort",
                  "Build and assign custom prehab routines",
                  "Run AI-powered team selection reports",
                  "Track compliance — see who is and isn't training",
                ].map(point => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#1B7A4A]/10 border border-[#1B7A4A]/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#1B7A4A]" />
                    </div>
                    <span className="text-[var(--text)]/60 text-sm font-body">{point}</span>
                  </div>
                ))}
              </motion.div>

              {/* Trial CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-[var(--card)] border border-[#1B7A4A]/20 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#1B7A4A]" />
                  <p className="text-[#1B7A4A] text-xs font-body font-semibold tracking-widest uppercase">7-Day Free Trial</p>
                </div>
                <p className="text-[var(--text)]/60 text-sm font-body mb-3">
                  Get full access to the Coach plan free for 7 days. After your trial, Kaya Coach is <strong className="text-[var(--text)]">£24.99/month</strong>. Cancel anytime before your trial ends and you won't be charged.
                </p>
                <Link to="/login?mode=signup&plan=coach">
                  <Button className="w-full h-11 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-xl">
                    Start Your Free Trial <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <p className="text-[var(--text)]/25 text-[10px] font-body text-center mt-2">No credit card required to start · £24.99/month after trial</p>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-x-5 gap-y-1">
                {["Physios", "S&C Coaches", "Academy Coaches", "Club Managers"].map(t => (
                  <span key={t} className="text-[var(--text)]/25 text-xs font-body flex items-center gap-1.5">
                    <span className="text-[#1B7A4A]">·</span> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — coach dashboard preview */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="relative">
              <CoachPreview />
              <div className="absolute inset-0 bg-[#1B7A4A]/5 rounded-2xl blur-[40px] -z-10" />
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">Everything coaches need</p>
            <h2 className="font-display text-4xl text-[var(--text)]">The complete platform<br />for athlete welfare.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[#1B7A4A]/30 transition-all group">
                <div className="w-9 h-9 bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1B7A4A]/20 transition-all">
                  <f.icon className="w-4 h-4 text-[#1B7A4A]" />
                </div>
                <h3 className="font-display text-base text-[var(--text)] mb-1">{f.title}</h3>
                <p className="text-[var(--text)]/40 text-xs font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">Getting started</p>
            <h2 className="font-display text-4xl text-[var(--text)]">Up and running<br />in minutes.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[#1B7A4A]/20 transition-all">
                <p className="font-mono text-[#1B7A4A]/40 text-xs mb-3 tracking-widest">{step.step}</p>
                <h3 className="font-display text-lg text-[var(--text)] mb-2">{step.title}</h3>
                <p className="text-[var(--text)]/40 text-xs font-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing clarity */}
        <div className="max-w-3xl mx-auto px-5 mb-24">
          <div className="bg-[var(--card)] border border-[#1B7A4A]/20 rounded-2xl p-8 text-center">
            <p className="kaya-label mb-4">Simple pricing</p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="font-mono text-5xl text-[#1B7A4A]">£24.99</span>
              <span className="text-[var(--text)]/30 font-body">/month</span>
            </div>
            <p className="text-[var(--text)]/40 font-body text-sm mb-6">after your 7-day free trial · cancel anytime</p>
            <div className="grid grid-cols-2 gap-3 mb-8 text-left">
              {["Unlimited athletes", "Pain alert system", "Custom routine builder", "Team selection report", "Performance testing", "Compliance tracking", "AI Coach access", "Priority support"].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1B7A4A] flex-shrink-0" />
                  <span className="text-[var(--text)]/60 text-xs font-body">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/login?mode=signup&plan=coach">
              <Button className="w-full h-12 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-xl">
                Start 7-Day Free Trial <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <p className="text-[var(--text)]/20 text-[10px] font-body mt-3">No credit card required · Full access during trial · Cancel before day 7 to avoid charge</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-6xl mx-auto px-5 mb-20 text-center">
          <AyuMark size={44} className="mx-auto mb-5 kaya-ring" />
          <h2 className="font-display text-3xl text-[var(--text)] mb-3">Already an athlete on Kaya?</h2>
          <p className="text-[var(--text)]/40 font-body mb-6 text-sm">Head back to the main app to start your prehab programme.</p>
          <Link to="/">
            <Button variant="outline" className="border-[var(--border)] text-[var(--text)]/40 hover:border-[#1B7A4A]/40 hover:text-[#1B7A4A]">
              Back to Kaya
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-5 pb-12 text-center">
          <p className="text-[var(--text)]/15 text-xs font-body leading-relaxed max-w-2xl mx-auto">
            ⚕️ <strong className="text-[var(--text)]/25">Medical Disclaimer:</strong> Kaya is a fitness companion app, not a medical product. Not a replacement for physiotherapy or professional healthcare advice.
          </p>
        </div>
      </div>
    </div>
  );
}
