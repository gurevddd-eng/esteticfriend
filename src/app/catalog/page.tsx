import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог профессионального косметического оборудования ESTETIC FRIEND",
};

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="section-pad">
      <div className="container-shell">
        <p className="section-kicker">Каталог</p>
        <h1 className="section-title mt-3">Каталог косметологического оборудования</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Выберите направление или посмотрите все аппараты.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/catalog"
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold !text-white"
          >
            Все
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-azure hover:text-azure"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
