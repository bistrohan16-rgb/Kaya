import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SkipForward, SkipBack, Check, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";

const PAIN_LEVELS = [
  { value: 0, label: "None", color: "border-[#1E5C3A] bg-[#1E5C3A]/20 text-emerald-400" },
  { value: 1, label: "Very Mild", color: "border-[#1B7A4A]/30 bg-[#1B7A4A]/5 text-[#1B7A4A]" },
  { value: 2, label: "Mild", color: "border-[#1B7A4A]/50 bg-[#1B7A4A]/10 text-[#1B7A4A]" },
  { value: 3, label: "Moderate", color: "border-[#C44A1A]/50 bg-[#C44A1A]/10 text-[#C44A1A]" },
  { value: 4, label: "Significant", color: "border-red-700/50 bg-red-900/20 text-red-400" },
  { value: 5, label: "Severe", color: "border-red-600 bg-red-900/30 text-red-300" },
];

const FEELINGS = [
  { value: "great", label: "Great" },
  { value: "good", label: "Good" },
  { value: "okay", label: "Okay" },
  { value: "tired", label: "Tired" },
  { value: "painful", label: "Painful" },
];

// Extract duration from description text as fallback
// e.g. "45 seconds each" -> 45, "30 seconds" -> 30
function extractDurationFromDescription(desc) {
  if (!desc) return null;
  const match = desc.match(/(\d+)\s*seconds?/i);
  return match ? parseInt(match[1]) : null;
}

export default function WorkoutPlayer({ routine, exercises, onComplete, onClose }) {
  const [phase, setPhase] = useState("exercise");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [restTime, setRestTime] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState(null);
  const [painLevel, setPainLevel] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [overallFeeling, setOverallFeeling] = useState("good");

  const mainTimerRef = useRef(null);
  const exerciseTimerRef = useRef(null);
  const restTimerRef = useRef(null);

  const currentExercise = exercises[currentIdx];
  const isLastExercise = currentIdx === exercises.length - 1;
  const progress = (currentIdx / exercises.length) * 100;
  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    mainTimerRef.current = setInterval(() => { if (!isPaused) setElapsed(p => p + 1); }, 1000);
    return () => clearInterval(mainTimerRef.current);
  }, [isPaused]);

  useEffect(() => {
    if (phase !== "exercise") return;
    clearInterval(exerciseTimerRef.current);
    const dur = currentExercise?.duration_seconds || extractDurationFromDescription(currentExercise?.description);
    if (dur) {
      setExerciseTimer(dur);
      exerciseTimerRef.current = setInterval(() => {
        if (!isPaused) setExerciseTimer(p => {
          if (p <= 1) { clearInterval(exerciseTimerRef.current); return 0; }
          return p - 1;
        });
      }, 1000);
    } else { setExerciseTimer(null); }
    return () => clearInterval(exerciseTimerRef.current);
  }, [currentIdx, phase, isPaused]);

  useEffect(() => {
    if (phase !== "rest") return;
    clearInterval(restTimerRef.current);
    setRestTime(30);
    let t = 30;
    restTimerRef.current = setInterval(() => {
      t -= 1; setRestTime(t);
      if (t <= 0) { clearInterval(restTimerRef.current); advanceToNext(); }
    }, 1000);
    return () => clearInterval(restTimerRef.current);
  }, [phase]);

  const advanceToNext = () => {
    if (isLastExercise) setPhase("summary");
    else { setCurrentIdx(p => p + 1); setPhase("exercise"); setPainLevel(0); }
  };

  const handleDoneExercise = () => {
    setExerciseLogs(p => [...p, { exercise_id: currentExercise.id, exercise_name: currentExercise.name, pain_level: painLevel }]);
    setPhase("pain_check");
  };

  const handlePainConfirmed = () => { if (isLastExercise) setPhase("summary"); else setPhase("rest"); };

  const handleComplete = () => {
    clearInterval(mainTimerRef.current);
    onComplete({
      routine_id: routine.id, routine_name: routine.name,
      exercises_completed: exerciseLogs.length,
      duration_minutes: Math.max(1, Math.round(elapsed / 60)),
      completed_at: new Date().toISOString(),
      overall_feeling: overallFeeling, exercises_log: exerciseLogs,
    });
  };

  // Timer ring — use duration_seconds or extract from description
  const extractedDuration = currentExercise ? extractDurationFromDescription(currentExercise.description) : null;
  const effectiveDuration = currentExercise?.duration_seconds || extractedDuration;
  const RING_R = 80;
  const RING_CIRC = 2 * Math.PI * RING_R;
  const timerMax = effectiveDuration || 1;
  const timerVal = exerciseTimer != null ? exerciseTimer : timerMax;
  const timerOffset = RING_CIRC - (timerVal / timerMax) * RING_CIRC;

  // Rest ring
  const REST_R = 84;
  const REST_CIRC = 2 * Math.PI * REST_R;
  const restOffset = REST_CIRC - (restTime / 30) * REST_CIRC;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[var(--bg)] z-50 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-[var(--border)]/50">
        <div>
          <h2 className="font-display text-lg text-[var(--text)]">{routine.name}</h2>
          <p className="text-[#1B7A4A] text-xs font-body tracking-widest uppercase mt-0.5">
            {phase === "rest" ? "Rest" : phase === "summary" ? "Complete" : phase === "pain_check" ? "Pain Check" : `${currentIdx + 1} of ${exercises.length}`}
          </p>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)]/40 hover:text-[var(--text)] hover:border-[#1B7A4A]/30 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-[var(--border)] flex-shrink-0">
        <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#1B7A4A] transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* EXERCISE */}
          {phase === "exercise" && currentExercise && (
            <motion.div key={`ex-${currentIdx}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center px-5 pt-8 pb-6 max-w-lg mx-auto w-full">

              {/* Exercise name */}
              <h3 className="font-display text-3xl text-[var(--text)] text-center mb-1">
                {currentExercise.name}
              </h3>
              {currentExercise.target_areas?.length > 0 && (
                <p className="text-[#1B7A4A] text-xs font-body tracking-widest uppercase mb-8 text-center">
                  {currentExercise.target_areas.join(" · ")}
                </p>
              )}

              {/* CENTRAL TIMER RING — timed exercises */}
              {(currentExercise.duration_seconds || extractDurationFromDescription(currentExercise.description)) ? (
                <div className="relative flex items-center justify-center mb-8">
                  <svg width="196" height="196" className="transform -rotate-90">
                    <circle cx="98" cy="98" r={RING_R} stroke="var(--border)" strokeWidth="8" fill="none" />
                    <motion.circle cx="98" cy="98" r={RING_R}
                      stroke="#1B7A4A" strokeWidth="8" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRC}
                      animate={{ strokeDashoffset: timerOffset }}
                      transition={{ duration: 0.9, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-6xl font-bold text-[#1B7A4A] leading-none">
                      {timerVal}
                    </span>
                    <span className="text-[var(--text)]/30 text-sm font-body mt-2">seconds</span>
                  </div>
                </div>
              ) : (
                /* REP-BASED — show reps/sets + a manual stopwatch */
                <div className="flex flex-col items-center mb-8 w-full">
                  {/* Reps and sets prominently displayed */}
                  <div className="flex gap-5 justify-center mb-6">
                    {currentExercise.sets && (
                      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-8 py-5 text-center min-w-[100px]">
                        <p className="font-mono text-5xl text-[var(--text)] leading-none">{currentExercise.sets}</p>
                        <p className="text-[var(--text)]/30 text-sm font-body mt-2">sets</p>
                      </div>
                    )}
                    {currentExercise.reps && (
                      <div className="bg-[var(--card)] border border-[#1B7A4A]/30 rounded-2xl px-8 py-5 text-center min-w-[100px]">
                        <p className="font-mono text-5xl text-[#1B7A4A] leading-none">{currentExercise.reps}</p>
                        <p className="text-[var(--text)]/30 text-sm font-body mt-2">reps</p>
                      </div>
                    )}
                    {!currentExercise.sets && !currentExercise.reps && (
                      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-8 py-5 text-center">
                        <p className="font-mono text-3xl text-[#1B7A4A] leading-none">Go</p>
                        <p className="text-[var(--text)]/30 text-sm font-body mt-2">at your pace</p>
                      </div>
                    )}
                  </div>
                  {/* Elapsed stopwatch so user has something to watch */}
                  <div className="flex items-center gap-2 text-[var(--text)]/20">
                    <span className="font-mono text-2xl">{formatTime(elapsed)}</span>
                    <span className="text-xs font-body">elapsed</span>
                  </div>
                </div>
              )}

              {/* HOW TO PERFORM — always visible, not collapsible */}
              {currentExercise.description && (
                <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 mb-8">
                  <p className="text-[#1B7A4A] text-xs font-body font-semibold tracking-widest uppercase mb-3">
                    How to perform
                  </p>
                  <p className="text-[var(--text)]/70 text-sm font-body leading-relaxed">
                    {currentExercise.description}
                  </p>
                </div>
              )}

              {/* Done button */}
              <Button onClick={handleDoneExercise}
                className="w-full h-14 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold text-base rounded-2xl">
                Done — Next Exercise
              </Button>

              <p className="text-[var(--text)]/15 text-[10px] font-body text-center mt-4">
                Kaya is a fitness companion, not a medical product. Stop immediately if you experience sharp pain.
              </p>
            </motion.div>
          )}

          {/* PAIN CHECK */}
          {phase === "pain_check" && (
            <motion.div key="pain"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center px-5 py-10 max-w-sm mx-auto w-full">
              <div className="flex justify-center mb-5">
                <KayaMark size={48} />
              </div>
              <h3 className="font-display text-2xl text-[var(--text)] text-center mb-1">How did that feel?</h3>
              <p className="text-[var(--text)]/40 text-sm font-body text-center mb-8">
                Rate any pain during <span className="text-[var(--text)]/70">{currentExercise?.name}</span>
              </p>
              <div className="grid grid-cols-3 gap-2 w-full mb-6">
                {PAIN_LEVELS.map(p => (
                  <button key={p.value} onClick={() => setPainLevel(p.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${painLevel === p.value ? p.color : "border-[var(--border)] bg-[var(--card)] text-[var(--text)]/30"}`}>
                    <p className="text-2xl font-mono font-bold">{p.value}</p>
                    <p className="text-[10px] font-body mt-0.5">{p.label}</p>
                  </button>
                ))}
              </div>
              {painLevel >= 4 && (
                <div className="bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3 mb-4 w-full">
                  <p className="text-red-400 text-sm font-body text-center">
                    High pain detected. Consider stopping or reducing intensity.
                  </p>
                </div>
              )}
              <Button onClick={handlePainConfirmed}
                className="w-full h-12 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-2xl">
                {isLastExercise ? "Finish Workout" : "Continue →"}
              </Button>
            </motion.div>
          )}

          {/* REST */}
          {phase === "rest" && (
            <motion.div key="rest"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center px-5 py-12 min-h-[70vh]">
              <p className="kaya-label mb-8">Rest</p>
              <div className="relative flex items-center justify-center mb-8">
                <svg width="210" height="210" className="transform -rotate-90">
                  <circle cx="105" cy="105" r={REST_R} stroke="var(--border)" strokeWidth="8" fill="none" />
                  <motion.circle cx="105" cy="105" r={REST_R}
                    stroke="#1B7A4A" strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={REST_CIRC}
                    animate={{ strokeDashoffset: restOffset }}
                    transition={{ duration: 0.9, ease: "linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-6xl font-bold text-[#1B7A4A] leading-none">{restTime}</span>
                  <span className="text-[var(--text)]/30 text-sm font-body mt-2">seconds</span>
                </div>
              </div>
              {exercises[currentIdx + 1] && (
                <div className="text-center mb-8">
                  <p className="text-[var(--text)]/30 text-xs font-body uppercase tracking-widest mb-1">Next up</p>
                  <p className="font-display text-xl text-[var(--text)]">{exercises[currentIdx + 1].name}</p>
                </div>
              )}
              <button onClick={() => { clearInterval(restTimerRef.current); advanceToNext(); }}
                className="text-[#1B7A4A]/40 text-sm font-body hover:text-[#1B7A4A] transition-colors underline">
                Skip rest
              </button>
            </motion.div>
          )}

          {/* SUMMARY */}
          {phase === "summary" && (
            <motion.div key="summary"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center px-5 py-8 max-w-sm mx-auto w-full">
              <div className="w-16 h-16 bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8 text-[#1B7A4A]" />
              </div>
              <h3 className="font-display text-3xl text-[var(--text)] mb-1">Session complete.</h3>
              <p className="text-[var(--text)]/30 text-sm font-body mb-8">{formatTime(elapsed)} · {exercises.length} exercises</p>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6 w-full space-y-2">
                {exerciseLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text)]/60 font-body truncate mr-3">{log.exercise_name}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${
                      log.pain_level === 0 ? "bg-emerald-900/30 text-emerald-400" :
                      log.pain_level <= 2 ? "bg-[#1B7A4A]/10 text-[#1B7A4A]" :
                      log.pain_level <= 3 ? "bg-[#C44A1A]/10 text-[#C44A1A]" :
                      "bg-red-900/30 text-red-400"
                    }`}>Pain: {log.pain_level}/5</span>
                  </div>
                ))}
              </div>
              <p className="kaya-label mb-3">How do you feel overall?</p>
              <div className="flex gap-2 justify-center flex-wrap mb-8">
                {FEELINGS.map(f => (
                  <button key={f.value} onClick={() => setOverallFeeling(f.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-body transition-all border ${
                      overallFeeling === f.value
                        ? "bg-[#1B7A4A] text-[var(--bg)] border-[#1B7A4A]"
                        : "border-[var(--border)] text-[var(--text)]/40 hover:border-[#1B7A4A]/30"
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <Button onClick={handleComplete}
                className="w-full h-12 bg-[#1B7A4A] text-[var(--bg)] hover:bg-[#22A05E] font-semibold rounded-2xl">
                <Check className="w-5 h-5 mr-2" />Save Session
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      {phase === "exercise" && (
        <div className="flex items-center justify-center gap-6 px-5 py-4 flex-shrink-0 border-t border-[var(--border)]/30">
          <button onClick={() => { if (currentIdx > 0) { setCurrentIdx(p => p - 1); setPhase("exercise"); setPainLevel(0); } }}
            disabled={currentIdx === 0}
            className="w-12 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)]/30 disabled:opacity-20 hover:border-[#1B7A4A]/30 hover:text-[var(--text)]/60 transition-all">
            <SkipBack className="w-5 h-5" />
          </button>
          <button onClick={() => setIsPaused(v => !v)}
            className="w-12 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)]/40 hover:border-[#1B7A4A]/30 hover:text-[var(--text)]/70 transition-all">
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button onClick={handleDoneExercise}
            className="w-12 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)]/30 hover:border-[#1B7A4A]/30 hover:text-[var(--text)]/60 transition-all">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
