import Link from "next/link";
import type { SiteInfo } from "@/lib/catalog";
import { DELIVERY_GEO } from "@/lib/content";

export function CompanyVideo({ site }: { site: SiteInfo }) {
  const facts = [
    { label: "Офисы", value: site.cities },
    { label: "Доставка", value: DELIVERY_GEO },
    { label: "Сервис", value: "Обучение и ремонт" },
  ];

  return (
    <section className="company-video">
      <div className="company-video__head">
        <div className="company-video__intro">
          <p className="section-kicker">О компании</p>
          <h2 className="section-title mt-3">Знакомимся ближе</h2>
          <p className="company-video__lead">{site.about}</p>
          <p className="company-video__extra">{site.aboutExtra}</p>
          <div className="company-video__actions">
            <Link href="/contacts" className="btn-primary">
              Контакты
            </Link>
            <Link href="/#consult" className="btn-outline">
              Задать вопрос
            </Link>
          </div>
        </div>

        <ul className="company-video__facts" aria-label="Ключевые факты">
          {facts.map((fact) => (
            <li key={fact.label} className="company-video__fact">
              <span className="company-video__fact-label">{fact.label}</span>
              <span className="company-video__fact-value">{fact.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
