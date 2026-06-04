import { motion } from "framer-motion";
import { Play, Info, Plus, Check } from "lucide-react";
import type { Title } from "@/data/titles";
import { MediaArtwork } from "@/lib/media";
import { useMyList } from "@/lib/my-list";

export function HeroBanner({
  title,
  profileId,
  onOpen,
}: {
  title: Title;
  profileId: string;
  onOpen: (id: string) => void;
}) {
  const has = useMyList((s) => s.has(profileId, title.id));
  const toggle = useMyList((s) => s.toggle);

  return (
    <div className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
      <div data-hero-media className="absolute inset-0 h-full w-full">
        <MediaArtwork media={title.backdrop} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        className="relative flex h-full max-w-2xl flex-col justify-end gap-4 px-4 pb-32 md:px-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          FLIXR Original
        </span>
        <h1
          className="text-4xl font-black leading-none text-white drop-shadow-2xl md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-white/90">
          <span className="font-semibold text-green-400">{title.match}% Match</span>
          <span>{title.year}</span>
          <span className="border border-white/40 px-1.5 text-xs">{title.rating}</span>
          <span>{title.duration}</span>
        </div>
        <p className="max-w-xl text-sm text-white/85 drop-shadow md:text-base">
          {title.synopsis}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const v = document.querySelector(
                '[data-hero-media] video'
              ) as HTMLVideoElement | null;
              if (v) {
                v.muted = false;
                v.play().catch(() => {});
              } else {
                onOpen(title.id);
              }
            }}
            className="flex items-center gap-2 rounded-sm bg-white px-5 py-2 font-semibold text-black transition-colors hover:bg-white/80"
          >
            <Play className="h-5 w-5 fill-black" /> Play
          </button>
          <button
            onClick={() => onOpen(title.id)}
            className="flex items-center gap-2 rounded-sm bg-white/25 px-5 py-2 font-semibold text-white backdrop-blur transition-colors hover:bg-white/35"
          >
            <Info className="h-5 w-5" /> More Info
          </button>
          <button
            onClick={() => toggle(profileId, title.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 text-white transition-colors hover:border-white"
            aria-label={has ? "Remove from My List" : "Add to My List"}
          >
            {has ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
