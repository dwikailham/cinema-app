import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBookingById, cancelBooking } from "@/lib/data/bookings";
import { releaseSeatsForShowtime } from "@/lib/data/seats";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const booking = getBookingById(id);

  if (!booking) {
    return NextResponse.json(
      { success: false, error: "Booking not found." },
      { status: 404 }
    );
  }

  if (booking.userId !== session.userId) {
    return NextResponse.json(
      { success: false, error: "Forbidden: This booking belongs to another user." },
      { status: 403 }
    );
  }

  if (booking.status === "cancelled") {
    return NextResponse.json(
      { success: false, error: "Booking is already cancelled." },
      { status: 409 }
    );
  }

  // Release seats back to available
  releaseSeatsForShowtime(booking.showtimeId, booking.seatIds);

  // Soft-delete the booking
  const cancelled = cancelBooking(id);

  return NextResponse.json({ success: true, data: cancelled });
}
