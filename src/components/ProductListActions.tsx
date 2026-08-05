"use client";

import {
  COMPARE_MAX,
  toSavedProduct,
  useCompare,
  useFavorites,
} from "@/components/ProductListsProvider";
import { IconCompare, IconHeart, IconHeartFilled } from "@/components/icons";

type ProductLike = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price?: number | null;
  shortDesc?: string | null;
  inStock?: boolean;
  category?: { name: string } | null;
};

export function ProductListActions({
  product,
  className = "",
}: {
  product: ProductLike;
  className?: string;
}) {
  const favorites = useFavorites();
  const compare = useCompare();
  const saved = toSavedProduct(product);
  const inFavorites = favorites.has(product.id);
  const inCompare = compare.has(product.id);

  return (
    <div className={`product-list-actions ${className}`.trim()}>
      <button
        type="button"
        className={`product-list-actions__btn${inFavorites ? " is-active" : ""}`}
        aria-label={inFavorites ? "Убрать из избранного" : "В избранное"}
        aria-pressed={inFavorites}
        disabled={!favorites.ready}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          favorites.toggle(saved);
        }}
      >
        {inFavorites ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
      </button>
      <button
        type="button"
        className={`product-list-actions__btn${inCompare ? " is-active" : ""}`}
        aria-label={
          inCompare
            ? "Убрать из сравнения"
            : compare.count >= COMPARE_MAX && !inCompare
              ? `Сравнение: максимум ${COMPARE_MAX}`
              : "Сравнить"
        }
        aria-pressed={inCompare}
        disabled={!compare.ready}
        title={
          !inCompare && compare.count >= COMPARE_MAX
            ? `В сравнении уже ${COMPARE_MAX}. Добавление заменит первый.`
            : undefined
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          compare.toggle(saved);
        }}
      >
        <IconCompare size={16} />
      </button>
    </div>
  );
}
