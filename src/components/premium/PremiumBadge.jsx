import { Sparkles, Star } from "lucide-react";
export default function PremiumBadge({ plan = "premium", className = "" }) {
  if (plan === "coach") return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 ${className}`}><Star className="w-2.5 h-2.5" /> COACH</span>;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 ${className}`}><Sparkles className="w-2.5 h-2.5" /> PRO</span>;
}
