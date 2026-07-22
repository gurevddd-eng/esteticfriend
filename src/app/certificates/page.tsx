import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Сертификаты",
};

export default function CertificatesPage() {
  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="section-kicker">Документы</p>
          <CmsContent
            slug="certificates"
            fallbackTitle="Сертификаты"
            fallbackHtml="<p>Сотрудничаем с проверенными заводами и поставляем оборудование, в качестве которого уверены. По запросу предоставим сертификаты и сопроводительные документы на интересующие аппараты.</p><ul><li>Сертификат соответствия</li><li>Паспорт оборудования</li><li>Инструкция</li><li>Гарантийный талон</li></ul>"
          />
        </div>
        <div className="h-fit rounded-[1.4rem] border border-[var(--line)] bg-white p-6">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Запросить документы
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Укажите аппарат — пришлём доступные документы.
          </p>
          <LeadForm source="certificates" compact />
        </div>
      </div>
    </div>
  );
}
