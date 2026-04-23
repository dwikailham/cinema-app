"use client";

import { useRouter } from "next/navigation";
import { Clock, Star, ChevronRight, Ticket } from "lucide-react";
import type { Movie } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();

  const lowestPrice = Math.min(...movie.showtimes.map((st) => st.basePrice));

  return (
    <Card
      hoverable
      className="group relative overflow-hidden bg-[#12121c]/50 backdrop-blur-sm border-[#2a2a3e] hover:border-[#e63946]/40 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
      onClick={() => router.push(`/movies/${movie.id}`)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-[#1e1e2e]">
        {/* Glow & Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-90 z-10" />
        <div className="absolute inset-0 bg-[#e63946]/0 group-hover:bg-[#e63946]/5 transition-colors duration-500 z-10" />
        
        {/* Image Placeholder Visual */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
          <div className="w-20 h-20 bg-[#e63946]/10 rounded-full flex items-center justify-center border border-[#e63946]/20 mb-4 group-hover:scale-110 transition-transform duration-500">
            <Star size={32} className="text-[#e63946]" />
          </div>
          <p className="text-[#f1f1f8] font-black text-xl leading-tight group-hover:scale-105 transition-transform duration-500">
            {movie.title}
          </p>
        </div>

        {/* Real image if available would go here */}
        {/* <img src={movie.posterPlaceholder} ... /> */}

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5 shadow-xl">
            <Star size={12} className="text-[#ffd166] fill-[#ffd166]" />
            <span className="text-xs font-bold text-white">{movie.rating}</span>
          </div>
        </div>
        
        {/* Genre Badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="px-3 py-1 bg-[#e63946] rounded-lg shadow-lg">
            <span className="text-xs font-black uppercase tracking-wider text-white">{movie.genre}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-8 space-y-5 relative z-20 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-[#f1f1f8] leading-tight group-hover:text-[#e63946] transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-sm text-[#a0a0b8] line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-[#a0a0b8]">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#6b6b88]" />
              <span className="text-sm font-bold">{movie.duration} mins</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#6b6b88] font-black uppercase tracking-[0.2em] block mb-1">Starting from</span>
              <span className="text-[#ffd166] font-black text-2xl">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(lowestPrice)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2a3e] flex items-center justify-between group/btn">
            <span className="text-xs font-bold text-[#e63946] uppercase tracking-widest">Available Now</span>
            <div className="w-8 h-8 rounded-full bg-[#e63946]/10 flex items-center justify-center text-[#e63946] group-hover:bg-[#e63946] group-hover:text-white transition-all duration-300">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
