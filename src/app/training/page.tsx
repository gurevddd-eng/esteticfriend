import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";
import { getSiteInfo } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Обучение",
  description:
    "Обучение аппаратным методикам при покупке оборудования SEVENS — в подарок. Очный и дистанционный формат, практика на моделях, сертификат.",
};

const TRAINING_FACTS = [
  {
    label: "При покупке",
    value: "Обучение в подарок",
  },
  {
    label: "Формат",
    value: "Очно или онлайн",
  },
  {
    label: "Без аппарата",
    value: "Тоже можно записаться",
  },
];

const COURSE_INCLUDES = [
  {
    title: "Теория",
    text: "Подробный блок по методике и работе на актуальном для вас оборудовании.",
  },
  {
    title: "Практика",
    text: "Отработка на моделях под контролем методиста.",
  },
  {
    title: "Сертификат",
    text: "Документ о прохождении курса после завершения обучения.",
  },
];

const ADVANTAGES = [
  {
    title: "Полный блок знаний",
    text: "Теория и практика по аппаратной косметологии именно на том оборудовании, с которым будете работать.",
  },
  {
    title: "Поддержка после курса",
    text: "Методисты остаются на связи и отвечают на дополнительные вопросы уже после обучения.",
  },
  {
    title: "Рекомендации по бизнесу",
    text: "По запросу подскажем, как развивать поток клиентов на процедуры с первого месяца работы.",
  },
];

export default async function TrainingPage() {
  const site = await getSiteInfo();

  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Обучение</p>
          <h1 className="section-title mt-3">Обучение аппаратным методикам</h1>
          <p className="page__lead">
            При покупке оборудования проводим обучение в подарок — очно или
            дистанционно. Можно пройти курс и без покупки аппарата.
          </p>

          <ul className="contact-facts delivery-facts">
            {TRAINING_FACTS.map((fact) => (
              <li key={fact.label}>
                <span className="contact-facts__label">{fact.label}</span>
                <span className="contact-facts__value">{fact.value}</span>
              </li>
            ))}
          </ul>

          <section className="delivery-block" aria-labelledby="training-course">
            <h2 id="training-course" className="delivery-block__title">
              Что входит в курс
            </h2>
            <ul className="delivery-ways">
              {COURSE_INCLUDES.map((item) => (
                <li key={item.title} className="delivery-ways__item">
                  <span className="delivery-ways__name">{item.title}</span>
                  <span className="delivery-ways__text">{item.text}</span>
                </li>
              ))}
            </ul>
            <p className="delivery-note">
              Дополнительно по запросу даём рекомендации по ведению бизнеса и
              привлечению посетителей.
            </p>
          </section>

          <section className="delivery-block" aria-labelledby="training-benefits">
            <h2 id="training-benefits" className="delivery-block__title">
              Преимущества
            </h2>
            <ul className="delivery-ways">
              {ADVANTAGES.map((item) => (
                <li key={item.title} className="delivery-ways__item">
                  <span className="delivery-ways__name">{item.title}</span>
                  <span className="delivery-ways__text">{item.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="delivery-block" aria-labelledby="training-contact">
            <h2 id="training-contact" className="delivery-block__title">
              Контакты
            </h2>
            <ul className="contact-facts service-facts--flush">
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
            </ul>
            <p className="delivery-note">
              Уточним формат, даты и программу под ваш аппарат.
            </p>
          </section>
        </div>

        <PageFormPanel
          title="Записаться на консультацию"
          lead="Расскажем про формат обучения под ваш аппарат."
        >
          <LeadForm source="training" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
