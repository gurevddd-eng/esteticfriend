"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  duplicateProduct,
  toggleProductFlag,
} from "@/actions/admin";
import {
  AdminBadge,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  confirmDelete,
} from "@/components/admin/ui";
import { formatPrice } from "@/lib/format";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  inStock: boolean;
  isNew: boolean;
  isHit: boolean;
  isActive: boolean;
  category: { id: string; name: string };
};

export function ProductsAdminClient({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "HIT" | "NEW" | "OUT">("ALL");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryId !== "ALL" && p.category.id !== categoryId) return false;
      if (filter === "ACTIVE" && !p.isActive) return false;
      if (filter === "INACTIVE" && p.isActive) return false;
      if (filter === "HIT" && !p.isHit) return false;
      if (filter === "NEW" && !p.isNew) return false;
      if (filter === "OUT" && p.inStock) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
      );
    });
  }, [products, query, categoryId, filter]);

  function refreshAfter(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Товары"
        description="Каталог аппаратов: поиск, фильтры, быстрые флаги и дублирование."
        actions={
          <Link href="/admin/products/new" className="btn-primary !min-h-10 !text-sm">
            + Добавить товар
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <input
          className="input-field"
          placeholder="Поиск по названию, slug, категории..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input-field"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="ALL">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="input-field" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="ALL">Все товары</option>
          <option value="ACTIVE">Только активные</option>
          <option value="INACTIVE">Неактивные</option>
          <option value="HIT">Хиты</option>
          <option value="NEW">Новинки</option>
          <option value="OUT">Нет в наличии</option>
        </select>
      </div>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/6 bg-[#faf8f7] text-xs tracking-wide text-[#8a817c] uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Товар</th>
                <th className="px-4 py-3 font-bold">Категория</th>
                <th className="px-4 py-3 font-bold">Цена</th>
                <th className="px-4 py-3 font-bold">Флаги</th>
                <th className="px-4 py-3 font-bold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <AdminEmpty title="Товары не найдены" />
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-b border-black/5 align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f3f1ef]">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt=""
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-semibold text-[#17141a] hover:text-[#b53d4a]"
                          >
                            {product.name}
                          </Link>
                          <p className="truncate text-xs text-[#8a817c]">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#4a4441]">{product.category.name}</td>
                    <td className="px-4 py-3 font-semibold text-[#17141a]">
                      {formatPrice(product.price) || "по запросу"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={pending}
                          className="rounded-full border border-black/8 px-2 py-0.5 text-[11px] font-bold"
                          onClick={() =>
                            refreshAfter(() =>
                              toggleProductFlag(product.id, "isActive", !product.isActive),
                            )
                          }
                        >
                          {product.isActive ? "Активен" : "Скрыт"}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          className="rounded-full border border-black/8 px-2 py-0.5 text-[11px] font-bold"
                          onClick={() =>
                            refreshAfter(() =>
                              toggleProductFlag(product.id, "isHit", !product.isHit),
                            )
                          }
                        >
                          {product.isHit ? "Хит" : "Не хит"}
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          className="rounded-full border border-black/8 px-2 py-0.5 text-[11px] font-bold"
                          onClick={() =>
                            refreshAfter(() =>
                              toggleProductFlag(product.id, "inStock", !product.inStock),
                            )
                          }
                        >
                          {product.inStock ? "В наличии" : "Под заказ"}
                        </button>
                        {product.isNew ? <AdminBadge tone="accent">New</AdminBadge> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-sm font-semibold text-[#b53d4a]"
                        >
                          Изменить
                        </Link>
                        <button
                          type="button"
                          disabled={pending}
                          className="text-sm font-semibold text-[#4a4441]"
                          onClick={() =>
                            refreshAfter(async () => {
                              const res = await duplicateProduct(product.id);
                              if (res.ok && res.id) router.push(`/admin/products/${res.id}`);
                            })
                          }
                        >
                          Копия
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          className="text-sm font-semibold text-rose-700"
                          onClick={() => {
                            if (!confirmDelete(`Удалить «${product.name}»?`)) return;
                            refreshAfter(() => deleteProduct(product.id));
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-black/6 px-4 py-3 text-xs text-[#8a817c]">
          Показано {filtered.length} из {products.length}
        </div>
      </AdminCard>
    </div>
  );
}
