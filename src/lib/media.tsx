import type { CSSProperties } from "react";

export type MediaAsset =
  | string
  | {
      kind: "image";
      src: string;
      alt?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
      autoPlay?: boolean;
      loop?: boolean;
      muted?: boolean;
      playsInline?: boolean;
    };

type Props = {
  media: MediaAsset;
  alt?: string;
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  style?: CSSProperties;
  hoverPlay?: boolean;
  id?: string;
};

const isMediaPath = (value: string) => /^(https?:|\/|\.\.?\/|data:|blob:)/i.test(value);
const isVideoPath = (value: string) => /\.(mp4|webm|ogg|mpeg|m4v)(\?|#|$)/i.test(value.toLowerCase());

export function MediaArtwork({
  media,
  alt,
  className,
  imageClassName,
  videoClassName,
  style,
  hoverPlay,
  id,
}: Props) {
  if (typeof media === "string") {
    if (isMediaPath(media)) {
      if (isVideoPath(media)) {
        const videoRefHandler = (el: HTMLVideoElement | null) => {
          if (!el) return;
          el.loop = true;
          el.muted = true;
          el.playsInline = true;
        };

        const video = (
          <video
            id={id}
            ref={videoRefHandler as any}
            className={className ?? videoClassName}
            style={style}
            src={media}
            poster={undefined}
            autoPlay={false}
            loop={true}
            muted={true}
            playsInline={true}
            {...{ "webkit-playsinline": "true" }}
          />
        );

        if (hoverPlay) {
          return (
            <div
              className={className}
              style={style}
              onMouseEnter={(e) => {
                const v = (e.currentTarget.querySelector("video") as HTMLVideoElement | null);
                v?.play().catch(() => {});
              }}
              onMouseLeave={(e) => {
                const v = (e.currentTarget.querySelector("video") as HTMLVideoElement | null);
                v?.pause();
                try {
                  v && (v.currentTime = 0);
                } catch {}
              }}
            >
              {video}
            </div>
          );
        }

        return video;
      }

      return <img id={id} src={media} alt={alt ?? ""} className={className ?? imageClassName} style={style} />;
    }

    return <div className={className} style={{ ...style, background: media }} />;
  }

  if (media.kind === "image") {
    return (
      <img
        id={id}
        src={media.src}
        alt={media.alt ?? ""}
        className={className ?? imageClassName}
        style={style}
      />
    );
  }

  // media.kind === 'video'
  const videoEl = (
    <video
      id={id}
      className={className ?? videoClassName}
      style={style}
      src={media.src}
      poster={media.poster}
      autoPlay={media.autoPlay ?? false}
      loop={media.loop ?? true}
      muted={media.muted ?? true}
      playsInline={media.playsInline ?? true}
    />
  );

  if (hoverPlay) {
    return (
      <div
        className={className}
        style={style}
        onMouseEnter={(e) => {
          const v = (e.currentTarget.querySelector("video") as HTMLVideoElement | null);
          v?.play().catch(() => {});
        }}
        onMouseLeave={(e) => {
          const v = (e.currentTarget.querySelector("video") as HTMLVideoElement | null);
          v?.pause();
          try {
            v && (v.currentTime = 0);
          } catch {}
        }}
      >
        {videoEl}
      </div>
    );
  }

  return videoEl;
}