import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "internhub_session";
const DEFAULT_SECRET = "internhub-default-development-jwt-secret-key-32chars-min";

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "STUDENT" | "RECRUITER";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session: SessionPayload | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      session = payload as unknown as SessionPayload;
    } catch {
      session = null;
    }
  }

  // Student routes protection
  if (pathname.startsWith("/student")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/recruiter", request.url));
    }
    return NextResponse.next();
  }

  // Recruiter routes protection
  if (pathname.startsWith("/recruiter")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/student/applications", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/recruiter/:path*"],
};
