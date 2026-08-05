import { AdminShell } from "@/components/AdminShell";
import { getAdminSession } from "@/lib/session";
import "./admin.css";
import "./admin-theme.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const isAdmin = Boolean(session.isLoggedIn && session.adminId);

  if (!isAdmin) {
    return <div className="admin-auth">{children}</div>;
  }

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
