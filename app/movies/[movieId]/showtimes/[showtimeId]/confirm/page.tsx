"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, CheckCircle, Ticket, Info, AlertTriangle } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PriceBreakdown } from "@/components/pricing/PriceBreakdown";
import { calculatePricing, formatPrice } from "@/lib/pricing";
import type { Movie, Showtime, Seat, Booking } from "@/types";

interface ConfirmBookingPageProps {
  params: Promise<{ movieId: string; showtimeId: string }>;
}

export default function ConfirmBookingPage({ params }: ConfirmBookingPageProps) {
  const { movieId, showtimeId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const seatIds = searchParams.get("seats")?.split(",") || [];

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (seatIds.length === 0) {
      router.replace(`/movies/${movieId}/showtimes/${showtimeId}/seats`);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/movies/${movieId}/showtimes/${showtimeId}/seats`);
        const data = await res.json();

        if (data.success) {
          setShowtime(data.data.showtime);
          const allSeats = data.data.layout.seats as Seat[];
          const filtered = allSeats.filter((s) => seatIds.includes(s.id));
          setSelectedSeats(filtered);
        } else {
          setError(data.error || "Failed to load layout");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [movieId, showtimeId, seatIds.length]);

  async function handleConfirm() {
    setIsConfirming(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          showtimeId,
          seatIds,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Success!
        router.push("/bookings?success=true");
      } else {
        setError(data.error || "Failed to confirm booking. Seats might have been taken.");
      }
    } catch (err) {
      setError("An unexpected error occurred during confirmation.");
    } finally {
      setIsConfirming(false);
    }
  }

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
        <AlertTriangle size={48} className="text-red-500" />
        <h3 className="text-xl font-bold text-[#f1f1f8]">{error || "Data not found"}</h3>
        <Button onClick={() => router.push(`/movies/${movieId}/showtimes/${showtimeId}/seats`)}>
          Back to Seat Selection
        </Button>
      </div>
    );
  }

  const pricing = calculatePricing(
    selectedSeats,
    showtime.basePrice,
    showtime.date,
    showtime.time
  );

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-[#e63946]/10 rounded-full flex items-center justify-center border border-[#e63946]/20 mb-2">
            <CheckCircle size={32} className="text-[#e63946]" />
          </div>
          <h1 className="text-3xl font-black text-[#f1f1f8] tracking-tight">Review Your Booking</h1>
          <p className="text-[#a0a0b8]">Please double-check your order details before confirming</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Summary */}
          <div className="space-y-6">
            <div className="bg-[#12121c]/50 backdrop-blur-sm border border-[#2a2a3e] rounded-2xl p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-xs text-[#e63946] font-black uppercase tracking-widest">Movie</p>
                <h2 className="text-2xl font-bold text-[#f1f1f8]">{showtime.movieTitle}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a2a3e]">
                <div className="space-y-1">
                  <p className="text-xs text-[#6b6b88] font-bold uppercase tracking-widest">Date</p>
                  <p className="text-[#f1f1f8] font-medium">{showtime.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#6b6b88] font-bold uppercase tracking-widest">Time</p>
                  <p className="text-[#f1f1f8] font-medium">{showtime.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#6b6b88] font-bold uppercase tracking-widest">Studio</p>
                  <p className="text-[#f1f1f8] font-medium">{showtime.studioId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#6b6b88] font-bold uppercase tracking-widest">Seats</p>
                  <p className="text-[#e63946] font-bold">{seatIds.join(", ")}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2a2a3e] flex items-start gap-3">
                <Info size={16} className="text-[#a0a0b8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#a0a0b8] leading-relaxed italic">
                  Note: Bookings are final. Please ensure the showtime and seat numbers are correct.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.back()}
              disabled={isConfirming}
            >
              <ChevronLeft size={18} />
              Change Selection
            </Button>
          </div>

          {/* Right: Pricing & Confirm */}
          <div className="space-y-6">
            <PriceBreakdown breakdown={pricing} seatCount={seatIds.length} />

            <Button
              className="w-full h-16 text-xl font-black shadow-lg shadow-[#e63946]/20"
              onClick={handleConfirm}
              isLoading={isConfirming}
            >
              <Ticket size={24} />
              Confirm & Book Now
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
