"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/admin";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isNew: boolean;
  isHit: boolean;
  inStock: boolean;
  category: { name: string };
};

export function ProductsAdminClient({ products }: { products: ProductRow[] }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
            Товары
          </h1>
          <p className="mt-2 text-muted">Каталог аппаратов на сайте</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          Добавить товар
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-[1.2rem] border border-[var(--line)] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--line)] text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Метки</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3 font-semibold text-navy">{p.name}</td>
                <td className="px-4 py-3 text-muted">{p.category.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isNew ? <span className="badge badge-new">Новинка</span> : null}
                    {p.isHit ? <span className="badge bg-pearl text-navy">Хит</span> : null}
                    {p.inStock ? (
                      <span className="badge badge-stock">В наличии</span>
                    ) : (
                      <span className="badge bg-pearl text-muted">Под заказ</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.isActive ? (
                    <span className="font-semibold text-azure">Активен</span>
                  ) : (
                    <span className="text-muted">Скрыт</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="btn-outline !min-h-8 !px-3 !text-xs"
                    >
                      Изменить
                    </Link>
                    <button
                      type="button"
                      className="text-xs font-semibold text-azure"
                      onClick={async () => {
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
    </div>
  );
}
