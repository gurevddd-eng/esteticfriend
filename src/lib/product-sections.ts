/** Split legacy HTML product descriptions into editable plain-text sections. */

export type ProductContentSections = {
  description: string;
  specs: string;
  kit: string;
  advantages: string;
};

const SECTION_ALIASES: Record<keyof ProductContentSections, string[]> = {
  description: [
    "описание",
    "принцип действия",
    "принцип работы",
    "показания",
    "показания к процедуре",
    "характеристики насадок",
    "особенности игл",
  ],
  specs: ["технические характеристики", "технические характеристики:"],
  kit: ["комплектация"],
  advantages: [
    "преимущества",
    "основные преимущества",
    "особенности аппарата",
    "отличительные особенности",
  ],
};

function stripTags(html: string) {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*p\s*>/gi, "\n")
    .replace(/<\/\s*li\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function matchSectionKey(title: string): keyof ProductContentSections | null {
  const key = title.toLowerCase().replace(/[:.]/g, "").trim();
  for (const [section, aliases] of Object.entries(SECTION_ALIASES) as Array<
    [keyof ProductContentSections, string[]]
  >) {
    if (aliases.some((alias) => key === alias || key.startsWith(alias))) {
      return section;
    }
  }
  return null;
}

/** Parse HTML (or plain text) into 4 admin-editable sections. */
export function splitProductSections(raw: string): ProductContentSections {
  const empty: ProductContentSections = {
    description: "",
    specs: "",
    kit: "",
    advantages: "",
  };
  if (!raw?.trim()) return empty;

  if (!/<\s*h3[\s>]/i.test(raw) && !/<\s*p[\s>]/i.test(raw)) {
    return { ...empty, description: raw.trim() };
  }

  const buckets: ProductContentSections = { ...empty };
  const parts = raw.split(/<\s*h3[^>]*>/i);
  const preface = stripTags(parts[0] || "");
  if (preface) {
    buckets.description = preface;
  }

  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const close = chunk.search(/<\s*\/\s*h3\s*>/i);
    if (close < 0) continue;
    const title = stripTags(chunk.slice(0, close));
    const body = stripTags(chunk.slice(close).replace(/^[\s\S]*?<\s*\/\s*h3\s*>/i, ""));
    const section = matchSectionKey(title) || "description";
    buckets[section] = [buckets[section], body].filter(Boolean).join("\n\n");
  }

  if (!buckets.description && !buckets.specs && !buckets.kit && !buckets.advantages) {
    buckets.description = stripTags(raw);
  }

  // Specs must be structured rows, not prose dump.
  if (buckets.specs) {
    buckets.specs = serializeSpecs(parseSpecRows(buckets.specs));
  }

  return buckets;
}

/** Render plain-text section body as safe HTML blocks. */
export function plainTextToHtml(text: string): string {
  const lines = text.replace(/\r/g, "").split("\n").map((l) => l.trimEnd());
  const blocks: string[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    const bullet = trimmed.match(/^[-–—•*]\s+(.*)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      list.push((bullet?.[1] || numbered?.[1] || "").trim());
      continue;
    }
    flushList();
    blocks.push(`<p>${escapeHtml(trimmed)}</p>`);
  }
  flushList();
  return blocks.join("\n");
}

export type SpecRow = { label: string; value: string };

function cleanLabel(value: string) {
  return value.replace(/^[-–—•*\s]+/, "").replace(/[.;:\s]+$/g, "").trim();
}

function cleanValue(value: string) {
  return value.replace(/[;]+$/g, "").trim();
}

function looksLikeSpecValue(value: string) {
  // Drop sentence-like values: "используется для лица."
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length >= 3 && /^[а-яёa-z]/.test(value) && /[.!?]$/.test(value)) {
    return false;
  }
  return true;
}

/** Keep only meaningful parameter/value pairs. */
export function normalizeSpecRows(rows: SpecRow[]): SpecRow[] {
  return rows
    .map((row) => ({
      label: cleanLabel(row.label || ""),
      value: cleanValue(row.value || ""),
    }))
    .filter((row) => {
      if (!row.label || !row.value) return false;
      if (row.label.length > 80) return false;
      if (/[.!?]$/.test(row.label)) return false;
      // "Длинное описание насадки: используется для лица."
      if (row.label.split(/\s+/).length > 6 && !/\d/.test(row.value)) return false;
      if (!looksLikeSpecValue(row.value)) return false;
      return true;
    });
}

/** Parse specs plain text into label/value rows for a table. */
export function parseSpecRows(text: string): SpecRow[] {
  const rows: SpecRow[] = [];

  for (const rawLine of text.replace(/\r/g, "").split("\n")) {
    let line = rawLine.trim();
    if (!line) continue;
    line = line
      .replace(/^[-–—•*]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .replace(/^•\s*/, "")
      .trim();
    if (!line) continue;

    // Skip prose paragraphs.
    if (line.length > 90 && !/[:：]/.test(line) && /[.!?]$/.test(line)) {
      continue;
    }

    const colon = line.match(/^(.+?)\s*[:：]\s+(.+)$/);
    if (colon) {
      rows.push({ label: cleanLabel(colon[1]), value: cleanValue(colon[2]) });
      continue;
    }

    const dash = line.match(/^(.{2,60}?)\s+[–—]\s+(.+)$/);
    if (dash) {
      rows.push({ label: cleanLabel(dash[1]), value: cleanValue(dash[2]) });
      continue;
    }

    // "Мощность лазера 800Вт"
    const unitish = line.match(
      /^([A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\s/()."«»-]{1,50}?)\s+(\d.*)$/u,
    );
    if (unitish) {
      rows.push({ label: cleanLabel(unitish[1]), value: cleanValue(unitish[2]) });
      continue;
    }

    const spaced = line.match(/^(.{2,48}?)\s{2,}(.+)$/);
    if (spaced) {
      rows.push({ label: cleanLabel(spaced[1]), value: cleanValue(spaced[2]) });
    }
  }

  return normalizeSpecRows(rows);
}

/** Read specs from DB: JSON rows or legacy plain text. */
export function deserializeSpecs(raw: string | null | undefined): SpecRow[] {
  const text = (raw || "").trim();
  if (!text) return [];

  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) {
        return normalizeSpecRows(
          parsed.map((item) => {
            if (!item || typeof item !== "object") return { label: "", value: "" };
            const row = item as { label?: unknown; value?: unknown };
            return {
              label: String(row.label ?? ""),
              value: String(row.value ?? ""),
            };
          }),
        );
      }
    } catch {
      // fall through
    }
  }

  return parseSpecRows(text);
}

/** Store specs as JSON array of {label,value}. */
export function serializeSpecs(rows: SpecRow[]): string {
  const cleaned = normalizeSpecRows(rows);
  return cleaned.length ? JSON.stringify(cleaned) : "";
}

/** Render technical specs rows as an HTML table. */
export function specsRowsToTableHtml(rows: SpecRow[]): string {
  const cleaned = normalizeSpecRows(rows);
  if (!cleaned.length) return "";

  const body = cleaned
    .map(
      (row) =>
        `<tr><th scope="row">${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`,
    )
    .join("");

  return `<table class="product-specs-table"><tbody>${body}</tbody></table>`;
}

/** Render technical specs as an HTML table (JSON or plain text). */
export function specsToTableHtml(text: string): string {
  const rows = deserializeSpecs(text);
  if (!rows.length) return "";
  return specsRowsToTableHtml(rows);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const PRODUCT_SECTION_META = [
  { key: "description" as const, title: "Описание" },
  { key: "specs" as const, title: "Технические характеристики" },
  { key: "kit" as const, title: "Комплектация" },
  { key: "advantages" as const, title: "Преимущества" },
];
