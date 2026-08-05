"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useFavorites } from "@/components/ProductListsProvider";
import { formatPrice } from "@/lib/format";

export function FavoritesView() {
  const { items, ready, remove, clear, count } = useFavorites();

  if (!ready) {
    return <p className="text-muted">Загрузка избранного...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="page-empty">
        <h2 className="page-empty__title">Пока пусто</h2>
        <p className="page-empty__text">
          Добавляйте аппараты в избранное с карточек каталога — список сохранится в
          этом браузере.
        </p>
        <div className="page-empty__actions">
          <Link href="/catalog" className="btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="collection-toolbar">
        <p className="section-kicker">Позиций: {count}</p>
        <button type="button" className="collection-toolbar__clear" onClick={clear}>
          Очистить список
        </button>
      </div>

      <div className="catalog-grid">
        {items.map((item) => (
          <article key={item.productId} className="product-tile">
            <Link href={`/product/${item.slug}`} className="product-visual block">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3"
                />
              ) : (
                <span className="device-silhouette" />
              )}
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-5">
              {item.categoryName ? (
                <p className="text-xs font-bold tracking-wide text-azure uppercase">
                  {item.categoryName}
                </p>
              ) : null}
              <h3 className="font-[family-name:var(--font-syne)] text-lg font-normal leading-snug text-navy">
                <Link href={`/product/${item.slug}`}>{item.name}</Link>
              </h3>
              {item.shortDesc ? (
                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.shortDesc}
                </p>
              ) : null}
              <div className="mt-1">
                {item.price != null ? (
                  <p className="text-lg font-bold text-navy">{formatPrice(item.price)}</p>
                ) : (
                  <p className="text-sm font-semibold text-muted">Цена по запросу</p>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <AddToCartButton
                  product={{
                    id: item.productId,
                    slug: item.slug,
                    name: item.name,
                    imageUrl: item.imageUrl,
                  }}
                  className="btn-primary !min-h-9 !px-4 !text-sm"
                  label="Купить"
                  compact
                />
                <button
                  type="button"
                  className="btn-outline !min-h-9 !px-4 !text-sm"
                  onClick={() => remove(item.productId)}
                >
                  Убрать
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
