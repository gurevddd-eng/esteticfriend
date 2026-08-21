"use client";

import { useMemo, useState } from "react";
import {
  PRODUCT_SECTION_META,
  deserializeSpecs,
  plainTextToHtml,
  specsRowsToTableHtml,
  type ProductContentSections,
} from "@/lib/product-sections";

export function ProductDetailsTabs({ sections }: { sections: ProductContentSections }) {
  const tabs = useMemo(() => {
    return PRODUCT_SECTION_META.map(({ key, title }) => {
      const raw = sections[key] || "";
      if (key === "specs") {
        const rows = deserializeSpecs(raw);
        if (!rows.length) return null;
        return { key, title, html: specsRowsToTableHtml(rows) };
      }
      if (!raw.trim()) return null;
      return { key, title, html: plainTextToHtml(raw) };
    }).filter((tab): tab is { key: typeof PRODUCT_SECTION_META[number]["key"]; title: string; html: string } =>
      Boolean(tab),
    );
  }, [sections]);

  const [active, setActive] = useState(tabs[0]?.key ?? "description");
  const current = tabs.find((tab) => tab.key === active) ?? tabs[0];

  if (!tabs.length || !current) return null;

  return (
    <section className="product-tabs" aria-label="Подробности о товаре">
      <div className="product-tabs__nav" role="tablist" aria-label="Разделы описания">
        {tabs.map((tab) => {
          const selected = tab.key === current.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`product-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`product-panel-${tab.key}`}
              className={`product-tabs__tab${selected ? " is-active" : ""}`}
              onClick={() => setActive(tab.key)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      <div
        className="product-tabs__panel"
        role="tabpanel"
        id={`product-panel-${current.key}`}
        aria-labelledby={`product-tab-${current.key}`}
      >
        <h2 className="product-tabs__title">{current.title}</h2>
        <div
          className={`product-tabs__body${current.key === "specs" ? " product-tabs__body--specs" : ""}`}
          dangerouslySetInnerHTML={{ __html: current.html }}
        />
      </div>
    </section>
  );
}
