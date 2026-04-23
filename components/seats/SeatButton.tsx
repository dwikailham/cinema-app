"use client";

import type { Seat } from "@/types";

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onToggle: (seatId: string) => void;
}

export function SeatButton({ seat, isSelected, onToggle }: SeatButtonProps) {
  const isBooked = seat.status === "booked";

  let buttonClass =
    "w-8 h-8 sm:w-9 sm:h-9 rounded-t-lg text-xs font-semibold transition-all duration-150 border focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#0a0a0f]";

  if (isBooked) {
    buttonClass +=
      " bg-[#374151] border-[#4b5563] text-[#6b7280] cursor-not-allowed";
  } else if (isSelected) {
    buttonClass +=
      " bg-[#3b82f6] border-[#2563eb] text-white cursor-pointer hover:bg-[#2563eb] focus:ring-[#3b82f6] active:scale-95";
  } else {
    buttonClass +=
      " bg-[#22c55e]/20 border-[#22c55e]/50 text-[#22c55e] cursor-pointer hover:bg-[#22c55e] hover:text-white hover:border-[#22c55e] focus:ring-[#22c55e] active:scale-95";
  }

  return (
    <button
      className={buttonClass}
      onClick={() => !isBooked && onToggle(seat.id)}
      disabled={isBooked}
      title={`Seat ${seat.id}${isBooked ? " (Booked)" : isSelected ? " (Selected)" : " (Available)"}`}
      aria-label={`Seat ${seat.id}`}
      aria-pressed={isSelected}
      aria-disabled={isBooked}
    >
      {seat.number}
    </button>
  );
}
