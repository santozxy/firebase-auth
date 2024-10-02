import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(req: NextRequest) {
  const token = cookies().get("__session")?.value;
  const loginURL = new URL("/login", req.nextUrl);
  const homeURL = new URL("/home", req.nextUrl);
  if (
    !token &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/register" &&
    req.nextUrl.pathname !== "/forgot-password"
  ) {
    return NextResponse.redirect(loginURL);
  }
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(homeURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
