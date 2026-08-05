import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  isLoggedIn: boolean;
  adminId?: string;
  email?: string;
  name?: string;
};

export const ADMIN_SESSION_COOKIE = "sevens_admin";
const LEGACY_SESSION_COOKIES = ["esteticfriend_admin"] as const;

function sessionCookieSecure(): boolean {
  if (process.env.SESSION_SECURE === "true") return true;
  if (process.env.SESSION_SECURE === "false") return false;

  const appUrl = process.env.APP_URL?.trim().toLowerCase() || "";
  if (appUrl.startsWith("https://")) return true;
  if (appUrl.startsWith("http://")) return false;

  // HTTP deploys without APP_URL must not get Secure cookies.
  return false;
}

export function getAdminSessionOptions(): SessionOptions {
  return {
    password:
      process.env.SESSION_SECRET ||
      "complex_password_at_least_32_characters_long",
    cookieName: ADMIN_SESSION_COOKIE,
    cookieOptions: {
      secure: sessionCookieSecure(),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    },
  };
}

async function clearCookie(name: string) {
  const cookieStore = await cookies();
  const cookieOptions = getAdminSessionOptions().cookieOptions ?? {};
  cookieStore.set(name, "", {
    path: cookieOptions.path ?? "/",
    httpOnly: true,
    sameSite: cookieOptions.sameSite ?? "lax",
    secure: cookieOptions.secure ?? false,
    maxAge: 0,
  });
}

export async function clearLegacyAdminSessionCookies() {
  await Promise.all(LEGACY_SESSION_COOKIES.map((name) => clearCookie(name)));
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, getAdminSessionOptions());
}

export async function destroyAdminSession() {
  const session = await getAdminSession();
  session.destroy();
  await clearLegacyAdminSessionCookies();
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isLoggedIn || !session.adminId) return null;
  return session;
}
