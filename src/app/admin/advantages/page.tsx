import { prisma } from "@/lib/prisma";
import { AdvantagesAdminClient } from "./AdvantagesAdminClient";

export default async function AdminAdvantagesPage() {
  const items = await prisma.advantage.findMany({ orderBy: { sortOrder: "asc" } });
  return <AdvantagesAdminClient items={items} />;
}
