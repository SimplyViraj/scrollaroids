import { createFileRoute } from "@tanstack/react-router";
import { HeroBanner } from "@/components/browse/HeroBanner";
import { Row } from "@/components/browse/Row";
import { getProfile } from "@/data/profiles";
import { getRowTitles, visibleTitlesForProfile } from "@/data/titles";
import { useOpenTitle } from "./browse.$profileId";

export const Route = createFileRoute("/browse/$profileId/")({
  head: ({ params }) => {
    const profile = getProfile(params.profileId);
    return {
      meta: [
        { title: `${profile?.name ?? "Browse"} — FLIXR` },
        { name: "description", content: `Watch ${profile?.tagline ?? "movies and shows"} on FLIXR.` },
      ],
    };
  },
  component: BrowseHome,
});

function BrowseHome() {
  const { profileId } = Route.useParams();
  const profile = getProfile(profileId)!;
  const { open } = useOpenTitle();
  const visibleTitles = visibleTitlesForProfile(profileId);

  const hero =
    visibleTitles.find((t) => t.trending && t.genres.some((g) => profile.genres.includes(g))) ??
    visibleTitles.find((t) => t.genres.some((g) => profile.genres.includes(g))) ??
    visibleTitles[0];

  return (
    <div>
      <HeroBanner title={hero} profileId={profileId} onOpen={open} />
      <div className="-mt-24 relative z-10 space-y-4">
        {profile.rows.map((r) => (
          <Row
            key={r.title}
            title={r.title}
            items={getRowTitles({
              profileId,
              kind: r.kind,
              genres: r.genres,
              allowedGenres: profile.isKids ? profile.genres : undefined,
            })}
            ranked={r.kind === "top10"}
            profileId={profileId}
            onOpen={open}
          />
        ))}
      </div>
    </div>
  );
}
