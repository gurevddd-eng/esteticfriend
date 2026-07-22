import { prisma } from "@/lib/prisma";
import { PagesAdminClient } from "./PagesAdminClient";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });
  return <PagesAdminClient pages={pages} />;
}
