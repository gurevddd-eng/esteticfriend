import Link from "next/link";
import type { CategoryDTO } from "@/lib/content";

export function CategoryShowcase({ categories }: { categories: CategoryDTO[] }) {
  const tiles = categories.filter((c) => c.slug !== "novinki");

  return (
    <section className="category-showcase section-pad">
      <div className="category-showcase__head">
        <div>
          <p className="section-kicker">Каталог</p>
          <h2 className="section-title mt-3">Категории аппаратов</h2>
        </div>
        <p className="category-showcase__lead">
          Выберите направление — от эпиляции и SMAS до RF и комбайнов для лица и
          тела.
        </p>
      </div>

      <ol className="category-showcase__list" aria-label="Категории каталога">
        {tiles.map((category, index) => (
          <li key={category.id}>
            <Link
              href={`/catalog/${category.slug}`}
              className="category-showcase__item"
            >
              <span className="category-showcase__index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="category-showcase__name">{category.name}</span>
              <span className="category-showcase__arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="category-showcase__foot">
        <Link href="/catalog" className="btn-primary">
          Весь каталог
        </Link>
      </div>
    </section>
  );
}
