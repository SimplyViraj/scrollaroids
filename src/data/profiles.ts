export type ProfileId = "alex" | "jordan" | "sam" | "kiddo";
export interface Profile {
  id: ProfileId;
  name: string;
  avatarColor: string; // hex/gradient for avatar
  initial: string;
  isKids?: boolean;
  tagline: string;
  genres: string[];
  rows: { title: string; genres?: string[]; kind?: "trending" | "top10" | "new" }[];
}

export const PROFILES: Profile[] = [
  {
    id: "firstyear",
    name: "First Year",
    initial: "1st Year",
    avatarColor: "linear-gradient(135deg, #2563eb, #7c3aed)",
    tagline: "Action. Sci-fi. Adrenaline.",
    genres: ["Action", "Sci-Fi", "Thriller"],
    rows: [
      { title: "Trending Now", kind: "trending" },
      { title: "Top 10 in Your Country", kind: "top10" },
      { title: "Explosive Action", genres: ["Action"] },
      { title: "Mind-Bending Sci-Fi", genres: ["Sci-Fi"] },
      { title: "Edge-of-Your-Seat Thrillers", genres: ["Thriller"] },
      { title: "New Releases", kind: "new" },
    ],
  },
  {
    id: "jordan",
    name: "Jordan",
    initial: "J",
    avatarColor: "linear-gradient(135deg, #16a34a, #0891b2)",
    tagline: "Stories that move you.",
    genres: ["Drama", "Thriller", "Crime"],
    rows: [
      { title: "Trending Now", kind: "trending" },
      { title: "Critically Acclaimed Dramas", genres: ["Drama"] },
      { title: "True Crime Obsessions", genres: ["Crime"] },
      { title: "Top 10 Today", kind: "top10" },
      { title: "Slow Burn Thrillers", genres: ["Thriller"] },
      { title: "New Releases", kind: "new" },
    ],
  },
  {
    id: "sam",
    name: "Sam",
    initial: "S",
    avatarColor: "linear-gradient(135deg, #f59e0b, #ef4444)",
    tagline: "Laugh out loud, always.",
    genres: ["Comedy", "Animation", "Romance"],
    rows: [
      { title: "Trending Now", kind: "trending" },
      { title: "Laugh Out Loud", genres: ["Comedy"] },
      { title: "Animated Favorites", genres: ["Animation"] },
      { title: "Feel-Good Romance", genres: ["Romance"] },
      { title: "Top 10 Comedies", kind: "top10" },
      { title: "New Releases", kind: "new" },
    ],
  },
  {
    id: "kiddo",
    name: "Kiddo",
    initial: "K",
    avatarColor: "linear-gradient(135deg, #fbbf24, #f97316)",
    isKids: true,
    tagline: "Just for kids!",
    genres: ["Family", "Animation", "Adventure"],
    rows: [
      { title: "Family Favorites", genres: ["Family"] },
      { title: "Cartoons & Animation", genres: ["Animation"] },
      { title: "Big Adventures", genres: ["Adventure"] },
      { title: "Top 10 for Kids", kind: "top10" },
    ],
  },
];

export const getProfile = (id: string): Profile | undefined =>
  PROFILES.find((p) => p.id === id);
