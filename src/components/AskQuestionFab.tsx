"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContactWidgetConfig } from "@/lib/contact-widget";
import { ContactChooserModal } from "@/components/ContactChooserModal";

const SCROLL_ROTATE = 0.24;

export function AskQuestionFab({ contactWidget }: { contactWidget: ContactWidgetConfig }) {
  const circleId = useId().replace(/:/g, "");
  const ringRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMotionReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (motionReduced) return;

    let frame = 0;

    const update = () => {
      if (document.body.dataset.scrollLocked === "true") {
        frame = 0;
        return;
      }
      ringRef.current?.style.setProperty(
        "--ask-fab-rotation",
        `${window.scrollY * SCROLL_ROTATE}deg`,
      );
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [motionReduced]);

  const content = (
    <>
      <button
        type="button"
        className="ask-fab"
        aria-label="Задать вопрос"
        onClick={() => setOpen(true)}
      >
        <span
          ref={ringRef}
          className="ask-fab__ring"
          style={motionReduced ? undefined : { "--ask-fab-rotation": "0deg" }}
          aria-hidden
        >
          <svg viewBox="0 0 100 100" className="ask-fab__ring-svg">
            <defs>
              <path
                id={circleId}
                d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              />
            </defs>
            <text className="ask-fab__ring-text">
              <textPath href={`#${circleId}`} startOffset="0%">
                задать вопрос
              </textPath>
            </text>
            <text className="ask-fab__ring-text">
              <textPath href={`#${circleId}`} startOffset="50%">
                задать вопрос
              </textPath>
            </text>
          </svg>
        </span>

        <span className="ask-fab__icon" aria-hidden>
          <svg viewBox="0 0 24 24" className="ask-fab__icon-svg">
            <path
              d="M6.5 8.5h11a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2h-6.2l-3.8 2.6V18.5a2 2 0 0 1-2-2v-5.5a2 2 0 0 1 2-2Z"
              fill="currentColor"
            />
            <circle cx="9.5" cy="13.25" r="0.85" fill="var(--ask-fab-icon-bg)" />
            <circle cx="12" cy="13.25" r="0.85" fill="var(--ask-fab-icon-bg)" />
            <circle cx="14.5" cy="13.25" r="0.85" fill="var(--ask-fab-icon-bg)" />
          </svg>
        </span>
      </button>

      <ContactChooserModal
        open={open}
        onClose={() => setOpen(false)}
        config={contactWidget}
      />
    </>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
