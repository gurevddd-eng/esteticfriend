import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/lib/content";

export function ProductCard({ product }: { product: ProductDTO }) {
  return (
    <article className="product-tile">
      <Link href={`/product/${product.slug}`} className="product-visual block">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <span className="device-silhouette" />
        )}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {product.isNew ? <span className="badge badge-new">Новинка</span> : null}
          {product.isHit ? (
            <span className="badge bg-white/90 text-navy">Хит</span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {product.category ? (
          <Link
            href={`/catalog/${product.category.slug}`}
            className="text-xs font-bold tracking-wide text-azure uppercase"
          >
            {product.category.name}
          </Link>
        ) : null}
        <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {product.shortDesc}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          {product.inStock ? (
            <span className="badge badge-stock">В наличии</span>
          ) : (
            <span className="badge bg-pearl text-muted">Под заказ</span>
          )}
          <Link href={`/product/${product.slug}`} className="btn-outline !min-h-9 !px-4 !text-sm">
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
