"use client";

import Link from "next/link";
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
    <div className="admin-login">
      <aside className="admin-login__aside">
        <div>
          <span className="admin-login__mark">EF</span>
          <p className="admin-login__name">ESTETIC FRIEND</p>
          <p className="admin-login__tag">
            CMS для каталога, главной и заявок — в одном спокойном рабочем пространстве.
          </p>
        </div>
        <ul className="admin-login__points">
          <li>Контент главной и промо</li>
          <li>Каталог аппаратов</li>
          <li>Заявки и AmoCRM</li>
        </ul>
      </aside>

      <div className="admin-login__panel">
        <form onSubmit={onSubmit} className="admin-login__form">
          <p className="admin-page__kicker">Вход</p>
          <h1 className="admin-page__title">Админ-панель</h1>
          <p className="admin-page__lead">
            Авторизуйтесь, чтобы управлять контентом сайта.
          </p>

          <div className="admin-login__fields">
            <label className="admin-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                required
                className="input-field"
                defaultValue="admin@esteticfriend.local"
                autoComplete="username"
              />
            </label>
            <label className="admin-field">
              <span>Пароль</span>
              <input
                name="password"
                type="password"
                required
                className="input-field"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="admin-login__error">{error}</p> : null}
            <button type="submit" className="btn-primary w-full" disabled={pending}>
              {pending ? "Вход..." : "Войти"}
            </button>
          </div>

          <Link href="/" className="admin-login__back">
            ← На сайт
          </Link>
        </form>
      </div>
    </div>
  );
}
