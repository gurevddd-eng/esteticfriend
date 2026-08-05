import Link from "next/link";
import type { BrandDTO } from "@/lib/catalog";

export function BrandsSection({ brands }: { brands: BrandDTO[] }) {
  if (!brands.length) return null;

  return (
    <section className="brands-section">
      <div className="brands-section__rail">
        <p className="brands-section__kicker">Партнёры</p>
        <h2 className="brands-section__title">Письма о полномочиях</h2>
        <p className="brands-section__lead">
          Работаем с проверенными заводами и по запросу предоставляем документы
          на оборудование.
        </p>
        <Link href="/certificates" className="brands-section__cta">
          Смотреть сертификаты
        </Link>
      </div>

      <ul className="brands-section__names" aria-label="Бренды-партнёры">
        {brands.map((brand) => (
          <li key={brand.id}>
            <span className="brands-section__name">{brand.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
