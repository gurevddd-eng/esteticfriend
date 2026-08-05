"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { logoutAdmin } from "@/actions/auth";
import { AdminNavIcon } from "@/components/AdminNavIcons";
import { IconClose, IconMenu } from "@/components/icons";
import {
  ADMIN_NAV_FLAT,
  ADMIN_SECTIONS,
  isAdminNavActive,
} from "@/lib/admin-nav";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function AdminShell({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useBodyScrollLock(drawerOpen);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const current =
    ADMIN_NAV_FLAT.find((item) => isAdminNavActive(pathname, item)) ?? null;

  const clock = useMemo(
    () =>
      now.toLocaleString("ru-RU", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [now],
  );

  return (
    <div className="admin-shell">
      <div className="admin-shell__glow" aria-hidden />
      <div
        className={`admin-shell__overlay${drawerOpen ? " is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />

      <aside className={`admin-sidebar${drawerOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar__texture" aria-hidden />
        <div className="admin-sidebar__brand">
          <Link href="/admin" className="admin-sidebar__logo">
            <span className="admin-sidebar__mark">EF</span>
            <span className="admin-sidebar__brand-text">
              <span className="admin-sidebar__name">ESTETIC</span>
              <span className="admin-sidebar__sub">Friend CMS</span>
            </span>
          </Link>
          <button
            type="button"
            className="admin-sidebar__close"
            aria-label="Закрыть меню"
            onClick={() => setDrawerOpen(false)}
          >
            <IconClose size={18} />
          </button>
        </div>

        <div className="admin-sidebar__pulse">
          <span className="admin-sidebar__dot" />
          Система онлайн
        </div>

        <nav className="admin-sidebar__nav" aria-label="Разделы">
          {ADMIN_SECTIONS.map((section) => (
            <div key={section.id} className="admin-nav-section">
              <p className="admin-nav-section__label">{section.label}</p>
              <ul className="admin-nav-list">
                {section.items.map((item) => {
                  const active = isAdminNavActive(pathname, item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`admin-nav-link${active ? " is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        <AdminNavIcon href={item.href} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__foot">
          {email ? (
            <div className="admin-sidebar__user">
              <span className="admin-sidebar__avatar" aria-hidden>
                {email.slice(0, 1).toUpperCase()}
              </span>
              <div className="admin-sidebar__user-meta">
                <p className="admin-sidebar__user-label">Администратор</p>
                <p className="admin-sidebar__email">{email}</p>
              </div>
            </div>
          ) : null}
          <div className="admin-sidebar__actions">
            <Link href="/" className="admin-sidebar__ghost" target="_blank">
              Сайт
            </Link>
            <form action={logoutAdmin} className="admin-sidebar__logout-form">
              <button type="submit" className="admin-sidebar__logout">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__menu"
            aria-label="Открыть меню"
            onClick={() => setDrawerOpen(true)}
          >
            <IconMenu size={18} />
          </button>
          <div className="admin-topbar__crumb">
            <p className="admin-topbar__section">
              {current?.section ?? "CMS"}
            </p>
            <span className="admin-topbar__sep" aria-hidden>
              /
            </span>
            <p className="admin-topbar__page">{current?.label ?? "Админка"}</p>
          </div>
          <time className="admin-topbar__clock" dateTime={now.toISOString()}>
            {clock}
          </time>
          <Link href="/" className="admin-topbar__site" target="_blank">
            Открыть сайт
          </Link>
        </header>
        <div className="admin-main">
          <div className="admin-main__frame">{children}</div>
        </div>
      </div>
    </div>
  );
}
