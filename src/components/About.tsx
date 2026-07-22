import Image from "next/image";
import { SITE } from "@/lib/content";

const highlights = [
  { label: "Офисы", value: "Москва и Санкт-Петербург" },
  { label: "Доставка", value: "Россия, СНГ и Китай" },
  { label: "Сервис", value: "Обучение и ремонт" },
] as const;

export function About() {
  return (
    <section className="section-pad bg-pearl/70">
      <div className="about-layout container-shell">
        <div className="about-copy">
          <p className="section-kicker">О нас</p>
          <h2 className="section-title mt-3">{SITE.name}</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">{SITE.about}</p>
          <p className="mt-4 text-base leading-relaxed text-muted">{SITE.aboutExtra}</p>
        </div>

        <aside className="about-rail" aria-label="Ключевые факты">
          <div className="about-rail__line" aria-hidden />
          <ul className="about-rail__list">
            {highlights.map((item) => (
              <li key={item.label}>
                <span className="about-rail__label">{item.label}</span>
                <span className="about-rail__value">{item.value}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="about-shelf" aria-label="Фотографии компании">
          <figure className="about-shelf__item about-shelf__item--side">
            <Image
              src="/about/about-2.png"
              alt="Лазерная эпиляция в кабинете специалиста"
              fill
              sizes="200px"
              className="object-cover"
            />
          </figure>

          <figure className="about-shelf__item about-shelf__item--center">
            <Image
              src="/about/about-1.png"
              alt="Клиенты ESTETIC FRIEND после процедур"
              fill
              sizes="280px"
              className="object-cover"
            />
          </figure>

          <figure className="about-shelf__item about-shelf__item--side">
            <Image
              src="/about/about-3.png"
              alt="Комфортная процедура на профессиональном оборудовании"
              fill
              sizes="200px"
              className="object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
