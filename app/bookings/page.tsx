"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ticket, Calendar, Clock, Armchair, Trash2, Info, CheckCircle, ArrowRight } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatPrice } from "@/lib/pricing";
import type { Booking } from "@/types";

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings/my");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        setError("Failed to load bookings");
      }
    } catch (err) {
      setError("An error occurred while fetching bookings");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        // Refresh local state
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
        );
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch (err) {
      alert("An error occurred during cancellation");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12 animate-in fade-in duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Ticket size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Your Ticket Wallet</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#f1f1f8] tracking-tight leading-[0.9]">My <br /><span className="text-[#e63946]">Bookings</span></h1>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#12121c]/50 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="text-right">
              <p className="text-[10px] text-[#6b6b88] font-bold uppercase tracking-widest">Total Reservations</p>
              <p className="text-2xl font-black text-[#f1f1f8]">{bookings.filter(b => b.status === "confirmed").length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <Armchair size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="p-6 bg-gradient-to-r from-green-500/20 to-transparent border border-green-500/30 rounded-[2rem] flex items-center gap-6 text-green-400 animate-in slide-in-from-top-4 duration-500 shadow-2xl shadow-green-500/5">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-green-500/30">
              <CheckCircle size={28} className="animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-black tracking-tight">Booking Confirmed!</p>
              <p className="text-sm opacity-80 font-medium">Your digital tickets are ready. We've sent a copy to your email.</p>
            </div>
            <button 
              onClick={() => router.replace("/bookings")}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
              <LoadingSpinner size="lg" />
            </div>
            <p className="text-[#6b6b88] font-bold tracking-widest uppercase text-xs animate-pulse">Accessing Vault</p>
          </div>
        ) : error ? (
          <div className="text-center py-32 glass-card border-red-500/20 max-w-md mx-auto">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-32 space-y-8 bg-[#12121c]/20 rounded-[3rem] border border-[#2a2a3e] border-dashed">
            <div className="w-24 h-24 bg-[#1e1e2e] rounded-3xl flex items-center justify-center mx-auto border border-[#3a3a52] shadow-2xl -rotate-6">
              <Ticket size={40} className="text-[#6b6b88]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-[#f1f1f8] tracking-tight">Your wallet is empty</h3>
              <p className="text-[#6b6b88] max-w-sm mx-auto leading-relaxed">
                You haven't made any cinematic reservations yet. Ready to experience the magic of the big screen?
              </p>
            </div>
            <Button size="lg" className="rounded-full px-8 shadow-xl shadow-[#e63946]/20" onClick={() => router.push("/movies")}>
              Explore Now Showing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {bookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking, idx) => (
                <div 
                  key={booking.id} 
                  className={`relative group transition-all duration-500 ${booking.status === "cancelled" ? "opacity-50 grayscale" : ""}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row bg-[#12121c]/60 backdrop-blur-xl border border-[#2a2a3e] rounded-[2rem] overflow-hidden hover:border-[#e63946]/40 transition-colors shadow-xl">
                    {/* Visual Strip */}
                    <div className={`w-full lg:w-24 flex items-center justify-center p-6 lg:p-0 ${booking.status === "confirmed" ? "bg-[#e63946]" : "bg-[#2a2a3e]"}`}>
                       <div className="lg:-rotate-90 flex items-center gap-2">
                         <Ticket size={24} className="text-white/80" />
                         <span className="text-white font-black uppercase tracking-widest text-sm whitespace-nowrap">CineTicket</span>
                       </div>
                    </div>

                    <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 relative">
                      {/* Perforation visual */}
                      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-white/5 border-l border-dashed border-white/20" />
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-black text-[#f1f1f8] tracking-tight leading-none">{booking.movieTitle}</h3>
                            <Badge
                              label={booking.status === "confirmed" ? "Active" : "Cancelled"}
                              variant={booking.status === "confirmed" ? "status-confirmed" : "status-cancelled"}
                              className="text-xs uppercase font-black"
                            />
                          </div>
                          <p className="text-sm text-[#e63946] font-black uppercase tracking-wider">Ref: {booking.id.split("-")[0]}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                          <div className="space-y-1.5">
                            <span className="text-xs font-black uppercase tracking-widest text-[#6b6b88]">Show Date</span>
                            <div className="flex items-center gap-2 text-[#f1f1f8]">
                              <Calendar size={14} className="text-[#e63946]" />
                              <p className="text-sm font-bold">{booking.showtimeDate}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-black uppercase tracking-widest text-[#6b6b88]">Show Time</span>
                            <div className="flex items-center gap-2 text-[#f1f1f8]">
                              <Clock size={14} className="text-[#e63946]" />
                              <p className="text-sm font-bold">{booking.showtimeTime}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-black uppercase tracking-widest text-[#6b6b88]">Reserved Seats</span>
                            <div className="flex items-center gap-2 text-[#f1f1f8]">
                              <Armchair size={14} className="text-[#e63946]" />
                              <p className="text-sm font-bold tracking-tighter">{booking.seatIds.join(", ")}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-6 pt-8 md:pt-0 border-t md:border-t-0 border-white/5">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-[#6b6b88] uppercase tracking-widest font-black mb-1">Total Paid</p>
                          <p className="text-4xl font-black text-[#f1f1f8] tracking-tighter">{formatPrice(booking.totalPrice)}</p>
                        </div>
                        
                        {booking.status === "confirmed" && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="rounded-full px-6 hover:shadow-lg hover:shadow-red-500/20"
                            onClick={() => handleCancel(booking.id)}
                            isLoading={cancellingId === booking.id}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Void Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <div className="flex items-center gap-3 p-4 bg-[#12121c]/50 rounded-2xl border border-[#2a2a3e]">
          <Info size={18} className="text-[#a0a0b8] shrink-0" />
          <p className="text-xs text-[#a0a0b8] leading-relaxed">
            Please arrive at the cinema at least 15 minutes before the showtime. You can present your Booking ID at the counter or use the QR code in your email (simulated).
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <BookingsContent />
    </Suspense>
  );
}