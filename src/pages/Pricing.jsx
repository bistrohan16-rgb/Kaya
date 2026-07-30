import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Shield, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";
import { useSubscription } from "@/hooks/useSubscription";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    desc: "Get started and explore Kaya.",
    icon: Shield,
    features: [
      "AI-generated prehab programme",
      "Up to 3 routines",
      "Exercise library access",
      "Sport plans library",
      "Performance testing tracker",
    ],
    excluded: [
      "AI Coach chat",
      "Diet Plan generator",
      "Unlimited routines",
      "Coach Dashboard",
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "£9.99",
    period: "per month",
    desc: "Everything you need to stay injury free.",
    icon: Zap,
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Everything in Free",
      "Unlimited AI routines",
      "AI Coach — 24/7 expert chat",
      "Personalised Diet Plan generator",
      "Full performance testing suite",
      "Priority AI generation",
    ],
    excluded: [
      "Coach Dashboard",
      "Athlete management",
    ],
    cta: "Start Premium",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "coach",
    name: "Coach",
    price: "£24.99",
    period: "per month",
    desc: "Manage your athletes. Protect your squad.",
    icon: Crown,
    priceId: import.meta.env.VITE_STRIPE_COACH_PRICE_ID,
    features: [
      "Everything in Premium",
      "Coach Command Centre",
      "Athlete management & monitoring",
      "Pain alert system",
      "Assign custom routines",
      "Team performance testing",
      "AI Team Selection Report",
      "Athlete compliance tracking",
    ],
    excluded: [],
    cta: "Start Coach",
    highlight: false,
    badge: "For Coaches",
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user, plan: currentPlan, isLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (priceId, planId) => {
    if (!user) { navigate("/login?redirect=/Pricing"); return; }
    if (planId === "free") { navigate("/Dashboard"); return; }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#B8960C]/4 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <KayaMark size={52} pulse className="mx-auto mb-6 kaya-ring" />
          <p className="kaya-label mb-4">Plans & Pricing</p>
          <h1 className="font-display text-5xl text-[#F8F8F8] mb-4">
            Invest in your longevity.
          </h1>
          <p className="text-[#F8F8F8]/40 font-body text-lg max-w-xl mx-auto leading-relaxed">
            One missed season costs more than a year of Kaya. Choose the plan that fits your ambition.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col transition-all ${
                plan.highlight
                  ? "bg-[#141414] border-2 border-[#B8960C]/60 shadow-lg shadow-[#B8960C]/10"
                  : "bg-[#141414] border border-[#2A2A2A] hover:border-[#B8960C]/20"
              }`}>

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-xs font-body font-bold px-3 py-1 rounded-full ${plan.highlight ? "bg-[#B8960C] text-[#080808]" : "bg-[#2A2A2A] text-[#F8F8F8]/60"}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? "bg-[#B8960C]/20 border border-[#B8960C]/30" : "bg-[#2A2A2A] border border-[#2A2A2A]"}`}>
                  <plan.icon className={`w-5 h-5 ${plan.highlight ? "text-[#B8960C]" : "text-[#F8F8F8]/40"}`} />
                </div>
                <h2 className="font-display text-2xl text-[#F8F8F8] mb-1">{plan.name}</h2>
                <p className="text-[#F8F8F8]/40 text-sm font-body mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-4xl font-bold ${plan.highlight ? "text-[#B8960C]" : "text-[#F8F8F8]"}`}>{plan.price}</span>
                  <span className="text-[#F8F8F8]/30 text-sm font-body">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? "bg-[#B8960C]/20" : "bg-[#2A2A2A]"}`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlight ? "text-[#B8960C]" : "text-[#F8F8F8]/40"}`} />
                    </div>
                    <span className="text-sm font-body text-[#F8F8F8]/70">{f}</span>
                  </div>
                ))}
                {plan.excluded.map(f => (
                  <div key={f} className="flex items-start gap-3 opacity-30">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#2A2A2A]">
                      <span className="text-[#F8F8F8]/40 text-xs">×</span>
                    </div>
                    <span className="text-sm font-body text-[#F8F8F8]/40 line-through">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={() => handleSubscribe(plan.priceId, plan.id)}
                disabled={loadingPlan === plan.id || currentPlan === plan.id}
                className={`w-full h-12 rounded-xl font-semibold ${
                  currentPlan === plan.id
                    ? "bg-[#2A2A2A] text-[#F8F8F8]/30 cursor-default"
                    : plan.highlight
                    ? "bg-[#B8960C] text-[#080808] hover:bg-[#D4AA10]"
                    : "border border-[#2A2A2A] bg-transparent text-[#F8F8F8]/60 hover:border-[#B8960C]/30 hover:text-[#F8F8F8]"
                }`}>
                {loadingPlan === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentPlan === plan.id ? (
                  "Current Plan"
                ) : (
                  <>{plan.cta} <ChevronRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center space-y-2">
          <p className="text-[#F8F8F8]/30 text-sm font-body">All plans include a 7-day free trial. Cancel anytime.</p>
          <p className="text-[#F8F8F8]/20 text-xs font-body">Payments processed securely by Stripe.</p>
        </div>
      </div>
    </div>
  );
}
