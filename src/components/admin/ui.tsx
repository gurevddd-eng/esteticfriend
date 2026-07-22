"use client";

import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="ea-pagehead">
      <div>
        <h1 className="ea-h1">{title}</h1>
        {description ? <p className="ea-sub">{description}</p> : null}
      </div>
      {actions ? <div className="ea-pagehead__actions">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`ea-panel ${className}`.trim()}>{children}</div>;
}

export function AdminStat({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number | string;
  href?: string;
  hint?: string;
}) {
  const inner = (
    <div className="ea-kpi__card">
      <p className="ea-kpi__label">{label}</p>
      <p className="ea-kpi__value">{value}</p>
      {hint ? <p className="ea-kpi__hint">{hint}</p> : null}
    </div>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="ea-kpi__link">
      {inner}
    </Link>
  );
}

export function AdminBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger" | "accent";
}) {
  const map = {
    neutral: "ea-chip ea-chip--neutral",
    success: "ea-chip ea-chip--ok",
    warn: "ea-chip ea-chip--warn",
    danger: "ea-chip ea-chip--danger",
    accent: "ea-chip ea-chip--accent",
  } as const;
  return <span className={map[tone]}>{children}</span>;
}

export function AdminEmpty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="ea-empty">
      <strong>{title}</strong>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function confirmDelete(message: string) {
  return typeof window !== "undefined" ? window.confirm(message) : false;
}
