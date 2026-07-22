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
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader
        title="Настройки"
        description="Контакты сайта, тексты и безопасность входа."
      />

      <AdminCard className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#17141a]">
            Сайт и контакты
          </h2>
          {FIELDS.map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">{label}</span>
              {key === "about" || key === "aboutExtra" || key === "footerText" ? (
                <textarea name={key} className="input-field min-h-28" defaultValue={settings[key] || ""} />
              ) : (
                <input name={key} className="input-field" defaultValue={settings[key] || ""} />
              )}
            </label>
          ))}
          {message ? <p className="text-sm text-[#b53d4a]">{message}</p> : null}
          <button type="submit" className="btn-primary">
            Сохранить настройки
          </button>
        </form>
      </AdminCard>

      <AdminCard className="p-6">
        <form onSubmit={onPassword} className="space-y-4">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#17141a]">
            Смена пароля
          </h2>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">
              Текущий пароль
            </span>
            <input name="currentPassword" type="password" required className="input-field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#8a817c] uppercase">
              Новый пароль
            </span>
            <input name="newPassword" type="password" required minLength={8} className="input-field" />
          </label>
          {pwdError ? <p className="text-sm text-rose-700">{pwdError}</p> : null}
          {pwdMessage ? <p className="text-sm text-[#b53d4a]">{pwdMessage}</p> : null}
          <button type="submit" className="btn-outline">
            Обновить пароль
          </button>
        </form>
      </AdminCard>
    </div>
  );
}
