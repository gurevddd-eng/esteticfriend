import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";
import { getSiteInfo } from "@/lib/catalog";
import { DELIVERY_GEO } from "@/lib/content";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Доставка косметологического оборудования по России, Беларуси и Казахстану. Самовывоз в Москве и Санкт-Петербурге. Оплата наличными, по счёту, картой, в кредит и рассрочку.",
};

const DELIVERY_WAYS = [
  {
    title: "Курьер",
    text: "Яндекс Go — когда нужна быстрая доставка по городу.",
  },
  {
    title: "Транспортные компании",
    text: "СДЭК, Желдорэкспедиция, DPD и Почта России — по всей географии поставки.",
  },
  {
    title: "Самовывоз",
    text: "Из офисов в Москве и Санкт-Петербурге — по предварительной записи.",
  },
];

const OFFICES = [
  {
    city: "Москва",
    address: "Измайловское шоссе, 71, корп. 4г-д, офис в отеле «Дельта»",
  },
  {
    city: "Москва",
    address: "ул. Бауманская, 43/1с1",
  },
  {
    city: "Санкт-Петербург",
    address: "пр-т Чернышевского, 20",
  },
];

const PAYMENT_WAYS = [
  "Наличными",
  "По счёту",
  "Банковской картой",
  "Переводом",
  "Кредит или рассрочка — условия рассчитываются индивидуально",
];

export default async function DeliveryPage() {
  const site = await getSiteInfo();

  const acceptanceSteps = [
    {
      title: "Осмотр при курьере",
      text: "Аппарат застрахован. Вскройте упаковку при курьере и проверьте внешние повреждения. При повреждениях заполните акт и откажитесь от приёмки.",
    },
    {
      title: "Проверка включения",
      text: "Если на улице выше +10 °C — включите аппарат без манипул и дождитесь загрузки системы. Если аппарат остыл ниже +10 °C — не включайте.",
    },
    {
      title: "Прогрев перед работой",
      text: "Не работайте на аппарате, пока он не нагреется до комнатной температуры — минимум 12 часов (кроме короткого включения при приёмке).",
    },
    {
      title: "Документы",
      text: `Подпишите акт ПП с датой приёмки и отправьте копию менеджеру или на ${site.email}. В гарантийном талоне укажите дату получения.`,
    },
    {
      title: "После приёмки",
      text: "Обмен и возврат возможны только в случаях, указанных в договоре.",
    },
  ];

  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">Сервис</p>
          <h1 className="section-title mt-3">Доставка и оплата</h1>
          <p className="page__lead">
            Доставляем оборудование по географии: {DELIVERY_GEO}. Срок — от 1 до
            40 дней, стоимость зависит от веса аппарата и тарифов перевозчика.
          </p>

          <ul className="contact-facts delivery-facts">
            <li>
              <span className="contact-facts__label">География</span>
              <span className="contact-facts__value">{DELIVERY_GEO}</span>
            </li>
            <li>
              <span className="contact-facts__label">Срок</span>
              <span className="contact-facts__value">1–40 дней</span>
            </li>
            <li>
              <span className="contact-facts__label">Стоимость</span>
              <span className="contact-facts__value">
                По тарифу ТК и весу аппарата
              </span>
            </li>
          </ul>

          <section className="delivery-block" aria-labelledby="delivery-ways">
            <h2 id="delivery-ways" className="delivery-block__title">
              Как получить аппарат
            </h2>
            <ul className="delivery-ways">
              {DELIVERY_WAYS.map((way) => (
                <li key={way.title} className="delivery-ways__item">
                  <span className="delivery-ways__name">{way.title}</span>
                  <span className="delivery-ways__text">{way.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="delivery-block" aria-labelledby="delivery-offices">
            <h2 id="delivery-offices" className="delivery-block__title">
              Адреса самовывоза
            </h2>
            <ul className="delivery-offices">
              {OFFICES.map((office) => (
                <li
                  key={`${office.city}-${office.address}`}
                  className="delivery-offices__item"
                >
                  <span className="delivery-offices__city">{office.city}</span>
                  <span className="delivery-offices__address">
                    {office.address}
                  </span>
                </li>
              ))}
            </ul>
            <p className="delivery-note">
              Посещение офиса — по предварительной договорённости с менеджером.
            </p>
          </section>

          <section
            className="delivery-block"
            aria-labelledby="delivery-acceptance"
          >
            <h2 id="delivery-acceptance" className="delivery-block__title">
              Памятка по приёмке
            </h2>
            <ol className="delivery-steps">
              {acceptanceSteps.map((step, index) => (
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

          <section className="delivery-block" aria-labelledby="delivery-pay">
            <h2 id="delivery-pay" className="delivery-block__title">
              Способы оплаты
            </h2>
            <ul className="delivery-pay">
              {PAYMENT_WAYS.map((way) => (
                <li key={way}>{way}</li>
              ))}
            </ul>
          </section>
        </div>

        <PageFormPanel
          title="Рассчитать доставку"
          lead="Оставьте контакты — посчитаем сроки и стоимость под ваш адрес."
        >
          <LeadForm source="delivery" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
