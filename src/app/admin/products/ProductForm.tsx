"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveProduct, uploadProductImage } from "@/actions/admin";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

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

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [uploading, setUploading] = useState(false);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const fd = new FormData(e.currentTarget);
    const res = await uploadProductImage(fd);
    setUploading(false);
    if (!res.ok) {
      setError(res.error || "Ошибка загрузки");
      return;
    }
    setImageUrl(res.url);
    e.currentTarget.reset();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await saveProduct(
      {
        name: String(fd.get("name") || ""),
        slug: String(fd.get("slug") || "") || undefined,
        categoryId: String(fd.get("categoryId") || ""),
        shortDesc: String(fd.get("shortDesc") || ""),
        description: String(fd.get("description") || ""),
        imageUrl: imageUrl || undefined,
        price: fd.get("price") ? Number(fd.get("price")) : null,
        inStock: fd.get("inStock") === "on",
        isNew: fd.get("isNew") === "on",
        isHit: fd.get("isHit") === "on",
        isActive: fd.get("isActive") === "on",
      },
      product?.id,
    );
    if (!res.ok) {
      setError("Ошибка сохранения");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <AdminPageHeader
        title={product?.id ? "Редактировать товар" : "Новый товар"}
        description="Карточка аппарата для каталога и хитов на главной."
        actions={
          <Link href="/admin/products" className="ea-btn ea-btn--secondary">
            ← К списку
          </Link>
        }
      />

      <AdminCard>
        <form onSubmit={onSubmit} style={{ padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
          <label>
            <span className="ea-label">Название</span>
            <input name="name" required className="ea-input" defaultValue={product?.name || ""} />
          </label>
          <label>
            <span className="ea-label">Slug</span>
            <input name="slug" className="ea-input" defaultValue={product?.slug || ""} />
          </label>
          <label>
            <span className="ea-label">Категория</span>
            <select name="categoryId" required className="ea-select" defaultValue={product?.categoryId || ""}>
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
          <label>
            <span className="ea-label">Цена, ₽</span>
            <input
              name="price"
              type="number"
              min={0}
              step={1}
              className="ea-input"
              defaultValue={product?.price ?? ""}
              placeholder="Оставьте пустым — цена по запросу"
            />
          </label>
          <label>
            <span className="ea-label">Краткое описание</span>
            <textarea name="shortDesc" className="ea-textarea" defaultValue={product?.shortDesc || ""} />
          </label>
          <label>
            <span className="ea-label">Полное описание</span>
            <textarea name="description" className="ea-textarea" style={{ minHeight: "8rem" }} defaultValue={product?.description || ""} />
          </label>
          <label>
            <span className="ea-label">URL изображения</span>
            <input
              className="ea-input"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/products/example.png"
            />
          </label>

          <div style={{ display: "grid", gap: "0.55rem", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
            {[
              ["inStock", "В наличии", product?.inStock ?? true],
              ["isNew", "Новинка", product?.isNew ?? false],
              ["isHit", "Хит", product?.isHit ?? false],
              ["isActive", "Активен на сайте", product?.isActive ?? true],
            ].map(([name, label, checked]) => (
              <label key={String(name)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
                <input name={String(name)} type="checkbox" defaultChecked={Boolean(checked)} />
                {label}
              </label>
            ))}
          </div>

          {error ? <p style={{ margin: 0, color: "var(--ea-danger)", fontWeight: 700 }}>{error}</p> : null}
          <button type="submit" className="ea-btn ea-btn--primary">
            Сохранить
          </button>
        </form>
      </AdminCard>

      <div style={{ marginTop: "1rem" }}>
      <AdminCard>
        <form onSubmit={onUpload} style={{ padding: "1.15rem", display: "grid", gap: "0.75rem" }}>
          <h2 className="ea-panel__title">Загрузить фото</h2>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" style={{ height: "8rem", width: "8rem", objectFit: "contain", borderRadius: "0.75rem", background: "var(--ea-panel-2)" }} />
          ) : null}
          <input type="file" name="file" accept="image/*" required />
          <button type="submit" className="ea-btn ea-btn--secondary" disabled={uploading}>
            {uploading ? "Загрузка..." : "Загрузить"}
          </button>
        </form>
      </AdminCard>
      </div>
    </div>
  );
}
