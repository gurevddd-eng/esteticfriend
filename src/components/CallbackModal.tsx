"use client";

import { useEffect } from "react";
import { LeadForm } from "@/components/LeadForm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function CallbackModal({
  open,
  onClose,
  title = "Обратный звонок",
  description = "Оставьте контакты — перезвоним в рабочее время.",
  source = "callback",
  compact = true,
  ariaLabel = title,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  source?: string;
  compact?: boolean;
  ariaLabel?: string;
}) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <h2 className="page-form__title">{title}</h2>
        <p className="page-form__lead">{description}</p>
        <LeadForm source={source} compact={compact} onSuccess={onClose} />
      </div>
    </div>
  );
}
