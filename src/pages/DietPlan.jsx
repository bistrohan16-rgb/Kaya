import { useState } from "react";
import { entities, ai } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, RefreshCw, Apple, Flame, Droplets, Beef, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { createPageUrl } from "@/utils";

const GOAL_OPTIONS = ["Build muscle", "Lose weight", "Improve endurance", "Recover faster", "Increase energy", "Stay lean", "Improve focus"];

export default function DietPlan() {
  const { isPremium } = useSubscription();
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["athleteProfile"],
    queryFn: async () => { const profiles = await entities.AthleteProfile.list(); return profiles[0] || null; }
  });

  const generatePlan = async (goal) => {
    if (!profile) return;
    setIsGenerating(true);
    const activeGoal = goal || selectedGoal || (profile.goals?.[0] ?? "general performance");
    const result = await ai.invoke({
      prompt: `Create a personalized daily meal plan for an athlete:
- Sport: ${profile.sport}, Age: ${profile.age}, Experience: ${profile.experience_level}
- Weight: ${profile.weight_kg ? profile.weight_kg + "kg" : "unknown"}, Height: ${profile.height_cm ? profile.height_cm + "cm" : "unknown"}
- Training days/week: ${profile.training_days_per_week || 4}, Primary goal: ${activeGoal}
Generate 5 meals (breakfast, morning snack, lunch, afternoon snack, dinner) with name, description, key ingredients, macros, and a performance tip. Include daily totals and 3 sport-specific nutrition tips.`,
      response_json_schema: {
        type: "object",
        properties: {
          plan_title: { type: "string" }, daily_goal_summary: { type: "string" },
          total_calories: { type: "number" }, total_protein: { type: "number" }, total_carbs: { type: "number" }, total_fat: { type: "number" }, hydration_ml: { type: "number" },
          meals: { type: "array", items: { type: "object", properties: { meal_name: { type: "string" }, time_suggestion: { type: "string" }, dish_name: { type: "string" }, description: { type: "string" }, key_ingredients: { type: "array", items: { type: "string" } }, calories: { type: "number" }, protein_g: { type: "number" }, carbs_g: { type: "number" }, fat_g: { type: "number" }, performance_tip: { type: "string" } } } },
          sport_nutrition_tips: { type: "array", items: { type: "string" } }
        }
      }
    });
    setPlan({ ...result, goal: activeGoal });
    setIsGenerating(false);
  };

  const mealColors = ["from-amber-50 to-orange-50 border-amber-200", "from-emerald-50 to-teal-50 border-emerald-200", "from-blue-50 to-sky-50 border-blue-200", "from-purple-50 to-violet-50 border-purple-200", "from-rose-50 to-pink-50 border-rose-200"];

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mb-5"><Lock className="w-9 h-9 text-amber-600" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium Feature</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-6">The personalized Diet Plan generator is available on Premium and Coach plans.</p>
        <Link to={createPageUrl("Pricing")}><Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-8"><Sparkles className="w-4 h-4 mr-2" />View Plans & Upgrade</Button></Link>
      </div>
    );
  }

  if (!profile) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><div className="text-center"><Apple className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500">Complete your athlete profile first.</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div><h1 className="text-xl md:text-2xl font-bold text-slate-900">Diet Plan</h1><p className="text-slate-500 text-xs md:text-sm mt-0.5 capitalize">{profile.sport} • {profile.age} yrs • {profile.experience_level}</p></div>
            {plan && <Button onClick={() => generatePlan()} variant="outline" size="sm" disabled={isGenerating} className="rounded-xl"><RefreshCw className="w-4 h-4 mr-2" />Regenerate</Button>}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!plan && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Apple className="w-5 h-5 text-emerald-600" /></div>
              <div><h2 className="font-bold text-slate-900">Personalised Nutrition Plan</h2><p className="text-sm text-slate-500">AI-powered for your sport & body</p></div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Select your primary nutrition goal:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {GOAL_OPTIONS.map(goal => (
                <button key={goal} onClick={() => setSelectedGoal(goal)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedGoal === goal ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300"}`}>
                  {goal}
                </button>
              ))}
            </div>
            <Button onClick={() => generatePlan(selectedGoal)} className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl py-5 text-base"><Sparkles className="w-5 h-5 mr-2" />Generate My Diet Plan</Button>
          </motion.div>
        )}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6"><Sparkles className="w-8 h-8 text-emerald-600" /></motion.div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Building Your Plan</h2>
            <p className="text-slate-500 text-center max-w-sm text-sm">Creating a personalised meal plan...</p>
          </div>
        )}
        <AnimatePresence>
          {plan && !isGenerating && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 text-white">
                <Badge className="bg-white/20 text-white border-0 mb-3">{plan.goal}</Badge>
                <h2 className="text-xl font-bold mb-1">{plan.plan_title}</h2>
                <p className="text-emerald-100 text-sm">{plan.daily_goal_summary}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{ icon: Flame, label: "Calories", value: plan.total_calories, unit: "kcal", color: "orange" }, { icon: Beef, label: "Protein", value: plan.total_protein, unit: "g", color: "red" }, { icon: Apple, label: "Carbs", value: plan.total_carbs, unit: "g", color: "amber" }, { icon: Droplets, label: "Water", value: Math.round(plan.hydration_ml / 1000 * 10) / 10, unit: "L", color: "blue" }].map(m => (
                  <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-xl bg-${m.color}-50 text-${m.color}-600 flex items-center justify-center mb-2`}><m.icon className="w-5 h-5" /></div>
                    <p className="text-xl font-bold text-slate-900">{m.value}</p>
                    <p className="text-xs text-slate-500">{m.unit}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Daily Meals</h3>
                {plan.meals?.map((meal, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`bg-gradient-to-r ${mealColors[i % mealColors.length]} border rounded-2xl p-5`}>
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{meal.meal_name}</span><h4 className="font-bold text-slate-900">{meal.dish_name}</h4><p className="text-xs text-slate-500">{meal.time_suggestion}</p></div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-white/70 rounded-lg px-2 py-1 font-medium">{meal.calories} kcal</span>
                        <span className="text-xs bg-white/70 rounded-lg px-2 py-1 font-medium">{meal.protein_g}g protein</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{meal.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">{meal.key_ingredients?.map(ing => <span key={ing} className="text-xs bg-white/60 rounded-lg px-2 py-0.5 text-slate-700">{ing}</span>)}</div>
                    {meal.performance_tip && <div className="bg-white/50 rounded-xl p-3 flex gap-2"><Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-slate-700">{meal.performance_tip}</p></div>}
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => { setPlan(null); setSelectedGoal(""); }} variant="outline" className="w-full rounded-xl">Change Goal & Regenerate</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
