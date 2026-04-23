import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBookingsByUserId } from "@/lib/data/bookings";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const bookings = getBookingsByUserId(session.userId);
  return NextResponse.json({ success: true, data: bookings });
}
