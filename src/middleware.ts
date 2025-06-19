// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  // 1. If it's a public route, let it pass
  if (PUBLIC_ROUTES.includes(pathname)) {
    // If user is already logged in and tries to access login/register, redirect to dashboard
    if (accessToken && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect private routes
  // If no access token, redirect to login page
  if (!accessToken) {
    // If trying to access a protected API route, respond with 401
    if (pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Validate access token (Optional but recommended for strict security)

  // 4. Token Refresh Logic (If access token is expired but refresh token exists)

  //   try {
  //     const isValid = await validateAccessToken(accessToken); // A function to validate token
  //     if (!isValid && refreshToken) {
  //       const newTokens = await refreshTokens(refreshToken); // A function to call refresh API
  //       if (newTokens) {
  //         const response = NextResponse.next();
  //         response.cookies.set("accessToken", newTokens.access, {
  //           httpOnly: true,
  //           secure: process.env.NODE_ENV === "production",
  //         });
  //         response.cookies.set("refreshToken", newTokens.refresh, {
  //           httpOnly: true,
  //           secure: process.env.NODE_ENV === "production",
  //         });
  //         return response;
  //       } else {
  //         // Refresh failed, redirect to login
  //         return NextResponse.redirect(new URL("/login", request.url));
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Token validation/refresh error:", error);
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }

  return NextResponse.next(); // Continue to the requested page/API route
}

export const config = {
  // Matcher for all routes except static files and _next
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
