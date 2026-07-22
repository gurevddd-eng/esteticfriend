"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE, type CategoryDTO } from "@/lib/content";

export function Header({ categories }: { categories: CategoryDTO[] }) {
  const [open, setOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,white_88%,transparent)] backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="brand-mark text-[0.95rem] text-navy md:text-base">
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
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-navy/80 transition hover:bg-pearl hover:text-navy"
            >
              Каталог
              <span aria-hidden className="text-[0.65rem]">
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
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 transition hover:bg-accent-soft hover:text-azure"
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
              className="rounded-full px-3 py-2 text-sm font-semibold text-navy/80 transition hover:bg-pearl hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={SITE.phoneHref}
            className="hidden text-sm font-bold text-navy sm:inline"
          >
            {SITE.phone}
          </a>
          <Link href="/#consult" className="btn-primary hidden !min-h-10 !px-4 !text-sm md:inline-flex">
            Консультация
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
            <a href={SITE.phoneHref} className="mt-3 px-3 text-sm font-bold text-azure">
              {SITE.phone}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
