"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let clearing = false;

    const clearHash = () => {
      if (!window.location.hash || clearing) return;
      clearing = true;
      // App Router keeps URL in its own state — plain replaceState is not enough.
      router.replace(pathname, { scroll: false });
      window.history.replaceState(null, "", pathname);
      requestAnimationFrame(() => {
        clearing = false;
      });
    };

    const onScroll = () => {
      if (document.body.dataset.scrollLocked === "true") return;

      const y = window.scrollY;
      const goingUp = y < lastY - 1;
      lastY = y;
      setVisible(y > 420);

      const hash = window.location.hash;
      if (!hash || !goingUp) return;

      if (y < 240) {
        clearHash();
        return;
      }

      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (!el) {
        clearHash();
        return;
      }

      // Left the anchored block while scrolling up (section slid down the viewport).
      if (el.getBoundingClientRect().top > window.innerHeight * 0.45) {
        clearHash();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, router]);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      className={`scroll-top${visible ? " is-visible" : ""}`}
      aria-label="Наверх"
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        if (window.location.hash) {
          router.replace(pathname, { scroll: false });
          window.history.replaceState(null, "", pathname);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="m6.5 10.5 5.5-5.5 5.5 5.5" />
      </svg>
    </button>,
    document.body,
  );
}
