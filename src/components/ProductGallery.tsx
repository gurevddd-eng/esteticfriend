import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/lib/content";
import { formatPrice } from "@/lib/format";

export function ProductGallery({ products }: { products: ProductDTO[] }) {
  return (
    <section className="section-pad !py-12">
      <div className="container-shell">
        <p className="section-kicker">Каталог</p>
        <h2 className="section-title mt-3">Наши новинки</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const priceLabel = formatPrice(product.price);
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group overflow-hidden rounded-[1.15rem] border border-[var(--line)] bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(53,68,89,0.12)]"
              >
                <div className="relative aspect-[4/3] bg-white">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  {product.inStock ? (
                    <span className="badge badge-stock absolute top-3 left-3 z-10">
                      В наличии
                    </span>
                  ) : null}
                </div>
                <div className="border-t border-[var(--line)] px-5 py-4">
                  <h3 className="font-[family-name:var(--font-syne)] text-lg text-navy">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{product.shortDesc}</p>
                  {priceLabel ? (
                    <p className="mt-3 text-base font-semibold text-navy">{priceLabel}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
