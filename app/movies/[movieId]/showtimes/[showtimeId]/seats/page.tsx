"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, Armchair, ArrowRight } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SeatMap } from "@/components/seats/SeatMap";
import { CountdownTimer } from "@/components/seats/CountdownTimer";
import { PriceBreakdown } from "@/components/pricing/PriceBreakdown";
import { calculatePricing } from "@/lib/pricing";
import { validateGapRule } from "@/lib/gapRule";
import type { Movie, Showtime, Seat, PriceBreakdown as PriceBreakdownType } from "@/types";

interface SeatSelectionPageProps {
  params: Promise<{ movieId: string; showtimeId: string }>;
}

export default function SeatSelectionPage({ params }: SeatSelectionPageProps) {
  const { movieId, showtimeId } = use(params);
  const router = useRouter();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [gapError, setGapError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/movies/${movieId}/showtimes/${showtimeId}/seats`);
        const data = await res.json();

        if (data.success) {
          setMovie(data.data.showtime.movie); // Assuming API returns this or I can use the ID
          setShowtime(data.data.showtime);
          setSeats(data.data.layout.seats);
          setSeatsPerRow(data.data.layout.seatsPerRow);
        } else {
          setError(data.error || "Failed to load seat layout");
        }
      } catch (err) {
        setError("An error occurred while fetching layout");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [movieId, showtimeId]);

  const handleToggleSeat = (seatId: string) => {
    setGapError("");
    setSelectedSeatIds((prev) => {
      const next = prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId];
      
      // Client-side gap rule validation for immediate feedback
      if (next.length > 0) {
        const result = validateGapRule(seats, next, seatsPerRow);
        if (!result.valid) {
          setGapError(result.message || "Gap rule violation");
        }
      }
      
      return next;
    });
  };

  const handleProceed = () => {
    if (selectedSeatIds.length === 0) return;
    
    const result = validateGapRule(seats, selectedSeatIds, seatsPerRow);
    if (!result.valid) {
      setGapError(result.message || "Gap rule violation");
      return;
    }

    // Pass selected seats to confirmation page via state/session or URL (URL is easier for refresh)
    const seatsParam = selectedSeatIds.join(",");
    router.push(`/movies/${movieId}/showtimes/${showtimeId}/confirm?seats=${seatsParam}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !showtime) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <h3 className="text-xl font-bold text-red-400">{error || "Data not found"}</h3>
        <Button onClick={() => router.push(`/movies/${movieId}`)}>Back</Button>
      </div>
    );
  }

  // Calculate real-time pricing
  const selectedSeatObjects = seats.filter((s) => selectedSeatIds.includes(s.id));
  const pricingBreakdown = calculatePricing(
    selectedSeatObjects,
    showtime.basePrice,
    showtime.date,
    showtime.time
  );

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button
              onClick={() => router.push(`/movies/${movieId}`)}
              className="flex items-center gap-2 text-[#a0a0b8] hover:text-[#f1f1f8] transition-colors mb-2"
            >
              <ChevronLeft size={16} />
              <span className="text-sm">Back to Movie</span>
            </button>
            <h1 className="text-3xl font-black text-[#f1f1f8]">Select Your Seats</h1>
            <p className="text-[#6b6b88] text-sm">
              {showtime.date} at <span className="text-[#ffd166] font-bold">{showtime.time}</span> • Studio {showtime.studioId}
            </p>
          </div>

          <CountdownTimer 
            showtimeId={showtimeId} 
            movieId={movieId} 
            onExpire={() => setSelectedSeatIds([])} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Seat Map */}
          <div className="xl:col-span-8 space-y-6">
            <div className="bg-[#12121c]/30 rounded-[2.5rem] border border-[#2a2a3e] p-6 md:p-12 overflow-x-auto no-scrollbar relative">
              {/* Screen Visual */}
              <div className="max-w-md mx-auto mb-16 relative">
                <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#3a3a52] to-transparent rounded-full shadow-[0_10px_30px_rgba(230,57,70,0.2)]" />
                <p className="text-xs text-[#6b6b88] font-bold uppercase tracking-[0.2em] text-center mt-4">Screen This Way</p>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-[#e63946]/5 to-transparent blur-3xl" />
              </div>

              <div className="min-w-fit flex justify-center">
                <SeatMap
                  seats={seats}
                  selectedSeats={selectedSeatIds}
                  onToggleSeat={handleToggleSeat}
                  seatsPerRow={seatsPerRow}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-4 bg-[#12121c]/20 rounded-2xl border border-[#2a2a3e]/50">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#22c55e]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#a0a0b8]">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#3b82f6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#a0a0b8]">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#374151]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#a0a0b8]">Booked</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Selection Summary */}
          <div className="xl:col-span-4 space-y-6">
            {/* Selection Summary */}
            <div className="bg-[#12121c]/50 backdrop-blur-sm border border-[#2a2a3e] rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#f1f1f8] flex items-center gap-2">
                <Armchair size={18} className="text-[#e63946]" />
                Your Selection
              </h3>
              
              {selectedSeatIds.length === 0 ? (
                <p className="text-sm text-[#6b6b88] italic">No seats selected yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeatObjects
                    .sort((a, b) => a.id.localeCompare(b.id))
                    .map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1 bg-[#e63946]/10 border border-[#e63946]/30 rounded-lg text-sm font-bold text-[#e63946]"
                      >
                        {s.id}
                      </span>
                    ))}
                </div>
              )}

              {gapError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300">
                  <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400 leading-tight font-medium">
                    {gapError}
                  </p>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <PriceBreakdown 
              breakdown={pricingBreakdown} 
              seatCount={selectedSeatIds.length} 
            />

            {/* Action */}
            <Button
              className="w-full h-14 text-lg font-black tracking-tight"
              disabled={selectedSeatIds.length === 0 || !!gapError}
              onClick={handleProceed}
            >
              <span>Review Booking</span>
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
