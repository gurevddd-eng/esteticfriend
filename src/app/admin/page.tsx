import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminBadge, AdminCard, AdminPageHeader, AdminStat } from "@/components/admin/ui";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    products,
    categories,
    reviews,
    leadsTotal,
    leadsNew,
    leadsToday,
    leadsWeek,
    inactiveProducts,
    recentLeads,
    hitProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.review.count({ where: { isActive: true } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.lead.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { isHit: true, isActive: true },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { category: { select: { name: true } } },
    }),
  ]);

  const statusTone = {
    NEW: "accent",
    IN_PROGRESS: "warn",
    DONE: "success",
    SPAM: "neutral",
  } as const;

  const statusLabel = {
    NEW: "Новая",
    IN_PROGRESS: "В работе",
    DONE: "Закрыта",
    SPAM: "Спам",
  } as const;

  return (
    <div>
      <AdminPageHeader
        title="Обзор"
        description="Сводка по каталогу и входящим заявкам."
        actions={
          <>
            <Link href="/admin/products/new" className="btn-primary !min-h-10 !text-sm">
              + Товар
            </Link>
            <Link href="/admin/leads" className="btn-outline !min-h-10 !text-sm">
              Заявки
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Новые заявки" value={leadsNew} href="/admin/leads?status=NEW" hint={`За 24ч: ${leadsToday}`} />
        <AdminStat label="Заявки за неделю" value={leadsWeek} href="/admin/leads" hint={`Всего: ${leadsTotal}`} />
        <AdminStat label="Товары" value={products} href="/admin/products" hint={inactiveProducts ? `Неактивных: ${inactiveProducts}` : "Все активны"} />
        <AdminStat label="Категории / отзывы" value={`${categories} / ${reviews}`} href="/admin/categories" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
            <h2 className="font-semibold text-[#17141a]">Последние заявки</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-[#b53d4a]">
              Все →
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {recentLeads.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#6f6764]">Заявок пока нет</p>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads?id=${lead.id}`}
                  className="flex items-start justify-between gap-3 px-5 py-3.5 transition hover:bg-[#faf8f7]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#17141a]">{lead.name}</p>
                    <p className="mt-0.5 text-sm text-[#6f6764]">
                      {lead.phone}
                      {lead.product ? ` · ${lead.product.name}` : ""}
                      {lead.source ? ` · ${lead.source}` : ""}
                    </p>
                  </div>
                  <AdminBadge tone={statusTone[lead.status]}>{statusLabel[lead.status]}</AdminBadge>
                </Link>
              ))
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
            <h2 className="font-semibold text-[#17141a]">Хиты продаж</h2>
            <Link href="/admin/products?hit=1" className="text-sm font-semibold text-[#b53d4a]">
              Каталог →
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {hitProducts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#6f6764]">Отметьте товары как «Хит»</p>
            ) : (
              hitProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-[#faf8f7]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#17141a]">{product.name}</p>
                    <p className="mt-0.5 text-sm text-[#6f6764]">{product.category.name}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[#17141a]">
                    {formatPrice(product.price ? Number(product.price) : null) || "—"}
                  </p>
                </Link>
              ))
            )}
          </div>
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/homepage", title: "Главная", text: "Hero, баннеры, блоки" },
          { href: "/admin/pages", title: "Страницы", text: "Политики и сервисы" },
          { href: "/admin/reviews", title: "Отзывы", text: "Модерация отзывов" },
          { href: "/admin/settings", title: "Настройки", text: "Контакты и пароль" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <AdminCard className="p-4 transition hover:-translate-y-0.5">
              <p className="font-semibold text-[#17141a]">{item.title}</p>
              <p className="mt-1 text-sm text-[#6f6764]">{item.text}</p>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
