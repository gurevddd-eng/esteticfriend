import { ADVANTAGES } from "@/lib/content";

export function Advantages() {
  return (
    <section className="section-pad">
      <div className="container-shell">
        <p className="section-kicker">Преимущества компании</p>
        <h2 className="section-title mt-3">Почему выбирают ESTETIC FRIEND</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((item, index) => (
            <div
              key={item.title}
              className="rounded-[1.4rem] border border-[var(--line)] bg-white p-6"
            >
              <span className="font-[family-name:var(--font-syne)] text-2xl font-bold text-azure/45">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-syne)] text-lg font-bold text-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
