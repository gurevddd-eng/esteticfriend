import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-navy text-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="brand-mark text-lg">{SITE.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Лучшее решение для профессионалов в сфере косметологии для получения
            высокого результата.
          </p>
          <a href={SITE.phoneHref} className="mt-6 inline-block text-lg font-bold">
            {SITE.phone}
          </a>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-white/45 uppercase">
            Навигация
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/80 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-white/45 uppercase">
            Офисы
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            {SITE.cities}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Доставка по России, СНГ и Китаю
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ESTETIC FRIEND</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/80">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
