"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

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

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.adminId = admin.id;
  session.email = admin.email;
  session.name = admin.name || undefined;
  await session.save();

  return { ok: true };
}

export async function logoutAdmin() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}
