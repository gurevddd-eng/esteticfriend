"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePage } from "@/actions/admin";

type PageRow = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

function plainPreview(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function PagesAdminClient({ pages }: { pages: PageRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        plainPreview(p.content).toLowerCase().includes(q),
    );
  }, [pages, query]);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Материалы</p>
          <h1 className="admin-page__title">Страницы</h1>
          <p className="admin-page__lead">
            {pages.length} в CMS — доставка, гарантия, обучение и юридические тексты.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/settings" className="btn-outline">
            Настройки
          </Link>
          <Link href="/admin/pages/new" className="btn-primary">
            Новая страница
          </Link>
        </div>
      </header>

      <div className="admin-toolbar admin-toolbar--single">
        <label className="admin-field">
          <span>Поиск</span>
          <input
            className="input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Заголовок, slug или текст"
          />
        </label>
      </div>

      {pages.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Страниц пока нет. Создайте первую.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Ничего не найдено.</p>
        </div>
      ) : (
        <div className="admin-pages-grid">
          {filtered.map((page) => {
            const preview = plainPreview(page.content);
            return (
              <article key={page.slug} className="admin-page-card">
                <div className="admin-page-card__top">
                  <code className="admin-slug">/{page.slug}</code>
                  <time className="admin-page-card__time">
                    {new Date(page.updatedAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <h2 className="admin-page-card__title">
                  <Link href={`/admin/pages/${page.slug}`}>{page.title}</Link>
                </h2>
                <p className="admin-page-card__preview">
                  {preview ? preview.slice(0, 160) + (preview.length > 160 ? "…" : "") : "Пустая страница"}
                </p>
                <div className="admin-page-card__actions">
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="admin-page-card__btn admin-page-card__btn--primary"
                  >
                    Редактировать
                  </Link>
                  <div className="admin-page-card__actions-row">
                    <Link
                      href={`/${page.slug}`}
                      className="admin-page-card__btn admin-page-card__btn--ghost"
                      target="_blank"
                      rel="noreferrer"
                    >
                      На сайте
                    </Link>
                    <button
                      type="button"
                      className="admin-page-card__btn admin-page-card__btn--danger"
                      onClick={async () => {
                        if (!confirm(`Удалить страницу «${page.title}»?`)) return;
                        await deletePage(page.slug);
                        router.refresh();
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
