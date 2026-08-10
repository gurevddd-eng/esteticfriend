"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ContactChannelIcon,
  contactChannelIconClass,
} from "@/components/ContactChannelIcon";
import { AdminModal } from "@/components/AdminModal";
import { saveContactWidgetConfig, uploadCmsImage } from "@/actions/admin";
import type {
  ContactWidgetChannel,
  ContactWidgetConfig,
  ContactWidgetIconPreset,
} from "@/lib/contact-widget";

const ICON_PRESETS: Array<{ value: ContactWidgetIconPreset; label: string }> = [
  { value: "chat", label: "Чат (лайм)" },
  { value: "max", label: "Макс" },
  { value: "telegram", label: "Telegram" },
  { value: "dark", label: "Тёмная" },
  { value: "custom", label: "Своя иконка" },
];

function emptyChannel(sortOrder: number): ContactWidgetChannel {
  return {
    id: `channel-${Date.now()}`,
    label: "",
    kind: "link",
    href: "",
    iconPreset: "dark",
    iconUrl: null,
    sortOrder,
    isActive: true,
  };
}

export function ContactWidgetAdminClient({
  initialConfig,
}: {
  initialConfig: ContactWidgetConfig;
}) {
  const router = useRouter();
  const [config, setConfig] = useState(initialConfig);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [channelOpen, setChannelOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<ContactWidgetChannel>(emptyChannel(0));

  const sortedChannels = useMemo(
    () => [...config.channels].sort((a, b) => a.sortOrder - b.sortOrder),
    [config.channels],
  );

  function openCreate() {
    setDraft(emptyChannel(config.channels.length));
    setEditingIndex(null);
    setChannelOpen(true);
  }

  function openEdit(index: number) {
    setDraft({ ...sortedChannels[index] });
    setEditingIndex(index);
    setChannelOpen(true);
  }

  function closeChannelModal() {
    setChannelOpen(false);
    setEditingIndex(null);
  }

  async function onSaveAll(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      await saveContactWidgetConfig(config);
      setMessage("Виджет связи сохранён");
      router.refresh();
    } catch {
      setError("Не удалось сохранить");
    } finally {
      setPending(false);
    }
  }

  async function onUploadIcon(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadCmsImage(fd);
    setUploading(false);
    if (!res.ok) {
      setError(res.error || "Не удалось загрузить иконку");
      return;
    }
    setDraft((current) => ({ ...current, iconUrl: res.url, iconPreset: "custom" }));
    setMessage("Иконка загружена — сохраните канал и общие настройки");
  }

  function saveChannel() {
    if (!draft.label.trim()) {
      setError("Укажите название канала");
      return;
    }

    const next = { ...draft, label: draft.label.trim(), href: draft.href.trim() };
    setConfig((current) => {
      const channels = [...current.channels];
      if (editingIndex === null) {
        channels.push(next);
      } else {
        const targetId = sortedChannels[editingIndex]?.id;
        const index = channels.findIndex((item) => item.id === targetId);
        if (index >= 0) channels[index] = next;
      }
      return { ...current, channels };
    });
    closeChannelModal();
    setError(null);
  }

  function removeChannel(index: number) {
    const targetId = sortedChannels[index]?.id;
    setConfig((current) => ({
      ...current,
      channels: current.channels.filter((item) => item.id !== targetId),
    }));
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Система</p>
          <h1 className="admin-page__title">Кнопка «Задать вопрос»</h1>
          <p className="admin-page__lead">
            Тексты, ссылки и иконки в окне выбора способа связи.
          </p>
        </div>
      </header>

      <form className="space-y-4" onSubmit={onSaveAll}>
        <section className="admin-panel space-y-4">
          <h2 className="admin-panel__title">Тексты окна</h2>
          <label className="admin-field">
            <span>Заголовок</span>
            <input
              className="input-field"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
            />
          </label>
          <label className="admin-field">
            <span>Текст кнопки закрытия</span>
            <input
              className="input-field"
              value={config.closeLabel}
              onChange={(e) => setConfig({ ...config, closeLabel: e.target.value })}
            />
          </label>
          <label className="admin-field">
            <span>Описание</span>
            <textarea
              className="input-field min-h-24"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
            />
          </label>
          <label className="admin-field">
            <span>Заголовок чата</span>
            <input
              className="input-field"
              value={config.chatTitle}
              onChange={(e) => setConfig({ ...config, chatTitle: e.target.value })}
            />
          </label>
          <label className="admin-field">
            <span>Описание чата</span>
            <textarea
              className="input-field min-h-24"
              value={config.chatDescription}
              onChange={(e) => setConfig({ ...config, chatDescription: e.target.value })}
            />
          </label>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Каналы связи</h2>
            <button type="button" className="btn-outline" onClick={openCreate}>
              Добавить канал
            </button>
          </div>

          {sortedChannels.length ? (
            <div className="admin-brand-grid">
              {sortedChannels.map((channel, index) => (
                <article key={channel.id} className="admin-brand-card">
                  <div className="contact-widget-admin__preview">
                    <span className={contactChannelIconClass(channel)}>
                      <ContactChannelIcon channel={channel} />
                    </span>
                    <div>
                      <h2 className="admin-brand-card__name">{channel.label}</h2>
                      <p className="admin-brand-card__meta">
                        {channel.kind === "chat" ? "Чат на сайте" : channel.href || "Без ссылки"}
                        {!channel.isActive ? " · скрыт" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="admin-item__actions">
                    <button
                      type="button"
                      className="admin-action-edit"
                      onClick={() => openEdit(index)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      className="admin-action-delete"
                      onClick={() => removeChannel(index)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-empty">Каналы не добавлены.</p>
          )}
        </section>

        {message ? <p className="admin-toast">{message}</p> : null}
        {error ? <p className="admin-login__error">{error}</p> : null}

        <div className="admin-page__actions">
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </form>

      <AdminModal
        open={channelOpen}
        onClose={closeChannelModal}
        title={editingIndex === null ? "Новый канал" : "Редактировать канал"}
      >
        <div className="admin-modal-form">
          <label className="admin-field">
            <span>Название</span>
            <input
              className="input-field"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </label>
          <label className="admin-field">
            <span>Тип</span>
            <select
              className="input-field"
              value={draft.kind}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  kind: e.target.value === "chat" ? "chat" : "link",
                })
              }
            >
              <option value="chat">Чат на сайте</option>
              <option value="link">Ссылка</option>
            </select>
          </label>
          {draft.kind === "link" ? (
            <label className="admin-field">
              <span>Ссылка</span>
              <input
                className="input-field"
                value={draft.href}
                onChange={(e) => setDraft({ ...draft, href: e.target.value })}
                placeholder="https://t.me/sevens"
              />
            </label>
          ) : null}
          <label className="admin-field">
            <span>Иконка</span>
            <select
              className="input-field"
              value={draft.iconPreset}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  iconPreset: e.target.value as ContactWidgetIconPreset,
                })
              }
            >
              {ICON_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Порядок</span>
            <input
              className="input-field"
              type="number"
              value={draft.sortOrder}
              onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })}
            />
          </label>
          {draft.iconPreset === "custom" ? (
            <label className="admin-field">
              <span>Файл иконки</span>
              <input
                className="input-field"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUploadIcon(file);
                }}
              />
              {draft.iconUrl ? (
                <Image
                  src={draft.iconUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="mt-2 rounded"
                />
              ) : null}
            </label>
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
            />
            Показывать на сайте
          </label>
          <div className="admin-modal-form__actions">
            <button type="button" className="btn-outline" onClick={closeChannelModal}>
              Отмена
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={uploading}
              onClick={saveChannel}
            >
              {uploading ? "Загрузка..." : "Сохранить канал"}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
