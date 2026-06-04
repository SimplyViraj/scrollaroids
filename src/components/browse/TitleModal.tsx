import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TITLES, getTitle, type Title } from "@/data/titles";
import { MediaArtwork } from "@/lib/media";
import { useMyList } from "@/lib/my-list";
import { VideoPlayer, type PlayerEpisode } from "@/components/VideoPlayer/VideoPlayer";

export function TitleModal({
  titleId,
  profileId,
  onClose,
}: {
  titleId: string | null;
  profileId: string;
  onClose: () => void;
}) {
  const title = titleId ? getTitle(titleId) : null;
  const has = useMyList((s) => (title ? s.has(profileId, title.id) : false));
  const toggle = useMyList((s) => s.toggle);
  const [visible, setVisible] = useState(false);
  const [featuredRelated, setFeaturedRelated] = useState<Title | null>(null);
  const [playerEpisodes, setPlayerEpisodes] = useState<PlayerEpisode[] | null>(null);
  const [playerStartIdx, setPlayerStartIdx] = useState(0);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const handleClose = () => {
    setVisible(false);
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(onClose, 300);
  };

  // Convert a title into the PlayerEpisode[] format VideoPlayer expects
  const buildEpisodes = (t: Title, startEpIndex = 0): [PlayerEpisode[], number] => {
    if (t.kind === "series" && t.episodes?.length) {
      return [
        t.episodes.map((ep) => ({
          number: ep.number,
          title: ep.title,
          duration: ep.duration,
          synopsis: ep.synopsis,
          src: ep.artwork ?? t.poster,   // artwork doubles as src in your data
          artwork: ep.artwork ?? t.poster,
        })),
        startEpIndex,
      ];
    }
    // Movie or series without episode list — treat as single item
    return [
      [{
        number: 1,
        title: t.title,
        duration: t.duration,
        synopsis: t.synopsis,
        src: t.backdrop ?? t.poster,
      }],
      0,
    ];
  };

  const openPlayer = (epIndex = 0) => {
    if (!title) return;
    const [eps, idx] = buildEpisodes(title, epIndex);
    setPlayerStartIdx(idx);
    setPlayerEpisodes(eps);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();

    if (title) {
      if (openTimer.current != null) window.clearTimeout(openTimer.current);
      setVisible(true);
      const sameGenreMovies = TITLES.filter(
        (candidate) =>
          candidate.id !== title.id &&
          candidate.kind !== "series" &&
          candidate.genres.some((genre) => title.genres.includes(genre)),
      );
      setFeaturedRelated(
        sameGenreMovies.length
          ? sameGenreMovies[Math.floor(Math.random() * sameGenreMovies.length)]
          : null,
      );
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (openTimer.current != null) window.clearTimeout(openTimer.current);
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    };
  }, [title, onClose]);

  return (
    <>
      {/* ── Full-screen video player ─────────────────────────────────────── */}
      {playerEpisodes && (
        <VideoPlayer
          seriesTitle={title?.title ?? ""}
          episodes={playerEpisodes}
          initialIndex={playerStartIdx}
          onClose={() => setPlayerEpisodes(null)}
        />
      )}

      {/* ── Info modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {title && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="mx-auto my-6 w-[95%] max-w-4xl overflow-hidden rounded-[16px] bg-[#181818] shadow-2xl"
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: visible ? 1 : 0.96, opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[clamp(200px,30vw,380px)] w-full overflow-hidden">
                <MediaArtwork
                  media={title.backdrop}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent" />
                <button
                  onClick={handleClose}
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div
                    className="mb-4 text-3xl font-black text-white md:text-5xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title.logo || title.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* ── Play button now opens VideoPlayer ── */}
                    <button
                      onClick={() => openPlayer(0)}
                      className="flex items-center gap-2 rounded-sm bg-white px-5 py-2 font-semibold text-black hover:bg-white/80"
                    >
                      <Play className="h-4 w-4 fill-black" /> Play
                    </button>
                    <button
                      onClick={() => toggle(profileId, title.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 text-white hover:border-white"
                      aria-label={has ? "Remove from My List" : "Add to My List"}
                    >
                      {has ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 text-white hover:border-white"
                      aria-label="Rate"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 px-6 py-6 md:grid-cols-3 md:px-8 md:py-8">
                <div className="md:col-span-2">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-green-400">{title.match}% Match</span>
                    <span className="text-white">{title.year}</span>
                    <span className="border border-white/40 px-1.5 text-xs text-white">{title.rating}</span>
                    <span className="text-white">{title.duration}</span>
                    {title.isNew && (
                      <span className="rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-white/90">{title.synopsis}</p>
                </div>
                <div className="space-y-3 text-sm">
                  {title.cast.length > 0 && (
                    <div>
                      <span className="text-white/50">Cast: </span>
                      <span className="text-white">{title.cast.join(", ")}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-white/50">Genres: </span>
                    <span className="text-white">{title.genres.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-white/50">This title is: </span>
                    <span className="text-white">
                      {title.match > 92 ? "Exciting, Suspenseful" : "Thought-provoking, Engaging"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 px-6 py-6 md:px-8">
                {title.kind === "series" ? (
                  <>
                    <h4 className="mb-4 text-xl font-bold text-white">Episodes</h4>
                    <div className="space-y-4">
                      {(title.episodes ?? [1, 2, 3].map((episode) => ({
                        number: episode,
                        title: `Episode ${episode}`,
                        duration: `${40 + episode * 5}m`,
                        synopsis: `${title.synopsis.slice(0, 80 + episode * 20)}…`,
                      }))).map((episode, i) => (
                        <div
                          key={episode.number}
                          className="flex gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0"
                        >
                          <button
                            onClick={() => openPlayer(i)}
                            className="relative flex h-[clamp(50px,6vw,72px)] w-[clamp(80px,10vw,120px)] shrink-0 items-center justify-center overflow-hidden rounded bg-white/10 text-white group"
                            onMouseEnter={(e) => {
                              const v = e.currentTarget.querySelector("video") as HTMLVideoElement | null;
                              if (v) { v.muted = true; v.play().catch(() => {}); }
                            }}
                            onMouseLeave={(e) => {
                              const v = e.currentTarget.querySelector("video") as HTMLVideoElement | null;
                              if (v) { try { v.pause(); v.currentTime = 0; } catch {} }
                            }}
                          >
                            <MediaArtwork
                              media={(episode as any).artwork ?? title.poster}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <Play className="relative z-10 h-5 w-5 fill-white text-white drop-shadow-lg" />
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-start justify-between gap-4">
                              <button
                                onClick={() => openPlayer(i)}
                                className="font-medium text-white hover:underline text-left"
                              >
                                {episode.number}. {episode.title}
                              </button>
                              <span className="shrink-0 text-sm text-white/50">{episode.duration}</span>
                            </div>
                            <p className="text-sm leading-6 text-white/60">{episode.synopsis}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  featuredRelated && (
                    <>
                      <h4 className="mb-4 text-xl font-bold text-white">More Like This</h4>
                      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
                          <MediaArtwork
                            media={featuredRelated.poster}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-green-400">{featuredRelated.match}% Match</span>
                            <span className="text-white">{featuredRelated.year}</span>
                            <span className="border border-white/40 px-1.5 text-xs text-white">{featuredRelated.rating}</span>
                            <span className="text-white">{featuredRelated.duration}</span>
                          </div>
                          <p className="text-sm leading-6 text-white/80">{featuredRelated.synopsis}</p>
                          <div className="text-sm text-white/60">
                            <span className="text-white/45">Genres: </span>
                            <span className="text-white">{featuredRelated.genres.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}