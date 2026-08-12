import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { queryClientInstance } from "@/lib/query-client";
import NavigationTracker from "@/lib/NavigationTracker";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import SplashScreen from "@/components/ui/SplashScreen";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CoachDashboard from "@/pages/CoachDashboard";
import CoachLanding from "@/pages/CoachLanding";
import CoachOnboarding from "@/pages/CoachOnboarding";
import AICoach from "@/pages/AICoach";
import DietPlan from "@/pages/DietPlan";
import Exercises from "@/pages/Exercises";
import Profile from "@/pages/Profile";
import Routines from "@/pages/Routines";
import SportPlans from "@/pages/SportPlans";
import Testing from "@/pages/Testing";
import Pricing from "@/pages/Pricing";

function ProtectedRoute({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();
  if (isLoadingAuth) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <KayaMark size={48} pulse />
    </div>
  );
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/coaches" element={<CoachLanding />} />
      <Route path="/Pricing" element={<Pricing />} />
      <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/CoachDashboard" element={<ProtectedRoute><CoachDashboard /></ProtectedRoute>} />
      <Route path="/CoachOnboarding" element={<ProtectedRoute><CoachOnboarding /></ProtectedRoute>} />
      <Route path="/AICoach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
      <Route path="/DietPlan" element={<ProtectedRoute><DietPlan /></ProtectedRoute>} />
      <Route path="/Exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
      <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/Routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
      <Route path="/SportPlans" element={<ProtectedRoute><SportPlans /></ProtectedRoute>} />
      <Route path="/Testing" element={<ProtectedRoute><Testing /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("kaya_splash_seen");
    if (seen) { setShowSplash(false); setSplashDone(true); }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("kaya_splash_seen", "1");
    setSplashDone(true);
    setTimeout(() => setShowSplash(false), 600);
  };

  return (
    <QueryClientProvider client={queryClientInstance}>
      <ThemeProvider>
        <AuthProvider>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <div className={`transition-opacity duration-500 ${splashDone ? "opacity-100" : "opacity-0"}`}>
            <Router>
              <NavigationTracker />
              <AppRoutes />
              <Toaster />
            </Router>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
