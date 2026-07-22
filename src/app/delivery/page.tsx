import type { Metadata } from "next";
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
          <h1 className="section-title mt-3">Доставка и оплата</h1>
          <div className="mt-8 space-y-6 text-muted leading-relaxed">
            <p>
              Доставляем оборудование по всей России, в Республику Беларусь,
              Казахстан и Китай. Организуем бережную логистику профессиональной
              техники до вашего салона или клиники.
            </p>
            <p>
              Офисы в Москве и Санкт-Петербурге — можно согласовать самовывоз
              или лично ознакомиться с аппаратами перед покупкой.
            </p>
            <p>
              Условия оплаты и сроки поставки уточняются менеджером под конкретный
              аппарат и регион доставки.
            </p>
          </div>
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
