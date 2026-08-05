import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      categories={categories}
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        shortDesc: product.shortDesc,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price === null ? null : Number(product.price),
        inStock: product.inStock,
        isNew: product.isNew,
        isHit: product.isHit,
        isActive: product.isActive,
      }}
    />
  );
}
