import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";
import { SITE } from "@/lib/content";
import { getBrandsSectionConfig, getBrandsWithCounts } from "@/lib/catalog";
import { brandsLabel, productsLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Бренды",
  description: `Производители косметологического оборудования в каталоге ${SITE.name}. Документы и письма о полномочиях — по запросу.`,
};

export default async function BrandsPage() {
  const [brands, section] = await Promise.all([
    getBrandsWithCounts(),
    getBrandsSectionConfig(),
  ]);

  const totalProducts = brands.reduce(
    (sum, brand) => sum + (brand._count?.products ?? 0),
    0,
  );

  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">{section.kicker || "Партнёры"}</p>
          <h1 className="section-title mt-3">Бренды</h1>
          <p className="page__lead">
            {section.lead ||
              "Работаем с проверенными заводами и по запросу предоставляем документы на оборудование."}
          </p>

          <ul className="contact-facts delivery-facts">
            <li>
              <span className="contact-facts__label">В каталоге</span>
              <span className="contact-facts__value">
                {brands.length ? brandsLabel(brands.length) : "Скоро появятся"}
              </span>
            </li>
            <li>
              <span className="contact-facts__label">Аппараты</span>
              <span className="contact-facts__value">
                {totalProducts ? productsLabel(totalProducts) : "По запросу"}
              </span>
            </li>
            <li>
              <span className="contact-facts__label">Документы</span>
              <span className="contact-facts__value">По запросу</span>
            </li>
          </ul>

          <section className="delivery-block" aria-labelledby="brands-list">
            <h2 id="brands-list" className="delivery-block__title">
              Производители
            </h2>

            {brands.length ? (
              <ul className="brands-index">
                {brands.map((brand, index) => {
                  const count = brand._count?.products ?? 0;
                  return (
                    <li key={brand.id}>
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="brands-index__item"
                      >
                        <span className="brands-index__index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="brands-index__body">
                          <span className="brands-index__name">{brand.name}</span>
                          {brand.description ? (
                            <span className="brands-index__desc">
                              {brand.description}
                            </span>
                          ) : null}
                          <span className="brands-index__meta">
                            {count ? productsLabel(count) : "По запросу"}
                          </span>
                        </span>
                        <span className="brands-index__arrow" aria-hidden>
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="page-empty">
                <h2 className="page-empty__title">Бренды скоро появятся</h2>
                <p className="page-empty__text">
                  Оставьте заявку — подберём оборудование под задачи вашего
                  салона.
                </p>
              </div>
            )}
          </section>

          <section className="delivery-block" aria-labelledby="brands-docs">
            <h2 id="brands-docs" className="delivery-block__title">
              {section.title || "Письма о полномочиях"}
            </h2>
            <p className="delivery-note brands-docs-lead">
              По запросу предоставим сертификаты и сопроводительные документы на
              интересующие аппараты.
            </p>
            <p className="brands-page-cta">
              <Link
                href={section.ctaHref || "/certificates"}
                className="btn-outline"
              >
                {section.cta || "Смотреть сертификаты"}
              </Link>
            </p>
          </section>
        </div>

        <PageFormPanel
          title="Подобрать бренд"
          lead="Оставьте контакты — подскажем производителя и аппараты под ваши задачи."
        >
          <LeadForm source="brands" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
