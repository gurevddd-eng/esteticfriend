import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_REVIEWS,
  type CategoryDTO,
  type ProductDTO,
  type ReviewDTO,
} from "@/lib/content";

export async function getCategories(): Promise<CategoryDTO[]> {
  return FALLBACK_CATEGORIES;
}

export async function getCategoryBySlug(slug: string) {
  return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(options?: {
  categorySlug?: string;
  isNew?: boolean;
  isHit?: boolean;
  take?: number;
}): Promise<ProductDTO[]> {
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

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getReviews(): Promise<ReviewDTO[]> {
  return FALLBACK_REVIEWS;
}

export async function createLead(input: {
  name: string;
  phone: string;
  message?: string;
  source?: string;
  productId?: string;
}) {
  return { id: `local-${Date.now()}`, ...input, createdAt: new Date() };
}
