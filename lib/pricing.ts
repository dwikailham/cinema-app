import type { Seat, PriceBreakdown, SeatPriceDetail, SeatZone } from "@/types";

const PREMIUM_ROWS = new Set(["A", "B"]);
const ECONOMY_ROWS = new Set(["G", "H"]);

function getSeatZone(row: string): SeatZone {
  if (PREMIUM_ROWS.has(row)) return "premium";
  if (ECONOMY_ROWS.has(row)) return "economy";
  return "regular";
}

function getZoneMultiplier(zone: SeatZone): number {
  switch (zone) {
    case "premium": return 1.3;
    case "economy": return 0.8;
    default:        return 1.0;
  }
}

function getZoneLabel(zone: SeatZone): string {
  switch (zone) {
    case "premium": return "Premium (Rows A–B, +30%)";
    case "economy": return "Economy (Rows G–H, −20%)";
    default:        return "Regular (Rows C–F)";
  }
}

function getDayMultiplier(dateString: string): number {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
  return dayOfWeek === 0 || dayOfWeek === 6 ? 1.2 : 1.0;
}

function getTimeMultiplier(timeString: string): number {
  const [hourStr, minuteStr] = timeString.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const totalMinutes = hour * 60 + minute;
  // Prime time: 17:00 (1020 min) to 21:00 (1260 min)
  return totalMinutes >= 1020 && totalMinutes <= 1260 ? 1.15 : 1.0;
}

export function calculatePricing(
  selectedSeats: Seat[],
  basePrice: number,
  showtimeDate: string,
  showtimeTime: string
): PriceBreakdown {
  const dayMultiplier = getDayMultiplier(showtimeDate);
  const timeMultiplier = getTimeMultiplier(showtimeTime);
  const isGroupBooking = selectedSeats.length >= 4;
  const groupDiscount = isGroupBooking ? 0.1 : 0;

  // Determine dominant zone for label (based on first seat, or mixed)
  const zones = selectedSeats.map((s) => getSeatZone(s.row));
  const dominantZone: SeatZone = zones.length > 0 ? zones[0] : "regular";

  const perSeat: SeatPriceDetail[] = selectedSeats.map((seat) => {
    const zone = getSeatZone(seat.row);
    const zoneMultiplier = getZoneMultiplier(zone);
    const zoneAdjustedPrice = Math.round(basePrice * zoneMultiplier);
    const afterDayMarkup = Math.round(zoneAdjustedPrice * dayMultiplier);
    const afterTimeMarkup = Math.round(afterDayMarkup * timeMultiplier);

    return {
      seatId: seat.id,
      zone,
      basePrice,
      zoneAdjustedPrice,
      afterDayMarkup,
      afterTimeMarkup,
      finalPrice: afterTimeMarkup,
    };
  });

  const subtotal = perSeat.reduce((sum, detail) => sum + detail.finalPrice, 0);
  const discountAmount = Math.round(subtotal * groupDiscount);
  const total = subtotal - discountAmount;

  return {
    basePrice,
    zoneLabel: selectedSeats.length === 1
      ? getZoneLabel(dominantZone)
      : zones.every((z) => z === zones[0])
        ? getZoneLabel(dominantZone)
        : "Mixed Zones",
    zoneMultiplier: selectedSeats.length === 1 ? getZoneMultiplier(dominantZone) : 0,
    dayMarkup: dayMultiplier,
    timeMarkup: timeMultiplier,
    groupDiscount,
    subtotal,
    total,
    perSeat,
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
