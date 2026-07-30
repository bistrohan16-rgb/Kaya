import { motion } from "framer-motion";
import { AyuMark } from "@/components/ui/AyuLogo";

export default function SplashScreen({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#080808] z-[999] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8960C]/4 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-10"
        >
          <AyuMark size={88} pulse />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="font-display text-5xl text-[#F8F8F8] tracking-wide mb-5"
        >
          Welcome to Kaya
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          className="font-display italic text-[#B8960C] text-xl tracking-wide"
        >
          Sanskrit: the body · the vessel
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 0.8 }}
        onAnimationComplete={onComplete}
        className="absolute inset-0 bg-[#080808] pointer-events-none"
      />
    </motion.div>
  );
}
