import { prisma } from "@/lib/prisma";
import { PromosAdminClient } from "./PromosAdminClient";

export default async function AdminPromosPage() {
  const items = await prisma.promoBanner.findMany({ orderBy: { sortOrder: "asc" } });
  return <PromosAdminClient items={items} />;
}
