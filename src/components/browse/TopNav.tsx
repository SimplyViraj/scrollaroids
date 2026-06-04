import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { getProfile, PROFILES } from "@/data/profiles";

export function TopNav() {
  const { profileId } = useParams({ from: "/browse/$profileId" });
  const navigate = useNavigate();
  const profile = getProfile(profileId)!;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex h-16 items-center gap-6 px-4 md:px-12">
        <Link
          to="/browse/$profileId"
          params={{ profileId }}
          className="text-2xl font-black tracking-tight text-primary"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          FLIXR
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link to="/browse/$profileId" params={{ profileId }} activeOptions={{ exact: true }} activeProps={{ className: "text-white font-semibold" }} className="text-white/70 hover:text-white">
            Home
          </Link>
          <Link to="/browse/$profileId/search" params={{ profileId }} activeProps={{ className: "text-white font-semibold" }} className="text-white/70 hover:text-white">
            Browse
          </Link>
          <Link to="/browse/$profileId/my-list" params={{ profileId }} activeProps={{ className: "text-white font-semibold" }} className="text-white/70 hover:text-white">
            My List
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {searchOpen ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/browse/$profileId/search", params: { profileId }, search: { q } });
              }}
              className="flex items-center border border-white/40 bg-black/70 px-2"
            >
              <Search className="h-4 w-4 text-white/70" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => !q && setSearchOpen(false)}
                placeholder="Titles, genres, people"
                className="w-40 bg-transparent px-2 py-1 text-sm text-white outline-none placeholder:text-white/40 sm:w-56"
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-white" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          )}
          <button className="hidden text-white/80 hover:text-white sm:block" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1 text-white"
              aria-label="Profile menu"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold"
                style={{ background: profile.avatarColor }}
              >
                {profile.initial}
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 border border-white/10 bg-black/95 py-2 text-sm shadow-2xl">
                {PROFILES.filter((p) => p.id !== profile.id).map((p) => (
                  <Link
                    key={p.id}
                    to="/browse/$profileId"
                    params={{ profileId: p.id }}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold" style={{ background: p.avatarColor }}>
                      {p.initial}
                    </span>
                    {p.name}
                  </Link>
                ))}
                <div className="my-2 border-t border-white/10" />
                <Link to="/profiles" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white/70 hover:text-white">
                  Manage Profiles
                </Link>
                <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-white/70 hover:text-white">
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
