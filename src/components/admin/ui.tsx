"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/auth";

export type AdminNavItem = {
  href: string;
  label: string;
  badge?: number;
};

export function AdminShell({
  email,
  name,
  nav,
  children,
}: {
  email?: string;
  name?: string;
  nav: AdminNavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="admin-sidebar border-b border-black/8 bg-[#111114] text-white lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="px-5 py-5">
          <Link href="/admin" className="block font-[family-name:var(--font-syne)] text-sm font-bold tracking-[0.08em] uppercase">
            Estetic Admin
          </Link>
          <p className="mt-2 truncate text-xs text-white/55">{name || email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[#111114]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      active ? "bg-[#e25563] text-white" : "bg-[#e25563] text-white"
                    }`}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <Link
            href="/"
            target="_blank"
            className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            Открыть сайт ↗
          </Link>
          <form action={logoutAdmin} className="px-1 pt-2">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#f0a0a8] transition hover:bg-white/10"
            >
              Выйти
            </button>
          </form>
        </nav>
      </aside>
      <div className="admin-main min-w-0 bg-[#f3f1ef]">
        <div className="mx-auto max-w-7xl p-4 md:p-7">{children}</div>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-[#17141a] md:text-3xl">
          {title}
        </h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-[#6f6764]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-black/8 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)] ${className}`}>
      {children}
    </div>
  );
}

export function AdminStat({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number | string;
  href?: string;
  hint?: string;
}) {
  const inner = (
    <div className="p-5">
      <p className="text-xs font-bold tracking-wide text-[#8a817c] uppercase">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold text-[#17141a]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#8a817c]">{hint}</p> : null}
    </div>
  );
  if (!href) return <AdminCard>{inner}</AdminCard>;
  return (
    <Link href={href} className="block transition hover:-translate-y-0.5">
      <AdminCard>{inner}</AdminCard>
    </Link>
  );
}

export function AdminBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger" | "accent";
}) {
  const tones = {
    neutral: "bg-[#f3f1ef] text-[#4a4441]",
    success: "bg-emerald-50 text-emerald-800",
    warn: "bg-amber-50 text-amber-800",
    danger: "bg-rose-50 text-rose-700",
    accent: "bg-[#fceef0] text-[#b53d4a]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function AdminEmpty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="font-semibold text-[#17141a]">{title}</p>
      {text ? <p className="mt-1 text-sm text-[#6f6764]">{text}</p> : null}
    </div>
  );
}

export function confirmDelete(message: string) {
  return typeof window !== "undefined" ? window.confirm(message) : false;
}
