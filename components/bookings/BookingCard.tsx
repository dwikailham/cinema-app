"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Film, MapPin, Ticket, Trash2 } from "lucide-react";
import type { Booking } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface BookingCardProps {
  booking: Booking;
  onCancelled: (bookingId: string) => void;
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Cancel this booking? Seats will be released.")) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        onCancelled(booking.id);
        router.refresh();
      } else {
        alert(data.error ?? "Failed to cancel booking.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <Card className="p-5 flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center shrink-0">
            <Film size={18} className="text-[#e63946]" />
          </div>
          <div>
            <h3 className="font-bold text-[#f1f1f8] text-sm leading-tight">
              {booking.movieTitle}
            </h3>
            <p className="text-xs text-[#6b6b88] mt-0.5">
              Booking #{booking.id.split("-").pop()}
            </p>
          </div>
        </div>
        <Badge
          label={booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
          variant={booking.status === "confirmed" ? "status-confirmed" : "status-cancelled"}
        />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-[#6b6b88] shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b88] uppercase tracking-wide">Date</p>
            <p className="text-xs text-[#f1f1f8] font-medium">
              {formatDate(booking.showtimeDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#6b6b88] shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b88] uppercase tracking-wide">Time</p>
            <p className="text-xs text-[#f1f1f8] font-medium">{booking.showtimeTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-[#6b6b88] shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b88] uppercase tracking-wide">Studio</p>
            <p className="text-xs text-[#f1f1f8] font-medium capitalize">
              {booking.studioId.replace("-", " ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Ticket size={13} className="text-[#6b6b88] shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b88] uppercase tracking-wide">Seats</p>
            <p className="text-xs text-[#f1f1f8] font-medium">
              {booking.seatIds.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Price & action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#2a2a3e]">
        <div>
          <p className="text-[10px] text-[#6b6b88] uppercase tracking-wide">Total Paid</p>
          <p className="text-base font-bold text-[#ffd166]">
            {formatIDR(booking.totalPrice)}
          </p>
        </div>
        {booking.status === "confirmed" && (
          <Button
            variant="danger"
            size="sm"
            isLoading={isCancelling}
            onClick={handleCancel}
          >
            <Trash2 size={13} />
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}
