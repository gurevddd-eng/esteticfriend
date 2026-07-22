import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_REVIEWS,
  type CategoryDTO,
  type ProductDTO,
  type ReviewDTO,
} from "@/lib/content";
import { prisma } from "@/lib/prisma";

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
    imageUrl: p.imageUrl,
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

export async function getReviews(): Promise<ReviewDTO[]> {
  if (!(await dbAvailable())) return FALLBACK_REVIEWS;

  const rows = await prisma.review.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) return FALLBACK_REVIEWS;
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    age: r.age,
    title: r.title,
    text: r.text,
    sortOrder: r.sortOrder,
  }));
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
  });
}
