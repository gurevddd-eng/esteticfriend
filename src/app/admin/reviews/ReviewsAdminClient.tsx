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
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {reviews.map((r) => (
            <AdminCard key={r.id}>
              <div style={{ padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                      <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>{r.title}</h2>
                      {!r.isActive ? <AdminBadge>Скрыт</AdminBadge> : null}
                    </div>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--ea-muted)" }}>
                      {r.author}
                      {r.age ? `, ${r.age}` : ""} · порядок {r.sortOrder}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button type="button" className="ea-btn ea-btn--ghost ea-btn--sm" onClick={() => setEditing(r)}>
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="ea-btn ea-btn--danger ea-btn--sm"
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
                <p style={{ margin: "0.65rem 0 0", fontSize: "0.9rem", color: "var(--ea-muted)" }}>{r.text}</p>
              </div>
            </AdminCard>
          ))}
        </div>

        <AdminCard>
          <form key={editing?.id || "new"} onSubmit={onSubmit} style={{ padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
            <h2 className="ea-panel__title">{editing ? "Редактировать" : "Новый отзыв"}</h2>
            <input name="author" required className="ea-input" placeholder="Автор" defaultValue={editing?.author || ""} />
            <input name="age" type="number" className="ea-input" placeholder="Возраст" defaultValue={editing?.age ?? ""} />
            <input name="title" required className="ea-input" placeholder="Заголовок" defaultValue={editing?.title || ""} />
            <textarea name="text" required className="ea-textarea" placeholder="Текст" defaultValue={editing?.text || ""} />
            <input name="sortOrder" type="number" className="ea-input" placeholder="Порядок" defaultValue={editing?.sortOrder ?? 0} />
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
              <input name="isActive" type="checkbox" defaultChecked={editing?.isActive ?? true} />
              Показывать на сайте
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="ea-btn ea-btn--primary">
                Сохранить
              </button>
              {editing ? (
                <button type="button" className="ea-btn ea-btn--secondary" onClick={() => setEditing(null)}>
                  Отмена
                </button>
              ) : null}
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
