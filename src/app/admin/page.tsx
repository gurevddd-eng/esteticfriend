import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [products, categories, leads, reviews] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.lead.count(),
    prisma.review.count({ where: { isActive: true } }),
  ]);

  const cards = [
    { label: "Товары", value: products, href: "/admin/products" },
    { label: "Категории", value: categories, href: "/admin/categories" },
    { label: "Заявки", value: leads, href: "/admin/leads" },
    { label: "Отзывы", value: reviews, href: "/admin/reviews" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Обзор
      </h1>
      <p className="mt-2 text-muted">Управление каталогом, заявками и контентом сайта.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-[1.2rem] border border-[var(--line)] bg-white p-5 transition hover:border-azure/40"
          >
            <p className="text-sm font-semibold text-muted">{card.label}</p>
            <p className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
              {card.value}
            </p>
            <p className="mt-3 text-sm font-semibold text-azure">Открыть →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
