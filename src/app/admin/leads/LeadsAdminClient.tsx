"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

type CrmFilter = "all" | "synced" | "pending" | "error";
type CartItem = { productId?: string; name: string; quantity: number };

const SOURCE_LABELS: Record<string, string> = {
  site: "Сайт",
  cart: "Корзина",
  callback: "Обратный звонок",
  "buy-one-click": "Купить в 1 клик",
  "home-consult": "Консультация",
  contacts: "Контакты",
  certificates: "Сертификаты",
  training: "Обучение",
  warranty: "Гарантия",
  delivery: "Доставка",
};

function sourceLabel(source: string | null) {
  if (!source) return "Сайт";
  return SOURCE_LABELS[source] ?? source;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.length === 10) {
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  }
  return phone;
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);

  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} мин назад`;
  if (diffHr < 24) return `${diffHr} ч назад`;
  if (diffHr < 48) return "вчера";

  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function parseCartItems(itemsJson: string | null): CartItem[] | null {
  if (!itemsJson) return null;
  try {
    const parsed = JSON.parse(itemsJson) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).name === "string" &&
        typeof (item as CartItem).quantity === "number",
    );
  } catch {
    return null;
  }
}

function crmStatus(lead: LeadRow): CrmFilter {
  if (lead.amoLeadId) return "synced";
  if (lead.amoSyncError) return "error";
  return "pending";
}

export function LeadsAdminClient({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [crmFilter, setCrmFilter] = useState<CrmFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sources = useMemo(() => {
    const set = new Set<string>();
    for (const lead of leads) {
      if (lead.source) set.add(lead.source);
    }
    return Array.from(set).sort();
  }, [leads]);

  const stats = useMemo(() => {
    const today = leads.filter((l) => isToday(l.createdAt)).length;
    const synced = leads.filter((l) => l.amoLeadId).length;
    const attention = leads.filter((l) => l.amoSyncError || !l.amoLeadId).length;
    return { total: leads.length, today, synced, attention };
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
      if (crmFilter !== "all" && crmStatus(lead) !== crmFilter) return false;
      if (!q) return true;
      const cart = parseCartItems(lead.itemsJson);
      const cartText = cart?.map((i) => i.name).join(" ") ?? "";
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
        (lead.message?.toLowerCase().includes(q) ?? false) ||
        (lead.product?.name.toLowerCase().includes(q) ?? false) ||
        cartText.toLowerCase().includes(q)
      );
    });
  }, [leads, query, sourceFilter, crmFilter]);

  async function copyPhone(lead: LeadRow) {
    try {
      await navigator.clipboard.writeText(lead.phone);
      setCopiedId(lead.id);
      window.setTimeout(() => setCopiedId((id) => (id === lead.id ? null : id)), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Входящие</p>
          <h1 className="admin-page__title">Заявки</h1>
          <p className="admin-page__lead">
            Обращения с сайта и заказы из корзины. При активном AmoCRM уходят в CRM автоматически.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/integrations" className="btn-outline">
            AmoCRM
          </Link>
        </div>
      </header>

      <div className="admin-kpi-row">
        <div className="admin-kpi">
          <span className="admin-kpi__label">Всего</span>
          <span className="admin-kpi__value">{stats.total}</span>
          <span className="admin-kpi__hint">в выборке до 100 последних</span>
        </div>
        <div className="admin-kpi admin-kpi--hot">
          <span className="admin-kpi__label">Сегодня</span>
          <span className="admin-kpi__value">{stats.today}</span>
          <span className="admin-kpi__hint is-hot">новые за сутки</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">В AmoCRM</span>
          <span className="admin-kpi__value">{stats.synced}</span>
          <span className="admin-kpi__hint">успешно синхронизированы</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">Ожидают</span>
          <span className="admin-kpi__value">{stats.attention}</span>
          <span className="admin-kpi__hint">не в CRM или с ошибкой</span>
        </div>
      </div>

      <div className="admin-toolbar admin-toolbar--leads">
        <label className="admin-field admin-toolbar__search">
          <span>Поиск</span>
          <input
            className="input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Имя, телефон, товар или текст"
          />
        </label>
        <label className="admin-field">
          <span>Источник</span>
          <select
            className="input-field"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="all">Все источники</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {sourceLabel(source)}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>CRM</span>
          <select
            className="input-field"
            value={crmFilter}
            onChange={(e) => setCrmFilter(e.target.value as CrmFilter)}
          >
            <option value="all">Все статусы</option>
            <option value="synced">В AmoCRM</option>
            <option value="pending">Не отправлены</option>
            <option value="error">С ошибкой</option>
          </select>
        </label>
      </div>

      {leads.length === 0 ? (
        <div className="admin-panel admin-leads-empty">
          <p className="admin-leads-empty__title">Заявок пока нет</p>
          <p className="admin-leads-empty__text">
            Когда посетители оставят заявку на сайте или оформят заказ из корзины, они появятся здесь.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty">Ничего не найдено по текущим фильтрам.</p>
        </div>
      ) : (
        <div className="admin-table-wrap admin-leads-table">
          <table>
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Источник</th>
                <th>Содержание</th>
                <th>CRM</th>
                <th>Когда</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const cartItems = parseCartItems(lead.itemsJson);
                const expanded = expandedId === lead.id;
                const status = crmStatus(lead);

                return (
                  <Fragment key={lead.id}>
                    <tr
                      className={expanded ? "is-expanded" : undefined}
                      onClick={() => setExpandedId(expanded ? null : lead.id)}
                    >
                      <td>
                        <div className="admin-lead-client">
                          <p className="admin-lead-client__name">{lead.name}</p>
                          <div className="admin-lead-phone">
                            <a
                              href={`tel:${lead.phone.replace(/\s/g, "")}`}
                              className="admin-lead-phone__link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {formatPhone(lead.phone)}
                            </a>
                            <button
                              type="button"
                              className="admin-lead-phone__copy"
                              title="Скопировать номер"
                              onClick={(e) => {
                                e.stopPropagation();
                                void copyPhone(lead);
                              }}
                            >
                              {copiedId === lead.id ? "✓" : "⧉"}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-lead-source${
                            lead.source === "cart" ? " is-cart" : ""
                          }`}
                        >
                          {sourceLabel(lead.source)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-lead-preview">
                          {lead.product ? (
                            <p className="admin-lead-preview__product">{lead.product.name}</p>
                          ) : null}
                          {cartItems ? (
                            <p className="admin-lead-preview__cart">
                              {cartItems.length} поз.
                              {cartItems[0] ? ` · ${cartItems[0].name}` : ""}
                              {cartItems.length > 1 ? "…" : ""}
                            </p>
                          ) : null}
                          {lead.message ? (
                            <p className="admin-lead-preview__message">
                              {lead.message.length > 72
                                ? `${lead.message.slice(0, 72)}…`
                                : lead.message}
                            </p>
                          ) : !lead.product && !cartItems ? (
                            <span className="admin-lead-preview__empty">Без комментария</span>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        {status === "synced" ? (
                          <span className="admin-status is-live">
                            #{lead.amoLeadId}
                          </span>
                        ) : status === "error" ? (
                          <span className="admin-status is-error" title={lead.amoSyncError ?? ""}>
                            Ошибка
                          </span>
                        ) : (
                          <span className="admin-status">Ожидает</span>
                        )}
                      </td>
                      <td>
                        <time
                          className="admin-lead-time"
                          dateTime={lead.createdAt}
                          title={new Date(lead.createdAt).toLocaleString("ru-RU")}
                        >
                          {formatWhen(lead.createdAt)}
                        </time>
                      </td>
                      <td>
                        <div
                          className="admin-item__actions justify-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="admin-action-edit"
                            onClick={() => setExpandedId(expanded ? null : lead.id)}
                          >
                            {expanded ? "Свернуть" : "Подробнее"}
                          </button>
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
                              {busyId === lead.id ? "…" : "В CRM"}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="admin-action-delete"
                            onClick={async () => {
                              if (!confirm(`Удалить заявку от «${lead.name}»?`)) return;
                              await deleteLead(lead.id);
                              if (expandedId === lead.id) setExpandedId(null);
                              router.refresh();
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="admin-lead-detail-row">
                        <td colSpan={6}>
                          <div className="admin-lead-detail">
                            <div className="admin-lead-detail__grid">
                              <div>
                                <p className="admin-lead-detail__label">Дата</p>
                                <p className="admin-lead-detail__value">
                                  {new Date(lead.createdAt).toLocaleString("ru-RU")}
                                </p>
                              </div>
                              <div>
                                <p className="admin-lead-detail__label">Источник</p>
                                <p className="admin-lead-detail__value">
                                  {sourceLabel(lead.source)}
                                </p>
                              </div>
                              {lead.amoSyncedAt ? (
                                <div>
                                  <p className="admin-lead-detail__label">Синхронизация</p>
                                  <p className="admin-lead-detail__value">
                                    {new Date(lead.amoSyncedAt).toLocaleString("ru-RU")}
                                  </p>
                                </div>
                              ) : null}
                            </div>

                            {lead.message ? (
                              <div className="admin-lead-detail__block">
                                <p className="admin-lead-detail__label">Сообщение</p>
                                <p className="admin-lead-detail__message">{lead.message}</p>
                              </div>
                            ) : null}

                            {cartItems && cartItems.length > 0 ? (
                              <div className="admin-lead-detail__block">
                                <p className="admin-lead-detail__label">Состав заказа</p>
                                <ul className="admin-lead-cart">
                                  {cartItems.map((item, index) => (
                                    <li key={`${item.name}-${index}`}>
                                      <span>{item.name}</span>
                                      <span className="admin-lead-cart__qty">× {item.quantity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}

                            {lead.amoSyncError ? (
                              <div className="admin-lead-detail__error">
                                <p className="admin-lead-detail__label">Ошибка AmoCRM</p>
                                <p>{lead.amoSyncError}</p>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
