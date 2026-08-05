"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct, saveProduct, uploadProductImage } from "@/actions/admin";

type Category = { id: string; name: string };

type Product = {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  imageUrl: string | null;
  price: number | null;
  inStock: boolean;
  isNew: boolean;
  isHit: boolean;
  isActive: boolean;
};

function slugifyClient(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ё/g, "e")
    .replace(/[^a-z0-9а-я\s-]/gi, "")
    .replace(/[а-я]/gi, (ch) => {
      const map: Record<string, string> = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "c",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };
      return map[ch] ?? "";
    })
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(price: number | null) {
  if (price === null || Number.isNaN(price) || price <= 0) return "Цена по запросу";
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = Boolean(product?.id);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugLocked, setSlugLocked] = useState(isEdit);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc || "");
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [price, setPrice] = useState(
    product?.price === null || product?.price === undefined ? "" : String(product.price),
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isHit, setIsHit] = useState(product?.isHit ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const categoryName = useMemo(
    () => categories.find((c) => c.id === categoryId)?.name || "Без категории",
    [categories, categoryId],
  );

  const priceNumber = useMemo(() => {
    const n = Number(price);
    return price.trim() && Number.isFinite(n) ? n : null;
  }, [price]);

  useEffect(() => {
    if (slugLocked) return;
    setSlug(slugifyClient(name));
  }, [name, slugLocked]);

  async function save() {
    setPending(true);
    setError(null);
    setMessage(null);

    if (!name.trim()) {
      setPending(false);
      setError("Укажите название");
      return;
    }
    if (!categoryId) {
      setPending(false);
      setError("Выберите категорию");
      return;
    }

    const res = await saveProduct(
      {
        name,
        slug: slug || undefined,
        categoryId,
        shortDesc,
        description,
        imageUrl: imageUrl || undefined,
        price: priceNumber,
        inStock,
        isNew,
        isHit,
        isActive,
      },
      product?.id,
    );

    setPending(false);
    if (!res.ok) {
      setError("Ошибка сохранения");
      return;
    }

    if (!product?.id && res.id) {
      router.push(`/admin/products/${res.id}`);
      router.refresh();
      return;
    }

    setMessage("Изменения сохранены");
    setSlugLocked(true);
    router.refresh();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await save();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    slug,
    categoryId,
    shortDesc,
    description,
    imageUrl,
    priceNumber,
    inStock,
    isNew,
    isHit,
    isActive,
    product?.id,
  ]);

  async function onUploadFile(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadProductImage(fd);
    setUploading(false);
    if (!res.ok) {
      setError(res.error || "Ошибка загрузки");
      return;
    }
    setImageUrl(res.url);
  }

  const flags = [
    {
      key: "isActive",
      label: "На сайте",
      hint: "Виден в каталоге",
      value: isActive,
      set: setIsActive,
    },
    {
      key: "inStock",
      label: "В наличии",
      hint: "Или под заказ",
      value: inStock,
      set: setInStock,
    },
    {
      key: "isNew",
      label: "Новинка",
      hint: "Метка new",
      value: isNew,
      set: setIsNew,
    },
    {
      key: "isHit",
      label: "Хит",
      hint: "Популярный",
      value: isHit,
      set: setIsHit,
    },
  ] as const;

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Каталог</p>
          <h1 className="admin-page__title">
            {name.trim() || (isEdit ? "Товар" : "Новый товар")}
          </h1>
          <p className="admin-page__lead">
            {isEdit
              ? "Редактируйте карточку аппарата. Ctrl/⌘+S — сохранить."
              : "Заполните карточку и сохраните товар в каталог."}
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/products" className="btn-outline">
            К списку
          </Link>
          {slug ? (
            <Link href={`/product/${slug}`} className="btn-outline" target="_blank">
              На сайте
            </Link>
          ) : null}
        </div>
      </header>

      <form onSubmit={onSubmit} className="admin-product-edit">
        <div className="admin-product-edit__main">
          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <p className="admin-settings-card__eyebrow">Основное</p>
              <h2 className="admin-settings-card__title">Название и размещение</h2>
            </div>

            <label className="admin-field">
              <span>Название</span>
              <input
                className="input-field admin-product-edit__title-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Например, Soprano Titanium"
              />
            </label>

            <div className="admin-product-edit__slug-row">
              <label className="admin-field admin-product-edit__slug-field">
                <span>Slug URL</span>
                <div className="admin-product-edit__slug-input">
                  <span className="admin-product-edit__slug-prefix">/product/</span>
                  <input
                    className="input-field"
                    value={slug}
                    onChange={(e) => {
                      setSlugLocked(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="avto-iz-nazvaniya"
                  />
                </div>
              </label>
              <button
                type="button"
                className="btn-outline admin-product-edit__slug-btn"
                onClick={() => {
                  setSlugLocked(false);
                  setSlug(slugifyClient(name));
                }}
              >
                Из названия
              </button>
            </div>

            <div className="admin-modal-form__row">
              <label className="admin-field">
                <span>Категория</span>
                <select
                  className="input-field"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Выберите категорию
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Цена, ₽</span>
                <input
                  className="input-field"
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Пусто — по запросу"
                />
              </label>
            </div>
          </section>

          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <p className="admin-settings-card__eyebrow">Описание</p>
              <h2 className="admin-settings-card__title">Тексты для каталога</h2>
            </div>

            <label className="admin-field">
              <span>
                Краткое описание
                <em className="admin-product-edit__counter">{shortDesc.length}</em>
              </span>
              <textarea
                className="input-field admin-product-edit__short"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="1–2 предложения для карточки в каталоге"
              />
            </label>

            <label className="admin-field">
              <span>
                Полное описание
                <em className="admin-product-edit__counter">{description.length}</em>
              </span>
              <textarea
                className="input-field admin-product-edit__long"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробности для страницы товара: возможности, комплектация, для кого подходит"
              />
            </label>
          </section>

          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <p className="admin-settings-card__eyebrow">Медиа</p>
              <h2 className="admin-settings-card__title">Фото аппарата</h2>
            </div>

            <div
              className={`admin-product-drop${uploading ? " is-busy" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) await onUploadFile(file);
              }}
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="admin-product-drop__img" />
              ) : (
                <div className="admin-product-drop__empty">
                  <strong>Перетащите фото сюда</strong>
                  <span>или выберите файл ниже · WebP / PNG / JPG</span>
                </div>
              )}
            </div>

            <div className="admin-modal-form__row">
              <label className="admin-field">
                <span>URL изображения</span>
                <input
                  className="input-field"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/products/example.webp"
                />
              </label>
              <label className="admin-field">
                <span>Файл</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await onUploadFile(file);
                  }}
                />
              </label>
            </div>
            {imageUrl ? (
              <button
                type="button"
                className="admin-action-delete"
                onClick={() => setImageUrl("")}
              >
                Убрать фото
              </button>
            ) : null}
          </section>
        </div>

        <aside className="admin-product-edit__side">
          <section className="admin-product-preview">
            <p className="admin-settings-card__eyebrow">Превью карточки</p>
            <div className="admin-product-preview__card">
              <div className="admin-product-preview__media">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" />
                ) : (
                  <span>Нет фото</span>
                )}
                <div className="admin-product-preview__badges">
                  {isNew ? <span>New</span> : null}
                  {isHit ? <span>Hit</span> : null}
                </div>
              </div>
              <p className="admin-product-preview__cat">{categoryName}</p>
              <h3>{name.trim() || "Название товара"}</h3>
              <p className="admin-product-preview__text">
                {shortDesc.trim() || "Краткое описание появится здесь"}
              </p>
              <div className="admin-product-preview__foot">
                <strong>{formatPrice(priceNumber)}</strong>
                <span>{inStock ? "В наличии" : "Под заказ"}</span>
              </div>
            </div>
            {!isActive ? (
              <p className="admin-product-preview__hidden">Сейчас скрыт на сайте</p>
            ) : null}
          </section>

          <section className="admin-settings-card admin-settings-card--compact">
            <p className="admin-settings-card__eyebrow">Публикация</p>
            <div className="admin-flag-toggles">
              {flags.map((flag) => (
                <button
                  key={flag.key}
                  type="button"
                  className={`admin-flag-toggle${flag.value ? " is-on" : ""}`}
                  onClick={() => flag.set(!flag.value)}
                  aria-pressed={flag.value}
                >
                  <span className="admin-flag-toggle__label">{flag.label}</span>
                  <span className="admin-flag-toggle__hint">{flag.hint}</span>
                  <span className="admin-flag-toggle__switch" aria-hidden />
                </button>
              ))}
            </div>
          </section>

          {error ? <p className="admin-login__error">{error}</p> : null}
          {message ? <p className="admin-toast">{message}</p> : null}

          <div className="admin-product-edit__sticky">
            <button type="submit" className="btn-primary" disabled={pending || uploading}>
              {pending ? "Сохранение..." : "Сохранить"}
            </button>
            <Link href="/admin/products" className="btn-outline">
              Отмена
            </Link>
            {product?.id ? (
              <button
                type="button"
                className="admin-action-delete"
                onClick={async () => {
                  if (!confirm(`Удалить товар «${name || product.name}»?`)) return;
                  await deleteProduct(product.id!);
                  router.push("/admin/products");
                  router.refresh();
                }}
              >
                Удалить
              </button>
            ) : null}
          </div>
        </aside>
      </form>
    </div>
  );
}
