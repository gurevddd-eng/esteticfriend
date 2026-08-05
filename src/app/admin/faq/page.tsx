import { prisma } from "@/lib/prisma";
import { FaqAdminClient } from "./FaqAdminClient";

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  return <FaqAdminClient items={items} />;
}
