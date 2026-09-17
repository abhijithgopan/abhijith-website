export interface Movie {
  title: string;
  rating: number;
  date: string;
  link: string;
  poster: string;
}

export const letterboxdFallback: Movie[] = [
  {
    title: "Vishwanath & Sons",
    rating: 3,
    date: "2026-09-11",
    link: "https://letterboxd.com/abhijithgopan/film/vishwanath-sons/",
    poster: "",
  },
  {
    title: "DC",
    rating: 3,
    date: "2026-09-04",
    link: "https://letterboxd.com/abhijithgopan/film/dc/",
    poster: "",
  },
  {
    title: "I, Nobody",
    rating: 2,
    date: "2026-08-30",
    link: "https://letterboxd.com/abhijithgopan/film/i-nobody/",
    poster: "",
  },
  {
    title: "Con City",
    rating: 2.5,
    date: "2026-08-24",
    link: "https://letterboxd.com/abhijithgopan/film/con-city/",
    poster: "",
  },
];

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeHtml(match[1].trim()) : "";
}

export async function getRecentMovies(limit = 4): Promise<Movie[]> {
  try {
    const response = await fetch("https://letterboxd.com/abhijithgopan/rss/", {
      cf: { cacheTtl: 600, cacheEverything: true },
      signal: AbortSignal.timeout(4000),
    } as RequestInit);
    if (!response.ok) return letterboxdFallback.slice(0, limit);

    const xml = await response.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

    const movies = items
      .map((item): Movie | null => {
        const title = extractTag(item, "letterboxd:filmTitle");
        const rating = Number(extractTag(item, "letterboxd:memberRating"));
        const date = extractTag(item, "letterboxd:watchedDate");
        const link = extractTag(item, "link");
        const description = extractTag(item, "description");
        const posterMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);

        if (!title || !date || !Number.isFinite(rating) || !link) return null;
        return { title, rating, date, link, poster: posterMatch?.[1] ?? "" };
      })
      .filter((movie): movie is Movie => movie !== null)
      .slice(0, limit);

    return movies.length === limit ? movies : letterboxdFallback.slice(0, limit);
  } catch {
    return letterboxdFallback.slice(0, limit);
  }
}

export function ratingStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 === 0.5 ? "½" : "";
  return "★".repeat(fullStars) + halfStar;
}

export function formatMovieDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(year, month - 1, day);
  return value.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
