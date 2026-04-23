import { NextRequest, NextResponse } from "next/server";
import { filterMovies, getAllGenres } from "@/lib/data/movies";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") ?? undefined;
  const query = searchParams.get("q") ?? undefined;

  const movies = filterMovies(genre, query);
  const genres = getAllGenres();

  return NextResponse.json({ success: true, data: { movies, genres } });
}
