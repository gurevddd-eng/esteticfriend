"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductListActions } from "@/components/ProductListActions";
import { formatPrice } from "@/lib/format";
import type { ProductDTO } from "@/lib/content";

export function ProductCard({ product }: { product: ProductDTO }) {
  const priceLabel = formatPrice(product.price);

  return (
    <article className="product-tile">
      <Link href={`/product/${product.slug}`} className="product-visual block">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3"
          />
        ) : (
          <span className="device-silhouette" />
        )}
        <div className="product-tile__badges">
          {product.isNew ? <span className="badge badge-new">Новинка</span> : null}
          {product.isHit ? <span className="badge badge-hit">Хит</span> : null}
          {!product.inStock ? (
            <span className="badge badge-order">Под заказ</span>
          ) : null}
        </div>
        <ProductListActions
          product={product}
          className="product-list-actions--overlay"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {product.brand ? (
            <Link
              href={`/brands/${product.brand.slug}`}
              className="text-xs font-bold tracking-wide text-azure uppercase"
            >
              {product.brand.name}
            </Link>
          ) : null}
          {product.category ? (
            <Link
              href={`/catalog/${product.category.slug}`}
              className="text-xs font-bold tracking-wide text-azure uppercase"
            >
              {product.category.name}
            </Link>
          ) : null}
        </div>
        <h3 className="font-[family-name:var(--font-syne)] text-lg font-normal leading-snug text-navy">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {product.shortDesc}
        </p>
        <div className="mt-1">
          {priceLabel ? (
            <p className="text-lg font-bold text-navy">{priceLabel}</p>
          ) : (
            <p className="text-sm font-semibold text-muted">Цена по запросу</p>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
            }}
            className="btn-primary !min-h-9 !px-4 !text-sm"
            label="Купить"
            compact
          />
          <Link href={`/product/${product.slug}`} className="btn-outline !min-h-9 !px-4 !text-sm">
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
