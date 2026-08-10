export type AdminNavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export type AdminNavSection = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_SECTIONS: AdminNavSection[] = [
  {
    id: "desk",
    label: "Рабочий стол",
    items: [
      { href: "/admin", label: "Обзор", exact: true },
      { href: "/admin/leads", label: "Заявки" },
    ],
  },
  {
    id: "home",
    label: "Главная",
    items: [
      { href: "/admin/home", label: "Герой" },
      { href: "/admin/slides", label: "Слайды" },
      { href: "/admin/promos", label: "Промо" },
      { href: "/admin/faq", label: "FAQ" },
      { href: "/admin/brands", label: "Бренды" },
      { href: "/admin/advantages", label: "Преимущества" },
    ],
  },
  {
    id: "catalog",
    label: "Каталог",
    items: [
      { href: "/admin/products", label: "Товары" },
      { href: "/admin/categories", label: "Категории" },
    ],
  },
  {
    id: "materials",
    label: "Материалы",
    items: [{ href: "/admin/pages", label: "Страницы" }],
  },
  {
    id: "system",
    label: "Система",
    items: [
      { href: "/admin/settings", label: "Настройки" },
      { href: "/admin/contact-widget", label: "Кнопка связи" },
      { href: "/admin/integrations", label: "Интеграции" },
    ],
  },
];

export const ADMIN_NAV_FLAT = ADMIN_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.label })),
);

export function isAdminNavActive(pathname: string, item: AdminNavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
