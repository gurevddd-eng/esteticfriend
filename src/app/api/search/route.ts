import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/catalog";

function mapSearchProduct(product: {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  imageUrl: string | null;
  price: number | null;
  category?: { name: string } | null;
}) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDesc: product.shortDesc,
    imageUrl: product.imageUrl,
    price: product.price,
    categoryName: product.category?.name ?? null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limitRaw = Number(searchParams.get("limit") ?? "8");
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 20)
    : 8;

  const { categories, products } = await searchCatalog(query, { productLimit: limit });

  return NextResponse.json({
    query,
    categories: categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      products: category.products.map(mapSearchProduct),
    })),
    products: products.map(mapSearchProduct),
  });
}
