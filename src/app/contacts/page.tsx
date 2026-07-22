import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Контакты",
};

export default function ContactsPage() {
  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="section-kicker">Контакты</p>
          <h1 className="section-title mt-3">Свяжитесь с нами</h1>
          <p className="mt-4 max-w-xl text-muted">
            Наши менеджеры ответят в ближайшее время и подготовят предложение.
          </p>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Телефон</p>
              <a href={SITE.phoneHref} className="mt-2 block text-2xl font-bold text-navy">
                {SITE.phone}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Email</p>
              <a href={`mailto:${SITE.email}`} className="mt-2 block text-lg font-semibold text-navy">
                {SITE.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Офисы</p>
              <p className="mt-2 text-lg font-semibold text-navy">{SITE.cities}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Доставка</p>
              <p className="mt-2 text-muted">Россия, СНГ, Китай</p>
            </div>
          </div>
        </div>
        <div className="h-fit rounded-[1.4rem] border border-[var(--line)] bg-white p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Обратный звонок
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Оставьте заявку — перезвоним и ответим на вопросы.
          </p>
          <LeadForm source="contacts" compact />
        </div>
      </div>
    </div>
  );
}
