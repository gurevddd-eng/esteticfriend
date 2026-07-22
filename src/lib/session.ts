import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  isLoggedIn: boolean;
  adminId?: string;
  email?: string;
  name?: string;
};

function isSecureCookie() {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  const appUrl = process.env.APP_URL || "";
  if (appUrl.startsWith("https://")) return true;
  if (appUrl.startsWith("http://")) return false;
  return process.env.NODE_ENV === "production";
}

const sessionPassword =
  process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long";

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: "esteticfriend_admin",
  cookieOptions: {
    secure: isSecureCookie(),
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
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
