import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Better Auth session cookie check
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/LogIn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/MyBookings", "/AddCarForm", "/MyAddedCars"],
};