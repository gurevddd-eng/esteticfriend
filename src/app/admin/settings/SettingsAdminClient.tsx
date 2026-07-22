"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSetting } from "@/actions/admin";

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
    const keys = ["phone", "email", "cities", "about", "aboutExtra"] as const;
    for (const key of keys) {
      await saveSetting(key, String(fd.get(key) || ""));
    }
    setMessage("Сохранено");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-navy">
        Настройки
      </h1>
      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-6"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Телефон</span>
          <input name="phone" className="input-field" defaultValue={settings.phone || ""} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Email</span>
          <input name="email" className="input-field" defaultValue={settings.email || ""} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Города</span>
          <input name="cities" className="input-field" defaultValue={settings.cities || ""} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">О компании</span>
          <textarea
            name="about"
            className="input-field min-h-28"
            defaultValue={settings.about || ""}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">
            Доп. описание
          </span>
          <textarea
            name="aboutExtra"
            className="input-field min-h-28"
            defaultValue={settings.aboutExtra || ""}
          />
        </label>
        {message ? <p className="text-sm text-azure">{message}</p> : null}
        <button type="submit" className="btn-primary">
          Сохранить
        </button>
      </form>
    </div>
  );
}
