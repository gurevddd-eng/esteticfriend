import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { AdminShell, type AdminNavItem } from "@/components/admin/ui";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const isAdmin = Boolean(session.isLoggedIn && session.adminId);

  if (!isAdmin) {
    return <div className="min-h-screen bg-[#f3f1ef]">{children}</div>;
  }

  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });

  const nav: AdminNavItem[] = [
    { href: "/admin", label: "Обзор" },
    { href: "/admin/leads", label: "Заявки", badge: newLeads },
    { href: "/admin/products", label: "Товары" },
    { href: "/admin/categories", label: "Категории" },
    { href: "/admin/homepage", label: "Главная" },
    { href: "/admin/pages", label: "Страницы" },
    { href: "/admin/reviews", label: "Отзывы" },
    { href: "/admin/settings", label: "Настройки" },
  ];

  return (
    <AdminShell email={session.email} name={session.name} nav={nav}>
      {children}
    </AdminShell>
  );
}
