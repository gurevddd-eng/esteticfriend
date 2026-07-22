import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Контакты",
};

export default function ContactsPage() {
  return (
    <div className="section-pad">
      <div className="container-shell grid gap-10 lg:grid-cols-2">
        <div>
          <p className="section-kicker">Контакты</p>
          <h1 className="section-title mt-3">Свяжитесь с нами</h1>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Телефон</p>
              <a href={SITE.phoneHref} className="mt-2 block text-2xl font-bold text-navy">
                {SITE.phone}
              </a>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Города</p>
              <p className="mt-2 text-lg font-semibold text-navy">{SITE.cities}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-muted uppercase">Доставка</p>
              <p className="mt-2 text-muted">Россия, СНГ, Китай</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.4rem] border border-[var(--line)] bg-white p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Оставить заявку
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Ответим и подготовим предложение под ваши задачи.
          </p>
          <LeadForm source="contacts" />
        </div>
      </div>
    </div>
  );
}
