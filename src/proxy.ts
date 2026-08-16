import { NextResponse, type NextRequest } from "next/server";
import { verifyUserToken } from "@/lib/auth";

/**
 * Edge proxy — enforces authentication before the page tree renders.
 *
 * Next.js 16 renamed the middleware file convention to "proxy".
 * Export name: `proxy`, config key: `match` (replaces `matcher`).
 *
 * This replaces the old client-side ProtectedRoute check, which was
 * trivially bypassable and caused a flash of dashboard content before
 * redirecting. The __session cookie is HttpOnly (set by /api/auth/login)
 * so it is invisible to JavaScript and cannot be stolen via XSS.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("__session")?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await verifyUserToken(token);
    return NextResponse.next();
  } catch {
    // Invalid / expired token — clear the stale cookie and redirect
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("__session", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return response;
  }
}

export const config = {
  // Protect every /dashboard sub-route at the edge
  match: ["/dashboard/:path*"],
};
