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
    setCurrentId("");
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
          <button type="button" className="btn-primary !min-h-10 !text-sm" onClick={() => startCreate()}>
            + Новая страница
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const exists = pages.some((p) => p.slug === preset.slug);
          return (
            <button
              key={preset.slug}
              type="button"
              className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs font-semibold text-[#4a4441]"
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

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <AdminCard className="max-h-[70vh] overflow-y-auto p-2">
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
                className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  currentId === page.id
                    ? "bg-[#17141a] text-white"
                    : "text-[#17141a] hover:bg-[#f3f1ef]"
                }`}
              >
                <span className="block truncate">{page.title}</span>
                <span className={`mt-0.5 block text-xs ${currentId === page.id ? "text-white/60" : "text-[#8a817c]"}`}>
                  /{page.slug || "..."}
                </span>
              </button>
            ))
          )}
        </AdminCard>

        {current ? (
          <AdminCard className="p-5">
            <form key={current.id} onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#8a817c] uppercase">
                  Заголовок
                </span>
                <input name="title" required className="input-field" defaultValue={current.title} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#8a817c] uppercase">
                  Slug (URL)
                </span>
                <input
                  name="slug"
                  required
                  className="input-field"
                  defaultValue={current.slug}
                  disabled={!creating && Boolean(current.slug)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#8a817c] uppercase">
                  Контент (HTML)
                </span>
                <textarea
                  name="content"
                  className="input-field min-h-72 font-mono text-sm"
                  defaultValue={current.content}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#17141a]">
                <input name="isPublished" type="checkbox" defaultChecked={current.isPublished} />
                Опубликована
              </label>
              {message ? <p className="text-sm text-[#b53d4a]">{message}</p> : null}
              {error ? <p className="text-sm text-rose-700">{error}</p> : null}
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary" disabled={pending}>
                  {pending ? "Сохраняем..." : "Сохранить"}
                </button>
                {!creating && current.id !== "__new__" ? (
                  <button
                    type="button"
                    className="btn-outline !text-rose-700"
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
                  <a href={`/${current.slug}`} target="_blank" className="btn-outline">
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
