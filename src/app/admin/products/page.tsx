import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductsAdminClient } from "./ProductsAdminClient";

async function ProductsInner() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <ProductsAdminClient
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        imageUrl: p.imageUrl,
        price: p.price ? Number(p.price) : null,
        inStock: p.inStock,
        isNew: p.isNew,
        isHit: p.isHit,
        isActive: p.isActive,
        category: p.category,
      }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p className="ea-sub">Загрузка каталога...</p>}>
      <ProductsInner />
    </Suspense>
  );
}
