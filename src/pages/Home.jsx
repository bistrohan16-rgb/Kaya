import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AyuMark, KayaWordmark } from "@/components/ui/AyuLogo";
import { ChevronRight, Shield, Zap, Users, Activity, BarChart3, Heart } from "lucide-react";

const SPORTS = ["Football","Rugby","Basketball","Running","Tennis","Swimming","Cycling","Weightlifting","CrossFit","Gymnastics","Baseball","Golf","Hockey","Athletics","Martial Arts"];
const FEATURES = [
  { icon: Shield, title: "AI Injury Prevention", desc: "Personalised prehab routines built for your exact sport, position, age and physical profile. Prevention before pain." },
  { icon: Activity, title: "Rehab Programmes", desc: "Already injured? Kaya builds a safe, structured return-to-sport plan around your injury and target return date." },
  { icon: BarChart3, title: "Performance Testing", desc: "Track sprint times, jumps, broncos and more. Monthly test logging with AI benchmarking against sport norms." },
  { icon: Zap, title: "AI Coach", desc: "Ask anything about injury prevention, nutrition, recovery or technique. Expert answers available 24/7." },
  { icon: Heart, title: "Pain Tracking", desc: "Log pain levels during every exercise. Kaya identifies patterns and flags concerns before they become injuries." },
  { icon: Users, title: "Coach Dashboard", desc: "Coaches manage athletes, assign routines, monitor compliance and pain data, and run AI team selection reports." },
];
const HOW_IT_WORKS = [
  { step: "01", title: "Build your profile", desc: "Tell Kaya your sport, position, training load and any injury history. The AI builds around you specifically." },
  { step: "02", title: "Receive your programme", desc: "Kaya generates personalised exercises and prehab routines specific to your sport, body and goals." },
  { step: "03", title: "Train and track", desc: "Complete sessions, log pain levels, track performance tests and watch your resilience grow over time." },
];
const TRUST = [
  { label: "Designed with sports physiotherapists" },
  { label: "Evidence-based exercise protocols" },
  { label: "Used across 15+ sports" },
  { label: "Built for all levels" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A1628] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(#B8960C 1px, transparent 1px), linear-gradient(90deg, #B8960C 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#B8960C]/4 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between">
          <KayaWordmark />
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" className="text-[#F8F8F8]/50 hover:text-[#F8F8F8]">Sign In</Button></Link>
            <Link to="/login"><Button className="bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] rounded-xl font-semibold">Get Started</Button></Link>
          </div>
        </motion.nav>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-5 pt-12 pb-20 md:pt-20 md:pb-28 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
            className="flex justify-center mb-10">
            <AyuMark size={88} pulse className="kaya-ring" />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[#B8960C] text-xs font-body font-semibold tracking-[0.4em] uppercase mb-5">
            AI-Powered Prehab & Rehabilitation
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl text-[#F8F8F8] leading-tight mb-6">
            Train smarter.<br /><span className="text-[#B8960C]">Last longer.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-[#F8F8F8]/50 text-lg max-w-2xl mx-auto mb-3 font-body leading-relaxed">
            Kaya is the AI-powered prehab and rehabilitation platform recommended by coaches and physios to keep athletes at every level training harder, performing longer and staying injury free.
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-[#F8F8F8]/25 text-sm font-body mb-10">
            AI-generated programmes tailored to your sport, position, age and injury history.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/login">
              <Button size="lg" className="bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] rounded-xl px-10 h-14 text-base font-semibold">
                Start Your Programme <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/Pricing">
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 border-[#2A3F58] text-[#F8F8F8]/40 hover:border-[#B8960C]/40 hover:text-[#B8960C]">
                View Plans
              </Button>
            </Link>
          </motion.div>

          {/* Sport pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-2 mb-4">
            {["Football","Rugby","Basketball","Running","Tennis","Swimming","Cycling","Weightlifting","CrossFit","More"].map(sport => (
              <span key={sport} className="px-3 py-1.5 bg-[#162232] border border-[#2A3F58] rounded-full text-xs font-body text-[#F8F8F8]/40">
                {sport}
              </span>
            ))}
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="text-[#F8F8F8]/20 text-xs font-body tracking-widest uppercase">
            Prehab · Rehab · Performance · Recovery
          </motion.p>
        </div>

        {/* Trust bar */}
        <div className="border-y border-[#2A3F58]/60 bg-[#162232]/40 py-4 mb-24">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex flex-wrap justify-center gap-8">
              {TRUST.map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#B8960C] rounded-full" />
                  <span className="text-[#F8F8F8]/40 text-xs font-body">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sport ticker */}
        <div className="border-y border-[#2A3F58]/40 bg-[#162232]/30 py-3 overflow-hidden mb-24">
          <motion.div animate={{ x: [0, -1800] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap">
            {[...SPORTS, ...SPORTS, ...SPORTS, ...SPORTS].map((sport, i) => (
              <span key={i} className="text-[#B8960C]/30 text-xs font-body font-bold tracking-[0.3em] uppercase flex items-center gap-4">
                {sport} <span className="text-[#2A3F58]">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">Built for athletes</p>
            <h2 className="font-display text-4xl text-[#F8F8F8]">Everything your body needs.<br />Nothing it doesn't.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-[#162232] border border-[#2A3F58] rounded-2xl p-6 hover:border-[#B8960C]/30 transition-all group">
                <div className="w-10 h-10 bg-[#B8960C]/10 border border-[#B8960C]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#B8960C]/20 transition-all">
                  <f.icon className="w-5 h-5 text-[#B8960C]" />
                </div>
                <h3 className="font-display text-lg text-[#F8F8F8] mb-2">{f.title}</h3>
                <p className="text-[#F8F8F8]/40 text-sm font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="text-center mb-12">
            <p className="kaya-label mb-3">Simple to start</p>
            <h2 className="font-display text-4xl text-[#F8F8F8]">Up and running in minutes.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#162232] border border-[#2A3F58] rounded-2xl p-6 hover:border-[#B8960C]/20 transition-all">
                <p className="font-mono text-[#B8960C]/40 text-xs mb-4 tracking-widest">{step.step}</p>
                <h3 className="font-display text-xl text-[#F8F8F8] mb-2">{step.title}</h3>
                <p className="text-[#F8F8F8]/40 text-sm font-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-5 mb-24">
          <div className="bg-[#162232] border border-[#2A3F58] rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[{ value: "15+", label: "Sports supported" }, { value: "AI", label: "Personalised for you" }, { value: "24/7", label: "Coach available" }, { value: "0", label: "Injuries is the goal" }].map(s => (
                <div key={s.label}>
                  <p className="font-mono text-3xl text-[#B8960C] mb-1">{s.value}</p>
                  <p className="text-[#F8F8F8]/40 text-sm font-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-5 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-[#162232] border border-[#B8960C]/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#B8960C]/5 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <AyuMark size={56} className="mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl text-[#F8F8F8] mb-4">Ready to train smarter?</h2>
              <p className="text-[#F8F8F8]/40 font-body mb-8 max-w-lg mx-auto leading-relaxed">
                Join athletes, coaches and physios across 15+ sports who use Kaya to train smarter, recover faster and last longer.
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] rounded-xl px-12 h-14 text-base font-semibold">
                  Start Free Today <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-6xl mx-auto px-5 pb-12 text-center">
          <p className="text-[#F8F8F8]/20 text-xs font-body leading-relaxed max-w-2xl mx-auto">
            ⚕️ <strong className="text-[#F8F8F8]/30">Medical Disclaimer:</strong> Kaya is a fitness companion app, not a medical product. It is not a replacement for physiotherapy, medical diagnosis, or professional healthcare advice. Results are not guaranteed. Always consult a qualified healthcare professional before starting any exercise programme.
          </p>
        </div>
      </div>
    </div>
  );
}
