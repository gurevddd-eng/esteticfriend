"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { ProductDTO } from "@/lib/content";

function useVisibleCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) setCount(1);
      else if (width < 900) setCount(2);
      else if (width < 1100) setCount(3);
      else setCount(4);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function HitsSlider({ products }: { products: ProductDTO[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const visible = useVisibleCount();
  const maxIndex = Math.max(0, products.length - visible);
  const gap = 16;
  const pageCount = maxIndex + 1;
  const page = index;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setPageWidth(track.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(maxIndex, next)));
  };

  const itemWidth =
    pageWidth > 0 ? (pageWidth - gap * (visible - 1)) / visible : 0;
  const offset = index * (itemWidth + gap);

  return (
    <div className="hits-slider">
      <div className="hits-slider__head">
        <div>
          <p className="section-kicker">Популярное</p>
          <h2 className="section-title mt-3">Хиты продаж</h2>
        </div>

        <div className="hits-slider__arrows">
          <button
            type="button"
            className="hits-slider__arrow"
            aria-label="Назад"
            disabled={index <= 0}
            onClick={() => go(index - 1)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="hits-slider__arrow"
            aria-label="Вперёд"
            disabled={index >= maxIndex}
            onClick={() => go(index + 1)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="hits-slider__viewport"
        ref={trackRef}
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return;
          const delta = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(delta) < 40) return;
          go(index + (delta < 0 ? 1 : -1));
        }}
      >
        <div
          className="hits-slider__track"
          style={{
            gap: `${gap}px`,
            transform: itemWidth ? `translate3d(-${offset}px, 0, 0)` : undefined,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="hits-slider__item"
              style={
                itemWidth
                  ? { flex: `0 0 ${itemWidth}px`, width: itemWidth }
                  : undefined
              }
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 ? (
        <div className="hits-slider__pager" aria-label="Страницы хитов">
          <p className="hits-slider__pager-label" aria-live="polite">
            <span className="hits-slider__pager-current">
              {String(page + 1).padStart(2, "0")}
            </span>
            <span className="hits-slider__pager-sep" aria-hidden>
              /
            </span>
            <span className="hits-slider__pager-total">
              {String(pageCount).padStart(2, "0")}
            </span>
          </p>

          <div className="hits-slider__pager-track" role="tablist">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Позиция ${i + 1} из ${pageCount}`}
                className={`hits-slider__pager-step ${i === page ? "is-active" : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
