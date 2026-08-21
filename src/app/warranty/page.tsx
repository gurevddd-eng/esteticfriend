import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";
import { getSiteInfo } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Гарантия",
  description:
    "Гарантия на всё косметологическое оборудование SEVENS. Срок указан в гарантийном талоне. Постгарантийный ремонт и сопровождение после запуска аппарата.",
};

const WARRANTY_FACTS = [
  {
    label: "Покрытие",
    value: "На всё оборудование",
  },
  {
    label: "Срок",
    value: "Указан в гарантийном талоне",
  },
  {
    label: "После гарантии",
    value: "Ремонт и сопровождение",
  },
];

const WARRANTY_POINTS = [
  {
    title: "Гарантия на аппарат",
    text: "Действует на всё оборудование. Конкретный срок и условия указаны в гарантийном талоне и зависят от модели.",
  },
  {
    title: "Сопровождение после запуска",
    text: "Помогаем не только до покупки, но и после ввода аппарата в работу — по вопросам эксплуатации и сервиса.",
  },
  {
    title: "Постгарантийный ремонт",
    text: "После окончания гарантии принимаем оборудование в ремонт. Сроки и стоимость согласуем после диагностики.",
  },
];

export default async function WarrantyPage() {
  const site = await getSiteInfo();

  const claimSteps = [
    {
      title: "Свяжитесь с нами",
      text: `Позвоните или напишите в WhatsApp: ${site.phone}. Можно оставить заявку в форме на этой странице.`,
    },
    {
      title: "Опишите ситуацию",
      text: "Назовите модель аппарата, дату покупки и опишите проблему. При необходимости пришлите фото или видео.",
    },
    {
      title: "Согласуем порядок работ",
      text: "Подскажем, нужна ли диагностика на месте, отправка в сервис или замена по гарантии.",
    },
  ];

  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Сервис</p>
          <h1 className="section-title mt-3">Гарантия</h1>
          <p className="page__lead">
            На всё оборудование действует гарантия. Срок указан в гарантийном
            талоне — условия зависят от конкретной модели и уточняются при
            покупке.
          </p>

          <ul className="contact-facts delivery-facts">
            {WARRANTY_FACTS.map((fact) => (
              <li key={fact.label}>
                <span className="contact-facts__label">{fact.label}</span>
                <span className="contact-facts__value">{fact.value}</span>
              </li>
            ))}
          </ul>

          <section className="delivery-block" aria-labelledby="warranty-cover">
            <h2 id="warranty-cover" className="delivery-block__title">
              Что входит в сервис
            </h2>
            <ul className="delivery-ways">
              {WARRANTY_POINTS.map((point) => (
                <li key={point.title} className="delivery-ways__item">
                  <span className="delivery-ways__name">{point.title}</span>
                  <span className="delivery-ways__text">{point.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="delivery-block" aria-labelledby="warranty-steps">
            <h2 id="warranty-steps" className="delivery-block__title">
              Как обратиться по гарантии
            </h2>
            <ol className="delivery-steps">
              {claimSteps.map((step, index) => (
                <li key={step.title} className="delivery-steps__item">
                  <span className="delivery-steps__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="delivery-steps__body">
                    <span className="delivery-steps__title">{step.title}</span>
                    <p className="delivery-steps__text">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="delivery-block" aria-labelledby="warranty-contact">
            <h2 id="warranty-contact" className="delivery-block__title">
              Контакты сервиса
            </h2>
            <ul className="contact-facts service-facts--flush">
              <li>
                <span className="contact-facts__label">Телефон / WhatsApp</span>
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
                <span className="contact-facts__label">Режим работы</span>
                <span className="contact-facts__value">
                  Пн–Пт, 10:00–21:00
                </span>
              </li>
            </ul>
            <p className="delivery-note">
              Офисы в Москве и Санкт-Петербурге — посещение по предварительной
              записи.
            </p>
          </section>
        </div>

        <PageFormPanel
          title="Вопрос по гарантии"
          lead="Оставьте контакты — подскажем порядок обращения и сроки."
        >
          <LeadForm source="warranty" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
