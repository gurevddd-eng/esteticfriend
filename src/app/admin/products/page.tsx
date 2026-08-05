import { prisma } from "@/lib/prisma";
import { ProductsAdminClient } from "./ProductsAdminClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        price: true,
        inStock: true,
        isNew: true,
        isHit: true,
        isActive: true,
        categoryId: true,
        category: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <ProductsAdminClient
      products={products.map((p) => ({
        ...p,
        price: p.price === null ? null : Number(p.price),
      }))}
      categories={categories}
    />
  );
}
