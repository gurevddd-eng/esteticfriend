import type { ProductDTO } from "@/lib/content";

export type CatalogSortKey =
  | "popular"
  | "discount"
  | "price-asc"
  | "price-desc"
  | "new";

export const CATALOG_SORT_OPTIONS: { value: CatalogSortKey; label: string }[] = [
  { value: "popular", label: "По популярности" },
  { value: "discount", label: "По величине скидки" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "new", label: "По новизне" },
];

export const DEFAULT_CATALOG_SORT: CatalogSortKey = "popular";

export type ProductSortMeta = {
  compareAtPrice?: number | null;
  leadCount?: number;
  createdAt?: string | null;
};

export type CatalogProduct = ProductDTO & ProductSortMeta;

/** Fallback compare-at prices for static catalog data keyed by product slug. */
export const PRODUCT_COMPARE_AT_META: Record<string, number> = {};

export function enrichProductForSort(
  product: ProductDTO,
  extra?: Pick<ProductSortMeta, "leadCount" | "createdAt">,
): CatalogProduct {
  return {
    ...product,
    compareAtPrice: product.compareAtPrice ?? PRODUCT_COMPARE_AT_META[product.slug] ?? null,
    leadCount: extra?.leadCount ?? 0,
    createdAt: extra?.createdAt ?? null,
  };
}

function discountPercent(product: CatalogProduct): number {
  const { price, compareAtPrice } = product;
  if (price == null || compareAtPrice == null || compareAtPrice <= price) return 0;
  return ((compareAtPrice - price) / compareAtPrice) * 100;
}

function popularityScore(product: CatalogProduct): number {
  const hitBoost = product.isHit ? 1_000 : 0;
  const newBoost = product.isNew ? 100 : 0;
  const leads = product.leadCount ?? 0;
  return hitBoost + newBoost + leads * 10;
}

function priceRank(price: number | null | undefined, asc: boolean): number {
  if (price == null) return asc ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  return price;
}

function compareByName(a: CatalogProduct, b: CatalogProduct): number {
  return a.name.localeCompare(b.name, "ru");
}

export function sortCatalogProducts(
  products: CatalogProduct[],
  sort: CatalogSortKey,
): CatalogProduct[] {
  const items = [...products];

  items.sort((a, b) => {
    let diff = 0;

    switch (sort) {
      case "popular":
        diff = popularityScore(b) - popularityScore(a);
        break;
      case "discount":
        diff = discountPercent(b) - discountPercent(a);
        break;
      case "price-asc":
        diff = priceRank(a.price, true) - priceRank(b.price, true);
        break;
      case "price-desc":
        diff = priceRank(b.price, false) - priceRank(a.price, false);
        break;
      case "new": {
        const newDiff = Number(b.isNew) - Number(a.isNew);
        if (newDiff !== 0) {
          diff = newDiff;
          break;
        }
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        diff = bTime - aTime;
        break;
      }
    }

    return diff !== 0 ? diff : compareByName(a, b);
  });

  return items;
}

export function formatProductCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} аппарат`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} аппарата`;
  }
  return `${count} аппаратов`;
}
