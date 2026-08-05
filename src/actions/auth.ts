"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  clearLegacyAdminSessionCookies,
  destroyAdminSession,
  getAdminSession,
} from "@/lib/session";

export type AuthResult = { ok: boolean; error?: string };

export async function loginAdmin(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return { ok: false, error: "Неверный логин или пароль" };

  const valid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!valid) return { ok: false, error: "Неверный логин или пароль" };

  await clearLegacyAdminSessionCookies();

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.adminId = admin.id;
  session.email = admin.email;
  session.name = admin.name || undefined;
  await session.save();

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function logoutAdmin(): Promise<AuthResult> {
  await destroyAdminSession();
  revalidatePath("/admin", "layout");
  return { ok: true };
}
