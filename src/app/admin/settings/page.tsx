import { prisma } from "@/lib/prisma";
import { SettingsAdminClient } from "./SettingsAdminClient";

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return <SettingsAdminClient settings={settings} />;
}
