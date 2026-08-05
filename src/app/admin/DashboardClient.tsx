"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  deltaLabel,
  type DashboardStats,
  type DayPoint,
  type NamedCount,
} from "@/lib/admin-dashboard";

const NAVY = "#354459";
const LIME = "#e0ef88";
const INK = "#000000";
const MUTED = "#4a4a4a";
const LINE = "rgba(53, 68, 89, 0.22)";
const SOFT = "#f4f4f2";

function AreaChart({ points }: { points: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 560;
  const h = 200;
  const padX = 12;
  const padY = 18;

  const max = Math.max(1, ...points.map((p) => p.count));
  const coords = points.map((p, i) => {
    const x = padX + (i / Math.max(1, points.length - 1)) * (w - padX * 2);
    const y = h - padY - (p.count / max) * (h - padY * 2);
    return { x, y, ...p };
  });

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const area = `${line} L${coords[coords.length - 1]?.x ?? padX},${h - padY} L${padX},${h - padY} Z`;

  const total = points.reduce((s, p) => s + p.count, 0);
  const active = hover !== null ? coords[hover] : null;

  return (
    <div className="admin-chart">
      <div className="admin-chart__meta">
        <div>
          <p className="admin-chart__eyebrow">Динамика</p>
          <h3 className="admin-chart__title">Заявки за 14 дней</h3>
        </div>
        <div className="admin-chart__stat">
          <span className="admin-chart__stat-value">{active ? active.count : total}</span>
          <span className="admin-chart__stat-label">
            {active ? active.label : "всего за период"}
          </span>
        </div>
      </div>
      <svg
        className="admin-chart__svg"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="График заявок за 14 дней"
        onMouseLeave={() => setHover(null)}
      >
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const y = h - padY - t * (h - padY * 2);
          return (
            <line
              key={t}
              x1={padX}
              x2={w - padX}
              y1={y}
              y2={y}
              stroke={LINE}
              strokeDasharray="4 6"
            />
          );
        })}
        <path d={area} fill="url(#leadFill)" opacity={0.9} />
        <path d={line} fill="none" stroke={NAVY} strokeWidth={2.5} strokeLinejoin="round" />
        {coords.map((c, i) => (
          <g key={c.date}>
            <circle
              cx={c.x}
              cy={c.y}
              r={hover === i ? 5.5 : 3.5}
              fill={hover === i ? INK : NAVY}
              stroke={LIME}
              strokeWidth={2}
              onMouseEnter={() => setHover(i)}
              style={{ cursor: "pointer" }}
            />
            <rect
              x={c.x - (w / points.length) / 2}
              y={0}
              width={w / points.length}
              height={h}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}
        <defs>
          <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NAVY} stopOpacity="0.35" />
            <stop offset="100%" stopColor={NAVY} stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>
      <div className="admin-chart__axis">
        <span>{points[0]?.label}</span>
        <span>{points[Math.floor(points.length / 2)]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

function BarChart({
  items,
  title,
  eyebrow,
  empty,
}: {
  items: NamedCount[];
  title: string;
  eyebrow: string;
  empty: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="admin-chart">
      <div className="admin-chart__meta">
        <div>
          <p className="admin-chart__eyebrow">{eyebrow}</p>
          <h3 className="admin-chart__title">{title}</h3>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="admin-empty">{empty}</p>
      ) : (
        <ul className="admin-bars">
          {items.map((item) => (
            <li key={item.name} className="admin-bars__row">
              <div className="admin-bars__label">
                <span title={item.name}>{item.name}</span>
                <strong>{item.count}</strong>
              </div>
              <div className="admin-bars__track">
                <div
                  className="admin-bars__fill"
                  style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DonutChart({
  items,
  title,
  eyebrow,
}: {
  items: NamedCount[];
  title: string;
  eyebrow: string;
}) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  const colors = [NAVY, INK, LIME, SOFT];
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  const slices = items.map((item, i) => {
    const len = (item.count / total) * c;
    const slice = { ...item, color: colors[i % colors.length], dash: len, offset };
    offset += len;
    return slice;
  });

  return (
    <div className="admin-chart">
      <div className="admin-chart__meta">
        <div>
          <p className="admin-chart__eyebrow">{eyebrow}</p>
          <h3 className="admin-chart__title">{title}</h3>
        </div>
      </div>
      <div className="admin-donut">
        <svg viewBox="0 0 140 140" className="admin-donut__svg" aria-hidden>
          <circle cx="70" cy="70" r={r} fill="none" stroke={LINE} strokeWidth="16" />
          {slices.map((s) => (
            <circle
              key={s.name}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${s.dash} ${c - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
          ))}
          <text
            x="70"
            y="66"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill={INK}
            fontFamily="var(--font-syne), sans-serif"
          >
            {items.reduce((s, i) => s + i.count, 0)}
          </text>
          <text x="70" y="84" textAnchor="middle" fontSize="10" fill={MUTED}>
            единиц
          </text>
        </svg>
        <ul className="admin-donut__legend">
          {slices.map((s) => (
            <li key={s.name}>
              <span className="admin-donut__swatch" style={{ background: s.color }} />
              <span>{s.name}</span>
              <strong>{s.count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SparkBars({ points }: { points: DayPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  return (
    <div className="admin-spark" aria-hidden>
      {points.slice(-7).map((p) => (
        <span
          key={p.date}
          className="admin-spark__bar"
          style={{ height: `${Math.max(12, (p.count / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardClient({ stats }: { stats: DashboardStats }) {
  const weekDelta = useMemo(
    () => deltaLabel(stats.kpis.leadsWeek, stats.kpis.leadsPrevWeek),
    [stats.kpis.leadsWeek, stats.kpis.leadsPrevWeek],
  );

  const kpis = [
    {
      label: "Заявки",
      value: stats.kpis.leads,
      href: "/admin/leads",
      hot: true,
      hint: `${stats.kpis.leadsWeek} за 7 дней · ${weekDelta.text}`,
      spark: true,
    },
    {
      label: "Товары",
      value: stats.kpis.products,
      href: "/admin/products",
      hint: `${stats.kpis.productsActive} активных · ${stats.kpis.inStock} в наличии`,
    },
    {
      label: "Категории",
      value: stats.kpis.categories,
      href: "/admin/categories",
      hint: `${stats.kpis.hits} хитов · ${stats.kpis.news} новинок`,
    },
    {
      label: "Страницы",
      value: stats.kpis.pages,
      href: "/admin/pages",
      hint: "Контент сайта",
    },
  ];

  const shortcuts = [
    { href: "/admin/leads", title: "Разбор заявок", text: `${stats.kpis.leads} всего` },
    { href: "/admin/products/new", title: "Новый товар", text: "Добавить аппарат" },
    { href: "/admin/home", title: "Герой", text: "Первый экран" },
    { href: "/admin/settings", title: "Контакты", text: "Телефон и email" },
  ];

  return (
    <div className="admin-page">
      <section className="admin-welcome">
        <div>
          <p className="admin-welcome__kicker">SEVENS CMS · Аналитика</p>
          <h1 className="admin-welcome__title">Рабочий стол</h1>
          <p className="admin-welcome__text">
            Заявки, каталог и контент главной — сводка за последние две недели.
          </p>
        </div>
        <div className="admin-welcome__actions">
          <Link href="/admin/leads" className="btn-primary">
            Заявки · {stats.kpis.leads}
          </Link>
          <Link href="/admin/products" className="btn-outline">
            Каталог
          </Link>
        </div>
      </section>

      <section className="admin-kpi-row">
        {kpis.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-kpi${item.hot ? " admin-kpi--hot" : ""}`}
          >
            <div className="admin-kpi__top">
              <span className="admin-kpi__label">{item.label}</span>
              {item.spark ? <SparkBars points={stats.leadsByDay} /> : null}
            </div>
            <span className="admin-kpi__value">{item.value}</span>
            <span className={`admin-kpi__hint${item.hot ? " is-hot" : ""}`}>
              {item.hint}
            </span>
          </Link>
        ))}
      </section>

      <div className="admin-dash-grid">
        <section className="admin-panel admin-panel--chart">
          <AreaChart points={stats.leadsByDay} />
        </section>

        <section className="admin-panel admin-panel--chart">
          <DonutChart
            eyebrow="Каталог"
            title="Состав ассортимента"
            items={stats.catalogMix.slice(0, 2)}
          />
        </section>

        <section className="admin-panel admin-panel--chart">
          <BarChart
            eyebrow="Каталог"
            title="Товары по категориям"
            items={stats.productsByCategory}
            empty="Нет товаров в категориях."
          />
        </section>

        <section className="admin-panel admin-panel--chart">
          <BarChart
            eyebrow="Лиды"
            title="Источники заявок"
            items={stats.leadsBySource}
            empty="За 14 дней источников нет."
          />
        </section>

        <section className="admin-panel admin-panel--chart">
          <BarChart
            eyebrow="Лиды"
            title="Топ товаров по заявкам"
            items={stats.topProducts}
            empty="Пока нет заявок с товаром."
          />
        </section>

        <section className="admin-panel admin-panel--chart">
          <BarChart
            eyebrow="Контент"
            title="Наполнение сайта"
            items={stats.contentMix}
            empty="Контент ещё не добавлен."
          />
        </section>
      </div>

      <div className="admin-dash-cols">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Последние заявки</h2>
            <Link href="/admin/leads" className="admin-panel__link">
              Все заявки
            </Link>
          </div>
          {stats.recentLeads.length === 0 ? (
            <p className="admin-empty">Пока нет обращений.</p>
          ) : (
            <ul className="admin-lead-list">
              {stats.recentLeads.map((lead) => (
                <li key={lead.id} className="admin-lead-row">
                  <div>
                    <p className="admin-lead-row__name">{lead.name}</p>
                    <p className="admin-lead-row__meta">
                      {lead.phone}
                      {lead.source ? ` · ${lead.source}` : ""}
                      {lead.productName ? ` · ${lead.productName}` : ""}
                    </p>
                  </div>
                  <time className="admin-lead-row__time">
                    {new Date(lead.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Быстрый старт</h2>
          </div>
          <ul className="admin-shortcut-list">
            {shortcuts.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="admin-shortcut">
                  <span>
                    <span className="admin-shortcut__title">{item.title}</span>
                    <span className="admin-shortcut__text">{item.text}</span>
                  </span>
                  <span className="admin-shortcut__arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="admin-stock-strip">
            <div>
              <span className="admin-stock-strip__label">В наличии</span>
              <strong>{stats.kpis.inStock}</strong>
            </div>
            <div>
              <span className="admin-stock-strip__label">Хиты</span>
              <strong>{stats.kpis.hits}</strong>
            </div>
            <div>
              <span className="admin-stock-strip__label">Новинки</span>
              <strong>{stats.kpis.news}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
