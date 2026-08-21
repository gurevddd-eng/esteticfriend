import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyOneClick } from "@/components/BuyOneClick";
import { ProductDetailsTabs } from "@/components/ProductDetailsTabs";
import { ProductListActions } from "@/components/ProductListActions";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/catalog";
import { splitProductSections, deserializeSpecs, serializeSpecs } from "@/lib/product-sections";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Аппарат" };
  return {
    title: product.name,
    description: product.shortDesc,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const priceLabel = formatPrice(product.price);
  const hasStructured = Boolean(
    product.specs?.trim() || product.kit?.trim() || product.advantages?.trim(),
  );
  const legacy = hasStructured ? null : splitProductSections(product.description);
  const specsRaw = product.specs || legacy?.specs || "";
  const sections = {
    description: hasStructured
      ? product.description
      : legacy?.description || product.description,
    // Only real parameter/value pairs for this product.
    specs: serializeSpecs(deserializeSpecs(specsRaw)),
    kit: product.kit || legacy?.kit || "",
    advantages: product.advantages || legacy?.advantages || "",
  };

  return (
    <div className="page">
      <p className="product-page__crumbs">
        <Link href="/catalog">Каталог</Link>
        {product.category ? (
          <>
            {" / "}
            <Link href={`/catalog/${product.category.slug}`}>
              {product.category.name}
            </Link>
          </>
        ) : null}
        {" / "}
        <span>{product.name}</span>
      </p>

      <div className="product-page__layout">
        <div className="product-page__media">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-6"
              priority
            />
          ) : (
            <span className="device-silhouette" />
          )}
          <div className="product-page__badges">
            {product.isNew ? <span className="badge badge-new">Новинка</span> : null}
            {product.isHit ? <span className="badge badge-hit">Хит</span> : null}
          </div>
          <ProductListActions
            product={product}
            className="product-list-actions--overlay"
          />
        </div>

        <div className="product-page__summary">
          <div className="product-page__meta">
            {product.brand ? (
              <Link href={`/brands/${product.brand.slug}`} className="product-page__category">
                {product.brand.name}
              </Link>
            ) : null}
            {product.category ? (
              <Link
                href={`/catalog/${product.category.slug}`}
                className="product-page__category"
              >
                {product.category.name}
              </Link>
            ) : null}
          </div>
          <h1 className="section-title mt-3">{product.name}</h1>
          <p className="page__lead">{product.shortDesc}</p>

          <div className="mt-5">
            {product.inStock ? (
              <span className="badge badge-stock">В наличии</span>
            ) : (
              <span className="badge badge-order">Под заказ</span>
            )}
          </div>

          <p className="product-page__price">{priceLabel || "Цена по запросу"}</p>

          <div className="product-page__actions">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.imageUrl,
              }}
              label="В корзину"
            />
            <BuyOneClick productId={product.id} productName={product.name} />
            <Link href="/cart" className="btn-outline">
              Перейти в корзину
            </Link>
          </div>
        </div>
      </div>

      <ProductDetailsTabs sections={sections} />
    </div>
  );
}
