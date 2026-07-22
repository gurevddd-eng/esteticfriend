import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <ProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
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
