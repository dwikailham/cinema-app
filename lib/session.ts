import { cookies } from "next/headers";
import type { SessionPayload, User } from "@/types";

const SESSION_COOKIE_NAME = "cinema-session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  try {
    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    return JSON.parse(decoded) as SessionPayload;
  } catch {
    return null;
  }
}

export function createSessionCookieValue(user: User): string {
  const payload: SessionPayload = {
    userId: user.id,
    name: user.name,
    username: user.username,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function getSessionCookieOptions(maxAge: number = SESSION_MAX_AGE) {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export const SESSION_COOKIE_NAME_EXPORT = SESSION_COOKIE_NAME;
