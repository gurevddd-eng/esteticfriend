import type { Metadata } from "next";
import Link from "next/link";
import { CatalogProductGrid } from "@/components/CatalogProductGrid";
import { enrichProductForSort } from "@/lib/product-sort";
import { searchCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/content";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

function countLabel(count: number) {
  if (count === 1) return "позиция";
  if (count < 5) return "позиции";
  return "позиций";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const query = q.trim();
  return {
    title: query ? `Поиск: ${query}` : "Поиск",
    description: `Поиск профессионального косметического оборудования ${SITE.name}`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const { categories, products } = query
    ? await searchCatalog(query, { productLimit: 48 })
    : { categories: [], products: [] };

  const categoryProducts = categories.flatMap((category) => category.products);
  const shownIds = new Set(categoryProducts.map((product) => product.id));
  const directProducts = products.filter((product) => !shownIds.has(product.id));
  const allProducts = [...categoryProducts, ...directProducts].map((product) =>
    enrichProductForSort(product),
  );
  const totalCount = allProducts.length;

  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">Поиск</p>
        <h1 className="section-title mt-3">
          {query ? `Результаты по запросу «${query}»` : "Поиск по каталогу"}
        </h1>
        <p className="page__lead">
          {query
            ? totalCount
              ? `Найдено ${totalCount} ${countLabel(totalCount)}.`
              : "Попробуйте изменить запрос или посмотрите весь каталог."
            : "Введите название аппарата, категорию или ключевое слово в строке поиска в шапке сайта."}
        </p>
      </header>

      {query && categories.length ? (
        <section className="search-categories">
          {categories.map((category) => (
            <article key={category.id} className="search-categories__item">
              <div className="search-categories__head">
                <div>
                  <p className="section-kicker">Категория</p>
                  <h2 className="search-categories__title">{category.name}</h2>
                  {category.description ? (
                    <p className="search-categories__desc">{category.description}</p>
                  ) : null}
                </div>
                <Link href={`/catalog/${category.slug}`} className="btn-secondary">
                  Вся категория
                </Link>
              </div>
              {category.products.length ? (
                <CatalogProductGrid
                  products={category.products.map((product) => enrichProductForSort(product))}
                />
              ) : (
                <p className="search-categories__empty">В этой категории пока нет аппаратов.</p>
              )}
            </article>
          ))}
        </section>
      ) : null}

      {query && directProducts.length ? (
        <section className={categories.length ? "search-products mt-8" : "search-products"}>
          {categories.length ? (
            <header className="search-products__head">
              <p className="section-kicker">Аппараты</p>
              <h2 className="search-categories__title">Отдельные совпадения</h2>
            </header>
          ) : null}
          <CatalogProductGrid
            products={directProducts.map((product) => enrichProductForSort(product))}
          />
        </section>
      ) : null}

      {query && !totalCount ? (
        <div className="page-empty">
          <h2 className="page-empty__title">По вашему запросу ничего не найдено</h2>
          <p className="page-empty__text">
            Проверьте написание или выберите направление в каталоге.
          </p>
          <div className="page-empty__actions">
            <Link href="/catalog" className="btn-primary">
              Перейти в каталог
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
