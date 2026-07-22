"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSetting } from "@/actions/admin";

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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    for (const [key] of FIELDS) {
      await saveSetting(key, String(fd.get(key) || ""));
    }
    setMessage("Сохранено — контакты и тексты сайта обновлены");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Настройки сайта
      </h1>
      <p className="mt-2 text-sm text-muted">
        Эти данные используются в шапке, подвале, контактах и метаданных.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-6"
      >
        {FIELDS.map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">{label}</span>
            {key === "about" || key === "aboutExtra" || key === "footerText" ? (
              <textarea
                name={key}
                className="input-field min-h-28"
                defaultValue={settings[key] || ""}
              />
            ) : (
              <input name={key} className="input-field" defaultValue={settings[key] || ""} />
            )}
          </label>
        ))}
        {message ? <p className="text-sm text-azure">{message}</p> : null}
        <button type="submit" className="btn-primary">
          Сохранить
        </button>
      </form>
    </div>
  );
}
