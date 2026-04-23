import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME_EXPORT } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    data: { message: "Logged out successfully." },
  });

  response.cookies.set(SESSION_COOKIE_NAME_EXPORT, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
