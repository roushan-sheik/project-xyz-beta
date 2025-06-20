// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  // 1. Public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (accessToken) {
      // If already logged in, redirect to proper dashboard
      const redirectPath = role === "SUPER_ADMIN" ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // 2. Not logged in - redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role-based route restrictions
  // Super admin allowed ONLY on /admin/*
  if (role === "SUPER_ADMIN" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // User not allowed on /admin/*
  if (role === "USER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
