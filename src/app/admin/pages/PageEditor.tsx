"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPage, deletePage, savePage } from "@/actions/admin";

type PageData = {
  slug: string;
  title: string;
  content: string;
  updatedAt?: string;
};

export function PageEditor({
  page,
  isNew = false,
}: {
  page?: PageData;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [content, setContent] = useState(page?.content || "<p></p>");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const stats = useMemo(() => {
    const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      chars: plain.length,
      words: plain ? plain.split(" ").length : 0,
    };
  }, [content]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    if (isNew) {
      const res = await createPage(slug, title, content);
      setPending(false);
      if (!res.ok) {
        setError(res.error || "Не удалось создать");
        return;
      }
      router.push(`/admin/pages/${res.slug}`);
      router.refresh();
      return;
    }

    if (!page?.slug) {
      setPending(false);
      setError("Страница не найдена");
      return;
    }

    await savePage(page.slug, title, content);
    setPending(false);
    setMessage("Страница сохранена");
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Материалы</p>
          <h1 className="admin-page__title">
            {isNew ? "Новая страница" : title || page?.title || "Страница"}
          </h1>
          <p className="admin-page__lead">
            {isNew
              ? "Создайте служебную или информационную страницу сайта."
              : `Редактирование /${page?.slug}`}
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/pages" className="btn-outline">
            К списку
          </Link>
          {!isNew && page?.slug ? (
            <Link href={`/${page.slug}`} className="btn-outline" target="_blank">
              На сайте
            </Link>
          ) : null}
          {!isNew && page?.slug ? (
            <button
              type="button"
              className="admin-action-delete"
              onClick={async () => {
                if (!confirm(`Удалить страницу «${title}»?`)) return;
                await deletePage(page.slug);
                router.push("/admin/pages");
                router.refresh();
              }}
            >
              Удалить
            </button>
          ) : null}
        </div>
      </header>

      <form onSubmit={onSubmit} className="admin-page-editor">
        <section className="admin-settings-card">
          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Заголовок</span>
              <input
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Например, Доставка и оплата"
              />
            </label>
            <label className="admin-field">
              <span>Slug</span>
              <input
                className="input-field"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required={isNew}
                disabled={!isNew}
                placeholder="delivery"
              />
            </label>
          </div>

          <div className="admin-page-editor__tabs">
            <button
              type="button"
              className={`admin-page-editor__tab${tab === "edit" ? " is-active" : ""}`}
              onClick={() => setTab("edit")}
            >
              HTML
            </button>
            <button
              type="button"
              className={`admin-page-editor__tab${tab === "preview" ? " is-active" : ""}`}
              onClick={() => setTab("preview")}
            >
              Превью
            </button>
            <p className="admin-page-editor__hint">
              Теги: &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;
            </p>
          </div>

          {tab === "edit" ? (
            <label className="admin-field">
              <span>Содержимое</span>
              <textarea
                className="input-field admin-page-editor__code"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
              />
            </label>
          ) : (
            <div className="admin-page-editor__preview">
              <p className="section-kicker">Сервис</p>
              <h2>{title || "Без названия"}</h2>
              <div
                className="admin-page-editor__html"
                dangerouslySetInnerHTML={{ __html: content || "<p>Пусто</p>" }}
              />
            </div>
          )}

          <div className="admin-page-editor__meta">
            <span>{stats.words} слов</span>
            <span>{stats.chars} символов</span>
            {page?.updatedAt ? (
              <span>
                Обновлено{" "}
                {new Date(page.updatedAt).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : null}
          </div>

          {message ? <p className="admin-toast">{message}</p> : null}
          {error ? <p className="admin-login__error">{error}</p> : null}

          <div className="admin-settings-actions">
            <Link href="/admin/pages" className="btn-outline">
              Отмена
            </Link>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? "Сохранение..." : isNew ? "Создать" : "Сохранить"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
