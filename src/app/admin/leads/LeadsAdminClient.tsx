"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteLead, updateLead } from "@/actions/admin";
import {
  AdminBadge,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  confirmDelete,
} from "@/components/admin/ui";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  source: string | null;
  status: "NEW" | "IN_PROGRESS" | "DONE" | "SPAM";
  notes: string;
  itemsJson: string | null;
  createdAt: string;
  product: { id: string; name: string; slug: string } | null;
};

const STATUS_OPTIONS = [
  { value: "NEW", label: "Новые" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "DONE", label: "Закрытые" },
  { value: "SPAM", label: "Спам" },
  { value: "ALL", label: "Все" },
] as const;

const STATUS_LABEL = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  DONE: "Закрыта",
  SPAM: "Спам",
} as const;

const STATUS_TONE = {
  NEW: "accent",
  IN_PROGRESS: "warn",
  DONE: "success",
  SPAM: "neutral",
} as const;

function parseItems(raw: string | null) {
  if (!raw) return [] as Array<{ name: string; quantity: number }>;
  try {
    const data = JSON.parse(raw) as Array<{ name?: string; quantity?: number }>;
    return data
      .filter((x) => x.name)
      .map((x) => ({ name: String(x.name), quantity: Number(x.quantity || 1) }));
  } catch {
    return [];
  }
}

export function LeadsAdminClient({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") || "NEW").toUpperCase();
  const initialId = searchParams.get("id");
  const [statusFilter, setStatusFilter] = useState(
    STATUS_OPTIONS.some((s) => s.value === initialStatus) ? initialStatus : "NEW",
  );
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialId || leads.find((l) => l.status === "NEW")?.id || leads[0]?.id || null,
  );
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.source || "").toLowerCase().includes(q) ||
        (lead.product?.name || "").toLowerCase().includes(q) ||
        (lead.message || "").toLowerCase().includes(q)
      );
    });
  }, [leads, statusFilter, query]);

  const selected = filtered.find((l) => l.id === selectedId) || leads.find((l) => l.id === selectedId) || null;

  function selectLead(id: string) {
    setSelectedId(id);
    setMessage(null);
    const lead = leads.find((l) => l.id === id);
    setNotes(lead?.notes || "");
  }

  function run(action: () => Promise<unknown>, okText: string) {
    startTransition(async () => {
      await action();
      setMessage(okText);
      router.refresh();
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Заявки"
        description="Входящие обращения с сайта, корзины и форм. Меняйте статус и оставляйте заметки."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const count =
              opt.value === "ALL"
                ? leads.length
                : leads.filter((l) => l.status === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  statusFilter === opt.value
                    ? "bg-[#17141a] text-white"
                    : "bg-white text-[#4a4441] border border-black/8"
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
        <input
          className="input-field max-w-sm"
          placeholder="Поиск: имя, телефон, источник..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <AdminCard>
          {filtered.length === 0 ? (
            <AdminEmpty title="Ничего не найдено" text="Смените фильтр или поисковый запрос" />
          ) : (
            <div className="max-h-[70vh] divide-y divide-black/5 overflow-y-auto">
              {filtered.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => selectLead(lead.id)}
                  className={`flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition ${
                    selected?.id === lead.id ? "bg-[#fceef0]" : "hover:bg-[#faf8f7]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#17141a]">{lead.name}</p>
                    <p className="mt-0.5 text-sm text-[#6f6764]">
                      {lead.phone}
                      {lead.source ? ` · ${lead.source}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-[#8a817c]">
                      {new Date(lead.createdAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <AdminBadge tone={STATUS_TONE[lead.status]}>{STATUS_LABEL[lead.status]}</AdminBadge>
                </button>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard className="p-5">
          {!selected ? (
            <AdminEmpty title="Выберите заявку" />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#17141a]">
                    {selected.name}
                  </h2>
                  <a href={`tel:${selected.phone}`} className="mt-1 block text-lg font-semibold text-[#b53d4a]">
                    {selected.phone}
                  </a>
                </div>
                <AdminBadge tone={STATUS_TONE[selected.status]}>
                  {STATUS_LABEL[selected.status]}
                </AdminBadge>
              </div>

              <div className="grid gap-2 text-sm text-[#4a4441]">
                <p>
                  <span className="font-semibold">Источник:</span> {selected.source || "—"}
                </p>
                <p>
                  <span className="font-semibold">Создана:</span>{" "}
                  {new Date(selected.createdAt).toLocaleString("ru-RU")}
                </p>
                {selected.product ? (
                  <p>
                    <span className="font-semibold">Товар:</span>{" "}
                    <Link href={`/product/${selected.product.slug}`} className="text-[#b53d4a]">
                      {selected.product.name}
                    </Link>
                  </p>
                ) : null}
              </div>

              {selected.message ? (
                <div className="rounded-xl bg-[#faf8f7] p-4 text-sm leading-relaxed text-[#4a4441]">
                  {selected.message}
                </div>
              ) : null}

              {parseItems(selected.itemsJson).length > 0 ? (
                <div>
                  <p className="text-xs font-bold tracking-wide text-[#8a817c] uppercase">Корзина</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {parseItems(selected.itemsJson).map((item, i) => (
                      <li key={i} className="flex justify-between gap-3 rounded-lg bg-[#faf8f7] px-3 py-2">
                        <span>{item.name}</span>
                        <span className="font-semibold">× {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#8a817c] uppercase">
                  Заметки менеджера
                </span>
                <textarea
                  className="input-field min-h-24"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Договорились перезвонить завтра..."
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {(["NEW", "IN_PROGRESS", "DONE", "SPAM"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={pending}
                    className="btn-outline !min-h-9 !px-3 !text-xs"
                    onClick={() =>
                      run(
                        () => updateLead(selected.id, { status, notes }),
                        `Статус: ${STATUS_LABEL[status]}`,
                      )
                    }
                  >
                    {STATUS_LABEL[status]}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-black/6 pt-4">
                <button
                  type="button"
                  className="btn-primary !min-h-10 !text-sm"
                  disabled={pending}
                  onClick={() =>
                    run(() => updateLead(selected.id, { notes }), "Заметки сохранены")
                  }
                >
                  Сохранить заметки
                </button>
                <button
                  type="button"
                  className="btn-outline !min-h-10 !text-sm !text-rose-700"
                  disabled={pending}
                  onClick={() => {
                    if (!confirmDelete("Удалить заявку безвозвратно?")) return;
                    run(async () => {
                      await deleteLead(selected.id);
                      setSelectedId(null);
                    }, "Заявка удалена");
                  }}
                >
                  Удалить
                </button>
              </div>
              {message ? <p className="text-sm text-[#b53d4a]">{message}</p> : null}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
