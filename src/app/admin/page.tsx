import { getDashboardStats } from "@/lib/admin-dashboard";
import { DashboardClient } from "./DashboardClient";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return <DashboardClient stats={stats} />;
}
