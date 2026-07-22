"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/slugify";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");
  return session;
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

  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return { ok: false as const, error: "Сначала удалите или перенесите товары" };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
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
    price: input.price === null || input.price === undefined || input.price <= 0
      ? null
      : input.price,
    inStock: input.inStock ?? true,
    isNew: input.isNew ?? false,
    isHit: input.isHit ?? false,
    isActive: input.isActive ?? true,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { ok: true as const };
}

export async function uploadProductImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "Файл не найден" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `product-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return { ok: true as const, url: `/uploads/${filename}` };
}

export async function savePage(slug: string, title: string, content: string) {
  await assertAdmin();
  await prisma.page.upsert({
    where: { slug },
    update: { title, content },
    create: { slug, title, content },
  });
  revalidatePath(`/${slug}`);
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
  revalidatePath("/admin/settings");
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

  if (id) {
    await prisma.review.update({ where: { id }, data });
  } else {
    await prisma.review.create({ data });
  }

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

export async function deleteLead(id: string) {
  await assertAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  return { ok: true as const };
}
