import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Доставка и оплата",
};

export default function DeliveryPage() {
  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="section-kicker">Сервис</p>
          <CmsContent
            slug="delivery"
            fallbackTitle="Доставка и оплата"
            fallbackHtml="<p>Доставляем оборудование по всей России, в Республику Беларусь, Казахстан и Китай.</p><p>Офисы в Москве и Санкт-Петербурге — можно согласовать самовывоз.</p><p>Условия оплаты и сроки поставки уточняются менеджером.</p>"
          />
        </div>
        <div className="rounded-[1.4rem] border border-[var(--line)] bg-white p-6">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Рассчитать доставку
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Оставьте контакты — рассчитаем сроки и стоимость.
          </p>
          <LeadForm source="delivery" compact />
        </div>
      </div>
    </div>
  );
}
