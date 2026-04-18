import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  console.log("middleware is running");
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  if (
    !token &&
    (url.pathname === "/" ||
      url.pathname.startsWith("/home") ||
      url.pathname.startsWith("/friends") ||
      url.pathname.startsWith("/profile"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    token && (token.role === 'admin') &&
    (url.pathname === "/" ||
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    token &&
    (url.pathname === "/" ||
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/home",
    "/friends",
    "/profile/:path*",
    "/verify/:path*",
    // "/admin/:path*",
  ],
};
