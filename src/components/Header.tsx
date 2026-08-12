"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { HeaderBrandLockup } from "@/components/HeaderBrandLockup";
import { CallbackModal } from "@/components/CallbackModal";
import { HeaderSearch } from "@/components/HeaderSearch";
import { useCart } from "@/components/CartProvider";
import { useCompare, useFavorites } from "@/components/ProductListsProvider";
import {
  IconBag,
  IconClose,
  IconCompare,
  IconHeart,
  IconMenu,
  IconPhone,
} from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { NAV_LINKS, type CategoryDTO } from "@/lib/content";
import type { SiteInfo } from "@/lib/catalog";

export function Header({
  categories,
  site,
}: {
  categories: CategoryDTO[];
  site: SiteInfo;
}) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(true);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { count: favoritesCount } = useFavorites();
  const { count: compareCount } = useCompare();
  const catalogPanelId = useId();
  const catalogWrapRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const catalogCategories = categories.filter((c) => c.slug !== "novinki");
  const secondaryLinks = NAV_LINKS.filter((l) => l.href !== "/catalog");

  function headerNavLabel(link: (typeof NAV_LINKS)[number]) {
    return "shortLabel" in link && link.shortLabel ? link.shortLabel : link.label;
  }

  useBodyScrollLock(menuOpen);

  const openCatalog = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCatalogOpen(true);
  };

  const scheduleCloseCatalog = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setCatalogOpen(false), 120);
  };

  const closeCatalog = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCatalogOpen(false);
  };

  const closeMenu = () => {
    menuBtnRef.current?.focus({ preventScroll: true });
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen && !catalogOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCatalogOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, catalogOpen]);

  useEffect(() => {
    if (!catalogOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!catalogWrapRef.current?.contains(event.target as Node)) {
        closeCatalog();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [catalogOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <>
      <header className={`site-header${catalogOpen ? " is-catalog-open" : ""}`}>
        <div className="site-header__bar">
          <div className="site-header__start">
            <HeaderBrandLockup className="site-header__brand" logoUrl={site.logoUrl} />
            <HeaderSearch />
          </div>

          <nav className="site-header__nav" aria-label="Основная навигация">
            <div
              ref={catalogWrapRef}
              className="site-header__catalog"
              onMouseEnter={openCatalog}
              onMouseLeave={scheduleCloseCatalog}
            >
              <button
                type="button"
                className={`site-header__link site-header__catalog-trigger${catalogOpen ? " is-active" : ""}`}
                aria-expanded={catalogOpen}
                aria-controls={catalogPanelId}
                onClick={() => setCatalogOpen((open) => !open)}
              >
                Каталог
                <span className="site-header__chevron" aria-hidden />
              </button>

              <div
                id={catalogPanelId}
                className={`site-header__mega${catalogOpen ? " is-open" : ""}`}
                hidden={!catalogOpen}
              >
                <div className="site-header__mega-inner">
                  <div className="site-header__mega-top">
                    <p className="site-header__mega-label">Направления</p>
                    <Link
                      href="/catalog"
                      className="site-header__mega-all"
                      onClick={closeCatalog}
                    >
                      Весь каталог
                      <span aria-hidden>→</span>
                    </Link>
                  </div>

                  <ul className="site-header__mega-grid">
                    {catalogCategories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/catalog/${category.slug}`}
                          className="site-header__mega-card"
                          onClick={closeCatalog}
                        >
                          <span className="site-header__mega-card-name">
                            {category.name}
                          </span>
                          {category.description ? (
                            <span className="site-header__mega-card-desc">
                              {category.description}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="site-header__link">
                {headerNavLabel(link)}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <a href={site.phoneHref} className="site-header__phone">
              {site.phone}
            </a>
            <button
              type="button"
              className="site-header__icon site-header__icon--desktop site-header__icon--callback"
              aria-label="Обратный звонок"
              onClick={() => setCallbackOpen(true)}
            >
              <IconPhone size={18} />
            </button>
            <Link
              href="/favorites"
              className="site-header__icon site-header__icon--desktop"
              aria-label={`Избранное${favoritesCount > 0 ? `, товаров: ${favoritesCount}` : ""}`}
            >
              <IconHeart size={18} />
              {favoritesCount > 0 ? (
                <span className="site-header__badge">{favoritesCount}</span>
              ) : null}
            </Link>
            <Link
              href="/compare"
              className="site-header__icon site-header__icon--desktop"
              aria-label={`Сравнение${compareCount > 0 ? `, товаров: ${compareCount}` : ""}`}
            >
              <IconCompare size={18} />
              {compareCount > 0 ? (
                <span className="site-header__badge">{compareCount}</span>
              ) : null}
            </Link>
            <Link
              href="/cart"
              className="site-header__icon"
              aria-label={`Корзина${count > 0 ? `, товаров: ${count}` : ""}`}
            >
              <IconBag size={18} />
              {count > 0 ? (
                <span className="site-header__badge">{count}</span>
              ) : null}
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              className="site-header__icon site-header__menu-btn"
              aria-label="Меню"
              aria-expanded={menuOpen}
              aria-controls="mobile-side-menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-drawer${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="mobile-drawer__backdrop"
          aria-label="Закрыть меню"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />
        <aside
          id="mobile-side-menu"
          className="mobile-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Меню сайта"
          inert={!menuOpen ? true : undefined}
        >
          <div className="mobile-drawer__head">
            <div>
              <div onClick={closeMenu}>
                <HeaderBrandLockup logoUrl={site.logoUrl} compact />
              </div>
              <a href={site.phoneHref} className="mobile-drawer__head-phone">
                {site.phone}
              </a>
            </div>
            <button
              type="button"
              className="site-header__icon"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <IconClose />
            </button>
          </div>

          <div className="mobile-drawer__tools" aria-label="Быстрые разделы">
            <Link
              href="/favorites"
              className="mobile-drawer__tool"
              tabIndex={menuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              <IconHeart size={18} />
              <span>Избранное</span>
              {favoritesCount > 0 ? (
                <em className="mobile-drawer__tool-count">{favoritesCount}</em>
              ) : null}
            </Link>
            <Link
              href="/compare"
              className="mobile-drawer__tool"
              tabIndex={menuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              <IconCompare size={18} />
              <span>Сравнение</span>
              {compareCount > 0 ? (
                <em className="mobile-drawer__tool-count">{compareCount}</em>
              ) : null}
            </Link>
            <Link
              href="/cart"
              className="mobile-drawer__tool"
              tabIndex={menuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              <IconBag size={18} />
              <span>Корзина</span>
              {count > 0 ? (
                <em className="mobile-drawer__tool-count">{count}</em>
              ) : null}
            </Link>
          </div>

          <nav className="mobile-drawer__nav" aria-label="Мобильная навигация">
            <div className="mobile-drawer__group">
              <button
                type="button"
                className={`mobile-drawer__group-trigger${mobileCatalogOpen ? " is-open" : ""}`}
                aria-expanded={mobileCatalogOpen}
                onClick={() => setMobileCatalogOpen((open) => !open)}
              >
                <span>Каталог</span>
                <span className="site-header__chevron" aria-hidden />
              </button>

              {mobileCatalogOpen ? (
                <ul className="mobile-drawer__catalog">
                  <li>
                    <Link
                      href="/catalog"
                      className="mobile-drawer__catalog-all"
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={closeMenu}
                    >
                      Весь каталог
                    </Link>
                  </li>
                  {catalogCategories.map((category, index) => (
                    <li key={category.id}>
                      <Link
                        href={`/catalog/${category.slug}`}
                        className="mobile-drawer__catalog-item"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={closeMenu}
                      >
                        <span aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-drawer__link"
                tabIndex={menuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-drawer__foot">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                closeMenu();
                setCallbackOpen(true);
              }}
            >
              Обратный звонок
            </button>
            <a href={site.phoneHref} className="mobile-drawer__call">
              <IconPhone size={16} />
              Позвонить
            </a>
          </div>
        </aside>
      </div>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
