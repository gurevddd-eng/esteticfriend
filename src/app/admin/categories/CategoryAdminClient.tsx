"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, saveCategory } from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setError(null);
    setOpen(true);
  }

  function openEdit(item: CategoryRow) {
    setEditing(item);
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setError(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
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
    setPending(false);
    if (!res.ok) {
      setError("Ошибка сохранения");
      return;
    }
    closeModal();
    router.refresh();
  }

  const totalProducts = categories.reduce((sum, c) => sum + c._count.products, 0);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Каталог</p>
          <h1 className="admin-page__title">Категории</h1>
          <p className="admin-page__lead">
            {categories.length} раздел{categories.length === 1 ? "" : categories.length < 5 ? "а" : "ов"} ·{" "}
            {totalProducts} товар{totalProducts === 1 ? "" : totalProducts < 5 ? "а" : "ов"}
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/products" className="btn-outline">
            К товарам
          </Link>
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить категорию
          </button>
        </div>
      </header>

      {categories.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Категорий пока нет. Создайте первую.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Порядок</th>
                <th>Название</th>
                <th>Slug</th>
                <th>Товары</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="text-muted">{c.sortOrder}</td>
                  <td>
                    <p className="font-semibold text-navy">{c.name}</p>
                    {c.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{c.description}</p>
                    ) : null}
                  </td>
                  <td>
                    <code className="admin-slug">/{c.slug}</code>
                  </td>
                  <td>
                    <span className="font-semibold text-navy">{c._count.products}</span>
                  </td>
                  <td>
                    <div className="admin-item__actions justify-end">
                      <button
                        type="button"
                        className="admin-action-edit"
                        onClick={() => openEdit(c)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="admin-action-delete"
                        onClick={async () => {
                          if (!confirm(`Удалить категорию «${c.name}»?`)) return;
                          const res = await deleteCategory(c.id);
                          if (!res.ok) {
                            alert(res.error || "Не удалось удалить");
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
        </div>
      )}

      <AdminModal
        open={open}
        onClose={closeModal}
        title={editing ? "Редактировать категорию" : "Новая категория"}
        description="Раздел каталога на сайте"
      >
        <form
          key={editing?.id || "new"}
          onSubmit={onSubmit}
          className="admin-modal-form"
        >
          <label className="admin-field">
            <span>Название</span>
            <input
              name="name"
              required
              className="input-field"
              defaultValue={editing?.name || ""}
              placeholder="Например, SMAS"
            />
          </label>
          <label className="admin-field">
            <span>Slug</span>
            <input
              name="slug"
              className="input-field"
              defaultValue={editing?.slug || ""}
              placeholder="Авто из названия, если пусто"
            />
          </label>
          <label className="admin-field">
            <span>Описание</span>
            <textarea
              name="description"
              className="input-field min-h-24"
              defaultValue={editing?.description || ""}
              placeholder="Кратко о разделе"
            />
          </label>
          <label className="admin-field">
            <span>Порядок</span>
            <input
              name="sortOrder"
              type="number"
              className="input-field"
              defaultValue={editing?.sortOrder ?? categories.length}
            />
          </label>
          {error ? <p className="admin-login__error">{error}</p> : null}
          <div className="admin-modal-form__actions">
            <button type="button" className="btn-outline" onClick={closeModal}>
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
