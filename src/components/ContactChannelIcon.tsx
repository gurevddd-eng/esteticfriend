import Image from "next/image";
import type { ContactWidgetChannel } from "@/lib/contact-widget";

function IconSiteChat() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="contact-sheet__glyph">
      <path
        d="M6.5 8.5h11a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2h-6.2l-3.8 2.6V18.5a2 2 0 0 1-2-2v-5.5a2 2 0 0 1 2-2Z"
        fill="currentColor"
      />
      <circle cx="9.5" cy="13.25" r="0.85" fill="var(--contact-sheet-icon-cutout)" />
      <circle cx="12" cy="13.25" r="0.85" fill="var(--contact-sheet-icon-cutout)" />
      <circle cx="14.5" cy="13.25" r="0.85" fill="var(--contact-sheet-icon-cutout)" />
    </svg>
  );
}

function IconMax() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="contact-sheet__glyph">
      <path
        d="M8.2 7.4h7.6c1.45 0 2.6 1.15 2.6 2.6v4.8c0 1.45-1.15 2.6-2.6 2.6h-4.3l-3.5 2.4v-2.4H8.2a2.6 2.6 0 0 1-2.6-2.6v-4.8c0-1.45 1.15-2.6 2.6-2.6Z"
        fill="currentColor"
      />
      <path
        d="M10.6 12.1h2.8M12 10.7v2.8"
        stroke="var(--contact-sheet-icon-cutout)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="contact-sheet__glyph">
      <path
        d="M19.4 5.8 5.9 11.4c-1.2.5-1.2 1.1-.22 1.4l3.4 1.06 1.3 3.95c.17.5.62.6.94.22l1.42-1.45 2.96 2.18c.54.4 1.04.19 1.19-.36l2.2-9.35c.22-.9-.34-1.3-1.02-1.04Z"
        fill="currentColor"
      />
      <path
        d="m9.2 14.1 6.9-4.35-5.45 4.95"
        stroke="var(--contact-sheet-icon-cutout)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="contact-sheet__glyph">
      <path
        d="M10.2 13.8 8.4 15.6a3.2 3.2 0 1 1-4.5-4.5l2.6-2.6a3.2 3.2 0 0 1 4.3-.24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13.8 10.2l1.8-1.8a3.2 3.2 0 1 1 4.5 4.5l-2.6 2.6a3.2 3.2 0 0 1-4.3.24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ContactChannelIcon({ channel }: { channel: ContactWidgetChannel }) {
  if (channel.iconPreset === "custom" && channel.iconUrl) {
    return (
      <Image
        src={channel.iconUrl}
        alt=""
        width={22}
        height={22}
        className="contact-sheet__icon-image"
      />
    );
  }

  switch (channel.iconPreset) {
    case "chat":
      return <IconSiteChat />;
    case "max":
      return <IconMax />;
    case "telegram":
      return <IconTelegram />;
    default:
      return <IconLink />;
  }
}

export function contactChannelIconClass(channel: ContactWidgetChannel) {
  if (channel.iconPreset === "custom") return "contact-sheet__icon contact-sheet__icon--custom";
  if (channel.iconPreset === "chat") return "contact-sheet__icon contact-sheet__icon--chat";
  return "contact-sheet__icon contact-sheet__icon--dark";
}
