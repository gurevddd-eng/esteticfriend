import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Обучение",
};

export default function TrainingPage() {
  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="section-kicker">Обучение</p>
          <CmsContent
            slug="training"
            fallbackTitle="Обучение аппаратным методикам"
            fallbackHtml="<p>При покупке оборудования проводим бесплатное сертифицированное обучение.</p>"
          />
        </div>
        <div className="h-fit rounded-[1.4rem] border border-[var(--line)] bg-white p-6">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Записаться на консультацию
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Расскажем про формат обучения под ваш аппарат.
          </p>
          <LeadForm source="training" compact />
        </div>
      </div>
    </div>
  );
}
