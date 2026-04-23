import fs from "fs";
import path from "path";
import type { Movie } from "@/types";

let _moviesCache: Movie[] | null = null;

function loadMovies(): Movie[] {
  if (_moviesCache) return _moviesCache;
  const filePath = path.join(process.cwd(), "data", "movies.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _moviesCache = JSON.parse(raw) as Movie[];
  return _moviesCache;
}

export function getAllMovies(): Movie[] {
  return loadMovies();
}

export function getMovieById(movieId: string): Movie | null {
  const movies = loadMovies();
  return movies.find((m) => m.id === movieId) ?? null;
}

export function getAllGenres(): string[] {
  const movies = loadMovies();
  const genreSet = new Set(movies.map((m) => m.genre));
  return Array.from(genreSet).sort();
}

export function filterMovies(genre?: string, query?: string): Movie[] {
  let movies = loadMovies();
  if (genre) {
    movies = movies.filter(
      (m) => m.genre.toLowerCase() === genre.toLowerCase()
    );
  }
  if (query) {
    const lowerQuery = query.toLowerCase();
    movies = movies.filter((m) =>
      m.title.toLowerCase().includes(lowerQuery)
    );
  }
  return movies;
}
