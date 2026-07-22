import { LeadForm } from "@/components/LeadForm";

export function ConsultSection() {
  return (
    <section id="consult" className="section-pad bg-navy text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="section-kicker !text-frost/80">Свяжитесь с нами</p>
          <h2 className="section-title mt-3 !text-white">
            Оставьте заявку — подготовим подходящее предложение
          </h2>
          <p className="mt-5 max-w-lg text-white/70">
            Наши менеджеры ответят в ближайшее время и помогут выбрать аппарат под
            задачи вашего салона или клиники.
          </p>
        </div>
        <div className="rounded-[1.6rem] bg-white p-6 text-ink md:p-8">
          <LeadForm source="home-consult" />
        </div>
      </div>
    </section>
  );
}
