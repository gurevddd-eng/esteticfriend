import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="section-pad">
      <div className="container-shell">
        <p className="section-kicker">Каталог</p>
        <h1 className="section-title mt-3">{category.name}</h1>
        {category.description ? (
          <p className="mt-4 max-w-2xl text-muted">{category.description}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/catalog"
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-navy"
          >
            Все
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/catalog/${item.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                item.slug === slug
                  ? "bg-navy !text-white"
                  : "border border-[var(--line)] bg-white text-navy hover:border-azure hover:text-azure"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {products.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[1.4rem] border border-[var(--line)] bg-white p-10 text-center">
            <p className="font-semibold text-navy">В этой категории пока нет позиций</p>
            <p className="mt-2 text-sm text-muted">
              Оставьте заявку — подберём подходящий аппарат под ваши задачи.
            </p>
            <Link href="/#consult" className="btn-primary mt-6 inline-flex">
              Получить консультацию
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
