import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSessionData } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(
    request,
    response,
    sessionOptions,
  );

  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
