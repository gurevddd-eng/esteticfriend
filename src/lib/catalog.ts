import {
  ADVANTAGES,
  BRANDS,
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FAQ_ITEMS,
  HERO_SLIDES,
  PROMOS,
  SITE,
  type CategoryDTO,
  type ProductDTO,
} from "@/lib/content";
import { prisma } from "@/lib/prisma";

export type SiteInfo = {
  name: string;
  phone: string;
  phoneHref: string;
  email: string;
  cities: string;
  tagline: string;
  about: string;
  aboutExtra: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  heroTitle: string;
  heroTitleLine: string;
  heroText: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
};

export type FaqDTO = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type BrandDTO = {
  id: string;
  name: string;
  sortOrder: number;
};

export type AdvantageDTO = {
  id: string;
  title: string;
  text: string;
  sortOrder: number;
};

export type PromoDTO = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  imageUrl: string | null;
  tone: string;
  sortOrder: number;
};

export type HeroSlideDTO = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  text: string;
  note: string | null;
  cta: string;
  href: string;
  imageUrl: string | null;
  tone: string;
  sortOrder: number;
};

function phoneToHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : SITE.phoneHref;
}

function mapCategory(
  c: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    sortOrder: number;
    _count?: { products: number };
  },
): CategoryDTO {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    sortOrder: c.sortOrder,
    _count: c._count,
  };
}

function mapProduct(
  p: {
    id: string;
    slug: string;
    name: string;
    shortDesc: string;
    description: string;
    imageUrl: string | null;
    price?: unknown;
    inStock: boolean;
    isNew: boolean;
    isHit: boolean;
    categoryId: string;
    category?: { id: string; slug: string; name: string } | null;
  },
): ProductDTO {
  const priceNum =
    p.price === null || p.price === undefined
      ? null
      : Number(typeof p.price === "object" && p.price !== null && "toString" in p.price
          ? (p.price as { toString(): string }).toString()
          : p.price);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDesc: p.shortDesc,
    description: p.description,
    imageUrl: p.imageUrl
      ? p.imageUrl.replace(/\.(png|jpe?g)$/i, ".webp")
      : p.imageUrl,
    price: Number.isFinite(priceNum) ? priceNum : null,
    inStock: p.inStock,
    isNew: p.isNew,
    isHit: p.isHit,
    categoryId: p.categoryId,
    category: p.category
      ? { id: p.category.id, slug: p.category.slug, name: p.category.name }
      : undefined,
  };
}

async function dbAvailable() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function getCategories(): Promise<CategoryDTO[]> {
  if (!(await dbAvailable())) return FALLBACK_CATEGORIES;

  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  if (!rows.length) return FALLBACK_CATEGORIES;
  return rows.map(mapCategory);
}

export async function getCategoryBySlug(slug: string) {
  if (!(await dbAvailable())) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const row = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return row ? mapCategory(row) : null;
}

export async function getProducts(options?: {
  categorySlug?: string;
  isNew?: boolean;
  isHit?: boolean;
  take?: number;
}): Promise<ProductDTO[]> {
  if (!(await dbAvailable())) {
    let items = [...FALLBACK_PRODUCTS];
    if (options?.categorySlug === "novinki" || options?.isNew) {
      items = items.filter((p) => p.isNew);
    } else if (options?.categorySlug) {
      items = items.filter((p) => p.category?.slug === options.categorySlug);
    }
    if (options?.isHit) items = items.filter((p) => p.isHit);
    if (options?.take) items = items.slice(0, options.take);
    return items;
  }

  const where: {
    isActive: boolean;
    isNew?: boolean;
    isHit?: boolean;
    category?: { slug: string };
  } = { isActive: true };

  if (options?.categorySlug === "novinki" || options?.isNew) {
    where.isNew = true;
  } else if (options?.categorySlug) {
    where.category = { slug: options.categorySlug };
  }
  if (options?.isHit) where.isHit = true;

  const rows = await prisma.product.findMany({
    where,
    include: { category: { select: { id: true, slug: true, name: true } } },
    orderBy: [{ isHit: "desc" }, { updatedAt: "desc" }],
    take: options?.take,
  });

  if (!rows.length && !(await prisma.product.count())) {
    return FALLBACK_PRODUCTS;
  }

  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  if (!(await dbAvailable())) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const row = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: { select: { id: true, slug: true, name: true } } },
  });
  return row ? mapProduct(row) : null;
}

export async function getPage(slug: string) {
  if (!(await dbAvailable())) return null;
  return prisma.page.findUnique({ where: { slug } });
}

export async function getSettings(): Promise<Record<string, string>> {
  if (!(await dbAvailable())) return {};
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const settings = await getSettings();
  const phone = settings.phone || SITE.phone;
  return {
    name: SITE.name,
    phone,
    phoneHref: phoneToHref(phone),
    email: settings.email || SITE.email,
    cities: settings.cities || SITE.cities,
    tagline: settings.tagline || SITE.tagline,
    about: settings.about || SITE.about,
    aboutExtra: settings.aboutExtra || SITE.aboutExtra,
    logoUrl: settings.logoUrl?.trim() || null,
    faviconUrl: settings.faviconUrl?.trim() || null,
    heroTitle: settings.heroTitle || "Косметологические аппараты",
    heroTitleLine: settings.heroTitleLine || "для салонов красоты",
    heroText:
      settings.heroText ||
      "Более 1000 специалистов уже работают на подобном оборудовании. Подберём аппарат под задачи вашего кабинета.",
    heroCtaPrimary: settings.heroCtaPrimary || "Перейти в каталог",
    heroCtaSecondary: settings.heroCtaSecondary || "Получить консультацию",
  };
}

export async function getFaqs(): Promise<FaqDTO[]> {
  if (!(await dbAvailable())) {
    return FAQ_ITEMS.map((item, index) => ({
      id: `faq-${index}`,
      question: item.question,
      answer: item.answer,
      sortOrder: index,
    }));
  }

  const rows = await prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) {
    return FAQ_ITEMS.map((item, index) => ({
      id: `faq-${index}`,
      question: item.question,
      answer: item.answer,
      sortOrder: index,
    }));
  }
  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    sortOrder: r.sortOrder,
  }));
}

export async function getBrands(): Promise<BrandDTO[]> {
  if (!(await dbAvailable())) {
    return BRANDS.map((name, index) => ({
      id: `brand-${index}`,
      name,
      sortOrder: index,
    }));
  }

  const rows = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) {
    return BRANDS.map((name, index) => ({
      id: `brand-${index}`,
      name,
      sortOrder: index,
    }));
  }
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    sortOrder: r.sortOrder,
  }));
}

export async function getAdvantages(): Promise<AdvantageDTO[]> {
  if (!(await dbAvailable())) {
    return ADVANTAGES.map((item, index) => ({
      id: `adv-${index}`,
      title: item.title,
      text: item.text,
      sortOrder: index,
    }));
  }

  const rows = await prisma.advantage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) {
    return ADVANTAGES.map((item, index) => ({
      id: `adv-${index}`,
      title: item.title,
      text: item.text,
      sortOrder: index,
    }));
  }
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    text: r.text,
    sortOrder: r.sortOrder,
  }));
}

export async function getPromos(): Promise<PromoDTO[]> {
  if (!(await dbAvailable())) {
    return PROMOS.map((p, index) => ({
      id: p.id,
      slug: p.id,
      eyebrow: p.eyebrow,
      title: p.title,
      text: p.text,
      cta: p.cta,
      href: p.href,
      imageUrl: p.imageUrl,
      tone: p.tone,
      sortOrder: index,
    }));
  }

  const rows = await prisma.promoBanner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) {
    return PROMOS.map((p, index) => ({
      id: p.id,
      slug: p.id,
      eyebrow: p.eyebrow,
      title: p.title,
      text: p.text,
      cta: p.cta,
      href: p.href,
      imageUrl: p.imageUrl,
      tone: p.tone,
      sortOrder: index,
    }));
  }
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    eyebrow: r.eyebrow,
    title: r.title,
    text: r.text,
    cta: r.cta,
    href: r.href,
    imageUrl: r.imageUrl,
    tone: r.tone,
    sortOrder: r.sortOrder,
  }));
}

export async function getHeroSlides(): Promise<HeroSlideDTO[]> {
  if (!(await dbAvailable())) {
    return HERO_SLIDES.map((s, index) => ({
      id: s.id,
      slug: s.id,
      eyebrow: s.eyebrow,
      title: s.title,
      text: s.text,
      note: s.note,
      cta: s.cta,
      href: s.href,
      imageUrl: s.imageUrl,
      tone: s.tone,
      sortOrder: index,
    }));
  }

  const rows = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) {
    return HERO_SLIDES.map((s, index) => ({
      id: s.id,
      slug: s.id,
      eyebrow: s.eyebrow,
      title: s.title,
      text: s.text,
      note: s.note,
      cta: s.cta,
      href: s.href,
      imageUrl: s.imageUrl,
      tone: s.tone,
      sortOrder: index,
    }));
  }
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    eyebrow: r.eyebrow,
    title: r.title,
    text: r.text,
    note: r.note,
    cta: r.cta,
    href: r.href,
    imageUrl: r.imageUrl,
    tone: r.tone,
    sortOrder: r.sortOrder,
  }));
}

export async function createLead(input: {
  name: string;
  phone: string;
  message?: string;
  source?: string;
  productId?: string;
  items?: Array<{ productId?: string; name: string; quantity: number }>;
}) {
  if (!(await dbAvailable())) {
    return { id: `local-${Date.now()}`, ...input, createdAt: new Date() };
  }

  let productId = input.productId;
  if (productId) {
    const exists = await prisma.product.findUnique({ where: { id: productId } });
    if (!exists) productId = undefined;
  }

  return prisma.lead.create({
    data: {
      name: input.name,
      phone: input.phone,
      message: input.message,
      source: input.source,
      productId: productId || null,
      itemsJson: input.items ? JSON.stringify(input.items) : null,
    },
  }).then(async (lead) => {
    void import("@/lib/amocrm")
      .then(({ syncLeadToAmoCrm }) => syncLeadToAmoCrm(lead.id))
      .catch(() => undefined);
    return lead;
  });
}
