import { useState, useEffect, useRef } from "react";
import { entities, ai, auth } from "@/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Trash2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useSubscription } from "@/hooks/useSubscription";
import { createPageUrl } from "@/utils";

const SUGGESTED_QUESTIONS = [
  "How can I prevent knee injuries?",
  "What should I eat before a game?",
  "How do I recover faster after training?",
  "What exercises help with lower back pain?",
  "How much protein do I need daily?",
  "What's the best warm-up routine?",
];

export default function AICoach() {
  const { isPremium, isLoading: subLoading } = useSubscription();
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I'm your **AI Sports Coach**. I can help you with injury prevention, recovery, nutrition, training tips, and more. What would you like to know?" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const { data: profile } = useQuery({
    queryKey: ["athleteProfile"],
    queryFn: async () => { const profiles = await entities.AthleteProfile.list(); return profiles[0] || null; }
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const buildSystemContext = () => {
    if (!profile) return "";
    return `The athlete's profile: sport = ${profile.sport}, age = ${profile.age}, experience = ${profile.experience_level}, weight = ${profile.weight_kg || "unknown"}kg, height = ${profile.height_cm || "unknown"}cm, training days per week = ${profile.training_days_per_week || "unknown"}, current concerns = ${profile.current_concerns?.join(", ") || "none"}, goals = ${profile.goals?.join(", ") || "none"}.`;
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    const profileContext = buildSystemContext();
    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
    const systemPrompt = `You are AthleteRx AI Coach — an expert sports medicine and performance assistant. You give practical, evidence-based advice on injury prevention, rehabilitation, nutrition, recovery, and athletic performance. Use markdown formatting to make responses clear and actionable.${profileContext ? `\n\nAthlete context: ${profileContext}` : ""}`;
    const response = await ai.invoke({ messages: [{ role: "user", content: systemPrompt + "\n\n" + newMessages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n") }] });
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const clearChat = () => setMessages([{ role: "assistant", content: "Hi! I'm your **AI Sports Coach**. How can I help?" }]);

  if (!subLoading && !isPremium) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mb-5"><Lock className="w-9 h-9 text-amber-600" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium Feature</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-6">AI Coach is available on Premium and Coach plans.</p>
        <Link to={createPageUrl("Pricing")}><Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-8"><Sparkles className="w-4 h-4 mr-2" />View Plans & Upgrade</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5 text-emerald-600" /></div>
          <div><h1 className="font-bold text-slate-900 text-base">AI Coach</h1><p className="text-xs text-emerald-600 font-medium">Online · Ready to help</p></div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} className="text-slate-400 hover:text-slate-600 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-4 h-4 text-emerald-600" /></div>}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-slate-800 text-white rounded-tr-sm" : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm"}`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    components={{ p: ({ children }) => <p className="my-1">{children}</p>, ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>, li: ({ children }) => <li className="my-0.5">{children}</li>, strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong> }}>
                    {msg.content}
                  </ReactMarkdown>
                ) : msg.content}
              </div>
              {msg.role === "user" && <div className="w-8 h-8 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-4 h-4 text-slate-600" /></div>}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-emerald-600" /></div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
              </div>
            </div>
          </motion.div>
        )}
        {messages.length === 1 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
            <p className="text-xs text-slate-400 font-medium mb-3 text-center">Suggested questions</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all">{q}</button>
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="bg-white border-t border-slate-100 px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <textarea ref={null} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Ask about injuries, nutrition, recovery..." rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 min-h-[42px] max-h-32"
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px"; }} />
          <Button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-[42px] w-[42px] p-0 flex-shrink-0"><Send className="w-4 h-4" /></Button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">⚕️ AthleteRx is a fitness companion, not a medical product. AI Coach is not a replacement for physiotherapy or medical advice. Always consult a qualified healthcare professional for injuries or health concerns.</p>
      </div>
    </div>
  );
}
