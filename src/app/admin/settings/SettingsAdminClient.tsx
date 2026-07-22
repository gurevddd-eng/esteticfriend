"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { changeAdminPassword, saveSetting } from "@/actions/admin";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

const FIELDS = [
  ["name", "Название компании"],
  ["tagline", "Слоган"],
  ["phone", "Телефон"],
  ["email", "Email"],
  ["cities", "Города / офисы"],
  ["footerText", "Текст в подвале"],
  ["about", "О компании"],
  ["aboutExtra", "Доп. описание"],
] as const;

export function SettingsAdminClient({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    for (const [key] of FIELDS) {
      await saveSetting(key, String(fd.get(key) || ""));
    }
    setMessage("Настройки сайта сохранены");
    router.refresh();
  }

  async function onPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwdError(null);
    setPwdMessage(null);
    const fd = new FormData(e.currentTarget);
    const res = await changeAdminPassword({
      currentPassword: String(fd.get("currentPassword") || ""),
      newPassword: String(fd.get("newPassword") || ""),
    });
    if (!res.ok) {
      setPwdError(res.error || "Ошибка");
      return;
    }
    setPwdMessage("Пароль обновлён");
    e.currentTarget.reset();
  }

  return (
    <div style={{ maxWidth: "720px", display: "grid", gap: "1rem" }}>
      <AdminPageHeader
        title="Настройки"
        description="Контакты сайта, тексты и безопасность входа."
      />

      <AdminCard>
        <form onSubmit={onSubmit} style={{ padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
          <h2 className="ea-panel__title">Сайт и контакты</h2>
          {FIELDS.map(([key, label]) => (
            <label key={key}>
              <span className="ea-label">{label}</span>
              {key === "about" || key === "aboutExtra" || key === "footerText" ? (
                <textarea name={key} className="ea-textarea" defaultValue={settings[key] || ""} />
              ) : (
                <input name={key} className="ea-input" defaultValue={settings[key] || ""} />
              )}
            </label>
          ))}
          {message ? <p style={{ margin: 0, color: "var(--ea-ok)", fontWeight: 700 }}>{message}</p> : null}
          <button type="submit" className="ea-btn ea-btn--primary">
            Сохранить настройки
          </button>
        </form>
      </AdminCard>

      <AdminCard>
        <form onSubmit={onPassword} style={{ padding: "1.15rem", display: "grid", gap: "0.85rem" }}>
          <h2 className="ea-panel__title">Смена пароля</h2>
          <label>
            <span className="ea-label">Текущий пароль</span>
            <input name="currentPassword" type="password" required className="ea-input" />
          </label>
          <label>
            <span className="ea-label">Новый пароль</span>
            <input name="newPassword" type="password" required minLength={8} className="ea-input" />
          </label>
          {pwdError ? <p style={{ margin: 0, color: "var(--ea-danger)", fontWeight: 700 }}>{pwdError}</p> : null}
          {pwdMessage ? <p style={{ margin: 0, color: "var(--ea-ok)", fontWeight: 700 }}>{pwdMessage}</p> : null}
          <button type="submit" className="ea-btn ea-btn--secondary">
            Обновить пароль
          </button>
        </form>
      </AdminCard>
    </div>
  );
}
