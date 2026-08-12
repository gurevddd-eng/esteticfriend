import Link from "next/link";
import { FooterBrandLockup } from "@/components/FooterBrandLockup";
import type { SiteInfo } from "@/lib/catalog";
import type { CategoryDTO } from "@/lib/content";

const COMPANY_LINKS = [
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/warranty", label: "Гарантия" },
  { href: "/training", label: "Обучение" },
  { href: "/certificates", label: "Сертификаты" },
  { href: "/contacts", label: "Контакты" },
] as const;

export function Footer({
  categories = [],
  site,
}: {
  categories?: CategoryDTO[];
  site: SiteInfo;
}) {
  const catalogLinks = categories.filter((c) => c.slug !== "novinki").slice(0, 6);

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand-col">
          <FooterBrandLockup className="site-footer__logo" logoUrl={site.logoUrl} />
          <p className="site-footer__tagline">
            {site.tagline ||
              "Профессиональное косметическое оборудование для салонов и клиник."}
          </p>
          <Link href="/#consult" className="btn-lime site-footer__cta">
            Оставить заявку
          </Link>
        </div>

        <div className="site-footer__col">
          <p className="site-footer__title">Каталог</p>
          <ul className="site-footer__list">
            {catalogLinks.map((category) => (
              <li key={category.id}>
                <Link href={`/catalog/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/catalog" className="site-footer__more">
                Весь каталог →
              </Link>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <p className="site-footer__title">Компания</p>
          <ul className="site-footer__list">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <p className="site-footer__title">Контакты</p>
          <ul className="site-footer__list site-footer__list--contacts">
            <li>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <span>{site.cities}</span>
            </li>
            <li>
              <span>Доставка: Россия, СНГ и Китай</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="site-footer__legal">
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/terms">Условия использования</Link>
        </div>
      </div>
    </footer>
  );
}
