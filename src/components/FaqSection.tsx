"use client";

import { useState } from "react";
import type { FaqDTO } from "@/lib/catalog";

export function FaqSection({ items }: { items: FaqDTO[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <section className="faq-section">
      <div className="faq-section__layout">
        <div className="faq-section__intro">
          <p className="section-kicker">FAQ</p>
          <h2 className="section-title mt-3">Частые вопросы</h2>
          <p className="faq-section__lead">
            Коротко о выборе оборудования, работе с дистрибьютором и сервисе после покупки.
            Если не нашли ответ — напишите нам, подскажем по вашей задаче.
          </p>
          <a href="/#consult" className="btn-outline faq-section__cta">
            Задать вопрос
          </a>
        </div>

        <div className="faq-section__list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.id} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="faq-item__question">{item.question}</span>
                  <span className="faq-item__icon" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="faq-item__panel"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="faq-item__panel-inner">
                    <p className="faq-item__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
