import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";

export const metadata: Metadata = {
  title: "Сертификаты",
};

export default function CertificatesPage() {
  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Документы</p>
          <CmsContent
            slug="certificates"
            fallbackTitle="Сертификаты"
            fallbackHtml="<p>Сотрудничаем с проверенными заводами и поставляем оборудование, в качестве которого уверены. По запросу предоставим сертификаты и сопроводительные документы на интересующие аппараты.</p><ul><li>Сертификат соответствия</li><li>Паспорт оборудования</li><li>Инструкция</li><li>Гарантийный талон</li></ul>"
          />
        </div>

        <PageFormPanel
          title="Запросить документы"
          lead="Укажите аппарат — пришлём доступные документы."
        >
          <LeadForm source="certificates" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
