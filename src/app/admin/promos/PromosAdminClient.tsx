"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePromo, savePromo, uploadCmsImage } from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

type PromoRow = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  imageUrl: string | null;
  tone: string;
  sortOrder: number;
  isActive: boolean;
};

export function PromosAdminClient({ items }: { items: PromoRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PromoRow | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditing(null);
    setImageUrl("");
    setOpen(true);
  }

  function openEdit(item: PromoRow) {
    setEditing(item);
    setImageUrl(item.imageUrl || "");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setImageUrl("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    await savePromo(
      {
        slug: String(fd.get("slug") || ""),
        eyebrow: String(fd.get("eyebrow") || ""),
        title: String(fd.get("title") || ""),
        text: String(fd.get("text") || ""),
        cta: String(fd.get("cta") || ""),
        href: String(fd.get("href") || ""),
        imageUrl: imageUrl || String(fd.get("imageUrl") || "") || null,
        tone: String(fd.get("tone") || "navy"),
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
          <h1 className="admin-page__title">Промо</h1>
          <p className="admin-page__lead">
            Баннеры под слайдером · {items.length}
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить баннер
          </button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Промо-баннеров пока нет.</p>
        </div>
      ) : (
        <div className="admin-media-grid admin-media-grid--two">
          {items.map((item) => (
            <article key={item.id} className="admin-media-card">
              <div className="admin-media-card__preview admin-media-card__preview--wide">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="480px"
                    className="object-cover"
                  />
                ) : (
                  <div className="admin-media-card__placeholder">Нет фото</div>
                )}
              </div>
              <div className="admin-media-card__body">
                <div className="admin-media-card__top">
                  <span className="admin-chip admin-chip--ghost">{item.tone}</span>
                  <span className={`admin-status${item.isActive ? " is-live" : ""}`}>
                    {item.isActive ? "Виден" : "Скрыт"}
                  </span>
                </div>
                <p className="admin-media-card__eyebrow">{item.eyebrow}</p>
                <h2 className="admin-media-card__title">{item.title}</h2>
                <p className="admin-media-card__text">{item.text}</p>
                <div className="admin-item__actions mt-3">
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
                      if (!confirm("Удалить баннер?")) return;
                      await deletePromo(item.id);
                      router.refresh();
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminModal
        open={open}
        onClose={closeModal}
        title={editing ? "Редактировать баннер" : "Новый баннер"}
        description="Промо-блок на главной"
        wide
      >
        <form
          key={editing?.id || "new"}
          onSubmit={onSubmit}
          className="admin-modal-form"
        >
          <div className="admin-modal-form__row">
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
              <span>Slug</span>
              <input name="slug" className="input-field" defaultValue={editing?.slug || ""} />
            </label>
          </div>
          <label className="admin-field">
            <span>Надзаголовок</span>
            <input
              name="eyebrow"
              className="input-field"
              defaultValue={editing?.eyebrow || ""}
            />
          </label>
          <label className="admin-field">
            <span>Текст</span>
            <textarea
              name="text"
              className="input-field min-h-24"
              defaultValue={editing?.text || ""}
            />
          </label>
          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Кнопка</span>
              <input
                name="cta"
                className="input-field"
                defaultValue={editing?.cta || "Подробнее"}
              />
            </label>
            <label className="admin-field">
              <span>Ссылка</span>
              <input
                name="href"
                className="input-field"
                defaultValue={editing?.href || "/#consult"}
              />
            </label>
          </div>
          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Тон</span>
              <select name="tone" className="input-field" defaultValue={editing?.tone || "navy"}>
                <option value="navy">navy</option>
                <option value="frost">frost</option>
              </select>
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
          </div>
          <label className="admin-field">
            <span>URL изображения</span>
            <input
              name="imageUrl"
              className="input-field"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Загрузить изображение</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.set("file", file);
                const res = await uploadCmsImage(fd);
                if (res.ok) setImageUrl(res.url);
              }}
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
