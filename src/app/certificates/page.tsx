import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сертификаты",
};

export default function CertificatesPage() {
  return (
    <div className="section-pad">
      <div className="container-shell max-w-3xl">
        <p className="section-kicker">Документы</p>
        <h1 className="section-title mt-3">Сертификаты</h1>
        <p className="mt-8 text-muted leading-relaxed">
          Мы сотрудничаем только с проверенными заводами и поставляем оборудование,
          в качестве которого уверены. По запросу предоставим сертификаты и
          сопроводительные документы на интересующие аппараты.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {["Сертификат соответствия", "Паспорт оборудования", "Инструкция", "Гарантийный талон"].map(
            (item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[var(--line)] bg-white px-5 py-6 font-semibold text-navy"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
