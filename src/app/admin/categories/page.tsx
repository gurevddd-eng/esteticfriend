import { prisma } from "@/lib/prisma";
import { CategoryAdminClient } from "./CategoryAdminClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return <CategoryAdminClient categories={categories} />;
}
