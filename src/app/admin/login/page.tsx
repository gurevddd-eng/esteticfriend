"use client";

import { FormEvent, useState } from "react";
import { loginAdmin } from "@/actions/auth";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await loginAdmin({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error || "Ошибка входа");
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111114] p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <p className="text-xs font-bold tracking-[0.14em] text-[#8a817c] uppercase">
          Estetic Admin
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold text-[#17141a]">
          Вход в панель
        </h1>
        <p className="mt-2 text-sm text-[#6f6764]">
          Управление каталогом, заявками и контентом сайта.
        </p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#8a817c] uppercase">
              Email
            </span>
            <input name="email" type="email" required autoComplete="username" className="input-field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-[#8a817c] uppercase">
              Пароль
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
            />
          </label>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? "Вход..." : "Войти"}
          </button>
        </div>
      </form>
    </div>
  );
}
