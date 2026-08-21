"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCertificate,
  saveCertificate,
  saveCertificatesPageContent,
  uploadCmsImage,
} from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

type CertificateRow = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};

type PageConfig = {
  kicker: string;
  title: string;
  lead: string;
  docsText: string;
  formTitle: string;
  formLead: string;
};

export function CertificatesAdminClient({
  items,
  page,
}: {
  items: CertificateRow[];
  page: PageConfig;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CertificateRow | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [sectionPending, setSectionPending] = useState(false);
  const [sectionMessage, setSectionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setImageUrl("");
    setError(null);
    setOpen(true);
  }

  function openEdit(item: CertificateRow) {
    setEditing(item);
    setImageUrl(item.imageUrl || "");
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setImageUrl("");
    setError(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await saveCertificate(
      {
        title: String(fd.get("title") || ""),
        description: String(fd.get("description") || ""),
        imageUrl: imageUrl || String(fd.get("imageUrl") || ""),
        sortOrder: Number(fd.get("sortOrder") || 0),
        isActive: fd.get("isActive") === "on",
      },
      editing?.id,
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error || "Ошибка сохранения");
      return;
    }
    closeModal();
    router.refresh();
  }

  async function onSectionSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSectionPending(true);
    setSectionMessage(null);
    const fd = new FormData(e.currentTarget);
    await saveCertificatesPageContent({
      kicker: String(fd.get("kicker") || ""),
      title: String(fd.get("title") || ""),
      lead: String(fd.get("lead") || ""),
      docs: String(fd.get("docs") || ""),
      formTitle: String(fd.get("formTitle") || ""),
      formLead: String(fd.get("formLead") || ""),
    });
    setSectionPending(false);
    setSectionMessage("Тексты страницы сохранены");
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Материалы</p>
          <h1 className="admin-page__title">Сертификаты</h1>
          <p className="admin-page__lead">
            Тексты страницы /certificates и фото документов · {items.length}
          </p>
        </div>
        <div className="admin-page__actions">
          <a href="/certificates" className="btn-outline" target="_blank" rel="noreferrer">
            Открыть страницу
          </a>
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить сертификат
          </button>
        </div>
      </header>

      <section className="admin-settings-card" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-settings-card__head">
          <p className="admin-settings-card__eyebrow">Страница</p>
          <h2 className="admin-settings-card__title">Тексты /certificates</h2>
        </div>
        <form onSubmit={onSectionSubmit} className="admin-modal-form">
          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Надзаголовок</span>
              <input name="kicker" className="input-field" defaultValue={page.kicker} />
            </label>
            <label className="admin-field">
              <span>Заголовок</span>
              <input name="title" className="input-field" defaultValue={page.title} required />
            </label>
          </div>
          <label className="admin-field">
            <span>Лид</span>
            <textarea name="lead" className="input-field min-h-24" defaultValue={page.lead} />
          </label>
          <label className="admin-field">
            <span>Список документов (по одному в строке)</span>
            <textarea name="docs" className="input-field min-h-28" defaultValue={page.docsText} />
          </label>
          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Заголовок формы</span>
              <input name="formTitle" className="input-field" defaultValue={page.formTitle} />
            </label>
            <label className="admin-field">
              <span>Текст формы</span>
              <input name="formLead" className="input-field" defaultValue={page.formLead} />
            </label>
          </div>
          <div className="admin-modal-form__actions">
            {sectionMessage ? <p className="text-sm text-muted">{sectionMessage}</p> : null}
            <button type="submit" className="btn-primary" disabled={sectionPending}>
              {sectionPending ? "Сохранение..." : "Сохранить тексты"}
            </button>
          </div>
        </form>
      </section>

      {items.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Сертификатов пока нет. Добавьте фото документов.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {items.map((item) => (
            <article key={item.id} className="admin-media-card">
              <div className="admin-media-card__preview">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="admin-media-card__placeholder">Нет фото</div>
                )}
              </div>
              <div className="admin-media-card__body">
                <div className="admin-media-card__top">
                  <span className="admin-chip admin-chip--ghost">#{item.sortOrder}</span>
                  <span className={`admin-status${item.isActive ? " is-live" : ""}`}>
                    {item.isActive ? "Виден" : "Скрыт"}
                  </span>
                </div>
                <h2 className="admin-media-card__title">{item.title}</h2>
                {item.description ? (
                  <p className="admin-media-card__text">{item.description}</p>
                ) : null}
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
                      if (!confirm("Удалить сертификат?")) return;
                      await deleteCertificate(item.id);
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
        title={editing ? "Редактировать сертификат" : "Новый сертификат"}
        description="Фото документа на странице /certificates"
        wide
      >
        <form
          key={editing?.id || "new"}
          onSubmit={onSubmit}
          className="admin-modal-form"
        >
          <label className="admin-field">
            <span>Название</span>
            <input
              name="title"
              required
              className="input-field"
              defaultValue={editing?.title || ""}
              placeholder="Сертификат соответствия"
            />
          </label>
          <label className="admin-field">
            <span>Описание</span>
            <textarea
              name="description"
              className="input-field min-h-20"
              defaultValue={editing?.description || ""}
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
            <span>Загрузить фото</span>
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
          {imageUrl ? (
            <div className="relative mt-2 h-40 w-full overflow-hidden border border-[var(--line)] bg-[var(--mist)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="h-full w-full object-contain" />
            </div>
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={editing?.isActive ?? true}
            />
            Показывать на сайте
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
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
