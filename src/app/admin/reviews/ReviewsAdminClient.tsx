"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteReview, saveReview } from "@/actions/admin";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  confirmDelete,
} from "@/components/admin/ui";

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
      <AdminPageHeader
        title="Отзывы"
        description="Отзывы на главной. Скрытые не показываются посетителям."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {reviews.map((r) => (
            <AdminCard key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-[#17141a]">{r.title}</h2>
                    {!r.isActive ? <AdminBadge>Скрыт</AdminBadge> : null}
                  </div>
                  <p className="text-sm text-[#6f6764]">
                    {r.author}
                    {r.age ? `, ${r.age}` : ""} · порядок {r.sortOrder}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#b53d4a]"
                    onClick={() => setEditing(r)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-rose-700"
                    onClick={async () => {
                      if (!confirmDelete("Удалить отзыв?")) return;
                      await deleteReview(r.id);
                      router.refresh();
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-[#4a4441]">{r.text}</p>
            </AdminCard>
          ))}
        </div>

        <AdminCard className="h-fit p-5">
          <form key={editing?.id || "new"} onSubmit={onSubmit} className="space-y-4">
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#17141a]">
              {editing ? "Редактировать" : "Новый отзыв"}
            </h2>
            <input name="author" required className="input-field" placeholder="Автор" defaultValue={editing?.author || ""} />
            <input name="age" type="number" className="input-field" placeholder="Возраст" defaultValue={editing?.age ?? ""} />
            <input name="title" required className="input-field" placeholder="Заголовок" defaultValue={editing?.title || ""} />
            <textarea name="text" required className="input-field min-h-28" placeholder="Текст" defaultValue={editing?.text || ""} />
            <input name="sortOrder" type="number" className="input-field" placeholder="Порядок" defaultValue={editing?.sortOrder ?? 0} />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input name="isActive" type="checkbox" defaultChecked={editing?.isActive ?? true} />
              Показывать на сайте
            </label>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Сохранить</button>
              {editing ? (
                <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Отмена</button>
              ) : null}
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
