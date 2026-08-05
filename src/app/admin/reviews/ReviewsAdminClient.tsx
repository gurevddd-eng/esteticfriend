"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteReview, saveReview } from "@/actions/admin";

type ReviewRow = {
  id: string;
  author: string;
  age: number | null;
  title: string;
  text: string;
  sortOrder: number;
  isActive: boolean;
};

export function ReviewsAdminClient({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ReviewRow | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await saveReview(
      {
        author: String(fd.get("author") || ""),
        age: fd.get("age") ? Number(fd.get("age")) : null,
        title: String(fd.get("title") || ""),
        text: String(fd.get("text") || ""),
        sortOrder: Number(fd.get("sortOrder") || 0),
        isActive: fd.get("isActive") === "on",
      },
      editing?.id,
    );
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Отзывы
      </h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-[1.2rem] border border-[var(--line)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-navy">{r.title}</h2>
                  <p className="text-sm text-muted">
                    {r.author}
                    {r.age ? `, ${r.age}` : ""}
                    {!r.isActive ? " · скрыт" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs font-semibold text-navy"
                    onClick={() => setEditing(r)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="text-xs font-semibold text-azure"
                    onClick={async () => {
                      await deleteReview(r.id);
                      router.refresh();
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink/80">{r.text}</p>
            </article>
          ))}
        </div>

        <form
          key={editing?.id || "new"}
          onSubmit={onSubmit}
          className="h-fit space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            {editing ? "Редактировать" : "Новый отзыв"}
          </h2>
          <input
            name="author"
            required
            className="input-field"
            placeholder="Автор"
            defaultValue={editing?.author || ""}
          />
          <input
            name="age"
            type="number"
            className="input-field"
            placeholder="Возраст"
            defaultValue={editing?.age ?? ""}
          />
          <input
            name="title"
            required
            className="input-field"
            placeholder="Заголовок"
            defaultValue={editing?.title || ""}
          />
          <textarea
            name="text"
            required
            className="input-field min-h-28"
            placeholder="Текст"
            defaultValue={editing?.text || ""}
          />
          <input
            name="sortOrder"
            type="number"
            className="input-field"
            placeholder="Порядок"
            defaultValue={editing?.sortOrder ?? 0}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={editing?.isActive ?? true}
            />
            Показывать на сайте
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
            {editing ? (
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>
                Отмена
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
