import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);
const SESSION_COOKIE_NAME = "binzo-admin-session";

const PANEL_PREFIXES = ["/admin-panel", "/lecturer-panel", "/referral-panel"];

type Role = "ADMIN" | "LECTURER" | "REFERRAL" | "REFERRAL_AGENT";

const ROLE_PANEL_MAP: Record<string, string> = {
  ADMIN: "/admin-panel",
  LECTURER: "/lecturer-panel",
  REFERRAL: "/referral-panel",
  REFERRAL_AGENT: "/referral-panel",
};

async function getSessionFromCookie(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, key, { algorithms: ["HS256"] });

    return payload as {
      user: { id: string; email: string; role: Role; privileges: string[] };
      expires: string;
    };
  } catch {
    return null;
  }
}

function isProtectedRoute(pathname: string): boolean {
  return PANEL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getPanelFromPath(pathname: string): string | null {
  for (const prefix of PANEL_PREFIXES) {
    if (pathname.startsWith(prefix)) return prefix;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /dashboard shortcut - redirect to role-specific dashboard
  if (pathname === "/dashboard") {
    const session = await getSessionFromCookie(request);

    if (!session || new Date() > new Date(session.expires)) {
      const signInUrl = new URL("/sign-in", request.url);

      return NextResponse.redirect(signInUrl);
    }

    const role = session.user.role as Role;
    const allowedPanel = ROLE_PANEL_MAP[role] || "/admin-panel";

    return NextResponse.redirect(new URL(`${allowedPanel}/dashboard`, request.url));
  }

  // Only intercept protected panel routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const session = await getSessionFromCookie(request);

  // No session -> redirect to sign-in with callbackUrl
  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // Check session expiry
  if (new Date() > new Date(session.expires)) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(signInUrl);
  }

  const role = session.user.role as Role;
  const allowedPanel = ROLE_PANEL_MAP[role];
  const currentPanel = getPanelFromPath(pathname);

  // If the user is accessing a panel that doesn't match their role, redirect to their own panel dashboard
  if (allowedPanel && currentPanel && currentPanel !== allowedPanel) {
    const redirectUrl = new URL(`${allowedPanel}/dashboard`, request.url);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin-panel/:path*", "/lecturer-panel/:path*", "/referral-panel/:path*"],
};
