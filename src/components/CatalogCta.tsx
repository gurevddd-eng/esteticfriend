import Image from "next/image";
import Link from "next/link";

export function CatalogCta() {
  return (
    <section className="catalog-cta">
      <div className="catalog-cta__media" aria-hidden>
        <Image
          src="/about/about-1.webp"
          alt=""
          fill
          sizes="100vw"
          className="catalog-cta__image"
          priority={false}
        />
        <div className="catalog-cta__veil" />
      </div>

      <div className="catalog-cta__content container-shell">
        <div className="catalog-cta__copy">
          <h2 className="catalog-cta__title">Аппараты для косметологии</h2>
          <p className="catalog-cta__text">
            Более 1000 специалистов уже выбрали нас. Присоединяйтесь к успеху!
          </p>
          <Link href="/catalog" className="btn-primary catalog-cta__btn">
            Перейти в каталог
          </Link>
        </div>
      </div>
    </section>
  );
}
