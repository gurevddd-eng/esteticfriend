"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { COMPARE_MAX, useCompare } from "@/components/ProductListsProvider";
import { formatPrice } from "@/lib/format";

export function CompareView() {
  const { items, ready, remove, clear, count } = useCompare();

  if (!ready) {
    return <p className="text-muted">Загрузка сравнения...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="page-empty">
        <h2 className="page-empty__title">Нечего сравнивать</h2>
        <p className="page-empty__text">
          Добавьте до {COMPARE_MAX} аппаратов через иконку сравнения на карточке.
        </p>
        <div className="page-empty__actions">
          <Link href="/catalog" className="btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  const rows = [
    {
      label: "Категория",
      get: (item: (typeof items)[number]) => item.categoryName || "—",
    },
    {
      label: "Цена",
      get: (item: (typeof items)[number]) =>
        item.price != null ? formatPrice(item.price) || "—" : "По запросу",
    },
    {
      label: "Наличие",
      get: (item: (typeof items)[number]) =>
        item.inStock ? "В наличии" : "Под заказ",
    },
    {
      label: "Описание",
      get: (item: (typeof items)[number]) => item.shortDesc || "—",
    },
  ] as const;

  return (
    <div>
      <div className="collection-toolbar">
        <p className="section-kicker">
          Сравниваем: {count} из {COMPARE_MAX}
        </p>
        <button type="button" className="collection-toolbar__clear" onClick={clear}>
          Очистить сравнение
        </button>
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">Параметр</th>
              {items.map((item) => (
                <th key={item.productId} scope="col">
                  <div className="compare-table__product">
                    <Link
                      href={`/product/${item.slug}`}
                      className="compare-table__media"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="device-silhouette !opacity-40" />
                      )}
                    </Link>
                    <Link href={`/product/${item.slug}`} className="compare-table__name">
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      className="compare-table__remove"
                      onClick={() => remove(item.productId)}
                    >
                      Убрать
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {items.map((item) => (
                  <td key={`${item.productId}-${row.label}`}>{row.get(item)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Действие</th>
              {items.map((item) => (
                <td key={`${item.productId}-action`}>
                  <AddToCartButton
                    product={{
                      id: item.productId,
                      slug: item.slug,
                      name: item.name,
                      imageUrl: item.imageUrl,
                    }}
                    className="btn-primary !min-h-9 !px-4 !text-sm"
                    label="Купить"
                    compact
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
