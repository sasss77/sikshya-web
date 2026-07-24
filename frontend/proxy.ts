import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Bypass proxy for Server Actions to prevent POST 404s
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  // Protect dashboard routes (e.g. /dashboard, /dashboard/profile, etc.)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged-in users from accessing /login and /signup pages
  // Redirect to root — root page (app/page.tsx) handles role-based routing (admin → /admin, others → /dashboard)
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Match all dashboard paths, login, and signup
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
