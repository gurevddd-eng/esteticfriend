"use client";

import { useEffect } from "react";
import { LeadForm } from "@/components/LeadForm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function CallbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
        aria-label="Обратный звонок"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
          Обратный звонок
        </h2>
        <p className="mt-2 mb-5 text-sm text-muted">
          Оставьте контакты — перезвоним в рабочее время.
        </p>
        <LeadForm source="callback" compact onSuccess={onClose} />
      </div>
    </div>
  );
}
