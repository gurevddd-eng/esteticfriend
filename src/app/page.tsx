import { Advantages } from "@/components/Advantages";
import { BrandsSection } from "@/components/BrandsSection";
import { CatalogCta } from "@/components/CatalogCta";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { CompanyVideo } from "@/components/CompanyVideo";
import { ConsultSection } from "@/components/ConsultSection";
import { FaqSection } from "@/components/FaqSection";
import { Hero } from "@/components/Hero";
import { HeroSlider } from "@/components/HeroSlider";
import { HitsSlider } from "@/components/HitsSlider";
import { PromoBanners } from "@/components/PromoBanners";
import {
  getAdvantages,
  getBrands,
  getBrandsSectionConfig,
  getCategories,
  getFaqs,
  getHeroSlides,
  getProducts,
  getPromos,
  getSiteInfo,
} from "@/lib/catalog";

export default async function HomePage() {
  const [categories, hits, site, faqs, brands, brandsSection, advantages, promos, slides] =
    await Promise.all([
      getCategories(),
      getProducts({ isHit: true, take: 12 }),
      getSiteInfo(),
      getFaqs(),
      getBrands(),
      getBrandsSectionConfig(),
      getAdvantages(),
      getPromos(),
      getHeroSlides(),
    ]);

  return (
    <>
      <Hero site={site} />
      <HeroSlider slides={slides} />
      <PromoBanners promos={promos} />
      <CatalogCta />

      <section className="hits-section">
        <HitsSlider products={hits} />
      </section>

      <CategoryShowcase categories={categories} />
      <BrandsSection brands={brands} config={brandsSection} />
      <FaqSection items={faqs} />
      <Advantages items={advantages} />
      <CompanyVideo site={site} />
      <ConsultSection site={site} />
    </>
  );
}
