import type { Seat, GapRuleResult } from "@/types";

type OccupancyStatus = "occupied" | "empty";

function buildRowOccupancy(
  allSeats: Seat[],
  selectedSeatIds: Set<string>,
  row: string,
  totalSeatsInRow: number
): OccupancyStatus[] {
  // Build array indexed by seat number (1-based → 0-indexed)
  const occupancy: OccupancyStatus[] = Array(totalSeatsInRow).fill("empty");

  for (const seat of allSeats) {
    if (seat.row !== row) continue;
    const index = seat.number - 1;
    if (seat.status === "booked" || selectedSeatIds.has(seat.id)) {
      occupancy[index] = "occupied";
    }
  }
  return occupancy;
}

export function validateGapRule(
  allSeats: Seat[],
  selectedSeatIds: string[],
  seatsPerRow: number
): GapRuleResult {
  const selectedSet = new Set(selectedSeatIds);

  // Get unique rows present in allSeats
  const rows = Array.from(new Set(allSeats.map((s) => s.row))).sort();

  for (const row of rows) {
    const occupancy = buildRowOccupancy(
      allSeats,
      selectedSet,
      row,
      seatsPerRow
    );

    // Scan for isolated empty seats
    for (let index = 1; index < seatsPerRow - 1; index++) {
      const leftOccupied  = occupancy[index - 1] === "occupied";
      const currentEmpty  = occupancy[index]     === "empty";
      const rightOccupied = occupancy[index + 1] === "occupied";

      if (leftOccupied && currentEmpty && rightOccupied) {
        const seatNumber = index + 1;
        const violatingSeat = `${row}${seatNumber}`;
        return {
          valid: false,
          violatingSeat,
          message: `Seat ${violatingSeat} would be left isolated. You cannot leave a single empty seat between occupied seats in the same row.`,
        };
      }
    }
  }

  return { valid: true };
}
