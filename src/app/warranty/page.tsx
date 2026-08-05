import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";

export const metadata: Metadata = {
  title: "Гарантия",
};

export default function WarrantyPage() {
  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Сервис</p>
          <CmsContent
            slug="warranty"
            fallbackTitle="Гарантия"
            fallbackHtml="<p>На оборудование действует гарантийный срок. Мы сопровождаем клиентов не только до момента покупки, но и после запуска аппарата в работу.</p><p>Также предоставляем постгарантийный ремонт.</p>"
          />
        </div>
        <PageFormPanel
          title="Вопрос по гарантии"
          lead="Оставьте контакты — подскажем порядок обращения."
        >
          <LeadForm source="warranty" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
