"use client";

import { useRouter } from "next/navigation";
import { deleteLead } from "@/actions/admin";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  source: string | null;
  itemsJson: string | null;
  createdAt: string;
  product: { name: string } | null;
};

export function LeadsAdminClient({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Заявки
      </h1>
      <p className="mt-2 text-muted">Обращения с сайта и заказы из корзины</p>

      <div className="mt-8 space-y-4">
        {leads.length === 0 ? (
          <div className="rounded-[1.2rem] border border-[var(--line)] bg-white p-6 text-muted">
            Заявок пока нет.
          </div>
        ) : (
          leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-[1.2rem] border border-[var(--line)] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
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
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-azure"
                  onClick={async () => {
                    await deleteLead(lead.id);
                    router.refresh();
                  }}
                >
                  Удалить
                </button>
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
