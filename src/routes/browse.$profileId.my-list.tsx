import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useMyList } from "@/lib/my-list";
import { getTitle, isTitleVisibleToProfile } from "@/data/titles";
import { TitleCard } from "@/components/browse/TitleCard";
import { useOpenTitle } from "./browse.$profileId";

export const Route = createFileRoute("/browse/$profileId/my-list")({
  head: () => ({ meta: [{ title: "My List — FLIXR" }] }),
  component: MyListPage,
});

function MyListPage() {
  const { profileId } = Route.useParams();
  const ids = useMyList((s) => s.lists[profileId] ?? []);
  const { open } = useOpenTitle();

  const titles = ids
    .map(getTitle)
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .filter((title) => isTitleVisibleToProfile(title, profileId));

  return (
    <div className="pt-24">
      <div className="px-4 md:px-12">
        <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">My List</h1>
        {titles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center text-white/60">
            <Bookmark className="h-12 w-12" />
            <p>Your list is empty.</p>
            <Link
              to="/browse/$profileId"
              params={{ profileId }}
              className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Find something to watch
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {titles.map((t) => (
              <TitleCard key={t.id} title={t} profileId={profileId} onOpen={open} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
