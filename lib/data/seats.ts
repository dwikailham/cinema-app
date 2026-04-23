import fs from "fs";
import path from "path";
import type { Seat, SeatsData, StudioLayout } from "@/types";

// In-memory per-showtime seat state: Map<showtimeId, Seat[]>
const _showtimeSeatState = new Map<string, Seat[]>();

let _rawSeatsData: SeatsData | null = null;

function loadRawSeats(): SeatsData {
  if (_rawSeatsData) return _rawSeatsData;
  const filePath = path.join(process.cwd(), "data", "seats.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _rawSeatsData = JSON.parse(raw) as SeatsData;
  return _rawSeatsData;
}

export function getSeatsForShowtime(
  studioId: string,
  showtimeId: string
): StudioLayout | null {
  const raw = loadRawSeats();
  const studioLayout = raw[studioId];
  if (!studioLayout) return null;

  // Lazily clone per showtime so each showtime has independent seat state
  if (!_showtimeSeatState.has(showtimeId)) {
    const clonedSeats: Seat[] = studioLayout.seats.map((seat) => ({
      ...seat,
    }));
    _showtimeSeatState.set(showtimeId, clonedSeats);
  }

  const seats = _showtimeSeatState.get(showtimeId)!;
  return {
    rows: studioLayout.rows,
    seatsPerRow: studioLayout.seatsPerRow,
    seats,
  };
}

export function bookSeatsForShowtime(
  showtimeId: string,
  seatIds: string[]
): boolean {
  const seats = _showtimeSeatState.get(showtimeId);
  if (!seats) return false;

  const seatIdSet = new Set(seatIds);
  for (const seat of seats) {
    if (seatIdSet.has(seat.id)) {
      if (seat.status === "booked") return false; // already taken
      seat.status = "booked";
    }
  }
  return true;
}

export function releaseSeatsForShowtime(
  showtimeId: string,
  seatIds: string[]
): void {
  const seats = _showtimeSeatState.get(showtimeId);
  if (!seats) return;

  const seatIdSet = new Set(seatIds);
  for (const seat of seats) {
    if (seatIdSet.has(seat.id) && seat.status === "booked") {
      seat.status = "available";
    }
  }
}

export function areSeatAvailable(
  showtimeId: string,
  seatIds: string[]
): boolean {
  const seats = _showtimeSeatState.get(showtimeId);
  if (!seats) return false;

  const seatMap = new Map(seats.map((s) => [s.id, s]));
  return seatIds.every((id) => seatMap.get(id)?.status === "available");
}
