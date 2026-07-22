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
    <form onSubmit={onSubmit} className="ea-login-card">
      <p className="ea-kicker">Estetic Admin</p>
      <h1 className="ea-h1" style={{ marginTop: "0.4rem" }}>
        Вход в панель
      </h1>
      <p className="ea-sub">Управление каталогом, заявками и контентом сайта.</p>
      <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.85rem" }}>
        <label>
          <span className="ea-label">Email</span>
          <input name="email" type="email" required autoComplete="username" className="ea-input" />
        </label>
        <label>
          <span className="ea-label">Пароль</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="ea-input"
          />
        </label>
        {error ? <p style={{ margin: 0, color: "var(--ea-danger)", fontWeight: 700 }}>{error}</p> : null}
        <button type="submit" className="ea-btn ea-btn--primary" disabled={pending}>
          {pending ? "Вход..." : "Войти"}
        </button>
      </div>
    </form>
  );
}
