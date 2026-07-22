import Link from "next/link";
import type { HomepageContent } from "@/lib/site";

export function PromoBanners({ promos }: { promos: HomepageContent["promos"] }) {
  if (!promos.length) return null;

  return (
    <section className="section-pad !py-10">
      <div className="container-shell grid gap-4 md:grid-cols-2">
        {promos.map((promo) => (
          <article
            key={`${promo.title}-${promo.href}`}
            className="rounded-[1.4rem] border border-[var(--line)] bg-white p-6 md:p-7"
          >
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
              {promo.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{promo.text}</p>
            <Link href={promo.href} className="btn-outline mt-5 inline-flex !min-h-10 !text-sm">
              {promo.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
