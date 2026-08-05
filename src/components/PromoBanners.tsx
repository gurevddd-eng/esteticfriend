import Image from "next/image";
import Link from "next/link";
import type { PromoDTO } from "@/lib/catalog";

export function PromoBanners({ promos }: { promos: PromoDTO[] }) {
  if (!promos.length) return null;

  return (
    <section className="promo-banners">
      <div className="promo-banners__grid">
        {promos.map((promo) => (
          <article
            key={promo.id}
            className={`promo-banner promo-banner--${promo.tone}`}
          >
            <div className="promo-banner__media" aria-hidden>
              {promo.imageUrl ? (
                <Image
                  src={promo.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="promo-banner__image"
                />
              ) : null}
            </div>
            <div className="promo-banner__veil" aria-hidden />

            <div className="promo-banner__copy">
              <p className="promo-banner__eyebrow">{promo.eyebrow}</p>
              <h2 className="promo-banner__title">{promo.title}</h2>
              <p className="promo-banner__text">{promo.text}</p>
              <Link
                href={promo.href}
                className={
                  promo.tone === "navy"
                    ? "btn-lime promo-banner__cta"
                    : "btn-primary promo-banner__cta"
                }
              >
                {promo.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
