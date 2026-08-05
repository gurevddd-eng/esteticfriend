import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Категория" };
  return {
    title: category.name,
    description: category.description ?? `Аппараты категории ${category.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProducts({ categorySlug: slug }),
  ]);

  if (!category) notFound();

  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">Каталог</p>
        <h1 className="section-title mt-3">{category.name}</h1>
        {category.description ? (
          <p className="page__lead">{category.description}</p>
        ) : null}
      </header>

      <CatalogFilters categories={categories} activeSlug={slug} />

      {products.length ? (
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="page-empty">
          <h2 className="page-empty__title">В этой категории пока нет позиций</h2>
          <p className="page-empty__text">
            Оставьте заявку — подберём подходящий аппарат под ваши задачи.
          </p>
          <div className="page-empty__actions">
            <Link href="/#consult" className="btn-primary">
              Получить консультацию
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
