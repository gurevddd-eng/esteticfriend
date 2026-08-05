import Image from "next/image";
import type { AdvantageDTO } from "@/lib/catalog";

export function Advantages({ items }: { items: AdvantageDTO[] }) {
  if (!items.length) return null;

  return (
    <section className="advantages">
      <div className="advantages__head">
        <div>
          <p className="section-kicker">Преимущества компании</p>
          <h2 className="section-title mt-3">Почему выбирают ESTETIC FRIEND</h2>
        </div>
        <p className="advantages__lead">
          Сервис, обучение и условия сотрудничества — всё, что нужно, чтобы оборудование
          работало на результат с первого дня.
        </p>
      </div>

      <div className="advantages__media">
        <Image
          src="/advantages/main.webp"
          alt="Команда и оборудование ESTETIC FRIEND"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="advantages__grid">
        {items.map((item, index) => (
          <article key={item.id} className="advantages__item">
            <span className="advantages__num" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="advantages__title">{item.title}</h3>
            <p className="advantages__text">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
