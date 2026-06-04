import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PROFILES } from "@/data/profiles";

export const Route = createFileRoute("/profiles")({
  head: () => ({
    meta: [
      { title: "Who's watching? — FLIXR" },
      { name: "description", content: "Choose a profile to start watching on FLIXR." },
    ],
  }),
  component: ProfilesPage,
});

function ProfilesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.h1
        className="mb-12 text-center text-3xl font-light text-white/95 sm:text-5xl md:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Who's watching?
      </motion.h1>

      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-8">
        {PROFILES.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
          >
            <Link
              to="/browse/$profileId"
              params={{ profileId: p.id }}
              className="group flex flex-col items-center gap-3 outline-none"
            >
              <div className="relative">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-md text-4xl font-bold text-white shadow-xl ring-0 transition-all duration-200 group-hover:ring-4 group-hover:ring-white sm:h-32 sm:w-32 sm:text-5xl md:h-40 md:w-40 md:text-6xl"
                  style={{ background: p.avatarColor }}
                >
                  {p.initial}
                </div>
                {p.isKids && (
                  <span className="absolute -bottom-1 right-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Kids
                  </span>
                )}
              </div>
              <span className="text-sm text-white/60 transition-colors group-hover:text-white sm:text-base md:text-lg">
                {p.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="mt-12 border border-white/30 px-5 py-2 text-sm uppercase tracking-widest text-white/60 transition-colors hover:border-white hover:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Manage Profiles
      </motion.button>
    </div>
  );
}
