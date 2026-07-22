"use client";

import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";

export function BuyOneClick({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn-outline" onClick={() => setOpen(true)}>
        Купить в 1 клик
      </button>
      {open ? (
        <div className="modal-backdrop" onClick={() => setOpen(false)} role="presentation">
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
              Купить в 1 клик
            </h2>
            <p className="mt-2 mb-1 text-sm text-muted">Товар: {productName}</p>
            <div className="mt-4">
              <LeadForm
                source="buy-one-click"
                productId={productId}
                productName={productName}
                compact
                onSuccess={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
