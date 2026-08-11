import { getBrandsSectionConfig } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { BrandsAdminClient } from "./BrandsAdminClient";

export default async function AdminBrandsPage() {
  const [brands, section] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
    getBrandsSectionConfig(),
  ]);

  return (
    <BrandsAdminClient
      section={section}
      brands={brands.map((brand) => ({
        id: brand.id,
        slug: brand.slug,
        name: brand.name,
        description: brand.description,
        sortOrder: brand.sortOrder,
        isActive: brand.isActive,
        _count: brand._count,
      }))}
    />
  );
}
