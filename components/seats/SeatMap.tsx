"use client";

import type { Seat } from "@/types";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
  seatsPerRow: number;
}

export function SeatMap({
  seats,
  selectedSeats,
  onToggleSeat,
  seatsPerRow,
}: SeatMapProps) {
  // Group seats by row
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Seats Grid */}
      <div className="space-y-3 w-full max-w-2xl px-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2 sm:gap-4 w-full">
            <div className="w-6 flex shrink-0 justify-end">
              <span className="text-xs uppercase tracking-wider text-[#6b6b88] font-bold">
                {row}
              </span>
            </div>
            
            <div
              className="flex gap-2 lg:gap-3 flex-1 justify-center"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))`,
              }}
            >
              {seats
                .filter((s) => s.row === row)
                .sort((a, b) => a.number - b.number)
                .map((seat) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isBooked = seat.status === "booked";

                  let stateClass = "";
                  if (isBooked) {
                    stateClass = "bg-[#2a2a3e] border-[#3a3a52] cursor-not-allowed opacity-40";
                  } else if (isSelected) {
                    stateClass = "bg-[#e63946] border-[#e63946] shadow-[0_0_15px_rgba(230,57,70,0.5)] scale-110";
                  } else {
                    stateClass = "bg-[#1e1e2e] border-[#3a3a52] hover:border-[#e63946] hover:bg-[#1e1e2e]/80 cursor-pointer active:scale-95";
                  }

                  return (
                    <button
                      key={seat.id}
                      disabled={isBooked}
                      onClick={() => onToggleSeat(seat.id)}
                      className={`
                        w-full aspect-square rounded-[4px] sm:rounded-[6px] border transition-all duration-200
                        flex flex-col items-center justify-center p-0.5 relative group overflow-hidden
                        ${stateClass}
                        ${isSelected ? "text-white" : isBooked ? "text-[#4a4a68]" : "text-[#a0a0b8] hover:text-[#f1f1f8]"}
                      `}
                      title={`${seat.row}${seat.number} - ${isBooked ? "Booked" : "Available"}`}
                    >
                      <span className="text-[10px] sm:text-xs font-bold">{seat.number}</span>
                    </button>
                  );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
