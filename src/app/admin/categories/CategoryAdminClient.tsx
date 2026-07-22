"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, saveCategory } from "@/actions/admin";

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
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Категории
      </h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-x-auto rounded-[1.2rem] border border-[var(--line)] bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Товары</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3 font-semibold text-navy">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.slug}</td>
                  <td className="px-4 py-3">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn-outline !min-h-8 !px-3 !text-xs"
                        onClick={() => setEditing(c)}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-azure"
                        onClick={async () => {
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
        </div>

        <form
          key={editing?.id || "new"}
          onSubmit={onSubmit}
          className="h-fit space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            {editing ? "Редактировать" : "Новая категория"}
          </h2>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Название</span>
            <input name="name" required className="input-field" defaultValue={editing?.name || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Slug</span>
            <input name="slug" className="input-field" defaultValue={editing?.slug || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Описание</span>
            <textarea
              name="description"
              className="input-field min-h-24"
              defaultValue={editing?.description || ""}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Порядок</span>
            <input
              name="sortOrder"
              type="number"
              className="input-field"
              defaultValue={editing?.sortOrder ?? 0}
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
            {editing ? (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setEditing(null)}
              >
                Отмена
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
