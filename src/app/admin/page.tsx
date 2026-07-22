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
        description="Операционная сводка: заявки, каталог и быстрые переходы."
        actions={
          <>
            <Link href="/admin/products/new" className="ea-btn ea-btn--primary">
              + Товар
            </Link>
            <Link href="/admin/leads" className="ea-btn ea-btn--secondary">
              Канбан заявок
            </Link>
          </>
        }
      />

      <div className="ea-kpi">
        <AdminStat label="Новые заявки" value={leadsNew} href="/admin/leads?status=NEW" hint={`За 24ч: ${leadsToday}`} />
        <AdminStat label="За неделю" value={leadsWeek} href="/admin/leads" hint={`Всего: ${leadsTotal}`} />
        <AdminStat label="Товары" value={products} href="/admin/products" hint={inactiveProducts ? `Скрытых: ${inactiveProducts}` : "Все активны"} />
        <AdminStat label="Категории / отзывы" value={`${categories} / ${reviews}`} href="/admin/categories" />
      </div>

      <div className="ea-dash-grid" style={{ marginTop: "1.1rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <AdminCard>
          <div className="ea-panel__head">
            <h2 className="ea-panel__title">Последние заявки</h2>
            <Link href="/admin/leads" className="ea-btn ea-btn--ghost ea-btn--sm">
              Все →
            </Link>
          </div>
          <div>
            {recentLeads.length === 0 ? (
              <p className="ea-empty">Заявок пока нет</p>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads?id=${lead.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid var(--ea-line)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>{lead.name}</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--ea-muted)" }}>
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
          <div className="ea-panel__head">
            <h2 className="ea-panel__title">Хиты продаж</h2>
            <Link href="/admin/products?hit=1" className="ea-btn ea-btn--ghost ea-btn--sm">
              Каталог →
            </Link>
          </div>
          <div>
            {hitProducts.length === 0 ? (
              <p className="ea-empty">Отметьте товары как «Хит»</p>
            ) : (
              hitProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid var(--ea-line)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>{product.name}</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--ea-muted)" }}>
                      {product.category.name}
                    </p>
                  </div>
                  <p style={{ fontWeight: 800, margin: 0, whiteSpace: "nowrap" }}>
                    {formatPrice(product.price ? Number(product.price) : null) || "—"}
                  </p>
                </Link>
              ))
            )}
          </div>
        </AdminCard>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        }}
      >
        {[
          { href: "/admin/homepage", title: "Главная", text: "Hero + live preview" },
          { href: "/admin/pages", title: "Страницы", text: "Политики и сервисы" },
          { href: "/admin/reviews", title: "Отзывы", text: "Модерация" },
          { href: "/admin/settings", title: "Настройки", text: "Контакты и пароль" },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
            <AdminCard className="ea-quick">
              <div style={{ padding: "1rem" }}>
                <p style={{ fontWeight: 800, margin: 0 }}>{item.title}</p>
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--ea-muted)" }}>
                  {item.text}
                </p>
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
