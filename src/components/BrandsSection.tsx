import Link from "next/link";
import type { BrandDTO, BrandsSectionConfig } from "@/lib/catalog";

export function BrandsSection({
  brands,
  config,
}: {
  brands: BrandDTO[];
  config: BrandsSectionConfig;
}) {
  if (!config.isEnabled || !brands.length) return null;

  return (
    <section className="brands-section">
      <div className="brands-section__rail">
        <p className="brands-section__kicker">{config.kicker}</p>
        <h2 className="brands-section__title">{config.title}</h2>
        <p className="brands-section__lead">{config.lead}</p>
        {config.cta ? (
          <Link href={config.ctaHref || "/brands"} className="brands-section__cta">
            {config.cta}
          </Link>
        ) : null}
      </div>

      <ul className="brands-section__names" aria-label="Бренды-партнёры">
        {brands.map((brand) => (
          <li key={brand.id}>
            <Link href={`/brands/${brand.slug}`} className="brands-section__name">
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
