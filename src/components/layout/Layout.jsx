import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/api/supabaseClient";
import { useSubscription } from "@/hooks/useSubscription";
import { createPageUrl } from "@/utils";
import { AyuMark as KayaMark, KayaWordmark } from "@/components/ui/AyuLogo";
import {
  LayoutDashboard, Dumbbell, BookOpen, User, LogOut,
  Trophy, Apple, MessageCircle, Crown, FlaskConical, ChevronRight
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0E0E0E] border-r border-[#2A2A2A]/50 min-h-screen fixed left-0 top-0 z-20">
        <div className="px-5 py-6 border-b border-[#2A2A2A]/50">
          <Link to="/Dashboard"><KayaWordmark /></Link>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={createPageUrl(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                  isActive
                    ? "bg-[#B8960C]/10 text-[#B8960C] border-l-2 border-[#B8960C] pl-[10px]"
                    : "text-[#F8F8F8]/50 hover:text-[#F8F8F8] hover:bg-[#2A2A2A]/30"
                }`}>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#B8960C]" : ""}`} />
                <span className="font-body">{item.name}</span>
                {item.premium && !isPremium && !isCoach && (
                  <span className="ml-auto text-[9px] font-bold text-[#B8960C] bg-[#B8960C]/10 px-1.5 py-0.5 rounded-full border border-[#B8960C]/20">PRO</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-[#2A2A2A]/50 space-y-1">
          {!isPremium && (
            <Link to="/Pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#B8960C] bg-[#B8960C]/5 border border-[#B8960C]/20 hover:bg-[#B8960C]/10 transition-all">
              <Crown className="w-4 h-4" /><span className="font-body">Upgrade to Pro</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto" />
            </Link>
          )}
          <Link to="/Profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${currentPath === "Profile" ? "text-[#B8960C] bg-[#B8960C]/10" : "text-[#F8F8F8]/50 hover:text-[#F8F8F8] hover:bg-[#2A2A2A]/30"}`}>
            <User className="w-4 h-4" /><span className="font-body truncate">{user?.full_name || user?.email?.split("@")[0] || "Profile"}</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F8F8F8]/30 hover:text-red-400 hover:bg-red-900/10 transition-all">
            <LogOut className="w-4 h-4" /><span className="font-body">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0 min-h-screen">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0E0E0E] border-t border-[#2A2A2A]/50 flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.slice(0, 5).map(item => {
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={createPageUrl(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-[#B8960C]" : "text-[#F8F8F8]/30 hover:text-[#F8F8F8]/60"}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-body font-medium">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
