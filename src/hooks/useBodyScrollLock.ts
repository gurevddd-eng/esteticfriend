"use client";

import { useEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;

function applyLock() {
  const { body, documentElement } = document;
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    body.dataset.scrollLocked = "true";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }
  lockCount += 1;
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  const { body, documentElement } = document;
  body.style.overflow = "";
  documentElement.style.overflow = "";
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  delete body.dataset.scrollLocked;
  window.scrollTo(0, savedScrollY);
}

/** Locks page scroll while `locked` is true. Supports nested overlays. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    applyLock();
    return () => releaseLock();
  }, [locked]);
}
