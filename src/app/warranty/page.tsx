import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Гарантия",
};

export default function WarrantyPage() {
  return (
    <div className="section-pad">
      <div className="container-shell max-w-3xl">
        <p className="section-kicker">Сервис</p>
        <h1 className="section-title mt-3">Гарантия</h1>
        <div className="mt-8 space-y-5 text-muted leading-relaxed">
          <p>
            На оборудование действует гарантийный срок. Мы сопровождаем клиентов
            не только до момента покупки, но и после запуска аппарата в работу.
          </p>
          <p>
            Также предоставляем постгарантийный ремонт: помогаем поддерживать
            оборудование в рабочем состоянии на всём сроке эксплуатации.
          </p>
          <p>
            По вопросам гарантийного обслуживания свяжитесь с менеджером — подскажем
            порядок обращения и сроки диагностики.
          </p>
        </div>
      </div>
    </div>
  );
}
