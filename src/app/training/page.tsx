import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";

export const metadata: Metadata = {
  title: "Обучение",
};

export default function TrainingPage() {
  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Обучение</p>
          <CmsContent
            slug="training"
            fallbackTitle="Обучение аппаратным методикам"
            fallbackHtml="<p>При покупке оборудования проводим бесплатное сертифицированное обучение.</p>"
          />
        </div>
        <PageFormPanel
          title="Записаться на консультацию"
          lead="Расскажем про формат обучения под ваш аппарат."
        >
          <LeadForm source="training" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
