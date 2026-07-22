import Link from "next/link";
import { logoutAdmin } from "@/actions/auth";
import { getAdminSession } from "@/lib/session";

const NAV = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/pages", label: "Страницы" },
  { href: "/admin/settings", label: "Настройки" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const isAdmin = Boolean(session.isLoggedIn && session.adminId);

  if (!isAdmin) {
    return <div className="min-h-screen bg-mist">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ef] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--line)] bg-white lg:border-b-0 lg:border-r">
        <div className="px-5 py-5">
          <Link href="/admin" className="brand-mark text-sm text-navy">
            ESTETIC ADMIN
          </Link>
          <p className="mt-1 text-xs text-muted">{session.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold text-navy/80 transition hover:bg-accent-soft hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-pearl hover:text-navy"
          >
            На сайт
          </Link>
          <form action={logoutAdmin} className="px-1 pt-2">
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-azure"
            >
              Выйти
            </button>
          </form>
        </nav>
      </aside>
      <div className="p-5 md:p-8">{children}</div>
    </div>
  );
}
