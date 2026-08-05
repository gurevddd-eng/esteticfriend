import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return <ProductForm categories={categories} />;
}
