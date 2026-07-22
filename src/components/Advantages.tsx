import Image from "next/image";
import { ADVANTAGES } from "@/lib/content";

export function Advantages() {
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div className="advantages-intro">
          <div className="advantages-intro__copy">
            <p className="section-kicker">Уникальные преимущества</p>
            <h2 className="section-title mt-3">
              ESTETIC FRIEND — лучшее решение для профессионалов в сфере
              косметологии для получения высокого результата
            </h2>
          </div>

          <figure className="advantages-intro__media">
            <Image
              src="/advantages/main.png"
              alt="Кабинет эстетической косметологии ESTETIC FRIEND"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </figure>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ADVANTAGES.map((item, index) => (
            <div
              key={item.title}
              className="rounded-[1.4rem] border border-[var(--line)] bg-white p-7"
            >
              <span className="font-[family-name:var(--font-syne)] text-3xl font-bold text-azure/40">
                0{index + 1}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
