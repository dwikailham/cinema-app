import { NextRequest, NextResponse } from "next/server";
import { getMovieById } from "@/lib/data/movies";
import { getSeatsForShowtime } from "@/lib/data/seats";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; showtimeId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { id, showtimeId } = await params;

  const movie = getMovieById(id);
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

  const layout = getSeatsForShowtime(showtime.studioId, showtimeId);
  if (!layout) {
    return NextResponse.json(
      { success: false, error: "Studio layout not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      showtime: {
        ...showtime,
        movieTitle: movie.title,
      },
      movie,
      studio: { id: showtime.studioId },
      layout,
    },
  });
}
