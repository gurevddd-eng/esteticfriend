import type { Metadata } from "next";
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
          <h1 className="section-title mt-3">Сертификаты</h1>
          <p className="mt-8 text-muted leading-relaxed">
            Сотрудничаем с проверенными заводами и поставляем оборудование, в качестве
            которого уверены. По запросу предоставим сертификаты и сопроводительные
            документы на интересующие аппараты.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Сертификат соответствия",
              "Паспорт оборудования",
              "Инструкция",
              "Гарантийный талон",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[var(--line)] bg-white px-5 py-6 font-semibold text-navy"
              >
                {item}
              </div>
            ))}
          </div>
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
