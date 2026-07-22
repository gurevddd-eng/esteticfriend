import Link from "next/link";
import type { CategoryDTO } from "@/lib/content";
import { FEATURED_CATEGORY_SLUGS } from "@/lib/content";

export function CategoryShowcase({ categories }: { categories: CategoryDTO[] }) {
  const featured = FEATURED_CATEGORY_SLUGS.map(
    (slug) => categories.find((c) => c.slug === slug) ?? null,
  ).filter(Boolean) as CategoryDTO[];

  return (
    <section className="section-pad bg-navy text-white">
      <div className="container-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker !text-frost/80">Каталог оборудования</p>
            <h2 className="section-title mt-3 !text-white">Ключевые направления</h2>
          </div>
          <Link href="/catalog" className="btn-ghost w-fit">
            Перейти в каталог
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((category, index) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group relative min-h-44 overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <span className="text-xs font-bold tracking-[0.16em] text-frost/60">
                0{index + 1}
              </span>
              <h3 className="mt-8 font-[family-name:var(--font-syne)] text-2xl font-bold">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-white/60">{category.description}</p>
              <span className="mt-6 inline-block text-sm font-semibold text-frost transition group-hover:translate-x-1">
                Смотреть →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
