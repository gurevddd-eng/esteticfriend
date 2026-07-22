"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, saveCategory } from "@/actions/admin";
import {
  AdminCard,
  AdminPageHeader,
  confirmDelete,
} from "@/components/admin/ui";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count: { products: number };
};

export function CategoryAdminClient({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await saveCategory(
      {
        name: String(fd.get("name") || ""),
        slug: String(fd.get("slug") || "") || undefined,
        description: String(fd.get("description") || ""),
        sortOrder: Number(fd.get("sortOrder") || 0),
      },
      editing?.id,
    );
    if (!res.ok) {
      setError("Ошибка сохранения");
      return;
    }
    setEditing(null);
    setMessage("Категория сохранена");
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Категории"
        description="Разделы каталога. Удаление возможно только без товаров внутри."
      />
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <AdminCard className="ea-table-wrap">
          <table className="ea-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Slug</th>
                <th>Порядок</th>
                <th>Товары</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>/{c.slug}</td>
                  <td>{c.sortOrder}</td>
                  <td>{c._count.products}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        className="ea-btn ea-btn--ghost ea-btn--sm"
                        onClick={() => {
                          setEditing(c);
                          setMessage(null);
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="ea-btn ea-btn--danger ea-btn--sm"
                        onClick={async () => {
                          if (!confirmDelete(`Удалить категорию «${c.name}»?`)) return;
                          const res = await deleteCategory(c.id);
                          if (!res.ok) {
                            setError(res.error || "Ошибка");
                            return;
                          }
                          router.refresh();
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>

        <AdminCard>
          <form key={editing?.id || "new"} onSubmit={onSubmit} style={{ padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
            <h2 className="ea-panel__title">{editing ? "Редактировать" : "Новая категория"}</h2>
            <label>
              <span className="ea-label">Название</span>
              <input name="name" required className="ea-input" defaultValue={editing?.name || ""} />
            </label>
            <label>
              <span className="ea-label">Slug</span>
              <input name="slug" className="ea-input" defaultValue={editing?.slug || ""} />
            </label>
            <label>
              <span className="ea-label">Описание</span>
              <textarea name="description" className="ea-textarea" defaultValue={editing?.description || ""} />
            </label>
            <label>
              <span className="ea-label">Порядок</span>
              <input name="sortOrder" type="number" className="ea-input" defaultValue={editing?.sortOrder ?? 0} />
            </label>
            {error ? <p style={{ margin: 0, color: "var(--ea-danger)", fontWeight: 700 }}>{error}</p> : null}
            {message ? <p style={{ margin: 0, color: "var(--ea-ok)", fontWeight: 700 }}>{message}</p> : null}
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
