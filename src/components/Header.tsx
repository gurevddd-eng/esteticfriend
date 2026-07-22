"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CallbackModal } from "@/components/CallbackModal";
import { useCart } from "@/components/CartProvider";
import { IconBag, IconClose, IconMenu, IconPhone } from "@/components/icons";
import { NAV_LINKS, SITE, type CategoryDTO } from "@/lib/content";

export function Header({ categories }: { categories: CategoryDTO[] }) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,white_88%,transparent)] backdrop-blur-xl">
        <div className="container-shell flex h-16 items-center justify-between gap-3 md:h-[4.5rem]">
          <Link href="/" className="brand-mark shrink-0 text-[0.95rem] text-navy md:text-base">
            {SITE.name}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setCatalogOpen(true)}
              onMouseLeave={() => setCatalogOpen(false)}
            >
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-navy/80 transition hover:bg-pearl hover:text-navy"
              >
                Каталог
                <span aria-hidden className="text-[0.6rem]">
                  ▾
                </span>
              </Link>
              {catalogOpen ? (
                <div className="absolute left-0 top-full z-50 w-[34rem] pt-2">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-[var(--line)] bg-white p-3 shadow-[0_24px_60px_rgba(10,42,69,0.14)]">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/catalog/${category.slug}`}
                        className="rounded-xl px-3 py-2 text-xs font-medium text-ink/80 transition hover:bg-accent-soft hover:text-azure"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {NAV_LINKS.filter((l) => l.href !== "/catalog").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-2.5 py-1.5 text-xs font-semibold text-navy/80 transition hover:bg-pearl hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={SITE.phoneHref}
              className="hidden text-sm font-bold text-navy xl:inline"
            >
              {SITE.phone}
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-navy transition hover:border-azure/40"
              aria-label="Обратный звонок"
              onClick={() => setCallbackOpen(true)}
            >
              <IconPhone />
            </button>
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-navy transition hover:border-azure/40"
              aria-label={`Корзина${count > 0 ? `, товаров: ${count}` : ""}`}
            >
              <IconBag />
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-bold leading-none text-white">
                  {count}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-white text-navy transition hover:border-azure/40 lg:hidden"
              aria-label="Меню"
              aria-expanded={menuOpen}
              aria-controls="mobile-side-menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-drawer lg:hidden ${menuOpen ? "is-open" : ""}`}
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
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <p className="brand-mark text-sm text-navy">{SITE.name}</p>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-navy"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <IconClose />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-semibold text-navy transition hover:bg-pearl"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-[var(--line)] pt-4">
              <p className="px-3 pb-2 text-xs font-bold tracking-wide text-muted uppercase">
                Каталог
              </p>
              <div className="grid grid-cols-1 gap-0.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/catalog/${category.slug}`}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 transition hover:bg-accent-soft hover:text-azure"
                    onClick={closeMenu}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="mt-auto space-y-2 border-t border-[var(--line)] px-5 py-4">
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
            <Link href="/cart" className="btn-outline w-full" onClick={closeMenu}>
              Корзина{count > 0 ? ` (${count})` : ""}
            </Link>
            <a href={SITE.phoneHref} className="block pt-1 text-center text-sm font-bold text-azure">
              {SITE.phone}
            </a>
          </div>
        </aside>
      </div>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
