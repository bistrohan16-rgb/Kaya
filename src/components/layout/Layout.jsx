import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/api/supabaseClient";
import { useSubscription } from "@/hooks/useSubscription";
import { createPageUrl } from "@/utils";
import { KayaWordmark, AyuMark as KayaMark } from "@/components/ui/AyuLogo";
import { useTheme } from "@/lib/ThemeContext";
import {
  LayoutDashboard, Dumbbell, BookOpen, LogOut,
  Trophy, Apple, MessageCircle, Crown, FlaskConical,
  ChevronDown, Settings, Sun, Moon, Users, BarChart3, ClipboardList
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ATHLETE_NAV = [
  { name: "Dashboard", icon: LayoutDashboard, path: "Dashboard" },
  { name: "Routines", icon: BookOpen, path: "Routines" },
  { name: "Exercises", icon: Dumbbell, path: "Exercises" },
  { name: "Plans", icon: Trophy, path: "SportPlans" },
  { name: "Testing", icon: FlaskConical, path: "Testing" },
  { name: "Coach", icon: MessageCircle, path: "AICoach", premium: true },
  { name: "Diet", icon: Apple, path: "DietPlan", premium: true },
];

const COACH_NAV = [
  { name: "Overview", icon: LayoutDashboard, path: "Dashboard" },
  { name: "Athletes", icon: Users, path: "CoachDashboard" },
  { name: "Routines", icon: ClipboardList, path: "Routines" },
  { name: "Testing", icon: BarChart3, path: "Testing" },
  { name: "AI Coach", icon: MessageCircle, path: "AICoach" },
];

function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
        style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-35)" }}>
        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>
      {/* Profile */}
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all"
        style={{ background: open ? "var(--card)" : "transparent" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(27,122,74,0.15)", border: "1px solid rgba(27,122,74,0.3)" }}>
          <span className="text-[#1B7A4A] text-xs font-mono font-bold">
            {(user?.full_name || user?.email || "U")[0].toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-body hidden md:block max-w-[80px] truncate" style={{ color: "var(--text-60)" }}>
          {user?.full_name || user?.email?.split("@")[0] || "Profile"}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform`} style={{ color: "var(--text-20)" }} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
          <Link to="/Profile" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-body transition-all hover:bg-[rgba(27,122,74,0.08)]"
            style={{ color: "var(--text-60)" }}>
            <Settings className="w-4 h-4" /> Profile Settings
          </Link>
          <Link to="/Pricing" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-body transition-all hover:bg-[rgba(27,122,74,0.08)]"
            style={{ color: "#1B7A4A" }}>
            <Crown className="w-4 h-4" /> Upgrade to Pro
          </Link>
          <div style={{ height: 1, background: "var(--border)" }} />
          <button onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body transition-all hover:bg-red-500/10"
            style={{ color: "var(--text-35)" }}>
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isPremium, isCoach, isAdmin } = useSubscription();
  const navItems = isCoach ? COACH_NAV : ATHLETE_NAV;
  const currentPath = location.pathname.slice(1);
  const handleLogout = async () => { try { await auth.logout(); } catch (_) {} navigate("/"); };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 h-14"
        style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)"
        }}>
        <div className="flex items-center gap-3">
          <Link to="/Dashboard"><KayaWordmark /></Link>
          {isAdmin ? (
            <span className="text-[10px] font-body font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: "rgba(27,122,74,0.2)", color: "#1B7A4A", border: "1px solid rgba(27,122,74,0.4)" }}>
              Admin
            </span>
          ) : isCoach ? (
            <span className="text-[10px] font-body font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: "rgba(27,122,74,0.15)", color: "#1B7A4A", border: "1px solid rgba(27,122,74,0.25)" }}>
              Coach
            </span>
          ) : null}
        </div>
        <ProfileMenu user={user} onLogout={handleLogout} />
      </header>

      {/* Main content */}
      <main className="flex-1 pt-14 pb-24">{children}</main>

      {/* Command Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
        <nav className="flex items-center justify-around px-4 py-3 rounded-2xl"
          style={{
            background: isCoach ? "var(--surface)" : "var(--surface)",
            border: isCoach ? "1px solid rgba(27,122,74,0.3)" : "1px solid var(--border)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(27,122,74,0.05)"
          }}>
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            const isPro = item.premium && !isPremium && !isCoach;
            return (
              <Link key={item.path} to={createPageUrl(item.path)}
                className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all relative"
                style={{ color: isActive ? "#1B7A4A" : isPro ? "var(--text-20)" : "var(--text-35)" }}>
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "#1B7A4A" }} />
                )}
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-body font-medium tracking-wide whitespace-nowrap">{item.name}</span>
                {isPro && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ background: "#1B7A4A" }}>
                    <span className="text-white text-[6px] font-bold">P</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
