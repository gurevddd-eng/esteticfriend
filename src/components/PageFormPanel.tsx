import type { ReactNode } from "react";

export function PageFormPanel({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <aside className="page-form">
      <h2 className="page-form__title">{title}</h2>
      {lead ? <p className="page-form__lead">{lead}</p> : null}
      {children}
    </aside>
  );
}
