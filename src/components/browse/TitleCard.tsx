import { motion } from "framer-motion";
import { Play, Plus, Check, ChevronDown } from "lucide-react";
import type { Title } from "@/data/titles";
import { MediaArtwork } from "@/lib/media";
import { useMyList } from "@/lib/my-list";

interface Props {
  title: Title;
  profileId: string;
  rank?: number;
  onOpen: (id: string) => void;
}

export function TitleCard({ title, profileId, rank, onOpen }: Props) {
  const has = useMyList((s) => s.has(profileId, title.id));
  const toggle = useMyList((s) => s.toggle);

  return (
    <motion.div
      className="group relative shrink-0 cursor-pointer"
      whileHover={{ scale: 1.08, zIndex: 20 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpen(title.id)}
    >
      <div className="flex items-end">
        {rank !== undefined && (
          <span
            className="-mr-4 select-none text-[7rem] font-black leading-none text-black sm:text-[9rem]"
            style={{
              WebkitTextStroke: "3px oklch(0.40 0 0)",
              fontFamily: "var(--font-display)",
            }}
          >
            {rank}
          </span>
        )}
        <div
          data-card-wrap
          className="relative aspect-[2/3] w-32 overflow-hidden rounded-sm sm:w-40 md:w-44"
          onMouseEnter={(e) => {
            const v = (e.currentTarget.querySelector('video') as HTMLVideoElement | null);
            if (v) {
              v.muted = true;
              v.play().catch(() => {});
            }
          }}
          onMouseLeave={(e) => {
            const v = (e.currentTarget.querySelector('video') as HTMLVideoElement | null);
            if (v) {
              try {
                v.pause();
                v.currentTime = 0;
              } catch {}
            }
          }}
        >
          <MediaArtwork media={title.poster} className="absolute inset-0 h-full w-full object-cover" hoverPlay />
          <div className="absolute inset-0 flex flex-col justify-between p-3">
            <div className="flex items-start justify-between gap-1">
              {title.isNew && (
                <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  New
                </span>
              )}
            </div>
            <div>
              <div
                className="text-lg font-black leading-tight text-white drop-shadow-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title.title}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-white/70">
                {title.genres.slice(0, 2).join(" • ")}
              </div>
            </div>
          </div>

          {/* hover quick-info */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const wrap = e.currentTarget.closest('[data-card-wrap]');
                  const v = wrap?.querySelector('video') as HTMLVideoElement | null;
                  if (v) {
                    v.muted = false;
                    v.play().catch(() => {});
                  } else {
                    onOpen(title.id); // fallback if MediaArtwork renders an img
                  }
                }}
                className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-white text-black hover:bg-white/80"
                aria-label="Play"
              >
                <Play className="h-3 w-3 fill-black" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(profileId, title.id);
                }}
                className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/60 text-white hover:border-white"
                aria-label={has ? "Remove from My List" : "Add to My List"}
              >
                {has ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(title.id);
                }}
                className="pointer-events-auto ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/60 text-white hover:border-white"
                aria-label="More info"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-white/80">
              <span className="font-semibold text-green-400">{title.match}% Match</span>
              <span className="border border-white/40 px-1">{title.rating}</span>
              <span>{title.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
