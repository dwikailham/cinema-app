import type { Booking } from "@/types";
import { randomUUID } from "crypto";

// In-memory bookings store (server-side singleton)
const _bookings: Booking[] = [];

export function getAllBookings(): Booking[] {
  return _bookings;
}

export function getBookingsByUserId(userId: string): Booking[] {
  return _bookings.filter((b) => b.userId === userId && b.status === "confirmed");
}

export function getBookingById(bookingId: string): Booking | null {
  return _bookings.find((b) => b.id === bookingId) ?? null;
}

export function createBooking(
  data: Omit<Booking, "id" | "createdAt">
): Booking {
  const booking: Booking = {
    ...data,
    id: `booking-${randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
  _bookings.push(booking);
  return booking;
}

export function cancelBooking(bookingId: string): Booking | null {
  const booking = _bookings.find((b) => b.id === bookingId);
  if (!booking) return null;
  booking.status = "cancelled";
  return booking;
}
