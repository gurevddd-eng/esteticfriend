"use client";

import { useEffect } from "react";

let lockCount = 0;

/**
 * Lock background scroll without position:fixed (avoids jump on unlock).
 * The overlay itself should be position:fixed; body only gets overflow:hidden.
 */
function applyLock() {
  const { body, documentElement } = document;
  if (lockCount === 0) {
    body.dataset.scrollLocked = "true";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    body.style.touchAction = "none";
  }
  lockCount += 1;
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  const { body, documentElement } = document;
  body.style.overflow = "";
  documentElement.style.overflow = "";
  body.style.touchAction = "";
  delete body.dataset.scrollLocked;
}

/** Locks page scroll while `locked` is true. Supports nested overlays. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    applyLock();
    return () => releaseLock();
  }, [locked]);
}

/** @deprecated No-op — kept so ScrollToTop import does not break. */
export function isScrollRestoring() {
  return false;
}
