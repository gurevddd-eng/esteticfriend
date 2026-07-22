"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePage, savePage } from "@/actions/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  confirmDelete,
} from "@/components/admin/ui";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  updatedAt: string;
};

const PRESETS = [
  { slug: "delivery", title: "Доставка и оплата" },
  { slug: "warranty", title: "Гарантия" },
  { slug: "training", title: "Обучение" },
  { slug: "certificates", title: "Сертификаты" },
  { slug: "privacy", title: "Политика конфиденциальности" },
  { slug: "terms", title: "Условия использования" },
];

export function PagesAdminClient({ pages }: { pages: PageRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(pages);
  const [currentId, setCurrentId] = useState(pages[0]?.id || "");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const current = useMemo(
    () => items.find((p) => p.id === currentId) || null,
    [items, currentId],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await savePage({
        id: creating ? undefined : current?.id,
        slug: String(fd.get("slug") || ""),
        title: String(fd.get("title") || ""),
        content: String(fd.get("content") || ""),
        isPublished: fd.get("isPublished") === "on",
      });
      if (!res.ok) {
        setError(res.error || "Ошибка");
        return;
      }
      setCreating(false);
      setMessage("Страница сохранена");
      router.refresh();
    });
  }

  function startCreate(preset?: { slug: string; title: string }) {
    setCreating(true);
    setMessage(null);
    setError(null);
    setItems((prev) => {
      const draft: PageRow = {
        id: "__new__",
        slug: preset?.slug || "",
        title: preset?.title || "Новая страница",
        content: "<p></p>",
        isPublished: true,
        updatedAt: new Date().toISOString(),
      };
      return [draft, ...prev.filter((p) => p.id !== "__new__")];
    });
    setCurrentId("__new__");
  }

  return (
    <div>
      <AdminPageHeader
        title="Страницы"
        description="Тексты политик, сервисов и других CMS-страниц. HTML поддерживается."
        actions={
          <button type="button" className="ea-btn ea-btn--primary" onClick={() => startCreate()}>
            + Новая страница
          </button>
        }
      />

      <div className="ea-toolbar">
        {PRESETS.map((preset) => {
          const exists = pages.some((p) => p.slug === preset.slug);
          return (
            <button
              key={preset.slug}
              type="button"
              className="ea-btn ea-btn--secondary ea-btn--sm"
              onClick={() => {
                if (exists) {
                  const page = items.find((p) => p.slug === preset.slug);
                  if (page) {
                    setCreating(false);
                    setCurrentId(page.id);
                  }
                } else startCreate(preset);
              }}
            >
              {exists ? "✎ " : "+ "}
              {preset.title}
            </button>
          );
        })}
      </div>

      <div className="ea-pages-layout">
        <AdminCard>
          <div style={{ maxHeight: "70vh", overflow: "auto", padding: "0.45rem" }}>
            {items.length === 0 ? (
              <AdminEmpty title="Страниц нет" />
            ) : (
              items.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => {
                    setCreating(page.id === "__new__");
                    setCurrentId(page.id);
                    setMessage(null);
                    setError(null);
                  }}
                  className={`ea-btn ${currentId === page.id ? "ea-btn--primary" : "ea-btn--ghost"}`}
                  style={{ width: "100%", justifyContent: "flex-start", marginBottom: "0.25rem", flexDirection: "column", alignItems: "flex-start", height: "auto", minHeight: "auto", padding: "0.65rem 0.75rem" }}
                >
                  <span style={{ display: "block", fontWeight: 800 }}>{page.title}</span>
                  <span style={{ display: "block", fontSize: "0.75rem", opacity: 0.7 }}>
                    /{page.slug || "..."}
                  </span>
                </button>
              ))
            )}
          </div>
        </AdminCard>

        {current ? (
          <AdminCard>
            <form key={current.id} onSubmit={onSubmit} style={{ padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
              <label>
                <span className="ea-label">Заголовок</span>
                <input name="title" required className="ea-input" defaultValue={current.title} />
              </label>
              <label>
                <span className="ea-label">Slug (URL)</span>
                <input
                  name="slug"
                  required
                  className="ea-input"
                  defaultValue={current.slug}
                  disabled={!creating && Boolean(current.slug)}
                />
              </label>
              <label>
                <span className="ea-label">Контент (HTML)</span>
                <textarea
                  name="content"
                  className="ea-textarea"
                  style={{ minHeight: "18rem", fontFamily: "ui-monospace, monospace", fontSize: "0.85rem" }}
                  defaultValue={current.content}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
                <input name="isPublished" type="checkbox" defaultChecked={current.isPublished} />
                Опубликована
              </label>
              {message ? <p style={{ margin: 0, color: "var(--ea-ok)", fontWeight: 700 }}>{message}</p> : null}
              {error ? <p style={{ margin: 0, color: "var(--ea-danger)", fontWeight: 700 }}>{error}</p> : null}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <button type="submit" className="ea-btn ea-btn--primary" disabled={pending}>
                  {pending ? "Сохраняем..." : "Сохранить"}
                </button>
                {!creating && current.id !== "__new__" ? (
                  <button
                    type="button"
                    className="ea-btn ea-btn--danger"
                    disabled={pending}
                    onClick={() => {
                      if (!confirmDelete(`Удалить страницу «${current.title}»?`)) return;
                      startTransition(async () => {
                        await deletePage(current.id);
                        setCurrentId("");
                        router.refresh();
                      });
                    }}
                  >
                    Удалить
                  </button>
                ) : null}
                {current.slug ? (
                  <a href={`/${current.slug}`} target="_blank" className="ea-btn ea-btn--secondary">
                    Открыть ↗
                  </a>
                ) : null}
              </div>
            </form>
          </AdminCard>
        ) : (
          <AdminCard>
            <AdminEmpty title="Выберите или создайте страницу" />
          </AdminCard>
        )}
      </div>
    </div>
  );
}
