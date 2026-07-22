"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteLead, updateLead } from "@/actions/admin";
import { AdminBadge, AdminEmpty, AdminPageHeader, confirmDelete } from "@/components/admin/ui";

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

const COLUMNS = [
  { value: "NEW", label: "Новые", tone: "accent" as const },
  { value: "IN_PROGRESS", label: "В работе", tone: "warn" as const },
  { value: "DONE", label: "Закрытые", tone: "success" as const },
  { value: "SPAM", label: "Спам", tone: "neutral" as const },
] as const;

const STATUS_LABEL = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  DONE: "Закрыта",
  SPAM: "Спам",
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
  const initialId = searchParams.get("id");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.source || "").toLowerCase().includes(q) ||
        (lead.product?.name || "").toLowerCase().includes(q) ||
        (lead.message || "").toLowerCase().includes(q),
    );
  }, [leads, query]);

  const selected = leads.find((l) => l.id === selectedId) || null;

  useEffect(() => {
    if (selected) setNotes(selected.notes || "");
  }, [selected]);

  function selectLead(id: string) {
    setSelectedId(id);
    setMessage(null);
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
        description="Канбан входящих обращений. Перетаскивайте статусы кнопками в карточке."
        actions={
          <input
            className="ea-input"
            style={{ minWidth: "220px" }}
            placeholder="Поиск: имя, телефон..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        }
      />

      <div className="ea-kanban">
        {COLUMNS.map((col) => {
          const items = filtered.filter((l) => l.status === col.value);
          return (
            <section key={col.value} className="ea-kanban__col">
              <div className="ea-kanban__head">
                <span>{col.label}</span>
                <AdminBadge tone={col.tone}>{items.length}</AdminBadge>
              </div>
              <div className="ea-kanban__list">
                {items.length === 0 ? (
                  <div className="ea-empty" style={{ padding: "1.5rem 0.5rem" }}>
                    Пусто
                  </div>
                ) : (
                  items.map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      className={`ea-kanban__card${selectedId === lead.id ? " is-selected" : ""}`}
                      onClick={() => selectLead(lead.id)}
                    >
                      <p style={{ margin: 0, fontWeight: 800 }}>{lead.name}</p>
                      <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--ea-muted)" }}>
                        {lead.phone}
                      </p>
                      <p style={{ margin: "0.45rem 0 0", fontSize: "0.75rem", color: "var(--ea-faint)" }}>
                        {new Date(lead.createdAt).toLocaleString("ru-RU")}
                        {lead.source ? ` · ${lead.source}` : ""}
                      </p>
                      {lead.product ? (
                        <p style={{ margin: "0.4rem 0 0", fontSize: "0.78rem", fontWeight: 700 }}>
                          {lead.product.name}
                        </p>
                      ) : null}
                    </button>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className={`ea-drawer${selected ? " is-open" : ""}`} aria-hidden={!selected}>
        <button
          type="button"
          className="ea-drawer__backdrop"
          aria-label="Закрыть"
          onClick={() => setSelectedId(null)}
        />
        <aside className="ea-drawer__panel">
          {!selected ? (
            <AdminEmpty title="Выберите заявку" />
          ) : (
            <div style={{ padding: "1.25rem", display: "grid", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                <div>
                  <p className="ea-kicker" style={{ margin: 0, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ea-faint)" }}>
                    Карточка заявки
                  </p>
                  <h2 className="ea-h1" style={{ fontSize: "1.35rem", margin: "0.35rem 0 0" }}>
                    {selected.name}
                  </h2>
                  <a href={`tel:${selected.phone}`} style={{ color: "var(--ea-accent)", fontWeight: 800, fontSize: "1.05rem" }}>
                    {selected.phone}
                  </a>
                </div>
                <button type="button" className="ea-btn ea-btn--ghost ea-btn--sm" onClick={() => setSelectedId(null)}>
                  Закрыть
                </button>
              </div>

              <AdminBadge tone={COLUMNS.find((c) => c.value === selected.status)?.tone || "neutral"}>
                {STATUS_LABEL[selected.status]}
              </AdminBadge>

              <div style={{ fontSize: "0.9rem", color: "var(--ea-muted)", display: "grid", gap: "0.35rem" }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "var(--ea-text)" }}>Источник:</strong> {selected.source || "—"}
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "var(--ea-text)" }}>Создана:</strong>{" "}
                  {new Date(selected.createdAt).toLocaleString("ru-RU")}
                </p>
                {selected.product ? (
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "var(--ea-text)" }}>Товар:</strong>{" "}
                    <Link href={`/product/${selected.product.slug}`}>{selected.product.name}</Link>
                  </p>
                ) : null}
              </div>

              {selected.message ? (
                <div className="ea-panel" style={{ padding: "0.9rem", background: "var(--ea-panel-2)" }}>
                  {selected.message}
                </div>
              ) : null}

              {parseItems(selected.itemsJson).length > 0 ? (
                <div>
                  <p className="ea-label">Корзина</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0.4rem 0 0", display: "grid", gap: "0.35rem" }}>
                    {parseItems(selected.itemsJson).map((item, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          background: "var(--ea-panel-2)",
                          borderRadius: "0.65rem",
                          padding: "0.55rem 0.75rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        <span>{item.name}</span>
                        <strong>× {item.quantity}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <label>
                <span className="ea-label">Заметки менеджера</span>
                <textarea
                  className="ea-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Договорились перезвонить завтра..."
                />
              </label>

              <div className="ea-seg" style={{ flexWrap: "wrap" }}>
                {COLUMNS.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    disabled={pending}
                    className={selected.status === status.value ? "is-on" : undefined}
                    onClick={() =>
                      run(
                        () => updateLead(selected.id, { status: status.value, notes }),
                        `Статус: ${STATUS_LABEL[status.value]}`,
                      )
                    }
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="ea-btn ea-btn--primary"
                  disabled={pending}
                  onClick={() => run(() => updateLead(selected.id, { notes }), "Заметки сохранены")}
                >
                  Сохранить заметки
                </button>
                <button
                  type="button"
                  className="ea-btn ea-btn--danger"
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
              {message ? <p style={{ margin: 0, color: "var(--ea-accent)", fontWeight: 700 }}>{message}</p> : null}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
