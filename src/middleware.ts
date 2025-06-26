import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];

  // Admin routes
  const adminRoutes = ["/admin"];

  // Subscription routes
  const subscriptionRoutes = ["/subscription"];

  // Check if route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If user is already logged in and trying to access login/register, redirect based on role
    if (accessToken) {
      if (role === "super_admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (role !== "super_admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // For all other protected routes, let the useSubscriptionGuard handle subscription checking
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PUBLIC_ROUTES = ["/login", "/register"];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const accessToken = request.cookies.get("accessToken")?.value;
//   const role = request.cookies.get("role")?.value;

//   // 1. Public routes
//   if (PUBLIC_ROUTES.includes(pathname)) {
//     if (accessToken) {
//       // If already logged in, redirect to proper dashboard
//       const redirectPath = role === "SUPER_ADMIN" ? "/admin" : "/";
//       return NextResponse.redirect(new URL(redirectPath, request.url));
//     }
//     return NextResponse.next();
//   }

//   // 2. Not logged in - redirect to login
//   if (!accessToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 3. Role-based route restrictions
//   // Super admin allowed ONLY on /admin/*
//   if (role === "SUPER_ADMIN" && !pathname.startsWith("/admin")) {
//     return NextResponse.redirect(new URL("/admin", request.url));
//   }

//   // User not allowed on /admin/*
//   if (role === "USER" && pathname.startsWith("/admin")) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
// };
