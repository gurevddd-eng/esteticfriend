"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAmoCrmSettings, testAmoCrmSettings } from "@/actions/admin";

type AmoFormState = {
  enabled: boolean;
  domain: string;
  tokenMasked: string;
  hasToken: boolean;
  pipelineId: string;
  statusId: string;
  responsibleUserId: string;
  liveEnabled: boolean;
  envOverrides: { token: boolean; domain: boolean };
};

export function IntegrationsAdminClient({ amo }: { amo: AmoFormState }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const token = String(fd.get("token") || "");
    await saveAmoCrmSettings({
      enabled: fd.get("enabled") === "on",
      domain: String(fd.get("domain") || ""),
      token,
      keepToken: !token.trim() && amo.hasToken,
      pipelineId: String(fd.get("pipelineId") || ""),
      statusId: String(fd.get("statusId") || ""),
      responsibleUserId: String(fd.get("responsibleUserId") || ""),
    });
    setPending(false);
    setMessage("Настройки AmoCRM сохранены");
    router.refresh();
  }

  async function onTest() {
    setTesting(true);
    setMessage(null);
    setError(null);
    const res = await testAmoCrmSettings();
    setTesting(false);
    if (!res.ok) {
      setError(res.error || "Не удалось подключиться");
      return;
    }
    setMessage(`Подключение успешно: ${res.accountName}`);
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Система</p>
          <h1 className="admin-page__title">Интеграции</h1>
          <p className="admin-page__lead">
            Внешние сервисы для заявок с сайта. Сейчас доступен AmoCRM.
          </p>
        </div>
      </header>

      <section className="admin-integration-card">
        <div className="admin-integration-card__head">
          <div>
            <p className="admin-integration-card__brand">AmoCRM</p>
            <h2 className="admin-integration-card__title">Сделки из заявок сайта</h2>
            <p className="admin-integration-card__text">
              Новая заявка создаёт сделку и контакт в воронке. В примечании — источник,
              товар и текст обращения.
            </p>
          </div>
          <span
            className={`admin-status${amo.liveEnabled ? " is-live" : ""}`}
          >
            {amo.liveEnabled ? "Активна" : "Выключена"}
          </span>
        </div>

        <form onSubmit={onSubmit} className="admin-modal-form">
          <label className="admin-check">
            <input name="enabled" type="checkbox" defaultChecked={amo.enabled} />
            <span>Отправлять заявки в AmoCRM</span>
          </label>

          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Домен аккаунта</span>
              <input
                name="domain"
                className="input-field"
                defaultValue={amo.domain}
                placeholder="company.amocrm.ru"
                required={amo.enabled}
              />
            </label>
            <label className="admin-field">
              <span>Токен доступа</span>
              <input
                name="token"
                className="input-field"
                type="password"
                autoComplete="off"
                placeholder={
                  amo.hasToken
                    ? `Сохранён: ${amo.tokenMasked}`
                    : "Долгоживущий или OAuth access token"
                }
              />
            </label>
          </div>

          {(amo.envOverrides.domain || amo.envOverrides.token) && (
            <p className="admin-integration-card__hint">
              Переменные окружения имеют приоритет
              {amo.envOverrides.domain ? " (AMOCRM_DOMAIN)" : ""}
              {amo.envOverrides.token ? " (AMOCRM_ACCESS_TOKEN)" : ""}.
            </p>
          )}

          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>ID воронки</span>
              <input
                name="pipelineId"
                className="input-field"
                defaultValue={amo.pipelineId}
                placeholder="Необязательно"
              />
            </label>
            <label className="admin-field">
              <span>ID этапа</span>
              <input
                name="statusId"
                className="input-field"
                defaultValue={amo.statusId}
                placeholder="Необязательно"
              />
            </label>
          </div>

          <label className="admin-field">
            <span>ID ответственного</span>
            <input
              name="responsibleUserId"
              className="input-field"
              defaultValue={amo.responsibleUserId}
              placeholder="Необязательно"
            />
          </label>

          <ol className="admin-integration-steps">
            <li>В AmoCRM: Настройки → Интеграции → создать интеграцию / долгоживущий токен.</li>
            <li>Укажите домен вида <code>yourname.amocrm.ru</code> и токен.</li>
            <li>При необходимости задайте воронку и этап — иначе сделка попадёт в основную.</li>
            <li>Сохраните и нажмите «Проверить связь».</li>
          </ol>

          {message ? <p className="text-sm text-azure">{message}</p> : null}
          {error ? <p className="admin-login__error">{error}</p> : null}

          <div className="admin-modal-form__actions">
            <button
              type="button"
              className="btn-outline"
              disabled={testing || pending}
              onClick={onTest}
            >
              {testing ? "Проверка..." : "Проверить связь"}
            </button>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
