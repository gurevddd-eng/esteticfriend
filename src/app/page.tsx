import { Advantages } from "@/components/Advantages";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ConsultSection } from "@/components/ConsultSection";
import { Hero } from "@/components/Hero";
import { Managers } from "@/components/Managers";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanners } from "@/components/PromoBanners";
import { Reviews } from "@/components/Reviews";
import { getCategories, getProducts, getReviews } from "@/lib/catalog";
import Link from "next/link";

export default async function HomePage() {
  const [categories, hits, reviews] = await Promise.all([
    getCategories(),
    getProducts({ isHit: true, take: 8 }),
    getReviews(),
  ]);

  return (
    <>
      <Hero />
      <PromoBanners />

      <section className="section-pad !pt-4">
        <div className="container-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Хиты продаж</p>
              <h2 className="section-title mt-3">Популярное оборудование</h2>
            </div>
            <Link href="/catalog" className="btn-outline w-fit">
              Смотреть каталог
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {hits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <CategoryShowcase categories={categories} />
      <Managers />
      <Advantages />
      <Reviews reviews={reviews} />
      <ConsultSection />
    </>
  );
}
