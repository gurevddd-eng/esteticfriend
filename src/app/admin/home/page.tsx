import { prisma } from "@/lib/prisma";
import { HomeAdminClient } from "./HomeAdminClient";

export default async function AdminHomePage() {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return <HomeAdminClient settings={settings} />;
}
