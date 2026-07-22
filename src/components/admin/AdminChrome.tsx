"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Package,
  PhoneCall,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { logoutAdmin } from "@/actions/auth";

const NAV: Array<{ href: string; label: string; icon: LucideIcon; key: string }> = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, key: "dash" },
  { href: "/admin/leads", label: "Заявки", icon: PhoneCall, key: "leads" },
  { href: "/admin/products", label: "Товары", icon: Package, key: "products" },
  { href: "/admin/categories", label: "Категории", icon: FolderTree, key: "categories" },
  { href: "/admin/homepage", label: "Главная", icon: Image, key: "homepage" },
  { href: "/admin/pages", label: "Страницы", icon: FileText, key: "pages" },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquareQuote, key: "reviews" },
  { href: "/admin/settings", label: "Настройки", icon: Settings, key: "settings" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminChrome({
  email,
  newLeads,
  children,
}: {
  email?: string;
  newLeads: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mobilePrimary = NAV.slice(0, 5);

  return (
    <div className="ea-root">
      <div className="ea-shell">
        <aside className="ea-rail" aria-label="Админ-навигация">
          <div className="ea-rail__brand">
            <div className="ea-rail__mark">EF</div>
            <div className="ea-rail__brand-text">
              <strong>Estetic Admin</strong>
              <span>{email}</span>
            </div>
          </div>

          <nav className="ea-nav" aria-label="Разделы">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.key} href={item.href} className={active ? "is-active" : undefined}>
                  <Icon className="ea-nav__icon" size={18} />
                  <span className="label">{item.label}</span>
                  {item.key === "leads" && newLeads > 0 ? (
                    <span className="ea-nav__badge">{newLeads > 99 ? "99+" : newLeads}</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ea-rail__foot">
            <Link href="/" target="_blank">
              <Home size={16} />
              <span className="label">На сайт</span>
            </Link>
            <form action={logoutAdmin}>
              <button type="submit">
                <LogOut size={16} />
                <span className="label">Выйти</span>
              </button>
            </form>
          </div>
        </aside>

        <div className="ea-main">
          <header className="ea-topbar">
            <div className="ea-topbar__crumbs">
              <span>Control Center</span>
              <span>/</span>
              <strong>ESTETIC FRIEND</strong>
            </div>
            <div className="ea-topbar__actions">
              {newLeads > 0 ? (
                <Link href="/admin/leads?status=NEW" className="ea-chip ea-chip--accent">
                  {newLeads} новых заявок
                </Link>
              ) : (
                <span className="ea-chip ea-chip--ok">Заявки в порядке</span>
              )}
              <Link href="/" className="ea-btn ea-btn--secondary ea-btn--sm" target="_blank">
                Открыть сайт
              </Link>
            </div>
          </header>

          <div className="ea-content">{children}</div>

          <nav className="ea-mobile-nav" aria-label="Мобильная навигация">
            {mobilePrimary.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.key} href={item.href} className={active ? "is-active" : undefined}>
                  <Icon size={16} style={{ display: "block", margin: "0 auto 0.15rem" }} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin/settings"
              className={
                ["/admin/settings", "/admin/pages", "/admin/reviews"].some((h) =>
                  pathname.startsWith(h),
                )
                  ? "is-active"
                  : undefined
              }
            >
              <Settings size={16} style={{ display: "block", margin: "0 auto 0.15rem" }} />
              Ещё
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
