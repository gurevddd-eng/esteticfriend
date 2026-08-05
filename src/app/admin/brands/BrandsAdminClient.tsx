"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBrand, saveBrand } from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

type BrandRow = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export function BrandsAdminClient({ brands }: { brands: BrandRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BrandRow | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: BrandRow) {
    setEditing(item);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    await saveBrand(
      {
        name: String(fd.get("name") || ""),
        sortOrder: Number(fd.get("sortOrder") || 0),
        isActive: fd.get("isActive") === "on",
      },
      editing?.id,
    );
    setPending(false);
    closeModal();
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Главная страница</p>
          <h1 className="admin-page__title">Бренды</h1>
          <p className="admin-page__lead">
            Партнёры в блоке «Письма о полномочиях» · {brands.length}
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить бренд
          </button>
        </div>
      </header>

      {brands.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Список брендов пуст.</p>
        </div>
      ) : (
        <div className="admin-brand-grid">
          {brands.map((brand) => (
            <article key={brand.id} className="admin-brand-card">
              <div>
                <h2 className="admin-brand-card__name">{brand.name}</h2>
                <p className="admin-brand-card__meta">
                  порядок {brand.sortOrder}
                  {!brand.isActive ? " · скрыт" : ""}
                </p>
              </div>
              <div className="admin-item__actions">
                <button
                  type="button"
                  className="admin-action-edit"
                  onClick={() => openEdit(brand)}
                >
                  Изменить
                </button>
                <button
                  type="button"
                  className="admin-action-delete"
                  onClick={async () => {
                    if (!confirm(`Удалить бренд ${brand.name}?`)) return;
                    await deleteBrand(brand.id);
                    router.refresh();
                  }}
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminModal
        open={open}
        onClose={closeModal}
        title={editing ? "Редактировать бренд" : "Новый бренд"}
      >
        <form key={editing?.id || "new"} onSubmit={onSubmit} className="admin-modal-form">
          <label className="admin-field">
            <span>Название</span>
            <input
              name="name"
              required
              className="input-field"
              defaultValue={editing?.name || ""}
            />
          </label>
          <label className="admin-field">
            <span>Порядок</span>
            <input
              name="sortOrder"
              type="number"
              className="input-field"
              defaultValue={editing?.sortOrder ?? brands.length}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={editing?.isActive ?? true} />
            Показывать на сайте
          </label>
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
