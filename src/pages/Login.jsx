import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const redirect = params.get("redirect") || "/Dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await auth.login(email, password);
      } else {
        await auth.signUp(email, password, fullName);
      }
      navigate(redirect);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#B8960C]/3 rounded-full blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-10">
          <KayaMark size={56} pulse className="mb-5" />
          <h1 className="font-display text-3xl text-[#F8F8F8]">
            {mode === "login" ? "Welcome back." : "Join Kaya."}
          </h1>
          <p className="text-[#F8F8F8]/40 text-sm mt-2 font-body">
            {mode === "login" ? "Sign in to your programme." : "Begin your protection."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Your name" required className="h-12" />
            </div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="athlete@email.com" required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                className="h-12 pr-10" />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F8F8F8]/30 hover:text-[#F8F8F8]/60">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm font-body">{error}</p>
            </div>
          )}
          <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10] font-semibold">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => { setMode(m => m === "login" ? "signup" : "login"); setError(""); }}
            className="text-[#F8F8F8]/40 text-sm font-body hover:text-[#B8960C] transition-colors">
            {mode === "login" ? "No account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8">
          <Link to="/" className="flex justify-center">
            <span className="text-[#F8F8F8]/20 text-xs font-body hover:text-[#F8F8F8]/40 transition-colors">← Back to Kaya</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
