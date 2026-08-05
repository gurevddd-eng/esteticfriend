"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="admin-modal" role="presentation">
      <button
        type="button"
        className="admin-modal__backdrop"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        className={`admin-modal__dialog${wide ? " admin-modal__dialog--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <header className="admin-modal__head">
          <div>
            <h2 id="admin-modal-title" className="admin-modal__title">
              {title}
            </h2>
            {description ? (
              <p className="admin-modal__desc">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="admin-modal__close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <IconClose size={18} />
          </button>
        </header>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
