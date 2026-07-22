import { prisma } from "@/lib/prisma";
import { ProductsAdminClient } from "./ProductsAdminClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return <ProductsAdminClient products={products} />;
}
