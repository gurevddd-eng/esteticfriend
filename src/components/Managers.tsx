import type { HomepageContent } from "@/lib/site";

export function Managers({
  kicker,
  title,
  items,
}: HomepageContent["managers"]) {
  if (!items.length) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-shell">
        <p className="section-kicker">{kicker}</p>
        <h2 className="section-title mt-3">{title}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {items.map((m) => (
            <article
              key={m.name}
              className="rounded-[1.4rem] border border-[var(--line)] bg-pearl/50 p-6 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
                {m.name.slice(0, 1)}
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-syne)] text-lg font-bold text-navy">
                {m.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{m.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
