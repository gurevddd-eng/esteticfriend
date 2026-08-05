import { prisma } from "@/lib/prisma";
import { PagesAdminClient } from "./PagesAdminClient";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { title: "asc" },
    select: {
      slug: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  });

  return (
    <PagesAdminClient
      pages={pages.map((p) => ({
        ...p,
        updatedAt: p.updatedAt.toISOString(),
      }))}
    />
  );
}
