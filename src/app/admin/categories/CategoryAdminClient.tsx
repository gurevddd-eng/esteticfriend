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
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AdminCard className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-black/6 bg-[#faf8f7] text-xs tracking-wide text-[#8a817c] uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Название</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Порядок</th>
                <th className="px-4 py-3 font-bold">Товары</th>
                <th className="px-4 py-3 font-bold" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#17141a]">{c.name}</td>
                  <td className="px-4 py-3 text-[#6f6764]">/{c.slug}</td>
                  <td className="px-4 py-3">{c.sortOrder}</td>
                  <td className="px-4 py-3">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="text-sm font-semibold text-[#b53d4a]"
                        onClick={() => {
                          setEditing(c);
                          setMessage(null);
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="text-sm font-semibold text-rose-700"
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

        <AdminCard className="h-fit p-5">
          <form key={editing?.id || "new"} onSubmit={onSubmit} className="space-y-4">
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#17141a]">
              {editing ? "Редактировать" : "Новая категория"}
            </h2>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">Название</span>
              <input name="name" required className="input-field" defaultValue={editing?.name || ""} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">Slug</span>
              <input name="slug" className="input-field" defaultValue={editing?.slug || ""} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">Описание</span>
              <textarea
                name="description"
                className="input-field min-h-24"
                defaultValue={editing?.description || ""}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">Порядок</span>
              <input
                name="sortOrder"
                type="number"
                className="input-field"
                defaultValue={editing?.sortOrder ?? 0}
              />
            </label>
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
            {message ? <p className="text-sm text-[#b53d4a]">{message}</p> : null}
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
        </AdminCard>
      </div>
    </div>
  );
}
