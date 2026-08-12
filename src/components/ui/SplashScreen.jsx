import { motion } from "framer-motion";
import { AyuMark as KayaMark } from "@/components/ui/AyuLogo";

export default function SplashScreen({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[var(--bg)] z-[999] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1B7A4A]/4 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* K mark — draws itself in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          {/* SVG K drawn stroke by stroke */}
          <svg width="88" height="88" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Vertical stem */}
            <motion.line x1="28" y1="14" x2="28" y2="86"
              stroke="#1B7A4A" strokeWidth="11" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            />
            {/* Upper diagonal */}
            <motion.line
              x1={28 + 5.5} y1="48"
              x2="78" y2="14"
              stroke="#1B7A4A" strokeWidth="11" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            />
            {/* Lower diagonal — from midpoint of upper */}
            <motion.line
              x1={(28 + 5.5 + 78) / 2} y1={(48 + 14) / 2}
              x2="82" y2="86"
              stroke="#1B7A4A" strokeWidth="11" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        {/* Welcome text */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
          className="font-display text-5xl text-[var(--text)] tracking-wide mb-5"
        >
          Welcome to Kaya
        </motion.h1>

        {/* Sanskrit meaning */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
          className="font-display italic text-[#1B7A4A] text-xl tracking-wide"
        >
          Sanskrit: the body · the vessel
        </motion.p>
      </div>

      {/* Fade out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.0, duration: 0.8 }}
        onAnimationComplete={onComplete}
        className="absolute inset-0 bg-[var(--bg)] pointer-events-none"
      />
    </motion.div>
  );
}
