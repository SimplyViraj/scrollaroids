import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect } from "react";

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.24),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]" />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/8 backdrop-blur"
          initial={{ rotate: -8, y: 10 }}
          animate={{ rotate: 0, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Play className="h-10 w-10 fill-white text-white" />
        </motion.div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-white/55">Flixr</p>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
            Press play.
          </h1>
          <p className="mx-auto max-w-md text-sm text-white/70 sm:text-base">
            A fast intro animation before the profile browser loads.
          </p>
        </div>
        <button
          onClick={onDone}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/18"
        >
          Enter
        </button>
      </motion.div>
    </main>
  );
}
