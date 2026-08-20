import { NextResponse } from "next/server";

export async function POST() {
  // Clear the HttpOnly session cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("__session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
