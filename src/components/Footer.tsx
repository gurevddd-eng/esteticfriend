import Link from "next/link";
import type { CategoryDTO } from "@/lib/content";
import type { SiteConfig } from "@/lib/site";

export function Footer({
  categories = [],
  site,
}: {
  categories?: CategoryDTO[];
  site: SiteConfig;
}) {
  const catalogLinks = categories.slice(0, 8);

  return (
    <footer className="border-t border-[var(--line)] bg-navy text-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="brand-mark text-lg">{site.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {site.footerText}
          </p>
          <a href={site.phoneHref} className="mt-6 inline-block text-lg font-bold">
            {site.phone}
          </a>
          <p className="mt-2 text-sm text-white/70">{site.email}</p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-white/45 uppercase">
            Каталог аппаратов
          </p>
          <ul className="mt-4 space-y-2">
            {catalogLinks.map((c) => (
              <li key={c.id}>
                <Link href={`/catalog/${c.slug}`} className="text-sm text-white/80 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalog" className="text-sm text-white/80 hover:text-white">
                Все аппараты
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-white/45 uppercase">
            Компания
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/delivery" className="text-sm text-white/80 hover:text-white">
                Доставка и оплата
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="text-sm text-white/80 hover:text-white">
                Гарантия
              </Link>
            </li>
            <li>
              <Link href="/training" className="text-sm text-white/80 hover:text-white">
                Обучение
              </Link>
            </li>
            <li>
              <Link href="/certificates" className="text-sm text-white/80 hover:text-white">
                Сертификаты
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="text-sm text-white/80 hover:text-white">
                Контакты
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-white/45 uppercase">
            Контакты
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">{site.cities}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Доставка по России, СНГ и Китаю
          </p>
          <Link href="/#consult" className="btn-primary mt-6 inline-flex !min-h-10 !px-4 !text-sm">
            Оставить заявку
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white/80">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
