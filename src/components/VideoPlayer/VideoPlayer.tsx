"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


export interface PlayerEpisode {
  number: number;
  title: string;
  duration: string;
  synopsis: string;
  src: string;          // e.g. "/FirstYear/treasurehunt2.mp4"
  artwork?: string;     // optional thumbnail src
}

interface VideoPlayerProps {
  /** Series / movie title shown in the top-left */
  seriesTitle: string;
  /** List of episodes (pass a single-item array for movies) */
  episodes: PlayerEpisode[];
  /** Which episode index to start on */
  initialIndex?: number;
  /** Called when the player should close */
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoPlayer({
  seriesTitle,
  episodes,
  initialIndex = 0,
  onClose,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [curIdx, setCurIdx] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);       // 0–1
  const [buffered, setBuffered] = useState(0);       // 0–1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showSkipToast, setShowSkipToast] = useState(false);

  const episode = episodes[curIdx];
  const hasNext = curIdx < episodes.length - 1;
  const hasPrev = curIdx > 0;

  // ── Load episode ────────────────────────────────────────────────────────────

  const loadEpisode = useCallback((idx: number, autoplay = true) => {
    const v = videoRef.current;
    if (!v) return;
    setCurIdx(idx);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    v.src = episodes[idx].src;
    v.load();
    if (autoplay) {
      v.muted = false;
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Browsers may block unmuted autoplay — fall back to muted
          v.muted = true;
          setMuted(true);
          v.play().then(() => setPlaying(true)).catch(() => {});
        });
    }
  }, [episodes]);

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    loadEpisode(initialIndex);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          v.currentTime = Math.min(v.duration, v.currentTime + 10);
          break;
        case "ArrowLeft":
          v.currentTime = Math.max(0, v.currentTime - 10);
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          if (!isFullscreen) onClose();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, muted, isFullscreen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fullscreen sync ─────────────────────────────────────────────────────────

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── Controls auto-hide ──────────────────────────────────────────────────────

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  // ── Video event handlers ────────────────────────────────────────────────────

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || isSeeking) return;
    setCurrentTime(v.currentTime);
    setProgress(v.duration ? v.currentTime / v.duration : 0);
  };

  const onDurationChange = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const onProgress = () => {
    const v = videoRef.current;
    if (!v || !v.buffered.length) return;
    setBuffered(v.buffered.end(v.buffered.length - 1) / (v.duration || 1));
  };

  const onEnded = () => {
    setPlaying(false);
    if (hasNext) {
      setShowSkipToast(true);
      setTimeout(() => {
        setShowSkipToast(false);
        loadEpisode(curIdx + 1);
      }, 3500);
    }
  };

  // ── Controls ────────────────────────────────────────────────────────────────

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  };

  // ── Seek bar ────────────────────────────────────────────────────────────────

  const seek = (clientX: number, barEl: HTMLElement) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = barEl.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
    setProgress(pct);
    setCurrentTime(v.currentTime);
  };

  const onSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    seek(e.clientX, e.currentTarget);
  };

  const onSeekBarTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    seek(e.touches[0].clientX, e.currentTarget);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      {/* ── Video element ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain bg-black"
        playsInline
        {...{ "webkit-playsinline": "true" }}
        preload="metadata"
        loop={false}
        muted={muted}
        onTimeUpdate={onTimeUpdate}
        onDurationChange={onDurationChange}
        onProgress={onProgress}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
        onClick={togglePlay}
      />

      {/* ── Top bar ── */}
      <div
        className={`
          absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-4 py-4
          bg-gradient-to-b from-black/80 to-transparent
          transition-opacity duration-300
          ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Close player"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{seriesTitle}</p>
          <p className="truncate text-sm font-bold text-white">{episode.title}</p>
        </div>
        {episodes.length > 1 && (
          <button
            onClick={() => setShowEpisodes((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <span>Episodes</span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showEpisodes ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      {/* ── Center play / pause tap zone ── */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 z-[5] flex items-center justify-center focus:outline-none"
        aria-label={playing ? "Pause" : "Play"}
        tabIndex={-1}
      >
        <div
          className={`
            flex h-16 w-16 items-center justify-center rounded-full
            border-2 border-white/40 bg-black/40 backdrop-blur-sm
            transition-all duration-200
            ${showControls && !playing ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          `}
        >
          {playing
            ? <Pause className="h-7 w-7 fill-white text-white" />
            : <Play className="h-7 w-7 fill-white text-white ml-1" />
          }
        </div>
      </button>

      {/* ── Bottom controls ── */}
      <div
        className={`
          absolute inset-x-0 bottom-0 z-10 px-4 pb-6 pt-16
          bg-gradient-to-t from-black/90 via-black/40 to-transparent
          transition-opacity duration-300
          ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Seek bar */}
        <div
          className="group relative mb-3 h-1 w-full cursor-pointer rounded-full bg-white/20 hover:h-1.5 transition-all duration-150"
          onClick={onSeekBarClick}
          onTouchMove={onSeekBarTouch}
          onMouseDown={() => setIsSeeking(true)}
          onMouseUp={() => setIsSeeking(false)}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          {/* Buffered */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
            style={{ width: `${buffered * 100}%` }}
          />
          {/* Played */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#e50914]"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center text-white hover:text-white/70 transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing
              ? <Pause className="h-6 w-6 fill-white" />
              : <Play className="h-6 w-6 fill-white ml-0.5" />
            }
          </button>

          {/* Skip next episode */}
          {hasNext && (
            <button
              onClick={() => loadEpisode(curIdx + 1)}
              className="flex h-9 w-9 items-center justify-center text-white hover:text-white/70 transition-colors"
              aria-label="Next episode"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          )}

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="flex h-9 w-9 items-center justify-center text-white hover:text-white/70 transition-colors"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted
              ? <VolumeX className="h-5 w-5" />
              : <Volume2 className="h-5 w-5" />
            }
          </button>

          {/* Time */}
          <span className="text-xs tabular-nums text-white/70 select-none">
            {fmtTime(currentTime)} / {fmtTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Prev / Next episode on desktop */}
          {hasPrev && (
            <button
              onClick={() => loadEpisode(curIdx - 1)}
              className="hidden md:flex h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-semibold text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => loadEpisode(curIdx + 1)}
              className="hidden md:flex h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-semibold text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center text-white hover:text-white/70 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen
              ? <Minimize className="h-5 w-5" />
              : <Maximize className="h-5 w-5" />
            }
          </button>
        </div>
      </div>

      {/* ── Episode drawer (slides in from right) ── */}
      {episodes.length > 1 && (
        <div
          className={`
            absolute inset-y-0 right-0 z-20 w-72 bg-[#141414]/95 backdrop-blur-md
            flex flex-col shadow-2xl
            transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${showEpisodes ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <span className="text-sm font-bold text-white">Episodes</span>
            <button
              onClick={() => setShowEpisodes(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
              aria-label="Close episode list"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {episodes.map((ep, i) => (
              <button
                key={ep.number}
                onClick={() => { loadEpisode(i); setShowEpisodes(false); }}
                className={`
                  flex w-full items-start gap-3 px-4 py-3 text-left transition-colors
                  ${i === curIdx ? "bg-white/10" : "hover:bg-white/5"}
                `}
              >
                {/* Thumbnail */}
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-white/10">
                  {ep.artwork
                    ? <img src={ep.artwork} alt={ep.title} className="absolute inset-0 h-full w-full object-cover" />
                    : <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">{ep.number}</div>
                  }
                  {i === curIdx && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#e50914] animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-semibold truncate ${i === curIdx ? "text-white" : "text-white/80"}`}>
                      {ep.number}. {ep.title}
                    </span>
                    <span className="shrink-0 text-xs text-white/40">{ep.duration}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-5 text-white/50 line-clamp-2">{ep.synopsis}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── "Next episode" autoplay toast ── */}
      {showSkipToast && hasNext && (
        <div className="absolute bottom-24 right-4 z-30 flex items-center gap-3 rounded-xl bg-[#1a1a1a] border border-white/10 px-4 py-3 shadow-2xl backdrop-blur-sm">
          <div>
            <p className="text-xs text-white/50">Next episode</p>
            <p className="text-sm font-bold text-white">{episodes[curIdx + 1].title}</p>
          </div>
          <button
            onClick={() => { setShowSkipToast(false); loadEpisode(curIdx + 1); }}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-white/90 transition-colors"
          >
            <Play className="h-3 w-3 fill-black" /> Play now
          </button>
          <button
            onClick={() => setShowSkipToast(false)}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}