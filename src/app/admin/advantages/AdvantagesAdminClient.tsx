"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAdvantage, saveAdvantage } from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

type AdvantageRow = {
  id: string;
  title: string;
  text: string;
  sortOrder: number;
  isActive: boolean;
};

export function AdvantagesAdminClient({ items }: { items: AdvantageRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdvantageRow | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: AdvantageRow) {
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
    await saveAdvantage(
      {
        title: String(fd.get("title") || ""),
        text: String(fd.get("text") || ""),
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
          <h1 className="admin-page__title">Преимущества</h1>
          <p className="admin-page__lead">
            Блок «Почему выбирают» · {items.length}
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить преимущество
          </button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Преимуществ пока нет.</p>
        </div>
      ) : (
        <div className="admin-brand-grid">
          {items.map((item, index) => (
            <article key={item.id} className="admin-brand-card">
              <div>
                <p className="admin-brand-card__meta">
                  {String(index + 1).padStart(2, "0")}
                  {!item.isActive ? " · скрыт" : ""}
                </p>
                <h2 className="admin-brand-card__name">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
              <div className="admin-item__actions">
                <button
                  type="button"
                  className="admin-action-edit"
                  onClick={() => openEdit(item)}
                >
                  Изменить
                </button>
                <button
                  type="button"
                  className="admin-action-delete"
                  onClick={async () => {
                    if (!confirm("Удалить преимущество?")) return;
                    await deleteAdvantage(item.id);
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
        title={editing ? "Редактировать" : "Новое преимущество"}
      >
        <form key={editing?.id || "new"} onSubmit={onSubmit} className="admin-modal-form">
          <label className="admin-field">
            <span>Заголовок</span>
            <input
              name="title"
              required
              className="input-field"
              defaultValue={editing?.title || ""}
            />
          </label>
          <label className="admin-field">
            <span>Текст</span>
            <textarea
              name="text"
              required
              className="input-field min-h-28"
              defaultValue={editing?.text || ""}
            />
          </label>
          <label className="admin-field">
            <span>Порядок</span>
            <input
              name="sortOrder"
              type="number"
              className="input-field"
              defaultValue={editing?.sortOrder ?? items.length}
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
