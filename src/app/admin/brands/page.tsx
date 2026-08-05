import { prisma } from "@/lib/prisma";
import { BrandsAdminClient } from "./BrandsAdminClient";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { sortOrder: "asc" } });
  return <BrandsAdminClient brands={brands} />;
}
