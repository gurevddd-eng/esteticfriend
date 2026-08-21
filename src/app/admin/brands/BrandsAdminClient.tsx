"use client";

import Link from "next/link";
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
    const res = await saveBrand(
      {
        name: String(fd.get("name") || ""),
        slug: String(fd.get("slug") || "") || undefined,
        description: String(fd.get("description") || ""),
        sortOrder: Number(fd.get("sortOrder") || 0),
        isActive: fd.get("isActive") === "on",
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

  const totalProducts = brands.reduce((sum, b) => sum + b._count.products, 0);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Каталог</p>
          <h1 className="admin-page__title">Бренды</h1>
          <p className="admin-page__lead">
            {brands.length} бренд{brands.length === 1 ? "" : brands.length < 5 ? "а" : "ов"} ·{" "}
            {totalProducts} товар{totalProducts === 1 ? "" : totalProducts < 5 ? "а" : "ов"} ·
            привязка к товарам как у категорий
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/products" className="btn-outline">
            К товарам
          </Link>
          <Link href="/admin/categories" className="btn-outline">
            Категории
          </Link>
          <button type="button" className="btn-primary" onClick={openCreate}>
            Добавить бренд
          </button>
        </div>
      </header>

      {brands.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Брендов пока нет. Создайте первый.</p>
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
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className="text-muted">{brand.sortOrder}</td>
                  <td>
                    <p className="font-semibold text-navy">{brand.name}</p>
                    {brand.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {brand.description}
                      </p>
                    ) : null}
                  </td>
                  <td>
                    <code className="admin-slug">/{brand.slug}</code>
                  </td>
                  <td>
                    <Link
                      href={`/admin/products?brand=${brand.id}`}
                      className="font-semibold text-navy underline-offset-2 hover:underline"
                    >
                      {brand._count.products}
                    </Link>
                  </td>
                  <td>
                    <span className={brand.isActive ? "text-navy" : "text-muted"}>
                      {brand.isActive ? "На сайте" : "Скрыт"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-item__actions justify-end">
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
                          if (!confirm(`Удалить бренд «${brand.name}»?`)) return;
                          const res = await deleteBrand(brand.id);
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

      <section className="admin-settings-card mt-8">
        <div className="admin-settings-card__head">
          <p className="admin-settings-card__eyebrow">Главная</p>
          <h2 className="admin-settings-card__title">Блок брендов на сайте</h2>
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

      <AdminModal
        open={open}
        onClose={closeModal}
        title={editing ? "Редактировать бренд" : "Новый бренд"}
        description="Бренд привязывается к товарам так же, как категория"
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
              placeholder="Например, Honkon"
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
              placeholder="Кратко о бренде"
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
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={editing?.isActive ?? true}
            />
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
