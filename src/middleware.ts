import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  // console.log("🧩 Path:", pathname);
  // console.log("🧩 Role:", role);

  // ✅ Force admin redirect if accessing "/"
  if (pathname === "/" && role === "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // ✅ Add verify-otp routes to public routes
  const publicRoutes = [
    "/login",
    "/register",
    "/user/verify-otp",
    "/verify-otp",
  ];
  const adminRoutes = ["/admin"];
  const subscriptionRoutes = ["/subscription"];

  // ✅ If public route and already logged in, redirect
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  // ✅ Block unauthenticated users
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Admin route guard
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ✅ Let other routes pass
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
