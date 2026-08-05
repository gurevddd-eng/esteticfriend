"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSlideDTO } from "@/lib/catalog";

const INTERVAL_MS = 7000;

export function HeroSlider({ slides }: { slides: HeroSlideDTO[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, index, slides.length]);

  if (!slides.length) return null;

  const goTo = (next: number) => {
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <section
      className="promo-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        setPaused(true);
        touchX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchX.current == null) {
          setPaused(false);
          return;
        }
        const delta = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(delta) >= 40) {
          goTo(index + (delta < 0 ? 1 : -1));
        }
        window.setTimeout(() => setPaused(false), 400);
      }}
    >
      <div className="promo-slider__head">
        <p className="section-kicker">Акции</p>
        <h2 className="promo-slider__heading">Спецпредложения для салонов</h2>
      </div>

      <div className="promo-slider__track" role="list">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <article
              key={slide.id}
              role="listitem"
              className={`promo-slider__card promo-slider__card--${slide.tone} ${active ? "is-active" : ""}`}
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches) goTo(i);
              }}
              onClick={() => {
                if (!active) goTo(i);
              }}
              onKeyDown={(event) => {
                if (active) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  goTo(i);
                }
              }}
              tabIndex={active ? -1 : 0}
              aria-current={active ? "true" : undefined}
              aria-label={slide.title}
            >
              <div className="promo-slider__media">
                {slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="promo-slider__image"
                  />
                ) : null}
              </div>

              <div className="promo-slider__veil" aria-hidden />

              <p className="promo-slider__index" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>

              <div className={`promo-slider__body ${active ? "is-visible" : ""}`}>
                <p className="promo-slider__eyebrow">{slide.eyebrow}</p>
                <h3 className="promo-slider__title">{slide.title}</h3>
                <p className="promo-slider__text">{slide.text}</p>
                <Link
                  href={slide.href}
                  className="promo-slider__cta"
                  tabIndex={active ? 0 : -1}
                  onClick={(event) => event.stopPropagation()}
                >
                  {slide.cta}
                </Link>
                {slide.note ? <p className="promo-slider__note">{slide.note}</p> : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="promo-slider__dots" role="tablist" aria-label="Слайды">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Слайд ${i + 1}: ${slide.title}`}
            className={`promo-slider__dot ${i === index ? "is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
