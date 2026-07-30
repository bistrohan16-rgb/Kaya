import { Link } from "react-router-dom";
import { Lock, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
export default function PremiumGate({ feature = "This feature", requiredPlan = "premium", children, isUnlocked }) {
  if (isUnlocked) return <>{children}</>;
  const isCoachFeature = requiredPlan === "coach";
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="pointer-events-none select-none opacity-30 blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isCoachFeature ? "bg-violet-100" : "bg-amber-100"}`}>
          {isCoachFeature ? <Star className="w-7 h-7 text-violet-600" /> : <Lock className="w-7 h-7 text-amber-600" />}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{isCoachFeature ? "Coach Plan Required" : "Premium Feature"}</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-xs">{feature} is available on the {isCoachFeature ? "Coach" : "Premium"} plan. Upgrade to unlock it.</p>
        <Link to={createPageUrl("Pricing")}>
          <Button className={`rounded-xl px-6 ${isCoachFeature ? "bg-violet-600 hover:bg-violet-700" : "bg-amber-500 hover:bg-amber-600"} text-white`}><Sparkles className="w-4 h-4 mr-2" />View Plans</Button>
        </Link>
      </div>
    </div>
  );
}
