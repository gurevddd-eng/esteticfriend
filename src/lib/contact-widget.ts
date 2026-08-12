export type ContactWidgetIconPreset = "chat" | "max" | "telegram" | "dark" | "custom";

export type ContactWidgetChannel = {
  id: string;
  label: string;
  kind: "chat" | "link";
  href: string;
  iconPreset: ContactWidgetIconPreset;
  iconUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ContactWidgetConfig = {
  title: string;
  description: string;
  closeLabel: string;
  chatTitle: string;
  chatDescription: string;
  channels: ContactWidgetChannel[];
};

export const CONTACT_WIDGET_SETTING_KEY = "contactWidget";

export const DEFAULT_CONTACT_WIDGET: ContactWidgetConfig = {
  title: "напишите нам",
  description:
    "Выберите удобный способ связи. Наша служба поддержки всегда на связи.",
  closeLabel: "Закрыть",
  chatTitle: "чат на сайте",
  chatDescription:
    "Опишите вопрос — специалист ответит и поможет с подбором оборудования.",
  channels: [
    {
      id: "max",
      label: "Макс",
      kind: "link",
      href: "https://max.ru",
      iconPreset: "max",
      iconUrl: null,
      sortOrder: 0,
      isActive: true,
    },
    {
      id: "telegram",
      label: "Telegram",
      kind: "link",
      href: "https://t.me/sevens",
      iconPreset: "telegram",
      iconUrl: null,
      sortOrder: 1,
      isActive: true,
    },
  ],
};

function normalizeChannel(raw: unknown, index: number): ContactWidgetChannel | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<ContactWidgetChannel>;
  const fallback = DEFAULT_CONTACT_WIDGET.channels[index];

  const id = typeof item.id === "string" && item.id.trim() ? item.id.trim() : fallback?.id || `channel-${index}`;
  const label = typeof item.label === "string" ? item.label.trim() : "";
  if (!label) return null;

  const kind = item.kind === "link" ? "link" : "chat";
  const iconPreset: ContactWidgetIconPreset =
    item.iconPreset === "max" ||
    item.iconPreset === "telegram" ||
    item.iconPreset === "dark" ||
    item.iconPreset === "custom" ||
    item.iconPreset === "chat"
      ? item.iconPreset
      : "chat";

  return {
    id,
    label,
    kind,
    href: typeof item.href === "string" ? item.href.trim() : "",
    iconPreset,
    iconUrl: typeof item.iconUrl === "string" && item.iconUrl.trim() ? item.iconUrl.trim() : null,
    sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : index,
    isActive: item.isActive !== false,
  };
}

export function parseContactWidgetConfig(raw: string | undefined | null): ContactWidgetConfig {
  if (!raw?.trim()) return DEFAULT_CONTACT_WIDGET;

  try {
    const parsed = JSON.parse(raw) as Partial<ContactWidgetConfig>;
    const channels = Array.isArray(parsed.channels)
      ? parsed.channels
          .map((channel, index) => normalizeChannel(channel, index))
          .filter(Boolean) as ContactWidgetChannel[]
      : DEFAULT_CONTACT_WIDGET.channels;

    return {
      title:
        typeof parsed.title === "string" && parsed.title.trim()
          ? parsed.title.trim()
          : DEFAULT_CONTACT_WIDGET.title,
      description:
        typeof parsed.description === "string" && parsed.description.trim()
          ? parsed.description.trim()
          : DEFAULT_CONTACT_WIDGET.description,
      closeLabel:
        typeof parsed.closeLabel === "string" && parsed.closeLabel.trim()
          ? parsed.closeLabel.trim()
          : DEFAULT_CONTACT_WIDGET.closeLabel,
      chatTitle:
        typeof parsed.chatTitle === "string" && parsed.chatTitle.trim()
          ? parsed.chatTitle.trim()
          : DEFAULT_CONTACT_WIDGET.chatTitle,
      chatDescription:
        typeof parsed.chatDescription === "string" && parsed.chatDescription.trim()
          ? parsed.chatDescription.trim()
          : DEFAULT_CONTACT_WIDGET.chatDescription,
      channels: channels.length ? channels.sort((a, b) => a.sortOrder - b.sortOrder) : DEFAULT_CONTACT_WIDGET.channels,
    };
  } catch {
    return DEFAULT_CONTACT_WIDGET;
  }
}

export function getActiveContactChannels(config: ContactWidgetConfig) {
  return config.channels.filter((channel) => channel.isActive && channel.kind !== "chat");
}
