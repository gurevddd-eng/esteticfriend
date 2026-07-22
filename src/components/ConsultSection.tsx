import { LeadForm } from "@/components/LeadForm";
import type { HomepageContent } from "@/lib/site";

export function ConsultSection({ content }: { content: HomepageContent["consult"] }) {
  return (
    <section id="consult" className="section-pad bg-navy text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="section-kicker !text-frost/80">{content.kicker}</p>
          <h2 className="section-title mt-3 !text-white">{content.title}</h2>
          <p className="mt-5 max-w-lg text-white/70">{content.text}</p>
        </div>
        <div className="rounded-[1.6rem] bg-white p-6 text-ink md:p-8">
          <LeadForm source="home-consult" />
        </div>
      </div>
    </section>
  );
}
