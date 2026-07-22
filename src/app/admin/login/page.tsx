"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
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
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[1.4rem] border border-[var(--line)] bg-white p-8 shadow-[0_20px_50px_rgba(20,17,22,0.08)]"
      >
        <p className="section-kicker">Админ-панель</p>
        <h1 className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold text-navy">
          Вход
        </h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="input-field"
              defaultValue="admin@esteticfriend.local"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              Пароль
            </span>
            <input name="password" type="password" required className="input-field" />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? "Вход..." : "Войти"}
          </button>
        </div>
      </form>
    </div>
  );
}
