"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteBrand,
  saveBrand,
  saveBrandsSectionContent,
} from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";
import type { BrandsSectionConfig } from "@/lib/catalog";

type BrandRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
};

export function BrandsAdminClient({
  brands,
  section,
}: {
  brands: BrandRow[];
  section: BrandsSectionConfig;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BrandRow | null>(null);
  const [pending, setPending] = useState(false);
  const [sectionPending, setSectionPending] = useState(false);
  const [sectionMessage, setSectionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setError(null);
    setOpen(true);
  }

  function openEdit(item: BrandRow) {
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
    await saveBrand(
      {
        name: String(fd.get("name") || ""),
        slug: String(fd.get("slug") || ""),
        description: String(fd.get("description") || ""),
        sortOrder: Number(fd.get("sortOrder") || 0),
        isActive: fd.get("isActive") === "on",
      },
      editing?.id,
    );
    setPending(false);
    closeModal();
    router.refresh();
  }

  async function onSectionSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSectionPending(true);
    setSectionMessage(null);
    const fd = new FormData(e.currentTarget);
    await saveBrandsSectionContent({
      kicker: String(fd.get("kicker") || ""),
      title: String(fd.get("title") || ""),
      lead: String(fd.get("lead") || ""),
      cta: String(fd.get("cta") || ""),
      ctaHref: String(fd.get("ctaHref") || ""),
      isEnabled: fd.get("isEnabled") === "on",
    });
    setSectionPending(false);
    setSectionMessage("Настройки раздела сохранены");
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Главная и каталог</p>
          <h1 className="admin-page__title">Бренды</h1>
          <p className="admin-page__lead">
            Партнёры на главной, страница /brands и привязка к товарам · {brands.length}
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить бренд
          </button>
        </div>
      </header>

      <section className="admin-settings-card">
        <div className="admin-settings-card__head">
          <p className="admin-settings-card__eyebrow">Раздел на сайте</p>
          <h2 className="admin-settings-card__title">Блок брендов и страница /brands</h2>
        </div>

        <form onSubmit={onSectionSubmit} className="admin-modal-form">
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isEnabled"
              type="checkbox"
              defaultChecked={section.isEnabled}
            />
            Показывать блок брендов на главной
          </label>

          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Подпись</span>
              <input
                name="kicker"
                className="input-field"
                defaultValue={section.kicker}
              />
            </label>
            <label className="admin-field">
              <span>Заголовок</span>
              <input
                name="title"
                className="input-field"
                defaultValue={section.title}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>Описание</span>
            <textarea
              name="lead"
              className="input-field"
              rows={3}
              defaultValue={section.lead}
            />
          </label>

          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Текст кнопки</span>
              <input name="cta" className="input-field" defaultValue={section.cta} />
            </label>
            <label className="admin-field">
              <span>Ссылка кнопки</span>
              <input
                name="ctaHref"
                className="input-field"
                defaultValue={section.ctaHref}
              />
            </label>
          </div>

          {sectionMessage ? <p className="admin-toast">{sectionMessage}</p> : null}

          <div className="admin-modal-form__actions">
            <button type="submit" className="btn-primary" disabled={sectionPending}>
              {sectionPending ? "Сохранение..." : "Сохранить раздел"}
            </button>
          </div>
        </form>
      </section>

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
                  /brands/{brand.slug} · товаров {brand._count.products}
                  {!brand.isActive ? " · скрыт" : ""}
                </p>
                {brand.description ? (
                  <p className="admin-brand-card__desc">{brand.description}</p>
                ) : null}
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
                    const res = await deleteBrand(brand.id);
                    if (!res.ok) {
                      alert(res.error || "Не удалось удалить бренд");
                      return;
                    }
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
            <span>Slug URL</span>
            <input
              name="slug"
              className="input-field"
              defaultValue={editing?.slug || ""}
              placeholder="honkon"
            />
          </label>
          <label className="admin-field">
            <span>Описание</span>
            <textarea
              name="description"
              className="input-field"
              rows={3}
              defaultValue={editing?.description || ""}
              placeholder="Кратко о бренде для страницы /brands"
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
