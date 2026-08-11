import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogProductGrid } from "@/components/CatalogProductGrid";
import { getBrandBySlug, getBrandsWithCounts, getProducts } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Бренд" };
  return {
    title: brand.name,
    description: brand.description || `Аппараты бренда ${brand.name}`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const [brand, brands, products] = await Promise.all([
    getBrandBySlug(slug),
    getBrandsWithCounts(),
    getProducts({ brandSlug: slug }),
  ]);

  if (!brand) notFound();

  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">
          <Link href="/brands">Бренды</Link>
        </p>
        <h1 className="section-title mt-3">{brand.name}</h1>
        {brand.description ? (
          <p className="page__lead">{brand.description}</p>
        ) : (
          <p className="page__lead">Аппараты бренда {brand.name} в каталоге SEVENS.</p>
        )}
      </header>

      <nav className="catalog-filters" aria-label="Бренды">
        <Link href="/brands" className="catalog-filters__item">
          <span className="catalog-filters__index" aria-hidden>
            ·
          </span>
          <span>Все бренды</span>
        </Link>
        {brands.map((item, index) => (
          <Link
            key={item.id}
            href={`/brands/${item.slug}`}
            className={`catalog-filters__item${item.slug === slug ? " is-active" : ""}`}
          >
            <span className="catalog-filters__index" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {products.length ? (
        <CatalogProductGrid products={products} />
      ) : (
        <div className="page-empty">
          <h2 className="page-empty__title">Пока нет аппаратов этого бренда</h2>
          <p className="page-empty__text">
            Оставьте заявку — подберём оборудование {brand.name} под ваши задачи.
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
