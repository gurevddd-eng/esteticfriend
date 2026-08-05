import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  isLoggedIn: boolean;
  adminId?: string;
  email?: string;
  name?: string;
};

function sessionCookieSecure(): boolean {
  const appUrl = process.env.APP_URL?.trim().toLowerCase() || "";
  if (appUrl.startsWith("http://")) return false;
  if (appUrl.startsWith("https://")) return true;
  if (process.env.SESSION_SECURE === "true") return true;
  if (process.env.SESSION_SECURE === "false") return false;
  return process.env.NODE_ENV === "production";
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieName: "esteticfriend_admin",
  cookieOptions: {
    secure: sessionCookieSecure(),
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isLoggedIn || !session.adminId) return null;
  return session;
}
