import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { getProfile } from "@/data/profiles";
import { searchTitles, visibleTitlesForProfile } from "@/data/titles";
import { TitleCard } from "@/components/browse/TitleCard";
import { useOpenTitle } from "./browse.$profileId";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/browse/$profileId/search")({
  validateSearch: zodValidator(schema),
  head: () => ({ meta: [{ title: "Search — FLIXR" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { profileId } = Route.useParams();
  const { q } = Route.useSearch();
  const profile = getProfile(profileId)!;
  const { open } = useOpenTitle();

  const allowed = profile.isKids ? profile.genres : undefined;
  const visibleTitles = visibleTitlesForProfile(profileId);
  const results = q
    ? searchTitles(q, profileId, allowed)
    : (allowed ? visibleTitles.filter((t) => t.genres.some((g) => allowed.includes(g))) : visibleTitles);

  return (
    <div className="pt-24">
      <div className="px-4 md:px-12">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          {q ? <>Results for "<span className="text-primary">{q}</span>"</> : "Browse all titles"}
        </h1>
        <p className="mb-6 text-sm text-white/60">{results.length} {results.length === 1 ? "title" : "titles"}</p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-white/60">
            <SearchIcon className="h-10 w-10" />
            <p>No titles match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((t) => (
              <TitleCard key={t.id} title={t} profileId={profileId} onOpen={open} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
