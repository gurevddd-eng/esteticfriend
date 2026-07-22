import { Advantages } from "@/components/Advantages";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ConsultSection } from "@/components/ConsultSection";
import { Hero } from "@/components/Hero";
import { Managers } from "@/components/Managers";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanners } from "@/components/PromoBanners";
import { Reviews } from "@/components/Reviews";
import { getCategories, getProducts, getReviews } from "@/lib/catalog";
import { getHomepageContent } from "@/lib/site";
import Link from "next/link";

export default async function HomePage() {
  const [categories, hits, reviews, home] = await Promise.all([
    getCategories(),
    getProducts({ isHit: true, take: 8 }),
    getReviews(),
    getHomepageContent(),
  ]);

  return (
    <>
      <Hero content={home.hero} />
      <PromoBanners promos={home.promos} />

      <section className="section-pad !pt-4">
        <div className="container-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">{home.hits.kicker}</p>
              <h2 className="section-title mt-3">{home.hits.title}</h2>
            </div>
            <Link href="/catalog" className="btn-outline w-fit">
              {home.hits.ctaLabel}
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {hits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <CategoryShowcase categories={categories} content={home.categories} />
      <Managers {...home.managers} />
      <Advantages {...home.advantages} />
      <Reviews reviews={reviews} content={home.reviews} />
      <ConsultSection content={home.consult} />
    </>
  );
}
