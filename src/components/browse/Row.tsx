import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/data/titles";
import { TitleCard } from "./TitleCard";

interface Props {
  title: string;
  items: Title[];
  profileId: string;
  ranked?: boolean;
  onOpen: (id: string) => void;
}

export function Row({ title, items, profileId, ranked, onOpen }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="group/row relative py-3 md:py-4">
      <h2 className="mb-2 px-4 text-base font-semibold text-white md:px-12 md:text-xl">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-black/40 opacity-0 transition-opacity hover:bg-black/70 group-hover/row:opacity-100 md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <div
          ref={scrollerRef}
          className="hide-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-4 md:gap-3 md:px-12"
        >
          {items.map((t, i) => (
            <TitleCard
              key={t.id}
              title={t}
              profileId={profileId}
              rank={ranked ? i + 1 : undefined}
              onOpen={onOpen}
            />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-black/40 opacity-0 transition-opacity hover:bg-black/70 group-hover/row:opacity-100 md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
      </div>
    </section>
  );
}
