import { prisma } from "@/lib/prisma";
import { aggregateLeadProductCounts, getLeadProductNames } from "@/lib/lead-products";

export type DayPoint = { date: string; label: string; count: number };

export type NamedCount = { name: string; count: number };

export type DashboardStats = {
  kpis: {
    leads: number;
    leadsWeek: number;
    leadsPrevWeek: number;
    products: number;
    productsActive: number;
    categories: number;
    pages: number;
    inStock: number;
    hits: number;
    news: number;
  };
  leadsByDay: DayPoint[];
  leadsBySource: NamedCount[];
  productsByCategory: NamedCount[];
  catalogMix: NamedCount[];
  contentMix: NamedCount[];
  topProducts: NamedCount[];
  recentLeads: {
    id: string;
    name: string;
    phone: string;
    source: string | null;
    productName: string | null;
    createdAt: string;
  }[];
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayLabel(d: Date) {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const today = startOfDay(now);
  const days = 14;
  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - (days - 1));

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const prevWeekStart = new Date(today);
  prevWeekStart.setDate(prevWeekStart.getDate() - 13);
  const prevWeekEnd = new Date(today);
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

  const [
    leadsTotal,
    leadsWeek,
    leadsPrevWeek,
    products,
    productsActive,
    categories,
    pages,
    inStock,
    hits,
    news,
    faqs,
    brands,
    promos,
    slides,
    advantages,
    recentLeads,
    leadsInRange,
    categoryRows,
    catalogStatus,
    leadsForProducts,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.lead.count({
      where: { createdAt: { gte: prevWeekStart, lt: prevWeekEnd } },
    }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.page.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.product.count({ where: { isHit: true } }),
    prisma.product.count({ where: { isNew: true } }),
    prisma.faqItem.count(),
    prisma.brand.count(),
    prisma.promoBanner.count(),
    prisma.heroSlide.count(),
    prisma.advantage.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { product: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: { createdAt: true, source: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.category.findMany({
      select: {
        name: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    }),
    Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.product.count({ where: { inStock: true } }),
      prisma.product.count({ where: { inStock: false } }),
    ]),
    prisma.lead.findMany({
      select: {
        productId: true,
        itemsJson: true,
        message: true,
        product: { select: { id: true, name: true } },
      },
    }),
  ]);

  const byDay = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(rangeStart);
    d.setDate(rangeStart.getDate() + i);
    byDay.set(dayKey(d), 0);
  }
  for (const lead of leadsInRange) {
    const key = dayKey(new Date(lead.createdAt));
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1);
  }

  const leadsByDay: DayPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(rangeStart);
    d.setDate(rangeStart.getDate() + i);
    const key = dayKey(d);
    leadsByDay.push({
      date: key,
      label: dayLabel(d),
      count: byDay.get(key) || 0,
    });
  }

  const sourceMap = new Map<string, number>();
  for (const lead of leadsInRange) {
    const name = (lead.source || "Без источника").trim() || "Без источника";
    sourceMap.set(name, (sourceMap.get(name) || 0) + 1);
  }
  const leadsBySource = [...sourceMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topProducts = aggregateLeadProductCounts(leadsForProducts).slice(0, 5);

  const [activeCount, hiddenCount, stockCount, orderCount] = catalogStatus;

  return {
    kpis: {
      leads: leadsTotal,
      leadsWeek,
      leadsPrevWeek,
      products,
      productsActive,
      categories,
      pages,
      inStock,
      hits,
      news,
    },
    leadsByDay,
    leadsBySource,
    productsByCategory: categoryRows
      .map((c) => ({ name: c.name, count: c._count.products }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count),
    catalogMix: [
      { name: "Активные", count: activeCount },
      { name: "Скрытые", count: hiddenCount },
      { name: "В наличии", count: stockCount },
      { name: "Под заказ", count: orderCount },
    ],
    contentMix: [
      { name: "Слайды", count: slides },
      { name: "Промо", count: promos },
      { name: "FAQ", count: faqs },
      { name: "Бренды", count: brands },
      { name: "Преимущества", count: advantages },
      { name: "Страницы", count: pages },
    ],
    topProducts,
    recentLeads: recentLeads.map((lead) => {
      const productNames = getLeadProductNames(lead);
      return {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        source: lead.source,
        productName: productNames.length > 0 ? productNames.join(", ") : null,
        createdAt: lead.createdAt.toISOString(),
      };
    }),
  };
}

export function deltaLabel(current: number, previous: number) {
  if (previous === 0 && current === 0) return { text: "без изменений", tone: "flat" as const };
  if (previous === 0) return { text: `+${current}`, tone: "up" as const };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return { text: "0%", tone: "flat" as const };
  if (pct > 0) return { text: `+${pct}%`, tone: "up" as const };
  return { text: `${pct}%`, tone: "down" as const };
}
