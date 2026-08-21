"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CertificateDTO } from "@/lib/catalog";

export function CertificatesGallery({ items }: { items: CertificateDTO[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (active === null) return;

    const root = dialogRef.current;
    const focusables = root?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % items.length));
      }
      if (e.key === "ArrowLeft") {
        setActive((i) =>
          i === null ? i : (i - 1 + items.length) % items.length,
        );
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, items.length]);

  if (!items.length) return null;

  const current = active !== null ? items[active] : null;

  return (
    <>
      <ul className="cert-gallery">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className="cert-gallery__card"
              onClick={() => setActive(index)}
              aria-label={`Открыть: ${item.title}`}
            >
              <span className="cert-gallery__media">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 280px"
                  className="object-cover"
                />
              </span>
              <span className="cert-gallery__caption">
                <span className="cert-gallery__title">{item.title}</span>
                {item.description ? (
                  <span className="cert-gallery__desc">{item.description}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current ? (
        <div
          ref={dialogRef}
          className="cert-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={() => setActive(null)}
          onTouchStart={(e) => {
            touchX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null || items.length < 2) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 48) return;
            setActive((i) => {
              if (i === null) return i;
              return dx < 0
                ? (i + 1) % items.length
                : (i - 1 + items.length) % items.length;
            });
          }}
        >
          <button
            type="button"
            className="cert-lightbox__close"
            aria-label="Закрыть"
            onClick={() => setActive(null)}
          >
            ×
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="cert-lightbox__nav cert-lightbox__nav--prev"
                aria-label="Предыдущий"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) =>
                    i === null ? i : (i - 1 + items.length) % items.length,
                  );
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="cert-lightbox__nav cert-lightbox__nav--next"
                aria-label="Следующий"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i === null ? i : (i + 1) % items.length));
                }}
              >
                ›
              </button>
            </>
          ) : null}
          <figure
            className="cert-lightbox__figure"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-lightbox__image">
              <Image
                src={current.imageUrl}
                alt={current.title}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="cert-lightbox__caption">
              <strong>{current.title}</strong>
              {current.description ? <span>{current.description}</span> : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
