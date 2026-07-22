import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Гарантия",
};

export default function WarrantyPage() {
  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="section-kicker">Сервис</p>
          <CmsContent
            slug="warranty"
            fallbackTitle="Гарантия"
            fallbackHtml="<p>На оборудование действует гарантийный срок. Мы сопровождаем клиентов не только до момента покупки, но и после запуска аппарата в работу.</p><p>Также предоставляем постгарантийный ремонт.</p>"
          />
        </div>
        <div className="h-fit rounded-[1.4rem] border border-[var(--line)] bg-white p-6">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Вопрос по гарантии
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Оставьте контакты — подскажем порядок обращения.
          </p>
          <LeadForm source="warranty" compact />
        </div>
      </div>
    </div>
  );
}
