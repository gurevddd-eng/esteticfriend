"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CallbackModal } from "@/components/CallbackModal";
import { useCart } from "@/components/CartProvider";
import { IconBag, IconClose, IconMenu, IconPhone } from "@/components/icons";
import { NAV_LINKS, SITE, type CategoryDTO } from "@/lib/content";

export function Header({ categories }: { categories: CategoryDTO[] }) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const { count } = useCart();

  useEffect(() => {
    const node = menuRef.current;
    if (!node) return;

    const close = () => {
      node.open = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!node.open) return;
      if (event.target instanceof Node && node.contains(event.target)) return;
      close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };

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

            <details ref={menuRef} className="mobile-nav relative lg:hidden">
              <summary
                className="inline-flex h-10 w-10 shrink-0 list-none items-center justify-center rounded-full border border-[var(--line)] bg-white text-navy [&::-webkit-details-marker]:hidden"
                aria-label="Меню"
              >
                <IconMenu className="mobile-nav__icon block" />
                <IconClose className="mobile-nav__close hidden" />
              </summary>

              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_60px_rgba(20,17,22,0.16)]">
                <div className="flex flex-col gap-1 p-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-xl px-3 py-3 text-sm font-semibold text-navy"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-1 grid grid-cols-2 gap-1 border-t border-[var(--line)] pt-3">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/catalog/${category.slug}`}
                        className="rounded-lg px-2 py-2 text-xs font-medium text-muted"
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-1 rounded-xl px-3 py-3 text-left text-sm font-semibold text-navy"
                    onClick={() => {
                      closeMenu();
                      setCallbackOpen(true);
                    }}
                  >
                    Обратный звонок
                  </button>
                  <Link
                    href="/cart"
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-navy"
                    onClick={closeMenu}
                  >
                    Корзина{count > 0 ? ` (${count})` : ""}
                  </Link>
                  <a href={SITE.phoneHref} className="mt-1 px-3 pb-1 text-sm font-bold text-azure">
                    {SITE.phone}
                  </a>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
