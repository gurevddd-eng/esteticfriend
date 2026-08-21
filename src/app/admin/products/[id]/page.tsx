import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        brandId: product.brandId,
        shortDesc: product.shortDesc,
        description: product.description,
        specs: product.specs,
        kit: product.kit,
        advantages: product.advantages,
        imageUrl: product.imageUrl,
        price: product.price === null ? null : Number(product.price),
        compareAtPrice:
          product.compareAtPrice === null ? null : Number(product.compareAtPrice),
        inStock: product.inStock,
        isNew: product.isNew,
        isHit: product.isHit,
        isActive: product.isActive,
      }}
    />
  );
}
