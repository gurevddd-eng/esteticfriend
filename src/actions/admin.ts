"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import type { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/slugify";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function revalidateCatalog() {
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function saveCategory(
  input: {
    name: string;
    slug?: string;
    description?: string;
    sortOrder?: number;
  },
  id?: string,
) {
  await assertAdmin();
  const slug = input.slug?.trim() || slugify(input.name);
  const data = {
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || null,
    sortOrder: input.sortOrder ?? 0,
  };

  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });

  revalidateCatalog();
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return { ok: false as const, error: "Сначала удалите или перенесите товары" };
  }
  await prisma.category.delete({ where: { id } });
  revalidateCatalog();
  return { ok: true as const };
}

export async function saveProduct(
  input: {
    name: string;
    slug?: string;
    categoryId: string;
    shortDesc?: string;
    description?: string;
    imageUrl?: string;
    price?: number | null;
    inStock?: boolean;
    isNew?: boolean;
    isHit?: boolean;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const slug = input.slug?.trim() || slugify(input.name);
  const data = {
    name: input.name.trim(),
    slug,
    categoryId: input.categoryId,
    shortDesc: input.shortDesc?.trim() || "",
    description: input.description?.trim() || "",
    imageUrl: input.imageUrl?.trim() || null,
    price:
      input.price === null || input.price === undefined || Number(input.price) <= 0
        ? null
        : input.price,
    inStock: input.inStock ?? true,
    isNew: input.isNew ?? false,
    isHit: input.isHit ?? false,
    isActive: input.isActive ?? true,
  };

  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });

  revalidateCatalog();
  if (id) revalidatePath(`/admin/products/${id}`);
  return { ok: true as const };
}

export async function toggleProductFlag(
  id: string,
  field: "isActive" | "isHit" | "isNew" | "inStock",
  value: boolean,
) {
  await assertAdmin();
  await prisma.product.update({ where: { id }, data: { [field]: value } });
  revalidateCatalog();
  return { ok: true as const };
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  await prisma.product.delete({ where: { id } });
  revalidateCatalog();
  return { ok: true as const };
}

export async function duplicateProduct(id: string) {
  await assertAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { ok: false as const, error: "Товар не найден" };

  const baseSlug = `${product.slug}-copy`;
  let slug = baseSlug;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const copy = await prisma.product.create({
    data: {
      name: `${product.name} (копия)`,
      slug,
      shortDesc: product.shortDesc,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      inStock: product.inStock,
      isNew: product.isNew,
      isHit: false,
      isActive: false,
      categoryId: product.categoryId,
    },
  });

  revalidateCatalog();
  return { ok: true as const, id: copy.id };
}

export async function uploadProductImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "Файл не найден" };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "Файл больше 8 МБ" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `product-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return { ok: true as const, url: `/uploads/${filename}` };
}

export async function savePage(input: {
  slug: string;
  title: string;
  content: string;
  isPublished?: boolean;
  id?: string;
}) {
  await assertAdmin();
  const slug = slugify(input.slug || input.title);
  if (!slug) return { ok: false as const, error: "Укажите корректный slug" };

  const data = {
    slug,
    title: input.title.trim(),
    content: input.content,
    isPublished: input.isPublished ?? true,
  };

  if (input.id) {
    await prisma.page.update({ where: { id: input.id }, data });
  } else {
    const exists = await prisma.page.findUnique({ where: { slug } });
    if (exists) return { ok: false as const, error: "Страница с таким slug уже есть" };
    await prisma.page.create({ data });
  }

  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deletePage(id: string) {
  await assertAdmin();
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return { ok: false as const, error: "Не найдено" };
  await prisma.page.delete({ where: { id } });
  revalidatePath(`/${page.slug}`);
  revalidatePath("/admin/pages");
  return { ok: true as const };
}

export async function saveSetting(key: string, value: string) {
  await assertAdmin();
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/");
  revalidatePath("/contacts");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/homepage");
  return { ok: true as const };
}

export async function saveHomepage(json: string) {
  await assertAdmin();
  JSON.parse(json);
  await prisma.siteSetting.upsert({
    where: { key: "homepage" },
    update: { value: json },
    create: { key: "homepage", value: json },
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true as const };
}

export async function saveReview(
  input: {
    author: string;
    age?: number | null;
    title: string;
    text: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const data = {
    author: input.author.trim(),
    age: input.age ?? null,
    title: input.title.trim(),
    text: input.text.trim(),
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  };

  if (id) await prisma.review.update({ where: { id }, data });
  else await prisma.review.create({ data });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { ok: true as const };
}

export async function deleteReview(id: string) {
  await assertAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { ok: true as const };
}

export async function updateLead(
  id: string,
  input: { status?: LeadStatus; notes?: string },
) {
  await assertAdmin();
  await prisma.lead.update({
    where: { id },
    data: {
      ...(input.status ? { status: input.status } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
    },
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deleteLead(id: string) {
  await assertAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await assertAdmin();
  if (!session.adminId) return { ok: false as const, error: "Нет сессии" };
  if (input.newPassword.length < 8) {
    return { ok: false as const, error: "Новый пароль — минимум 8 символов" };
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin) return { ok: false as const, error: "Админ не найден" };

  const valid = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!valid) return { ok: false as const, error: "Текущий пароль неверный" };

  const passwordHash = await bcrypt.hash(input.newPassword, 10);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  return { ok: true as const };
}
