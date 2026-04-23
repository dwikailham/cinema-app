import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMovieById } from "@/lib/data/movies";
import { getSeatsForShowtime, areSeatAvailable, bookSeatsForShowtime } from "@/lib/data/seats";
import { createBooking } from "@/lib/data/bookings";
import { calculatePricing } from "@/lib/pricing";
import { validateGapRule } from "@/lib/gapRule";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json() as {
      movieId?: string;
      showtimeId?: string;
      seatIds?: string[];
    };

    const { movieId, showtimeId, seatIds } = body;

    if (!movieId || !showtimeId || !seatIds || seatIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "movieId, showtimeId, and seatIds are required." },
        { status: 400 }
      );
    }

    // 1. Validate movie & showtime
    const movie = getMovieById(movieId);
    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found." },
        { status: 404 }
      );
    }

    const showtime = movie.showtimes.find((st) => st.id === showtimeId);
    if (!showtime) {
      return NextResponse.json(
        { success: false, error: "Showtime not found." },
        { status: 404 }
      );
    }

    // 2. Validate seat availability
    const available = areSeatAvailable(showtimeId, seatIds);
    if (!available) {
      return NextResponse.json(
        { success: false, error: "One or more seats are no longer available." },
        { status: 409 }
      );
    }

    // 3. Load layout for gap rule validation
    const layout = getSeatsForShowtime(showtime.studioId, showtimeId);
    if (!layout) {
      return NextResponse.json(
        { success: false, error: "Studio layout not found." },
        { status: 404 }
      );
    }

    // 4. Server-side gap rule validation
    const gapResult = validateGapRule(layout.seats, seatIds, layout.seatsPerRow);
    if (!gapResult.valid) {
      return NextResponse.json(
        { success: false, error: gapResult.message ?? "Gap rule violation." },
        { status: 422 }
      );
    }

    // 5. Calculate pricing (server-side)
    const selectedSeats = layout.seats.filter((s) => seatIds.includes(s.id));
    const priceBreakdown = calculatePricing(
      selectedSeats,
      showtime.basePrice,
      showtime.date,
      showtime.time
    );

    // 6. Book seats
    const booked = bookSeatsForShowtime(showtimeId, seatIds);
    if (!booked) {
      return NextResponse.json(
        { success: false, error: "Failed to book seats. Please try again." },
        { status: 409 }
      );
    }

    // 7. Create booking record
    const booking = createBooking({
      userId: session.userId,
      movieId,
      movieTitle: movie.title,
      showtimeId,
      showtimeDate: showtime.date,
      showtimeTime: showtime.time,
      studioId: showtime.studioId,
      seatIds,
      priceBreakdown,
      totalPrice: priceBreakdown.total,
      status: "confirmed",
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
