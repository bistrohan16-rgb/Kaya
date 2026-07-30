import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/api/supabaseClient";
import { useSubscription } from "@/hooks/useSubscription";
import { createPageUrl } from "@/utils";
import { AyuMark as KayaMark, KayaWordmark } from "@/components/ui/AyuLogo";
import {
  LayoutDashboard, Dumbbell, BookOpen, User, LogOut,
  Trophy, Apple, MessageCircle, Crown, FlaskConical, ChevronRight
} from "lucide-react";

const ATHLETE_NAV = [
  { name: "Dashboard", icon: LayoutDashboard, path: "Dashboard" },
  { name: "Routines", icon: BookOpen, path: "Routines" },
  { name: "Exercises", icon: Dumbbell, path: "Exercises" },
  { name: "Sport Plans", icon: Trophy, path: "SportPlans" },
  { name: "Testing", icon: FlaskConical, path: "Testing" },
  { name: "AI Coach", icon: MessageCircle, path: "AICoach", premium: true },
  { name: "Diet Plan", icon: Apple, path: "DietPlan", premium: true },
];

const COACH_NAV = [
  { name: "Command Centre", icon: LayoutDashboard, path: "Dashboard" },
  { name: "My Athletes", icon: Crown, path: "CoachDashboard" },
  { name: "Routines", icon: BookOpen, path: "Routines" },
  { name: "Exercises", icon: Dumbbell, path: "Exercises" },
  { name: "Testing", icon: FlaskConical, path: "Testing" },
  { name: "AI Coach", icon: MessageCircle, path: "AICoach" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isPremium, isCoach } = useSubscription();
  const navItems = isCoach ? COACH_NAV : ATHLETE_NAV;
  const currentPath = location.pathname.slice(1);
  const handleLogout = async () => { try { await auth.logout(); } catch (_) {} navigate("/"); };

  return (
    <div className="flex min-h-screen bg-[#080808]">

      {/* Desktop sidebar — smooth, minimal, no boxes */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen fixed left-0 top-0 z-20"
        style={{ background: "linear-gradient(180deg, #0E0E0E 0%, #080808 100%)", borderRight: "1px solid rgba(255,255,255,0.04)" }}>

        {/* Logo */}
        <div className="px-6 py-7">
          <Link to="/Dashboard">
            <KayaWordmark />
          </Link>
        </div>

        {/* Nav items — no background boxes, just clean text with gold indicator */}
        <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            const isPro = item.premium && !isPremium && !isCoach;
            return (
              <Link key={item.path} to={createPageUrl(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative ${
                  isActive
                    ? "text-[#B8960C]"
                    : isPro
                    ? "text-[#F8F8F8]/25 hover:text-[#F8F8F8]/40"
                    : "text-[#F8F8F8]/40 hover:text-[#F8F8F8]/80"
                }`}>
                {/* Active indicator — thin gold left bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#B8960C] rounded-full" />
                )}
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-[#B8960C]" : isPro ? "text-[#F8F8F8]/20" : "text-[#F8F8F8]/30 group-hover:text-[#F8F8F8]/60"
                }`} />
                <span className="font-body font-medium">{item.name}</span>
                {isPro && (
                  <span className="ml-auto text-[8px] font-bold text-[#B8960C]/60 tracking-widest">PRO</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section — no box, just clean links */}
        <div className="px-4 pb-6 pt-4 space-y-0.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>

          {!isPremium && !isCoach && (
            <Link to="/Pricing"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#B8960C]/70 hover:text-[#B8960C] transition-all group mb-2">
              <Crown className="w-4 h-4 group-hover:text-[#B8960C]" />
              <span className="font-body font-medium">Upgrade to Pro</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            </Link>
          )}

          <Link to="/Profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              currentPath === "Profile" ? "text-[#B8960C]" : "text-[#F8F8F8]/30 hover:text-[#F8F8F8]/60"
            }`}>
            <User className="w-4 h-4" />
            <span className="font-body truncate">{user?.full_name || user?.email?.split("@")[0] || "Profile"}</span>
          </Link>

          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F8F8F8]/20 hover:text-[#F8F8F8]/40 transition-all">
            <LogOut className="w-4 h-4" />
            <span className="font-body">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">{children}</main>

      {/* Mobile bottom nav — with labels */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 safe-area-pb"
        style={{ background: "#0E0E0E", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map(item => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={createPageUrl(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? "text-[#B8960C]" : "text-[#F8F8F8]/25 hover:text-[#F8F8F8]/50"
                }`}>
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-body font-medium tracking-wide">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
