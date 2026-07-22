"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { savePage } from "@/actions/admin";

type PageRow = { slug: string; title: string; content: string };

export function PagesAdminClient({ pages }: { pages: PageRow[] }) {
  const router = useRouter();
  const [current, setCurrent] = useState(pages[0] || null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!current) return;
    const fd = new FormData(e.currentTarget);
    await savePage(
      current.slug,
      String(fd.get("title") || ""),
      String(fd.get("content") || ""),
    );
    setMessage("Сохранено");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Страницы
      </h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                current?.slug === p.slug
                  ? "bg-navy !text-white"
                  : "bg-white text-navy border border-[var(--line)]"
              }`}
              onClick={() => {
                setCurrent(p);
                setMessage(null);
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
        {current ? (
          <form
            key={current.slug}
            onSubmit={onSubmit}
            className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5"
          >
            <p className="text-xs font-bold tracking-wide text-muted uppercase">
              /{current.slug}
            </p>
            <input
              name="title"
              required
              className="input-field"
              defaultValue={current.title}
            />
            <textarea
              name="content"
              className="input-field min-h-64 font-mono text-sm"
              defaultValue={current.content}
            />
            {message ? <p className="text-sm text-azure">{message}</p> : null}
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
