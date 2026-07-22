"use client";

import Link from "next/link";
import { useState } from "react";
import { CallbackModal } from "@/components/CallbackModal";
import { useCart } from "@/components/CartProvider";
import { NAV_LINKS, SITE, type CategoryDTO } from "@/lib/content";

export function Header({ categories }: { categories: CategoryDTO[] }) {
  const [open, setOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const { count } = useCart();

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
              className="btn-outline hidden !min-h-10 !px-3 !text-xs md:inline-flex"
              onClick={() => setCallbackOpen(true)}
            >
              Обратный звонок
            </button>
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-navy transition hover:border-azure/40"
              aria-label={`Корзина${count > 0 ? `, товаров: ${count}` : ""}`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 8h12l-1.1 10.1a2 2 0 0 1-2 1.9H9.1a2 2 0 0 1-2-1.9L6 8Z" />
                <path d="M9 8V6.5A3 3 0 0 1 12 3.5 3 3 0 0 1 15 6.5V8" />
              </svg>
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-bold leading-none text-white">
                  {count}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white lg:hidden"
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-[var(--line)] bg-white lg:hidden">
            <div className="container-shell flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-navy"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-1 border-t border-[var(--line)] pt-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/catalog/${category.slug}`}
                    className="rounded-lg px-2 py-2 text-xs font-medium text-muted"
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-navy"
                onClick={() => {
                  setOpen(false);
                  setCallbackOpen(true);
                }}
              >
                Обратный звонок
              </button>
              <Link
                href="/cart"
                className="rounded-xl px-3 py-3 text-sm font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                Корзина{count > 0 ? ` (${count})` : ""}
              </Link>
              <a href={SITE.phoneHref} className="mt-2 px-3 text-sm font-bold text-azure">
                {SITE.phone}
              </a>
            </div>
          </div>
        ) : null}
      </header>
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
