import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
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

  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
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
          <div className="mt-5">
            {product.inStock ? (
              <span className="badge badge-stock">В наличии</span>
            ) : (
              <span className="badge bg-pearl text-muted">Под заказ</span>
            )}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-ink/80">{product.description}</p>

          <div className="mt-10 rounded-[1.4rem] border border-[var(--line)] bg-white p-6">
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
              Заявка на консультацию
            </h2>
            <p className="mt-2 mb-5 text-sm text-muted">
              Подберём комплектацию и расскажем об условиях поставки.
            </p>
            <LeadForm
              source="product"
              productId={product.id}
              productName={product.name}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
