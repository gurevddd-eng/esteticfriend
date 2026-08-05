import Link from "next/link";
import type { CategoryDTO } from "@/lib/content";

export function CatalogFilters({
  categories,
  activeSlug,
}: {
  categories: CategoryDTO[];
  activeSlug?: string | null;
}) {
  const items = categories.filter((c) => c.slug !== "novinki");

  return (
    <nav className="catalog-filters" aria-label="Категории каталога">
      <Link
        href="/catalog"
        className={`catalog-filters__item${!activeSlug ? " is-active" : ""}`}
      >
        <span className="catalog-filters__index" aria-hidden>
          ·
        </span>
        <span>Все аппараты</span>
      </Link>
      {items.map((category, index) => (
        <Link
          key={category.id}
          href={`/catalog/${category.slug}`}
          className={`catalog-filters__item${activeSlug === category.slug ? " is-active" : ""}`}
        >
          <span className="catalog-filters__index" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{category.name}</span>
        </Link>
      ))}
    </nav>
  );
}
