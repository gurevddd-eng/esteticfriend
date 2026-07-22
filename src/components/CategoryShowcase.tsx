import Link from "next/link";
import type { CategoryDTO } from "@/lib/content";
import type { HomepageContent } from "@/lib/site";

export function CategoryShowcase({
  categories,
  content,
}: {
  categories: CategoryDTO[];
  content: HomepageContent["categories"];
}) {
  const tiles = categories.filter((c) => c.slug !== "novinki").slice(0, 8);

  return (
    <section className="section-pad bg-navy text-white">
      <div className="container-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker !text-frost/80">{content.kicker}</p>
            <h2 className="section-title mt-3 !text-white">{content.title}</h2>
          </div>
          <Link href="/catalog" className="btn-ghost w-fit">
            {content.ctaLabel}
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group min-h-36 rounded-[1.4rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold">
                {category.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-white/60">
                {category.description}
              </p>
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
