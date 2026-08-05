import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";
import { getSiteInfo } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Контакты",
};

export default async function ContactsPage() {
  const site = await getSiteInfo();

  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Контакты</p>
          <h1 className="section-title mt-3">Свяжитесь с нами</h1>
          <p className="page__lead">
            Наши менеджеры ответят в ближайшее время и подготовят предложение.
          </p>

          <ul className="contact-facts">
            <li>
              <span className="contact-facts__label">Телефон</span>
              <a href={site.phoneHref} className="contact-facts__value">
                {site.phone}
              </a>
            </li>
            <li>
              <span className="contact-facts__label">Email</span>
              <a href={`mailto:${site.email}`} className="contact-facts__value">
                {site.email}
              </a>
            </li>
            <li>
              <span className="contact-facts__label">Офисы</span>
              <span className="contact-facts__value">{site.cities}</span>
            </li>
            <li>
              <span className="contact-facts__label">Доставка</span>
              <span className="contact-facts__value">Россия, СНГ, Китай</span>
            </li>
          </ul>
        </div>

        <PageFormPanel
          title="Обратный звонок"
          lead="Оставьте заявку — перезвоним и ответим на вопросы."
        >
          <LeadForm source="contacts" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
