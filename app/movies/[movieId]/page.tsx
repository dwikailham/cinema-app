"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Star, Film, ChevronLeft, Info, Ticket } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Movie } from "@/types";

interface MovieDetailPageProps {
  params: Promise<{ movieId: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { movieId } = use(params);
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();

        if (data.success) {
          setMovie(data.data);
        } else {
          setError(data.error || "Failed to load movie details");
        }
      } catch (err) {
        setError("An error occurred while fetching movie details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <Info size={24} className="text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-[#f1f1f8]">{error || "Movie not found"}</h3>
        <Button variant="secondary" onClick={() => router.push("/movies")}>
          Back to Movies
        </Button>
      </div>
    );
  }

  // Group showtimes by date
  const showtimesByDate = movie.showtimes.reduce((acc, st) => {
    if (!acc[st.date]) acc[st.date] = [];
    acc[st.date].push(st);
    return acc;
  }, {} as Record<string, typeof movie.showtimes>);

  return (
    <AuthGuard>
      <div className="relative min-h-screen">
        {/* Cinematic Backdrop */}
        <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/80 to-[#0a0a0f] z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="w-full h-full bg-[#1e1e2e] flex items-center justify-center">
             <Film size={200} className="text-[#e63946]/5" />
          </div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Back Button */}
          <button
            onClick={() => router.push("/movies")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#12121c]/50 backdrop-blur-md rounded-full border border-white/5 text-[#a0a0b8] hover:text-[#f1f1f8] transition-all group hover:bg-[#12121c]/80"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Movies</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Movie Poster & Basic Info */}
            <div className="lg:col-span-4 space-y-8">
              <div className="relative aspect-[2/3] bg-gradient-to-br from-[#1e1e2e] to-[#2a2a3e] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <div className="w-24 h-24 bg-[#e63946]/10 rounded-3xl flex items-center justify-center border border-[#e63946]/20 group-hover:scale-110 transition-transform duration-700 shadow-[0_0_30px_rgba(230,57,70,0.2)]">
                    <Film size={48} className="text-[#e63946]" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-[#f1f1f8] font-black text-2xl leading-tight">
                      {movie.title}
                    </h2>
                    <p className="text-[#e63946] text-xs font-bold uppercase tracking-widest mt-2">{movie.genre}</p>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5 shadow-xl">
                    <Star size={14} className="text-[#ffd166] fill-[#ffd166]" />
                    <span className="text-sm font-bold text-white">{movie.rating}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[#a0a0b8]">
                    <div className="w-8 h-8 rounded-lg bg-[#0a0a0f] flex items-center justify-center border border-white/5">
                      <Clock size={16} />
                    </div>
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <span className="text-[#f1f1f8] font-bold">{movie.duration} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[#a0a0b8]">
                    <div className="w-8 h-8 rounded-lg bg-[#0a0a0f] flex items-center justify-center border border-white/5">
                      <Star size={16} />
                    </div>
                    <span className="text-sm font-medium">Score</span>
                  </div>
                  <span className="text-[#ffd166] font-black">{movie.rating}</span>
                </div>
                <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                   <Info size={16} className="text-[#e63946]" />
                   <p className="text-xs text-[#6b6b88] leading-tight uppercase font-black tracking-wider">Available in Dolby Atmos</p>
                </div>
              </div>
            </div>

            {/* Right Column: Synopsis & Showtime Selection */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e63946]/10 rounded-full border border-[#e63946]/20 backdrop-blur-md">
                  <Ticket size={14} className="text-[#e63946]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e63946]">Now Booking</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#f1f1f8] leading-[0.9]">
                  {movie.title}
                </h1>
                <p className="text-lg md:text-xl text-[#a0a0b8] leading-relaxed max-w-3xl">
                  {movie.synopsis}
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#e63946] to-[#ff6b6b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e63946]/20">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#f1f1f8]">Select Showtime</h2>
                    <p className="text-sm text-[#6b6b88] uppercase font-bold tracking-wider">Choose your preferred date and time</p>
                  </div>
                </div>

                <div className="space-y-12">
                  {Object.entries(showtimesByDate).map(([date, times]) => {
                    const dateObj = new Date(date);
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    });

                    return (
                      <div key={date} className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-4">
                          <h3 className="text-[#f1f1f8] font-bold text-lg">
                            {formattedDate}
                          </h3>
                          <div className="h-px flex-1 bg-gradient-to-r from-[#2a2a3e] to-transparent" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                          {times.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => router.push(`/movies/${movie.id}/showtimes/${st.id}/seats`)}
                              className="group relative p-6 bg-[#12121c]/40 border border-[#2a2a3e] rounded-2xl text-center transition-all duration-300 hover:border-[#e63946]/50 hover:bg-[#e63946]/5 hover:-translate-y-1"
                            >
                              <span className="block text-2xl font-black text-[#f1f1f8] group-hover:text-[#e63946] transition-colors mb-1">
                                {st.time}
                              </span>
                              <span className="block text-xs text-[#6b6b88] font-bold uppercase tracking-wider group-hover:text-[#a0a0b8] transition-colors">
                                From {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(st.basePrice)}
                              </span>
                              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#e63946]/20 rounded-2xl transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
