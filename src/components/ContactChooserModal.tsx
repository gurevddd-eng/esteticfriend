"use client";

import { useEffect, useState } from "react";
import {
  ContactChannelIcon,
  contactChannelIconClass,
} from "@/components/ContactChannelIcon";
import { LeadForm } from "@/components/LeadForm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  getActiveContactChannels,
  type ContactWidgetConfig,
} from "@/lib/contact-widget";

type View = "channels" | "chat";

export function ContactChooserModal({
  open,
  onClose,
  config,
}: {
  open: boolean;
  onClose: () => void;
  config: ContactWidgetConfig;
}) {
  const [view, setView] = useState<View>("channels");
  const channels = getActiveContactChannels(config);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setView("channels");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (view === "chat") {
          setView("channels");
          return;
        }
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, view]);

  if (!open) return null;

  function handleClose() {
    setView("channels");
    onClose();
  }

  return (
    <div className="contact-sheet" onClick={handleClose} role="presentation">
      <div
        className="contact-sheet__panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={view === "chat" ? config.chatTitle : config.title}
      >
        <div className="contact-sheet__accent" aria-hidden />

        <button
          type="button"
          className="contact-sheet__close"
          aria-label="Закрыть"
          onClick={handleClose}
        >
          ×
        </button>

        {view === "channels" ? (
          <>
            <div className="contact-sheet__head">
              <p className="contact-sheet__kicker">Связь</p>
              <h2 className="contact-sheet__title">{config.title}</h2>
              <p className="contact-sheet__lead">{config.description}</p>
            </div>

            <ul className="contact-sheet__list">
              {channels.map((channel) => {
                const icon = (
                  <span className={contactChannelIconClass(channel)}>
                    <ContactChannelIcon channel={channel} />
                  </span>
                );

                if (channel.kind === "chat") {
                  return (
                    <li key={channel.id}>
                      <button
                        type="button"
                        className="contact-sheet__option"
                        onClick={() => setView("chat")}
                      >
                        {icon}
                        <span className="contact-sheet__label">{channel.label}</span>
                      </button>
                    </li>
                  );
                }

                const href = channel.href.trim();
                if (!href) return null;

                const external = /^https?:\/\//i.test(href);

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

            <button type="button" className="contact-sheet__submit btn-primary" onClick={handleClose}>
              {config.closeLabel}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="contact-sheet__back"
              onClick={() => setView("channels")}
            >
              ← Назад
            </button>
            <div className="contact-sheet__head">
              <p className="contact-sheet__kicker">Чат</p>
              <h2 className="contact-sheet__title">{config.chatTitle}</h2>
              <p className="contact-sheet__lead">{config.chatDescription}</p>
            </div>
            <LeadForm source="question" compact={false} onSuccess={handleClose} />
          </>
        )}
      </div>
    </div>
  );
}
