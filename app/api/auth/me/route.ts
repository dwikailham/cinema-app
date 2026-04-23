import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/data/users";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const user = findUserById(session.userId);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found." },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, data: user });
}
