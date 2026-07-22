import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyOneClick } from "@/components/BuyOneClick";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/catalog";

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

  return (
    <div className="section-pad">
      <div className="container-shell">
        <p className="text-sm text-muted">
          <Link href="/catalog" className="hover:text-azure">
            Каталог
          </Link>
          {product.category ? (
            <>
              {" / "}
              <Link
                href={`/catalog/${product.category.slug}`}
                className="hover:text-azure"
              >
                {product.category.name}
              </Link>
            </>
          ) : null}
          {" / "}
          {product.name}
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="product-visual !aspect-[5/4] rounded-[1.6rem] border border-[var(--line)]">
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
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {product.isNew ? <span className="badge badge-new">Новинка</span> : null}
              {product.isHit ? (
                <span className="badge bg-white/90 text-navy">Хит</span>
              ) : null}
            </div>
          </div>

          <div>
            {product.category ? (
              <Link
                href={`/catalog/${product.category.slug}`}
                className="text-xs font-bold tracking-wide text-azure uppercase"
              >
                {product.category.name}
              </Link>
            ) : null}
            <h1 className="section-title mt-3">{product.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted">{product.shortDesc}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {product.inStock ? (
                <span className="badge badge-stock">В наличии</span>
              ) : (
                <span className="badge bg-pearl text-muted">Под заказ</span>
              )}
            </div>

            <p className="mt-6 text-3xl font-bold text-navy">
              {priceLabel || "Цена по запросу"}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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

            <div className="mt-10 border-t border-[var(--line)] pt-8">
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
                Описание
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
