// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarPlaceholder: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface SessionPayload {
  userId: string;
  name: string;
  username: string;
}

// ─── Movies ──────────────────────────────────────────────────────────────────

export interface Showtime {
  id: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:mm"
  studioId: string;
  basePrice: number;
  movieTitle?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  synopsis: string;
  rating: string;
  posterPlaceholder: string;
  showtimes: Showtime[];
}

// ─── Seats ───────────────────────────────────────────────────────────────────

export type SeatStatus = "available" | "booked" | "selected";

export interface Seat {
  id: string;      // e.g. "A1"
  row: string;     // e.g. "A"
  number: number;  // e.g. 1
  status: SeatStatus;
}

export interface StudioLayout {
  rows: number;
  seatsPerRow: number;
  seats: Seat[];
}

export interface SeatsData {
  [studioId: string]: StudioLayout;
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export type SeatZone = "premium" | "regular" | "economy";

export interface SeatPriceDetail {
  seatId: string;
  zone: SeatZone;
  basePrice: number;
  zoneAdjustedPrice: number;
  afterDayMarkup: number;
  afterTimeMarkup: number;
  finalPrice: number;
}

export interface PriceBreakdown {
  basePrice: number;
  zoneLabel: string;
  zoneMultiplier: number;
  dayMarkup: number;
  timeMarkup: number;
  groupDiscount: number;
  subtotal: number;
  total: number;
  perSeat: SeatPriceDetail[];
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  showtimeId: string;
  showtimeDate: string;
  showtimeTime: string;
  studioId: string;
  seatIds: string[];
  priceBreakdown: PriceBreakdown;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Gap Rule ────────────────────────────────────────────────────────────────

export interface GapRuleResult {
  valid: boolean;
  violatingSeat?: string;
  message?: string;
}
