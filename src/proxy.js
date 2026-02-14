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
    token &&
    ( url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify") ||
      // url.pathname.startsWith("/") ||
      url.pathname.startsWith("/verify/:path*"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (
    !token &&
    ( url.pathname.startsWith("/home") ||
      url.pathname.startsWith("/friends") ||
      url.pathname.startsWith("/profile"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/home",
    "/friends",
    "/profile",
    "/verify/:path*",
  ],
};
