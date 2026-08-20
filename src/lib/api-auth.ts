import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";

/**
 * Reads and verifies the session token from the request.
 *
 * Priority order:
 *   1. __session HttpOnly cookie  (post-C3 clients)
 *   2. Authorization Bearer header (legacy / programmatic clients)
 *
 * Returns { userId, email } on success, or null if unauthenticated.
 */
export async function getAuth(
  request: Request
): Promise<{ userId: string; email: string } | null> {
  let token = "";

  // 1. HttpOnly cookie
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const t = part.trim();
    if (t.startsWith("__session=")) {
      token = decodeURIComponent(t.slice("__session=".length));
      break;
    }
  }

  // 2. Bearer fallback
  if (!token) {
    const auth = request.headers.get("authorization") ?? "";
    if (auth.startsWith("Bearer ")) token = auth.slice(7);
  }

  if (!token) return null;

  try {
    const { userId, email } = await verifyUserToken(token);
    if (!userId) return null;
    return { userId, email: email ?? "" };
  } catch {
    return null;
  }
}

/** Convenience — returns a pre-built 401 JSON response. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
