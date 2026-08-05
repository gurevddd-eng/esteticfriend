"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/admin";

type CategoryOption = { id: string; name: string };

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
  categoryId: string;
  category: { name: string };
};

function formatPrice(price: number | null) {
  if (price === null || price <= 0) return "По запросу";
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function ProductsAdminClient({
  products,
  categories = [],
}: {
  products: ProductRow[];
  categories?: CategoryOption[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");

  const activeCount = products.filter((p) => p.isActive).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "hidden" && p.isActive) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
      );
    });
  }, [products, query, categoryFilter, statusFilter]);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Каталог</p>
          <h1 className="admin-page__title">Товары</h1>
          <p className="admin-page__lead">
            {products.length} аппарат{products.length === 1 ? "" : products.length < 5 ? "а" : "ов"} ·{" "}
            {activeCount} на сайте
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/categories" className="btn-outline">
            Категории
          </Link>
          <Link href="/admin/products/new" className="btn-primary">
            Добавить товар
          </Link>
        </div>
      </header>

      <div className="admin-toolbar">
        <label className="admin-field admin-toolbar__search">
          <span>Поиск</span>
          <input
            className="input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название или slug"
          />
        </label>
        <label className="admin-field">
          <span>Категория</span>
          <select
            className="input-field"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Статус</span>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="hidden">Скрытые</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Товаров пока нет. Добавьте первый аппарат.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Ничего не найдено по текущим фильтрам.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Товар</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Метки</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="admin-product-cell">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt="" className="admin-product-thumb" />
                      ) : (
                        <div className="admin-product-thumb admin-product-thumb--empty">Нет</div>
                      )}
                      <div>
                        <p className="font-semibold text-navy">{p.name}</p>
                        <code className="admin-slug">/{p.slug}</code>
                      </div>
                    </Link>
                  </td>
                  <td className="text-muted">{p.category.name}</td>
                  <td className="font-semibold text-navy">{formatPrice(p.price)}</td>
                  <td>
                    <div className="admin-flag-row">
                      {p.isNew ? <span className="admin-flag">Новинка</span> : null}
                      {p.isHit ? <span className="admin-flag">Хит</span> : null}
                      <span className={`admin-flag${p.inStock ? "" : " is-muted"}`}>
                        {p.inStock ? "В наличии" : "Под заказ"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status${p.isActive ? " is-live" : ""}`}>
                      {p.isActive ? "Активен" : "Скрыт"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-item__actions justify-end">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="admin-action-edit"
                      >
                        Открыть
                      </Link>
                      <button
                        type="button"
                        className="admin-action-delete"
                        onClick={async () => {
                          if (!confirm(`Удалить товар «${p.name}»?`)) return;
                          await deleteProduct(p.id);
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
    </div>
  );
}
