"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deleteProduct,
  duplicateProduct,
  toggleProductFlag,
} from "@/actions/admin";
import {
  AdminBadge,
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
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "HIT" | "NEW" | "OUT">(
    searchParams.get("hit") === "1" ? "HIT" : "ALL",
  );
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
        description="Сетка каталога с быстрыми флагами, поиском и дублированием."
        actions={
          <Link href="/admin/products/new" className="ea-btn ea-btn--primary">
            + Добавить товар
          </Link>
        }
      />

      <div className="ea-toolbar">
        <input
          className="ea-input"
          style={{ flex: "1 1 220px" }}
          placeholder="Поиск по названию, slug, категории..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="ea-select"
          style={{ flex: "0 1 180px" }}
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
        <div className="ea-seg">
          {(
            [
              ["ALL", "Все"],
              ["ACTIVE", "Актив"],
              ["HIT", "Хиты"],
              ["NEW", "New"],
              ["OUT", "Нет"],
              ["INACTIVE", "Скрыт"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "is-on" : undefined}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ea-panel">
          <AdminEmpty title="Товары не найдены" text="Смените фильтр или добавьте товар" />
        </div>
      ) : (
        <div className="ea-product-grid">
          {filtered.map((product) => (
            <article key={product.id} className="ea-panel ea-product-card">
              <div className="ea-product-card__media">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt="" fill className="object-contain p-3" sizes="240px" />
                ) : (
                  <span style={{ color: "var(--ea-faint)", fontSize: "0.8rem" }}>Нет фото</span>
                )}
              </div>
              <div className="ea-product-card__body">
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.45rem" }}>
                  {!product.isActive ? <AdminBadge>Скрыт</AdminBadge> : null}
                  {product.isHit ? <AdminBadge tone="accent">Хит</AdminBadge> : null}
                  {product.isNew ? <AdminBadge tone="warn">New</AdminBadge> : null}
                  <AdminBadge tone={product.inStock ? "success" : "neutral"}>
                    {product.inStock ? "В наличии" : "Под заказ"}
                  </AdminBadge>
                </div>
                <Link
                  href={`/admin/products/${product.id}`}
                  style={{ fontWeight: 800, color: "inherit", textDecoration: "none", display: "block" }}
                >
                  {product.name}
                </Link>
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "var(--ea-muted)" }}>
                  {product.category.name} · /{product.slug}
                </p>
                <p style={{ margin: "0.55rem 0 0", fontWeight: 800, fontSize: "1.05rem" }}>
                  {formatPrice(product.price) || "по запросу"}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.75rem" }}>
                  <button
                    type="button"
                    className="ea-btn ea-btn--secondary ea-btn--sm"
                    disabled={pending}
                    onClick={() =>
                      refreshAfter(() => toggleProductFlag(product.id, "isActive", !product.isActive))
                    }
                  >
                    {product.isActive ? "Скрыть" : "Показать"}
                  </button>
                  <button
                    type="button"
                    className="ea-btn ea-btn--secondary ea-btn--sm"
                    disabled={pending}
                    onClick={() =>
                      refreshAfter(() => toggleProductFlag(product.id, "isHit", !product.isHit))
                    }
                  >
                    {product.isHit ? "Не хит" : "Хит"}
                  </button>
                  <button
                    type="button"
                    className="ea-btn ea-btn--secondary ea-btn--sm"
                    disabled={pending}
                    onClick={() =>
                      refreshAfter(() => toggleProductFlag(product.id, "inStock", !product.inStock))
                    }
                  >
                    Сток
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.65rem" }}>
                  <Link href={`/admin/products/${product.id}`} className="ea-btn ea-btn--primary ea-btn--sm">
                    Изменить
                  </Link>
                  <button
                    type="button"
                    className="ea-btn ea-btn--ghost ea-btn--sm"
                    disabled={pending}
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
                    className="ea-btn ea-btn--danger ea-btn--sm"
                    disabled={pending}
                    onClick={() => {
                      if (!confirmDelete(`Удалить «${product.name}»?`)) return;
                      refreshAfter(() => deleteProduct(product.id));
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

      <p style={{ marginTop: "0.85rem", fontSize: "0.8rem", color: "var(--ea-faint)" }}>
        Показано {filtered.length} из {products.length}
      </p>
    </div>
  );
}
