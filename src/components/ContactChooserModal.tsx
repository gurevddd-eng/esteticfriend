"use client";

import { useEffect } from "react";
import {
  ContactChannelIcon,
  contactChannelIconClass,
} from "@/components/ContactChannelIcon";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  getActiveContactChannels,
  type ContactWidgetConfig,
} from "@/lib/contact-widget";

export function ContactChooserModal({
  open,
  onClose,
  config,
}: {
  open: boolean;
  onClose: () => void;
  config: ContactWidgetConfig;
}) {
  const channels = getActiveContactChannels(config);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="contact-sheet" onClick={onClose} role="presentation">
      <div
        className="contact-sheet__panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
      >
        <div className="contact-sheet__accent" aria-hidden />

        <button
          type="button"
          className="contact-sheet__close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>

        <div className="contact-sheet__head">
          <p className="contact-sheet__kicker">Связь</p>
          <h2 className="contact-sheet__title">{config.title}</h2>
          <p className="contact-sheet__lead">{config.description}</p>
        </div>

        <ul className="contact-sheet__list">
          {channels.map((channel) => {
            const href = channel.href.trim();
            if (!href) return null;

            const external = /^https?:\/\//i.test(href);
            const icon = (
              <span className={contactChannelIconClass(channel)}>
                <ContactChannelIcon channel={channel} />
              </span>
            );

            return (
              <li key={channel.id}>
                <a
                  href={href}
                  className="contact-sheet__option"
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {icon}
                  <span className="contact-sheet__label">{channel.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <button type="button" className="contact-sheet__submit btn-primary" onClick={onClose}>
          {config.closeLabel}
        </button>
      </div>
    </div>
  );
}
