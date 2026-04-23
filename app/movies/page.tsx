"use client";

import { useEffect, useState } from "react";
import { Film, Search as SearchIcon, Filter } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { MovieCard } from "@/components/movies/MovieCard";
import { SearchBar } from "@/components/movies/SearchBar";
import { GenreFilter } from "@/components/movies/GenreFilter";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import type { Movie } from "@/types";

export default function MovieListingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set("q", search);
        if (genre) query.set("genre", genre);

        const res = await fetch(`/api/movies?${query.toString()}`);
        const data = await res.json();

        if (data.success) {
          setMovies(data.data.movies);
          setGenres(data.data.genres);
        } else {
          setError("Failed to load movies");
        }
      } catch (err) {
        setError("An error occurred while fetching movies");
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(fetchMovies, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [search, genre]);

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 md:py-16 space-y-16 md:space-y-24">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gradient-to-br from-[#12121c] via-[#0a0a0f] to-[#12121c] p-6 md:p-10 rounded-[2rem] border border-[#2a2a3e] shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e63946]/5 blur-[100px] -mr-48 -mt-48 group-hover:bg-[#e63946]/10 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e63946]/10 rounded-full border border-[#e63946]/20 backdrop-blur-md">
              <Film size={14} className="text-[#e63946]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#e63946]">Premiere Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#f1f1f8] leading-[1.1]">
              Experience Cinema <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] to-[#ff6b6b]">
                Like Never Before
              </span>
            </h1>
            <p className="text-[#a0a0b8] text-sm md:text-lg max-w-md leading-relaxed">
              Book the best seats for the latest blockbusters in premium studios with high-fidelity sound.
            </p>
          </div>

          <div className="relative z-10 w-full lg:w-[450px] glass-card p-3 rounded-2xl border-[#3a3a52]/30 mt-10 lg:mt-0 shadow-2xl">
            <SearchBar value={search} onChange={setSearch} placeholder="Search for blockbusters..." />
          </div>
        </div>

        {/* Filters Area */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1e1e2e] flex items-center justify-center border border-[#3a3a52] shadow-lg">
                <Filter size={20} className="text-[#a0a0b8]" />
              </div>
              <h2 className="text-2xl font-black text-[#f1f1f8] tracking-tight">Browse Genres</h2>
            </div>
            <p className="text-xs text-[#6b6b88] font-black uppercase tracking-[0.2em] bg-[#12121c] px-4 py-2 rounded-full border border-[#2a2a3e]">
              {movies.length} Movies Found
            </p>
          </div>
          <div className="bg-[#12121c]/50 p-2 rounded-2xl border border-[#2a2a3e] inline-block max-w-full overflow-x-auto no-scrollbar shadow-inner">
            <GenreFilter genres={genres} selected={genre} onSelect={setGenre} />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e63946]/20 blur-xl rounded-full animate-pulse" />
              <LoadingSpinner size="lg" />
            </div>
            <p className="text-[#6b6b88] font-bold tracking-widest uppercase text-xs animate-pulse">Synchronizing Data</p>
          </div>
        ) : error ? (
          <div className="text-center py-32 glass-card border-red-500/20 max-w-md mx-auto">
            <p className="text-red-400 font-medium">{error}</p>
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-32 space-y-6 bg-[#12121c]/20 rounded-[2rem] border border-[#2a2a3e] border-dashed">
            <div className="w-20 h-20 bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto border border-[#3a3a52] shadow-xl">
              <SearchIcon size={32} className="text-[#6b6b88]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#f1f1f8]">No matches found</h3>
              <p className="text-[#6b6b88] max-w-xs mx-auto">
                We couldn't find any movies matching your current filters. Try resetting your search.
              </p>
              <Button variant="secondary" size="sm" onClick={() => {setSearch(""); setGenre("");}} className="mt-4">
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {movies.map((movie, idx) => (
              <div 
                key={movie.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
