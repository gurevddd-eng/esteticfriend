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
  type BrandDTO,
} from "@/lib/content";
import {
  CONTACT_WIDGET_SETTING_KEY,
  DEFAULT_CONTACT_WIDGET,
  parseContactWidgetConfig,
  type ContactWidgetConfig,
} from "@/lib/contact-widget";
import { prisma } from "@/lib/prisma";
import { enrichProductForSort, type CatalogProduct } from "@/lib/product-sort";

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

export type BrandsSectionConfig = {
  kicker: string;
  title: string;
  lead: string;
  cta: string;
  ctaHref: string;
  isEnabled: boolean;
};

const DEFAULT_BRANDS_SECTION: BrandsSectionConfig = {
  kicker: "Партнёры",
  title: "Письма о полномочиях",
  lead: "Работаем с проверенными заводами и по запросу предоставляем документы на оборудование.",
  cta: "Смотреть сертификаты",
  ctaHref: "/certificates",
  isEnabled: true,
};

export type { BrandDTO };

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

export type CertificateDTO = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

export type CertificatesPageConfig = {
  kicker: string;
  title: string;
  lead: string;
  docs: string[];
  formTitle: string;
  formLead: string;
};

const DEFAULT_CERTIFICATES_PAGE: CertificatesPageConfig = {
  kicker: "Документы",
  title: "Сертификаты",
  lead:
    "Сотрудничаем с проверенными заводами и поставляем оборудование, в качестве которого уверены. По запросу пришлём документы на интересующие аппараты.",
  docs: [
    "Сертификат соответствия",
    "Паспорт оборудования",
    "Инструкция",
    "Гарантийный талон",
  ],
  formTitle: "Запросить документы",
  formLead: "Укажите аппарат — пришлём доступные сертификаты и материалы.",
};

function parseDocsList(raw: string | undefined, fallback: string[]): string[] {
  if (!raw?.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const list = parsed.map((item) => String(item || "").trim()).filter(Boolean);
      return list.length ? list : fallback;
    }
  } catch {
    // plain text, one item per line
  }
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);
  return lines.length ? lines : fallback;
}

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

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const num = Number(
    typeof value === "object" && value !== null && "toString" in value
      ? (value as { toString(): string }).toString()
      : value,
  );
  return Number.isFinite(num) ? num : null;
}

function mapBrand(
  b: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    sortOrder: number;
    _count?: { products: number };
  },
): BrandDTO {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description,
    sortOrder: b.sortOrder,
    _count: b._count,
  };
}

function mapProduct(
  p: {
    id: string;
    slug: string;
    name: string;
    shortDesc: string;
    description: string;
    specs?: string | null;
    kit?: string | null;
    advantages?: string | null;
    imageUrl: string | null;
    price?: unknown;
    compareAtPrice?: unknown;
    inStock: boolean;
    isNew: boolean;
    isHit: boolean;
    categoryId: string;
    brandId?: string | null;
    category?: { id: string; slug: string; name: string } | null;
    brand?: { id: string; slug: string; name: string } | null;
    createdAt?: Date | string;
    _count?: { leads: number };
  },
): ProductDTO {
  const priceNum = toNumber(p.price);
  const compareAtPriceNum = toNumber(p.compareAtPrice);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDesc: p.shortDesc,
    description: p.description,
    specs: p.specs ?? "",
    kit: p.kit ?? "",
    advantages: p.advantages ?? "",
    imageUrl: p.imageUrl
      ? p.imageUrl.replace(/\.(png|jpe?g)$/i, ".webp")
      : p.imageUrl,
    price: priceNum,
    compareAtPrice: compareAtPriceNum,
    inStock: p.inStock,
    isNew: p.isNew,
    isHit: p.isHit,
    categoryId: p.categoryId,
    category: p.category
      ? { id: p.category.id, slug: p.category.slug, name: p.category.name }
      : undefined,
    brandId: p.brandId ?? null,
    brand: p.brand
      ? { id: p.brand.id, slug: p.brand.slug, name: p.brand.name }
      : null,
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
  brandSlug?: string;
  isNew?: boolean;
  isHit?: boolean;
  take?: number;
}): Promise<CatalogProduct[]> {
  if (!(await dbAvailable())) {
    let items = [...FALLBACK_PRODUCTS];
    if (options?.categorySlug === "novinki" || options?.isNew) {
      items = items.filter((p) => p.isNew);
    } else if (options?.categorySlug) {
      items = items.filter((p) => p.category?.slug === options.categorySlug);
    }
    if (options?.brandSlug) {
      items = items.filter((p) => p.brand?.slug === options.brandSlug);
    }
    if (options?.isHit) items = items.filter((p) => p.isHit);
    if (options?.take) items = items.slice(0, options.take);
    return items.map((product) => enrichProductForSort(product));
  }

  const where: {
    isActive: boolean;
    isNew?: boolean;
    isHit?: boolean;
    category?: { slug: string };
    brand?: { slug: string };
  } = { isActive: true };

  if (options?.categorySlug === "novinki" || options?.isNew) {
    where.isNew = true;
  } else if (options?.categorySlug) {
    where.category = { slug: options.categorySlug };
  }
  if (options?.brandSlug) where.brand = { slug: options.brandSlug };
  if (options?.isHit) where.isHit = true;

  const rows = await prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, slug: true, name: true } },
      brand: { select: { id: true, slug: true, name: true } },
      _count: { select: { leads: true } },
    },
    orderBy: [{ isHit: "desc" }, { updatedAt: "desc" }],
    take: options?.take,
  });

  if (!rows.length && !(await prisma.product.count())) {
    return FALLBACK_PRODUCTS.map((product) => enrichProductForSort(product));
  }

  return rows.map((row) =>
    enrichProductForSort(mapProduct(row), {
      leadCount: row._count.leads,
      createdAt: row.createdAt.toISOString(),
    }),
  );
}

export type SearchCategoryResult = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  products: ProductDTO[];
};

export type SearchCatalogResult = {
  categories: SearchCategoryResult[];
  products: ProductDTO[];
};

function queryTokens(normalizedQuery: string) {
  return normalizedQuery.split(/\s+/).filter(Boolean);
}

function matchesTokens(haystackParts: Array<string | null | undefined>, normalizedQuery: string) {
  const haystack = haystackParts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return queryTokens(normalizedQuery).every((token) => haystack.includes(token));
}

function matchesCategoryQuery(category: CategoryDTO, normalizedQuery: string): boolean {
  return matchesTokens(
    [category.name, category.description, category.slug.replace(/-/g, " ")],
    normalizedQuery,
  );
}

function matchesProductDirectQuery(product: ProductDTO, normalizedQuery: string): boolean {
  return matchesTokens(
    [
      product.name,
      product.shortDesc,
      product.brand?.name,
      product.slug.replace(/-/g, " "),
    ],
    normalizedQuery,
  );
}

function categoryProductWhere(categoryId: string) {
  return {
    categoryId,
    isActive: true,
  } as const;
}

function directProductWhere(trimmed: string, excludeIds: string[]) {
  const tokens = queryTokens(trimmed.toLowerCase());
  return {
    isActive: true,
    ...(excludeIds.length ? { id: { notIn: excludeIds } } : {}),
    AND: tokens.map((token) => ({
      OR: [
        { name: { contains: token, mode: "insensitive" as const } },
        { shortDesc: { contains: token, mode: "insensitive" as const } },
        { slug: { contains: token, mode: "insensitive" as const } },
        { brand: { name: { contains: token, mode: "insensitive" as const } } },
      ],
    })),
  };
}

function categoryWhere(trimmed: string) {
  const tokens = queryTokens(trimmed.toLowerCase());
  return {
    AND: tokens.map((token) => ({
      OR: [
        { name: { contains: token, mode: "insensitive" as const } },
        { description: { contains: token, mode: "insensitive" as const } },
        { slug: { contains: token, mode: "insensitive" as const } },
      ],
    })),
  };
}

async function getCategoryProducts(categoryId: string, categorySlug: string) {
  const rows = await prisma.product.findMany({
    where: categoryProductWhere(categoryId),
    include: {
      category: { select: { id: true, slug: true, name: true } },
      brand: { select: { id: true, slug: true, name: true } },
    },
    orderBy: [{ isHit: "desc" }, { name: "asc" }],
  });

  if (rows.length) return rows.map(mapProduct);

  return FALLBACK_PRODUCTS.filter(
    (product) => product.category?.slug === categorySlug || product.categoryId === categoryId,
  );
}

export async function searchCatalog(
  query: string,
  options?: { productLimit?: number },
): Promise<SearchCatalogResult> {
  const trimmed = query.trim();
  if (!trimmed) return { categories: [], products: [] };

  const normalized = trimmed.toLowerCase();
  const productLimit = options?.productLimit ?? 8;

  if (!(await dbAvailable())) {
    const categories = FALLBACK_CATEGORIES.filter((category) =>
      matchesCategoryQuery(category, normalized),
    ).map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      products: FALLBACK_PRODUCTS.filter(
        (product) =>
          product.category?.slug === category.slug || product.categoryId === category.id,
      ),
    }));

    const shownProductIds = new Set(
      categories.flatMap((category) => category.products.map((product) => product.id)),
    );

    const products = FALLBACK_PRODUCTS.filter(
      (product) =>
        matchesProductDirectQuery(product, normalized) && !shownProductIds.has(product.id),
    ).slice(0, productLimit);

    return { categories, products };
  }

  const categoryRows = await prisma.category.findMany({
    where: categoryWhere(trimmed),
    orderBy: { sortOrder: "asc" },
  });

  let categories: SearchCategoryResult[] = await Promise.all(
    categoryRows.map(async (category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      products: await getCategoryProducts(category.id, category.slug),
    })),
  );

  if (!categories.length && !(await prisma.category.count())) {
    categories = FALLBACK_CATEGORIES.filter((category) =>
      matchesCategoryQuery(category, normalized),
    ).map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      products: FALLBACK_PRODUCTS.filter(
        (product) =>
          product.category?.slug === category.slug || product.categoryId === category.id,
      ),
    }));
  }

  const shownProductIds = categories.flatMap((category) =>
    category.products.map((product) => product.id),
  );

  const directRows = await prisma.product.findMany({
    where: directProductWhere(trimmed, shownProductIds),
    include: {
      category: { select: { id: true, slug: true, name: true } },
      brand: { select: { id: true, slug: true, name: true } },
    },
    orderBy: [{ isHit: "desc" }, { name: "asc" }],
    take: productLimit,
  });

  let products = directRows.map(mapProduct);

  if (!products.length && !categories.length && !(await prisma.product.count())) {
    const shownIds = new Set(shownProductIds);
    products = FALLBACK_PRODUCTS.filter(
      (product) =>
        matchesProductDirectQuery(product, normalized) && !shownIds.has(product.id),
    ).slice(0, productLimit);
  }

  return { categories, products };
}

export async function searchProducts(
  query: string,
  limit = 8,
): Promise<ProductDTO[]> {
  const { categories, products } = await searchCatalog(query, { productLimit: limit });
  const fromCategories = categories.flatMap((category) => category.products);
  const shownIds = new Set(fromCategories.map((product) => product.id));
  const extras = products.filter((product) => !shownIds.has(product.id));

  return [...fromCategories, ...extras];
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  if (!(await dbAvailable())) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const row = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, slug: true, name: true } },
      brand: { select: { id: true, slug: true, name: true } },
    },
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

export async function getContactWidgetConfig(): Promise<ContactWidgetConfig> {
  const settings = await getSettings();
  return parseContactWidgetConfig(settings[CONTACT_WIDGET_SETTING_KEY]);
}

export type { ContactWidgetConfig };

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
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      sortOrder: index,
    }));
  }
  return rows.map(mapBrand);
}

export async function getBrandsWithCounts(): Promise<BrandDTO[]> {
  if (!(await dbAvailable())) {
    return getBrands();
  }

  const rows = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!rows.length) return getBrands();
  return rows.map(mapBrand);
}

export async function getBrandBySlug(slug: string): Promise<BrandDTO | null> {
  if (!(await dbAvailable())) {
    const brands = await getBrands();
    return brands.find((brand) => brand.slug === slug) ?? null;
  }

  const row = await prisma.brand.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  return row ? mapBrand(row) : null;
}

export async function getBrandsSectionConfig(): Promise<BrandsSectionConfig> {
  const settings = await getSettings();
  return {
    kicker: settings.brandsKicker || DEFAULT_BRANDS_SECTION.kicker,
    title: settings.brandsTitle || DEFAULT_BRANDS_SECTION.title,
    lead: settings.brandsLead || DEFAULT_BRANDS_SECTION.lead,
    cta: settings.brandsCta || DEFAULT_BRANDS_SECTION.cta,
    ctaHref: settings.brandsCtaHref || DEFAULT_BRANDS_SECTION.ctaHref,
    isEnabled: settings.brandsSectionEnabled !== "0",
  };
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

export async function getCertificatesPageConfig(): Promise<CertificatesPageConfig> {
  if (!(await dbAvailable())) {
    return DEFAULT_CERTIFICATES_PAGE;
  }
  const settings = await getSettings();
  return {
    kicker: settings.certificatesKicker || DEFAULT_CERTIFICATES_PAGE.kicker,
    title: settings.certificatesTitle || DEFAULT_CERTIFICATES_PAGE.title,
    lead: settings.certificatesLead || DEFAULT_CERTIFICATES_PAGE.lead,
    docs: parseDocsList(settings.certificatesDocs, DEFAULT_CERTIFICATES_PAGE.docs),
    formTitle: settings.certificatesFormTitle || DEFAULT_CERTIFICATES_PAGE.formTitle,
    formLead: settings.certificatesFormLead || DEFAULT_CERTIFICATES_PAGE.formLead,
  };
}

export async function getCertificates(): Promise<CertificateDTO[]> {
  if (!(await dbAvailable())) return [];

  const rows = await prisma.certificate.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return rows
    .filter((r) => Boolean(r.imageUrl?.trim()))
    .map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      imageUrl: r.imageUrl,
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
