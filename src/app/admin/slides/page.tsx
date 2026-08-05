import { prisma } from "@/lib/prisma";
import { SlidesAdminClient } from "./SlidesAdminClient";

export default async function AdminSlidesPage() {
  const items = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
  return <SlidesAdminClient items={items} />;
}
