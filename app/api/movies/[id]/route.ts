import { NextRequest, NextResponse } from "next/server";
import { getMovieById } from "@/lib/data/movies";
import { getSession } from "@/lib/session";

export async function GET(
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
  const movie = getMovieById(id);

  if (!movie) {
    return NextResponse.json(
      { success: false, error: "Movie not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: movie });
}
