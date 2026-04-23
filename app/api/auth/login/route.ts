import { NextRequest, NextResponse } from "next/server";
import { findUserByCredentials } from "@/lib/data/users";
import { createSessionCookieValue, SESSION_COOKIE_NAME_EXPORT } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { username?: string; password?: string };
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const user = findUserByCredentials(username, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const cookieValue = createSessionCookieValue(user);
    const response = NextResponse.json({ success: true, data: user });
    response.cookies.set(SESSION_COOKIE_NAME_EXPORT, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
