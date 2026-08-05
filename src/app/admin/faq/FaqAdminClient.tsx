"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteFaq, saveFaq } from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export function FaqAdminClient({ items }: { items: FaqRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: FaqRow) {
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
    await saveFaq(
      {
        question: String(fd.get("question") || ""),
        answer: String(fd.get("answer") || ""),
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
          <h1 className="admin-page__title">FAQ</h1>
          <p className="admin-page__lead">
            {items.length} вопрос{items.length === 1 ? "" : items.length < 5 ? "а" : "ов"} на главной.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить вопрос
          </button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Пока нет вопросов. Добавьте первый.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Вопрос</th>
                <th>Порядок</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="font-semibold text-navy">{item.question}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{item.answer}</p>
                  </td>
                  <td>{item.sortOrder}</td>
                  <td>
                    <span className={`admin-status${item.isActive ? " is-live" : ""}`}>
                      {item.isActive ? "Виден" : "Скрыт"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-item__actions justify-end">
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
                          if (!confirm("Удалить вопрос?")) return;
                          await deleteFaq(item.id);
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
        title={editing ? "Редактировать вопрос" : "Новый вопрос"}
        description="Отображается в блоке FAQ на главной"
      >
        <form key={editing?.id || "new"} onSubmit={onSubmit} className="admin-modal-form">
          <label className="admin-field">
            <span>Вопрос</span>
            <input
              name="question"
              required
              className="input-field"
              defaultValue={editing?.question || ""}
            />
          </label>
          <label className="admin-field">
            <span>Ответ</span>
            <textarea
              name="answer"
              required
              className="input-field min-h-28"
              defaultValue={editing?.answer || ""}
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
