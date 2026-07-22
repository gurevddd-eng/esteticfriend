import { About } from "@/components/About";
import { Advantages } from "@/components/Advantages";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ConsultSection } from "@/components/ConsultSection";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Reviews } from "@/components/Reviews";
import { getCategories, getProducts, getReviews } from "@/lib/catalog";
import Link from "next/link";

export default async function HomePage() {
  const [categories, products, reviews] = await Promise.all([
    getCategories(),
    getProducts({ isNew: true }),
    getReviews(),
  ]);

  return (
    <>
      <Hero />

      <section className="section-pad">
        <div className="container-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Ассортимент</p>
              <h2 className="section-title mt-3">Наши новинки</h2>
            </div>
            <Link href="/catalog/novinki" className="btn-outline w-fit">
              Все новинки
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <CategoryShowcase categories={categories} />
      <Advantages />
      <About />
      <Reviews reviews={reviews} />
      <ConsultSection />
    </>
  );
}
