"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  CONTACT_WIDGET_SETTING_KEY,
  type ContactWidgetConfig,
} from "@/lib/contact-widget";
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
    compareAtPrice?: number | null;
    inStock?: boolean;
    isNew?: boolean;
    isHit?: boolean;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const slug = input.slug?.trim() || slugify(input.name);
  const price =
    input.price === null || input.price === undefined || input.price <= 0
      ? null
      : input.price;
  const compareAtPrice =
    input.compareAtPrice === null ||
    input.compareAtPrice === undefined ||
    input.compareAtPrice <= 0
      ? null
      : input.compareAtPrice;

  const data = {
    name: input.name.trim(),
    slug,
    categoryId: input.categoryId,
    shortDesc: input.shortDesc?.trim() || "",
    description: input.description?.trim() || "",
    imageUrl: input.imageUrl?.trim() || null,
    price,
    compareAtPrice,
    inStock: input.inStock ?? true,
    isNew: input.isNew ?? false,
    isHit: input.isHit ?? false,
    isActive: input.isActive ?? true,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/catalog");
    revalidatePath("/");
    return { ok: true as const, id };
  }

  const created = await prisma.product.create({ data });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${created.id}`);
  revalidatePath("/catalog");
  revalidatePath("/");
  return { ok: true as const, id: created.id };
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
  revalidatePath(`/admin/pages/${slug}`);
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
  revalidatePath("/contacts");
  return { ok: true as const };
}

export async function saveSiteSettings(input: {
  phone: string;
  email: string;
  cities: string;
  tagline: string;
  about: string;
  aboutExtra: string;
  logoUrl?: string;
  faviconUrl?: string;
}) {
  await assertAdmin();
  const entries: Array<[string, string]> = [
    ["phone", input.phone.trim()],
    ["email", input.email.trim()],
    ["cities", input.cities.trim()],
    ["tagline", input.tagline.trim()],
    ["about", input.about.trim()],
    ["aboutExtra", input.aboutExtra.trim()],
    ["logoUrl", (input.logoUrl || "").trim()],
    ["faviconUrl", (input.faviconUrl || "").trim()],
  ];

  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/contacts");
  revalidatePath("/admin/home");
  return { ok: true as const };
}

export async function uploadBrandAsset(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file");
  const kind = String(formData.get("kind") || "logo");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "Файл не найден" };
  }

  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/vnd.microsoft.icon",
  ];
  if (file.type && !allowed.includes(file.type) && !file.name.endsWith(".ico")) {
    return { ok: false as const, error: "Допустимы PNG, JPG, WebP, SVG или ICO" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || (kind === "favicon" ? ".ico" : ".png");
  const filename = `brand-${kind}-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return { ok: true as const, url: `/uploads/${filename}` };
}

export async function deleteLead(id: string) {
  await assertAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  return { ok: true as const };
}

export async function deletePage(slug: string) {
  await assertAdmin();
  await prisma.page.delete({ where: { slug } });
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  return { ok: true as const };
}

export async function createPage(slug: string, title: string, content = "") {
  await assertAdmin();
  const cleanSlug = slugify(slug || title);
  if (!cleanSlug) return { ok: false as const, error: "Укажите slug" };
  await prisma.page.create({
    data: {
      slug: cleanSlug,
      title: title.trim() || cleanSlug,
      content,
    },
  });
  revalidatePath(`/${cleanSlug}`);
  revalidatePath("/admin/pages");
  return { ok: true as const, slug: cleanSlug };
}

export async function saveFaq(
  input: {
    question: string;
    answer: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const data = {
    question: input.question.trim(),
    answer: input.answer.trim(),
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  };
  if (id) {
    await prisma.faqItem.update({ where: { id }, data });
  } else {
    await prisma.faqItem.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/faq");
  return { ok: true as const };
}

export async function deleteFaq(id: string) {
  await assertAdmin();
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/faq");
  return { ok: true as const };
}

export async function saveBrand(
  input: { name: string; sortOrder?: number; isActive?: boolean },
  id?: string,
) {
  await assertAdmin();
  const data = {
    name: input.name.trim(),
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  };
  if (id) {
    await prisma.brand.update({ where: { id }, data });
  } else {
    await prisma.brand.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { ok: true as const };
}

export async function deleteBrand(id: string) {
  await assertAdmin();
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { ok: true as const };
}

export async function saveAdvantage(
  input: {
    title: string;
    text: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const data = {
    title: input.title.trim(),
    text: input.text.trim(),
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  };
  if (id) {
    await prisma.advantage.update({ where: { id }, data });
  } else {
    await prisma.advantage.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/advantages");
  return { ok: true as const };
}

export async function deleteAdvantage(id: string) {
  await assertAdmin();
  await prisma.advantage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/advantages");
  return { ok: true as const };
}

export async function savePromo(
  input: {
    slug?: string;
    eyebrow?: string;
    title: string;
    text?: string;
    cta?: string;
    href?: string;
    imageUrl?: string | null;
    tone?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    slug,
    eyebrow: input.eyebrow?.trim() || "",
    title: input.title.trim(),
    text: input.text?.trim() || "",
    cta: input.cta?.trim() || "Подробнее",
    href: input.href?.trim() || "/#consult",
    imageUrl: input.imageUrl?.trim() || null,
    tone: input.tone?.trim() || "navy",
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  };
  if (id) {
    await prisma.promoBanner.update({ where: { id }, data });
  } else {
    await prisma.promoBanner.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/promos");
  return { ok: true as const };
}

export async function deletePromo(id: string) {
  await assertAdmin();
  await prisma.promoBanner.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/promos");
  return { ok: true as const };
}

export async function saveHeroSlide(
  input: {
    slug?: string;
    eyebrow?: string;
    title: string;
    text?: string;
    note?: string | null;
    cta?: string;
    href?: string;
    imageUrl?: string | null;
    tone?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  id?: string,
) {
  await assertAdmin();
  const slug = input.slug?.trim() || slugify(input.title);
  const data = {
    slug,
    eyebrow: input.eyebrow?.trim() || "",
    title: input.title.trim(),
    text: input.text?.trim() || "",
    note: input.note?.trim() || null,
    cta: input.cta?.trim() || "Подробнее",
    href: input.href?.trim() || "/#consult",
    imageUrl: input.imageUrl?.trim() || null,
    tone: input.tone?.trim() || "navy",
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  };
  if (id) {
    await prisma.heroSlide.update({ where: { id }, data });
  } else {
    await prisma.heroSlide.create({ data });
  }
  revalidatePath("/");
  revalidatePath("/admin/slides");
  return { ok: true as const };
}

export async function deleteHeroSlide(id: string) {
  await assertAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/slides");
  return { ok: true as const };
}

export async function uploadCmsImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "Файл не найден" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `cms-${Date.now()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return { ok: true as const, url: `/uploads/${filename}` };
}

export async function saveContactWidgetConfig(config: ContactWidgetConfig) {
  await assertAdmin();
  await prisma.siteSetting.upsert({
    where: { key: CONTACT_WIDGET_SETTING_KEY },
    update: { value: JSON.stringify(config) },
    create: { key: CONTACT_WIDGET_SETTING_KEY, value: JSON.stringify(config) },
  });
  revalidatePath("/");
  revalidatePath("/admin/contact-widget");
  return { ok: true as const };
}

export async function saveHomeContent(input: Record<string, string>) {
  await assertAdmin();
  const keys = [
    "heroTitle",
    "heroTitleLine",
    "heroText",
    "heroCtaPrimary",
    "heroCtaSecondary",
    "tagline",
  ] as const;
  for (const key of keys) {
    if (key in input) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: input[key] ?? "" },
        create: { key, value: input[key] ?? "" },
      });
    }
  }
  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/settings");
  return { ok: true as const };
}

export async function saveAmoCrmSettings(input: {
  enabled: boolean;
  domain: string;
  token: string;
  keepToken?: boolean;
  pipelineId?: string;
  statusId?: string;
  responsibleUserId?: string;
}) {
  await assertAdmin();
  const { AMOCRM_SETTING_KEYS } = await import("@/lib/amocrm");

  const pairs: Array<[string, string]> = [
    [AMOCRM_SETTING_KEYS.enabled, input.enabled ? "1" : "0"],
    [AMOCRM_SETTING_KEYS.domain, input.domain.trim()],
    [AMOCRM_SETTING_KEYS.pipelineId, (input.pipelineId || "").trim()],
    [AMOCRM_SETTING_KEYS.statusId, (input.statusId || "").trim()],
    [
      AMOCRM_SETTING_KEYS.responsibleUserId,
      (input.responsibleUserId || "").trim(),
    ],
  ];

  if (!input.keepToken) {
    pairs.push([AMOCRM_SETTING_KEYS.token, input.token.trim()]);
  } else if (input.token.trim()) {
    pairs.push([AMOCRM_SETTING_KEYS.token, input.token.trim()]);
  }

  for (const [key, value] of pairs) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/admin/integrations");
  revalidatePath("/admin/leads");
  return { ok: true as const };
}

export async function testAmoCrmSettings() {
  await assertAdmin();
  const { testAmoCrmConnection } = await import("@/lib/amocrm");
  return testAmoCrmConnection();
}

export async function syncLeadToAmo(id: string) {
  await assertAdmin();
  const { syncLeadToAmoCrm } = await import("@/lib/amocrm");
  const result = await syncLeadToAmoCrm(id);
  revalidatePath("/admin/leads");
  return result;
}
