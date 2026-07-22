import { AdminChrome } from "@/components/admin/AdminChrome";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import "./admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  const isAdmin = Boolean(session.isLoggedIn && session.adminId);

  if (!isAdmin) {
    return (
      <div className="ea-root">
        <div className="ea-login-wrap">{children}</div>
      </div>
    );
  }

  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });

  return (
    <AdminChrome email={session.email} newLeads={newLeads}>
      {children}
    </AdminChrome>
  );
}
