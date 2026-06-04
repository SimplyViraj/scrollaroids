import type { ProfileId } from "./profiles";
import type { MediaAsset } from "@/lib/media";

const svgArtwork = (title: string, subtitle: string, from: string, to: string): MediaAsset => ({
  kind: "image",
  src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1800" fill="url(#g)" />
      <circle cx="930" cy="340" r="280" fill="rgba(255,255,255,0.14)" />
      <circle cx="250" cy="1450" r="360" fill="rgba(0,0,0,0.14)" />
      <text x="90" y="380" fill="white" font-family="Arial, sans-serif" font-size="96" font-weight="700">${title}</text>
      <text x="90" y="490" fill="rgba(255,255,255,0.88)" font-family="Arial, sans-serif" font-size="44">${subtitle}</text>
    </svg>
  `)}`,
  alt: title,
});

export type Title = {
  id: string;
  title: string;
  logo?: string;
  kind?: "movie" | "series";
  visibleTo: ProfileId[];
  synopsis: string;
  year: number;
  rating: "TV-MA" | "TV-14" | "PG-13" | "PG";
  duration: string;
  match: number;
  genres: string[];
  cast: string[];
  poster: MediaAsset;
  backdrop: MediaAsset;
  episodes?: {
    number: number;
    title: string;
    duration: string;
    synopsis: string;
    artwork?: MediaAsset;
  }[];
  trending?: boolean;
  isNew?: boolean;
};

export const TITLES: Title[] = [
  {
    id: "aloha-duo",
    title: "Aloha",
    visibleTo: ["firstyear"],
    synopsis: "First ever duo picture she ever took. Courtesy of Maanya Chadalavada. Only two duo pics for entire first Year. She never liked me *sob sob*",
    year: 2022,
    rating: "TV-MA",
    duration: "2h 11m",
    match: 98,
    genres: ["Action", "Sci-Fi", "Thriller"],
    cast: ["Mara Voss", "Ilan Reed", "Noa Vale"],
    poster: "/FirstYear/alohaduo.jpeg",
    backdrop: "/FirstYear/alohaduobackdrop.jpeg",
    trending: true,
    isNew: false,
  },
  {
    id: "treasurehunt",
    title: "Treasure Hunt",
    kind: "series",
    visibleTo: ["firstyear"],
    synopsis: "Not all treasures are silver and gold, mate. -Captain Jack Sparrow",
    year: 2022,
    rating: "TV-14",
    duration: "1h 58m",
    match: 96,
    genres: ["Drama", "Crime", "Thriller"],
    cast: ["Eden Shaw", "Priya Cole", "Jonah Pike"],
    poster: "/FirstYear/treasurehunt1.mp4",
    backdrop: "/FirstYear/treasurehunt1.mp4",
    episodes: [
      {
        number: 1,
        title: "The Last Light",
        duration: "48m",
        synopsis: "A lead from the old waterfront case returns and pulls the investigation open again.",
        artwork: "/FirstYear/treasurehunt2.mp4",
      },
      { number: 2, title: "Window in the Dark", duration: "51m", synopsis: "A witness changes their story, and the timeline of the crime starts to bend." },
      { number: 3, title: "Nothing Stays Buried", duration: "54m", synopsis: "The detectives follow a hidden transfer route into the city’s oldest district." },
    ],
    trending: true,
  },
  {
    id: "laugh-track",
    title: "Laugh Track",
    visibleTo: ["sam"],
    synopsis: "A chaotic comedy club tries to survive one terrible weekend of open mic glory.",
    year: 2023,
    rating: "PG-13",
    duration: "1h 42m",
    match: 94,
    genres: ["Comedy"],
    cast: ["Rina Ford", "Miles Bennet", "Tess Jun"],
    poster: "linear-gradient(160deg, #1f2937 0%, #f59e0b 50%, #fb7185 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(245,158,11,.5) 55%, rgba(251,113,133,.2) 100%)",
    trending: true,
  },
  {
    id: "sky-sailors",
    title: "Sky Sailors",
    kind: "series",
    visibleTo: ["kiddo", "sam"],
    synopsis: "A found family of pilots charts a route across stormfields to save a floating archive.",
    year: 2025,
    rating: "PG",
    duration: "1h 49m",
    match: 93,
    genres: ["Family", "Adventure", "Animation"],
    cast: ["Lumi Finch", "Ari North", "Theo Hale"],
    poster: "linear-gradient(160deg, #1d4ed8 0%, #38bdf8 50%, #f59e0b 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(56,189,248,.48) 55%, rgba(245,158,11,.18) 100%)",
    episodes: [
      { number: 1, title: "Lift Off", duration: "27m", synopsis: "The crew discovers the map that makes the storm corridors visible." },
      { number: 2, title: "The Glass Current", duration: "29m", synopsis: "An impossible weather system forces the pilots to trust an unexpected ally." },
      { number: 3, title: "The Archive Below", duration: "30m", synopsis: "The team dives beneath the clouds to protect the last hidden library in the sky." },
    ],
    isNew: true,
  },
  {
    id: "red-harbor",
    title: "Red Harbor",
    visibleTo: ["jordan"],
    synopsis: "In a port town built on secrets, every deal comes with a larger cost.",
    year: 2022,
    rating: "TV-MA",
    duration: "2h 04m",
    match: 91,
    genres: ["Crime", "Drama"],
    cast: ["Cal Vega", "Mina Ortiz", "Soren Vale"],
    poster: "linear-gradient(160deg, #111827 0%, #b91c1c 50%, #f97316 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(185,28,28,.55) 55%, rgba(249,115,22,.18) 100%)",
  },
  {
    id: "glimmer",
    title: "Glimmer",
    visibleTo: ["jordan", "sam"],
    synopsis: "A musician returns home to confront the performance that changed her family forever.",
    year: 2024,
    rating: "PG-13",
    duration: "1h 51m",
    match: 90,
    genres: ["Drama", "Romance"],
    cast: ["Elena Bloom", "Jasper Lin", "Ada Kwon"],
    poster: "linear-gradient(160deg, #312e81 0%, #8b5cf6 50%, #ec4899 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 12%, rgba(139,92,246,.5) 55%, rgba(236,72,153,.18) 100%)",
    trending: true,
  },
  {
    id: "pixel-pals",
    title: "Pixel Pals",
    visibleTo: ["kiddo", "sam"],
    synopsis: "Two animated roommates accidentally become the city’s most useful babysitters.",
    year: 2024,
    rating: "PG",
    duration: "1h 28m",
    match: 89,
    genres: ["Animation", "Family", "Comedy"],
    cast: ["Pip", "Momo", "Zuzu"],
    poster: "linear-gradient(160deg, #0f766e 0%, #22c55e 50%, #facc15 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 12%, rgba(34,197,94,.48) 55%, rgba(250,204,21,.18) 100%)",
    isNew: true,
  },
  {
    id: "cold-echo",
    title: "Cold Echo",
    visibleTo: ["alex", "jordan"],
    synopsis: "A mountain rescue team uncovers a signal that should not exist in the snow.",
    year: 2021,
    rating: "TV-14",
    duration: "2h 02m",
    match: 88,
    genres: ["Thriller", "Adventure"],
    cast: ["Milo Trent", "Sana Noor", "Iris Vale"],
    poster: "linear-gradient(160deg, #0f172a 0%, #334155 50%, #22d3ee 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(51,65,85,.55) 55%, rgba(34,211,238,.18) 100%)",
  },
  {
    id: "second-city",
    title: "Second City",
    kind: "series",
    visibleTo: ["sam", "jordan"],
    synopsis: "A group of old friends tries to relaunch their lives after a decade of bad timing.",
    year: 2025,
    rating: "TV-14",
    duration: "1h 47m",
    match: 87,
    genres: ["Comedy", "Drama"],
    cast: ["Lena Moss", "Omar Key", "Bea Rivers"],
    poster: "linear-gradient(160deg, #111827 0%, #0ea5e9 45%, #f43f5e 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 12%, rgba(14,165,233,.5) 55%, rgba(244,63,94,.18) 100%)",
    episodes: [
      { number: 1, title: "Pilot Season", duration: "32m", synopsis: "The friends reunite to save a neighborhood bar from a new lease." },
      { number: 2, title: "Soft Launch", duration: "30m", synopsis: "A bad pitch meeting turns into an accidental viral moment." },
      { number: 3, title: "Second Chances", duration: "31m", synopsis: "Everyone gets one more shot at the plan they thought they had outgrown." },
    ],
    trending: true,
    isNew: true,
  },
  {
    id: "moonlit-letters",
    title: "Moonlit Letters",
    visibleTo: ["jordan", "sam"],
    synopsis: "Anonymous messages lead two strangers through the architecture of a long lost love.",
    year: 2020,
    rating: "PG-13",
    duration: "1h 55m",
    match: 86,
    genres: ["Romance", "Drama"],
    cast: ["Nina Hart", "Dylan Cruz", "Mae Sterling"],
    poster: "linear-gradient(160deg, #312e81 0%, #6366f1 52%, #f472b6 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(99,102,241,.5) 55%, rgba(244,114,182,.18) 100%)",
  },
  {
    id: "wild-atlas",
    title: "Wild Atlas",
    kind: "series",
    visibleTo: ["kiddo"],
    synopsis: "A panoramic expedition series following a team mapping the world’s last hidden places.",
    year: 2024,
    rating: "PG",
    duration: "3h 12m",
    match: 85,
    genres: ["Adventure", "Family"],
    cast: ["Kai Mercer", "Ivy Stone", "Rory Hale"],
    poster: "linear-gradient(160deg, #065f46 0%, #0f766e 50%, #22c55e 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(6,95,70,.55) 55%, rgba(34,197,94,.18) 100%)",
    episodes: [
      { number: 1, title: "Uncharted", duration: "41m", synopsis: "The team traces the edge of a map nobody believed existed." },
      { number: 2, title: "Green Line", duration: "43m", synopsis: "A lost river route reveals a city hidden beneath the canopy." },
      { number: 3, title: "Last Light Camp", duration: "44m", synopsis: "Night falls on the expedition as the crew makes camp on the border of a glacier." },
    ],
  },
  {
    id: "future-perfect",
    title: "Future Perfect",
    kind: "movie",
    visibleTo: ["alex"],
    synopsis: "A speculative newsroom predicts tomorrow accurately, and then gets trapped inside it.",
    year: 2025,
    rating: "TV-MA",
    duration: "2h 06m",
    match: 95,
    genres: ["Sci-Fi", "Thriller", "Drama"],
    cast: ["Anya Slate", "Noah Pike", "Reid Sun"],
    poster: "linear-gradient(160deg, #0f172a 0%, #2563eb 50%, #06b6d4 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(37,99,235,.52) 55%, rgba(6,182,212,.18) 100%)",
    trending: true,
    isNew: true,
  },
  {
    id: "tiny-heroes",
    title: "Tiny Heroes",
    kind: "series",
    visibleTo: ["kiddo"],
    synopsis: "A crew of miniature adventurers protects a backyard kingdom from larger-than-life trouble.",
    year: 2023,
    rating: "PG",
    duration: "1h 36m",
    match: 84,
    genres: ["Animation", "Family", "Adventure"],
    cast: ["Mina Bell", "Toby Fox", "June Park"],
    poster: "linear-gradient(160deg, #7c3aed 0%, #ec4899 50%, #f59e0b 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(124,58,237,.5) 55%, rgba(245,158,11,.18) 100%)",
    episodes: [
      { number: 1, title: "Pocket Kingdom", duration: "23m", synopsis: "The heroes discover that the backyard fence is actually a border wall." },
      { number: 2, title: "The Garden Giant", duration: "24m", synopsis: "A towering obstacle becomes a surprisingly friendly neighbor." },
      { number: 3, title: "Moonbeam Patrol", duration: "25m", synopsis: "The tiny crew takes an overnight mission to recover a stolen lantern." },
    ],
  },
  {
    id: "below-zero",
    title: "Below Zero",
    visibleTo: ["alex", "jordan"],
    synopsis: "A forensic analyst and a pilot chase a vanished research team through the arctic dark.",
    year: 2022,
    rating: "TV-14",
    duration: "2h 00m",
    match: 83,
    genres: ["Thriller", "Crime"],
    cast: ["Harper Quinn", "Leo Moss", "Sia North"],
    poster: "linear-gradient(160deg, #111827 0%, #1e3a8a 50%, #22d3ee 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(30,58,138,.55) 55%, rgba(34,211,238,.18) 100%)",
  },
  {
    id: "quiet-wire",
    title: "Quiet Wire",
    visibleTo: ["alex"],
    synopsis: "A repair tech hears conversations inside the city grid and follows the sound home.",
    year: 2021,
    rating: "PG-13",
    duration: "1h 53m",
    match: 82,
    genres: ["Sci-Fi", "Drama"],
    cast: ["Vera Cole", "Jon Park", "Elle Hart"],
    poster: "linear-gradient(160deg, #0f172a 0%, #64748b 50%, #38bdf8 100%)",
    backdrop: "linear-gradient(110deg, rgba(2,6,23,.95) 10%, rgba(100,116,139,.55) 55%, rgba(56,189,248,.18) 100%)",
  },
];

export const getTitle = (id: string): Title | undefined => TITLES.find((title) => title.id === id);

export const isTitleVisibleToProfile = (title: Title, profileId: ProfileId) =>
  title.visibleTo.includes(profileId);

export const visibleTitlesForProfile = (profileId: ProfileId) =>
  TITLES.filter((title) => isTitleVisibleToProfile(title, profileId));

export const getRowTitles = ({
  profileId,
  kind,
  genres,
  allowedGenres,
}: {
  profileId: ProfileId;
  kind?: "trending" | "top10" | "new";
  genres?: string[];
  allowedGenres?: string[];
}): Title[] => {
  const genreFilter = genres?.length ? genres : allowedGenres;
  const matchesGenre = (title: Title) =>
    isTitleVisibleToProfile(title, profileId) &&
    (!genreFilter || title.genres.some((genre) => genreFilter.includes(genre)));

  let items = TITLES.filter(matchesGenre);

  if (kind === "trending") {
    items = items.filter((title) => title.trending);
  } else if (kind === "top10") {
    items = [...items].sort((left, right) => right.match - left.match).slice(0, 10);
  } else if (kind === "new") {
    items = items.filter((title) => title.isNew);
  }

  return [...items].sort((left, right) => right.match - left.match || right.year - left.year);
};

export const searchTitles = (
  query: string,
  profileId: ProfileId,
  allowedGenres?: string[],
): Title[] => {
  const normalized = query.trim().toLowerCase();
  const genreFilter = allowedGenres?.length ? allowedGenres : undefined;

  return TITLES.filter((title) => {
    const matchesVisibility = isTitleVisibleToProfile(title, profileId);
    const matchesGenre = !genreFilter || title.genres.some((genre) => genreFilter.includes(genre));
    const haystack = [title.title, title.synopsis, title.cast.join(" "), title.genres.join(" ")]
      .join(" ")
      .toLowerCase();
    return matchesVisibility && matchesGenre && (!normalized || haystack.includes(normalized));
  }).sort((left, right) => right.match - left.match || right.year - left.year);
};