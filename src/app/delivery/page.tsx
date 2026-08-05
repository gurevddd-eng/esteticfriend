import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";

export const metadata: Metadata = {
  title: "Доставка и оплата",
};

export default function DeliveryPage() {
  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Сервис</p>
          <CmsContent
            slug="delivery"
            fallbackTitle="Доставка и оплата"
            fallbackHtml="<p>Доставляем оборудование по всей России, в Республику Беларусь, Казахстан и Китай.</p><p>Офисы в Москве и Санкт-Петербурге — можно согласовать самовывоз.</p><p>Условия оплаты и сроки поставки уточняются менеджером.</p>"
          />
        </div>
        <PageFormPanel
          title="Рассчитать доставку"
          lead="Оставьте контакты — рассчитаем сроки и стоимость."
        >
          <LeadForm source="delivery" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
