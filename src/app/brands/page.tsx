import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/content";
import { getBrandsSectionConfig, getBrandsWithCounts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Бренды",
  description: `Бренды косметологического оборудования в каталоге ${SITE.name}`,
};

export default async function BrandsPage() {
  const [brands, section] = await Promise.all([
    getBrandsWithCounts(),
    getBrandsSectionConfig(),
  ]);

  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">{section.kicker}</p>
        <h1 className="section-title mt-3">{section.title}</h1>
        <p className="page__lead">{section.lead}</p>
      </header>

      {brands.length ? (
        <ul className="brands-page-grid">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link href={`/brands/${brand.slug}`} className="brands-page-card">
                <h2>{brand.name}</h2>
                {brand._count?.products ? (
                  <p>{brand._count.products} аппарат{brand._count.products === 1 ? "" : brand._count.products < 5 ? "а" : "ов"}</p>
                ) : (
                  <p>Каталог бренда</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="page-empty">
          <h2 className="page-empty__title">Бренды скоро появятся</h2>
          <p className="page-empty__text">
            Оставьте заявку — подберём оборудование под задачи вашего салона.
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
