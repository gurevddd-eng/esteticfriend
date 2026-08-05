"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteLead, syncLeadToAmo } from "@/actions/admin";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  source: string | null;
  itemsJson: string | null;
  createdAt: string;
  amoLeadId: string | null;
  amoSyncedAt: string | null;
  amoSyncError: string | null;
  product: { name: string } | null;
};

export function LeadsAdminClient({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Заявки</p>
          <h1 className="admin-page__title">Обращения</h1>
          <p className="admin-page__lead">
            Заявки с сайта и заказы из корзины. При активном AmoCRM уходят в CRM автоматически.
          </p>
        </div>
      </header>

      <div className="admin-list">
        {leads.length === 0 ? (
          <div className="admin-panel">
            <p className="admin-empty">Заявок пока нет.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <article key={lead.id} className="admin-item">
              <div className="admin-item__head">
                <div>
                  <h2 className="font-bold text-navy">{lead.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {lead.phone}
                    {lead.source ? ` · ${lead.source}` : ""}
                    {lead.product ? ` · ${lead.product.name}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(lead.createdAt).toLocaleString("ru-RU")}
                  </p>
                  <div className="mt-2">
                    {lead.amoLeadId ? (
                      <span className="admin-status is-live">
                        AmoCRM · #{lead.amoLeadId}
                      </span>
                    ) : lead.amoSyncError ? (
                      <span className="admin-status" title={lead.amoSyncError}>
                        Ошибка CRM
                      </span>
                    ) : (
                      <span className="admin-status">Не в CRM</span>
                    )}
                  </div>
                  {lead.amoSyncError ? (
                    <p className="mt-1 text-xs text-red-700">{lead.amoSyncError}</p>
                  ) : null}
                </div>
                <div className="admin-item__actions">
                  {!lead.amoLeadId ? (
                    <button
                      type="button"
                      className="admin-action-edit"
                      disabled={busyId === lead.id}
                      onClick={async () => {
                        setBusyId(lead.id);
                        const res = await syncLeadToAmo(lead.id);
                        setBusyId(null);
                        if (!res.ok) {
                          alert(res.error || "Не удалось отправить в AmoCRM");
                        }
                        router.refresh();
                      }}
                    >
                      {busyId === lead.id ? "Отправка..." : "В AmoCRM"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="admin-action-delete"
                    onClick={async () => {
                      await deleteLead(lead.id);
                      router.refresh();
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              {lead.message ? (
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{lead.message}</p>
              ) : null}
              {lead.itemsJson ? (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-pearl p-3 text-xs text-muted">
                  {lead.itemsJson}
                </pre>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
