import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/browse/TopNav";
import { TitleModal } from "@/components/browse/TitleModal";
import { getProfile } from "@/data/profiles";

const OPEN_TITLE_EVENT = "flixr:open-title";

export const useOpenTitle = () => ({
  open: (id: string) => {
    window.dispatchEvent(new CustomEvent(OPEN_TITLE_EVENT, { detail: { id } }));
  },
});

export const Route = createFileRoute("/browse/$profileId")({
  component: BrowseLayout,
});

function BrowseLayout() {
  const { profileId } = Route.useParams();
  const profile = getProfile(profileId);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      setOpenId(detail?.id ?? null);
    };

    window.addEventListener(OPEN_TITLE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TITLE_EVENT, onOpen);
  }, []);

  if (!profile) return <Navigate to="/profiles" />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav />
      <Outlet />
      <TitleModal titleId={openId} profileId={profileId} onClose={() => setOpenId(null)} />
      <footer className="mt-16 px-4 text-xs text-white/40 md:px-12">
        <p>FLIXR &middot; A Netflix-style demo &middot; All titles and content are fictional.</p>
      </footer>
    </div>
  );
}
