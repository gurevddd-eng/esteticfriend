import { LeadForm } from "@/components/LeadForm";

export function ConsultSection() {
  return (
    <section id="consult" className="section-pad bg-navy text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="section-kicker !text-frost/80">Остались вопросы?</p>
          <h2 className="section-title mt-3 !text-white">
            Проведём бесплатную консультацию и подберём оборудование за 20 минут
          </h2>
          <p className="mt-5 max-w-lg text-white/70">
            Оставьте контакты — менеджер поможет выбрать аппарат под задачи вашего
            кабинета или клиники.
          </p>
        </div>
        <div className="rounded-[1.6rem] bg-white p-6 text-ink md:p-8">
          <LeadForm source="home-consult" />
        </div>
      </div>
    </section>
  );
}
