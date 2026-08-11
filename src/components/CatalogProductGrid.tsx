"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_SORT,
  formatProductCount,
  sortCatalogProducts,
  type CatalogProduct,
  type CatalogSortKey,
} from "@/lib/product-sort";

export function CatalogProductGrid({ products }: { products: CatalogProduct[] }) {
  const [sort, setSort] = useState<CatalogSortKey>(DEFAULT_CATALOG_SORT);

  const sortedProducts = useMemo(
    () => sortCatalogProducts(products, sort),
    [products, sort],
  );

  if (!products.length) return null;

  return (
    <>
      <div className="catalog-toolbar">
        <p className="catalog-toolbar__count">{formatProductCount(products.length)}</p>
        <div className="catalog-sort">
          <label htmlFor="catalog-sort" className="catalog-sort__label">
            Сортировка
          </label>
          <div className="catalog-sort__control">
            <select
              id="catalog-sort"
              className="catalog-sort__select"
              value={sort}
              onChange={(event) => setSort(event.target.value as CatalogSortKey)}
            >
              {CATALOG_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="catalog-sort__chevron" aria-hidden>
              ▾
            </span>
          </div>
        </div>
      </div>

      <div className="catalog-grid">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
