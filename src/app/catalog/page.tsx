import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogProductGrid } from "@/components/CatalogProductGrid";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог",
  description: `Каталог профессионального косметического оборудования ${SITE.name}`,
};

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">Каталог</p>
        <h1 className="section-title mt-3">Каталог косметологического оборудования</h1>
        <p className="page__lead">
          Выберите направление или посмотрите все аппараты.
        </p>
      </header>

      <CatalogFilters categories={categories} />

      <CatalogProductGrid products={products} />
    </div>
  );
}
