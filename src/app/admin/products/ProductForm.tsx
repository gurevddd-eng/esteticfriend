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
    <div className="max-w-3xl">
      <AdminPageHeader
        title={product?.id ? "Редактировать товар" : "Новый товар"}
        description="Карточка аппарата для каталога и хитов на главной."
        actions={
          <Link href="/admin/products" className="btn-outline !min-h-10 !text-sm">
            ← К списку
          </Link>
        }
      />

      <AdminCard className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Название</span>
          <input name="name" required className="input-field" defaultValue={product?.name || ""} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Slug</span>
          <input name="slug" className="input-field" defaultValue={product?.slug || ""} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Категория</span>
          <select
            name="categoryId"
            required
            className="input-field"
            defaultValue={product?.categoryId || ""}
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
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Цена, ₽</span>
          <input
            name="price"
            type="number"
            min={0}
            step={1}
            className="input-field"
            defaultValue={product?.price ?? ""}
            placeholder="Оставьте пустым — цена по запросу"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Краткое описание</span>
          <textarea
            name="shortDesc"
            className="input-field min-h-20"
            defaultValue={product?.shortDesc || ""}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Полное описание</span>
          <textarea
            name="description"
            className="input-field min-h-32"
            defaultValue={product?.description || ""}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">URL изображения</span>
          <input
            className="input-field"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/products/example.png"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["inStock", "В наличии", product?.inStock ?? true],
            ["isNew", "Новинка", product?.isNew ?? false],
            ["isHit", "Хит", product?.isHit ?? false],
            ["isActive", "Активен на сайте", product?.isActive ?? true],
          ].map(([name, label, checked]) => (
            <label key={String(name)} className="flex items-center gap-2 text-sm text-navy">
              <input name={String(name)} type="checkbox" defaultChecked={Boolean(checked)} />
              {label}
            </label>
          ))}
        </div>

        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button type="submit" className="btn-primary">
          Сохранить
        </button>
      </form>
      </AdminCard>

      <AdminCard className="mt-4 p-6">
      <form onSubmit={onUpload} className="space-y-3">
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-bold text-[#17141a]">
          Загрузить фото
        </h2>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-32 w-32 rounded-xl object-contain bg-[#f3f1ef]" />
        ) : null}
        <input type="file" name="file" accept="image/*" required />
        <button type="submit" className="btn-outline" disabled={uploading}>
          {uploading ? "Загрузка..." : "Загрузить"}
        </button>
      </form>
      </AdminCard>
    </div>
  );
}
