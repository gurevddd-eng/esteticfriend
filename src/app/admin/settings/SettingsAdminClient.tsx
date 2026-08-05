"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSiteSettings, uploadBrandAsset } from "@/actions/admin";

type SiteDefaults = {
  phone: string;
  email: string;
  cities: string;
  tagline: string;
  about: string;
  aboutExtra: string;
};

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

export function SettingsAdminClient({
  settings,
  defaults,
}: {
  settings: Record<string, string>;
  defaults: SiteDefaults;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState(settings.phone || defaults.phone);
  const [email, setEmail] = useState(settings.email || defaults.email);
  const [cities, setCities] = useState(settings.cities || defaults.cities);
  const [tagline, setTagline] = useState(settings.tagline || defaults.tagline);
  const [about, setAbout] = useState(settings.about || defaults.about);
  const [aboutExtra, setAboutExtra] = useState(
    settings.aboutExtra || defaults.aboutExtra,
  );
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || "");

  const filled = useMemo(() => {
    const values = [phone, email, cities, tagline, about, aboutExtra];
    return values.filter((v) => v.trim()).length;
  }, [phone, email, cities, tagline, about, aboutExtra]);

  async function uploadKind(kind: "logo" | "favicon", file: File) {
    setUploading(kind);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", kind);
    const res = await uploadBrandAsset(fd);
    setUploading(null);
    if (!res.ok) {
      setError(res.error || "Ошибка загрузки");
      return;
    }
    if (kind === "logo") setLogoUrl(res.url);
    else setFaviconUrl(res.url);
    setMessage(kind === "logo" ? "Логотип загружен — нажмите «Сохранить»" : "Иконка загружена — нажмите «Сохранить»");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      await saveSiteSettings({
        phone,
        email,
        cities,
        tagline,
        about,
        aboutExtra,
        logoUrl,
        faviconUrl,
      });
      setMessage("Настройки сайта сохранены");
      router.refresh();
    } catch {
      setError("Не удалось сохранить");
    } finally {
      setPending(false);
    }
  }

  function resetDefaults() {
    setPhone(defaults.phone);
    setEmail(defaults.email);
    setCities(defaults.cities);
    setTagline(defaults.tagline);
    setAbout(defaults.about);
    setAboutExtra(defaults.aboutExtra);
    setMessage(null);
    setError(null);
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Система</p>
          <h1 className="admin-page__title">Настройки</h1>
          <p className="admin-page__lead">
            Контакты, бренд, логотип и иконка вкладки браузера.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link href="/admin/integrations" className="btn-outline">
            Интеграции
          </Link>
          <Link href="/admin/home" className="btn-outline">
            Герой
          </Link>
          <Link href="/" className="btn-outline" target="_blank">
            Сайт
          </Link>
        </div>
      </header>

      <div className="admin-settings-layout">
        <form onSubmit={onSubmit} className="admin-settings-main">
          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <div>
                <p className="admin-settings-card__eyebrow">Бренд</p>
                <h2 className="admin-settings-card__title">Логотип и иконка</h2>
                <p className="admin-settings-card__text">
                  Логотип — в шапке, футере и герое. Иконка — во вкладке браузера (favicon).
                </p>
              </div>
            </div>

            <div className="admin-brand-assets">
              <div className="admin-brand-asset">
                <p className="admin-brand-asset__label">Логотип сайта</p>
                <div className="admin-brand-asset__preview admin-brand-asset__preview--logo">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Логотип" />
                  ) : (
                    <span className="admin-brand-asset__fallback">
                      Estetic <em>Friend</em>
                    </span>
                  )}
                </div>
                <label className="admin-field">
                  <span>URL логотипа</span>
                  <input
                    className="input-field"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Пусто — текстовый логотип"
                  />
                </label>
                <label className="admin-field">
                  <span>Загрузить файл</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    disabled={uploading !== null}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadKind("logo", file);
                    }}
                  />
                </label>
                {logoUrl ? (
                  <button
                    type="button"
                    className="admin-action-delete"
                    onClick={() => setLogoUrl("")}
                  >
                    Убрать логотип
                  </button>
                ) : null}
              </div>

              <div className="admin-brand-asset">
                <p className="admin-brand-asset__label">Иконка браузера</p>
                <div className="admin-brand-asset__preview admin-brand-asset__preview--favicon">
                  {faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={faviconUrl} alt="Favicon" />
                  ) : (
                    <span>Нет</span>
                  )}
                </div>
                <div className="admin-brand-asset__tab" aria-hidden>
                  <span className="admin-brand-asset__tab-icon">
                    {faviconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={faviconUrl} alt="" />
                    ) : (
                      "EF"
                    )}
                  </span>
                  <span>ESTETIC FRIEND</span>
                </div>
                <label className="admin-field">
                  <span>URL favicon</span>
                  <input
                    className="input-field"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="/uploads/brand-favicon.png"
                  />
                </label>
                <label className="admin-field">
                  <span>Загрузить файл</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico"
                    disabled={uploading !== null}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadKind("favicon", file);
                    }}
                  />
                </label>
                {faviconUrl ? (
                  <button
                    type="button"
                    className="admin-action-delete"
                    onClick={() => setFaviconUrl("")}
                  >
                    Убрать иконку
                  </button>
                ) : null}
              </div>
            </div>
            <p className="admin-settings-card__text">
              Рекомендуется: логотип PNG/WebP/SVG на прозрачном фоне; favicon 32×32 или 180×180 PNG.
              {uploading ? ` · Загрузка ${uploading}...` : ""}
            </p>
          </section>

          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <div>
                <p className="admin-settings-card__eyebrow">Контакты</p>
                <h2 className="admin-settings-card__title">Связь с клиентом</h2>
                <p className="admin-settings-card__text">
                  Телефон и почта отображаются в шапке, футере и формах.
                </p>
              </div>
            </div>
            <div className="admin-modal-form__row">
              <label className="admin-field">
                <span>Телефон</span>
                <input
                  name="phone"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={defaults.phone}
                />
              </label>
              <label className="admin-field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={defaults.email}
                />
              </label>
            </div>
            <label className="admin-field">
              <span>Города</span>
              <input
                name="cities"
                className="input-field"
                value={cities}
                onChange={(e) => setCities(e.target.value)}
                placeholder={defaults.cities}
              />
            </label>
          </section>

          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <div>
                <p className="admin-settings-card__eyebrow">Слоган</p>
                <h2 className="admin-settings-card__title">Короткая фраза</h2>
                <p className="admin-settings-card__text">
                  Рядом с названием компании в футере и превью.
                </p>
              </div>
            </div>
            <label className="admin-field">
              <span>Слоган</span>
              <input
                name="tagline"
                className="input-field"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={defaults.tagline}
              />
            </label>
          </section>

          <section className="admin-settings-card">
            <div className="admin-settings-card__head">
              <div>
                <p className="admin-settings-card__eyebrow">О компании</p>
                <h2 className="admin-settings-card__title">Тексты на сайте</h2>
                <p className="admin-settings-card__text">
                  Основной и дополнительный абзацы — блок консультации и «О нас».
                </p>
              </div>
            </div>
            <label className="admin-field">
              <span>Основной текст</span>
              <textarea
                name="about"
                className="input-field min-h-32"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder={defaults.about}
              />
            </label>
            <label className="admin-field">
              <span>Дополнительный текст</span>
              <textarea
                name="aboutExtra"
                className="input-field min-h-32"
                value={aboutExtra}
                onChange={(e) => setAboutExtra(e.target.value)}
                placeholder={defaults.aboutExtra}
              />
            </label>
          </section>

          {message ? <p className="admin-toast">{message}</p> : null}
          {error ? <p className="admin-login__error">{error}</p> : null}

          <div className="admin-settings-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={resetDefaults}
              disabled={pending}
            >
              Подставить дефолты
            </button>
            <button type="submit" className="btn-primary" disabled={pending || uploading !== null}>
              {pending ? "Сохранение..." : "Сохранить настройки"}
            </button>
          </div>
        </form>

        <aside className="admin-settings-side">
          <section className="admin-settings-preview">
            <p className="admin-settings-card__eyebrow">Превью</p>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="admin-settings-preview__logo" />
            ) : (
              <h2 className="admin-settings-preview__brand">ESTETIC FRIEND</h2>
            )}
            <p className="admin-settings-preview__tagline">
              {tagline.trim() || defaults.tagline}
            </p>
            <div className="admin-settings-preview__contacts">
              <a
                href={phoneHref(phone.trim() || defaults.phone)}
                className="admin-settings-preview__row"
              >
                <span>Телефон</span>
                <strong>{phone.trim() || defaults.phone}</strong>
              </a>
              <a
                href={`mailto:${email.trim() || defaults.email}`}
                className="admin-settings-preview__row"
              >
                <span>Email</span>
                <strong>{email.trim() || defaults.email}</strong>
              </a>
              <div className="admin-settings-preview__row">
                <span>Города</span>
                <strong>{cities.trim() || defaults.cities}</strong>
              </div>
            </div>
            <p className="admin-settings-preview__about">
              {(about.trim() || defaults.about).slice(0, 180)}
              {(about.trim() || defaults.about).length > 180 ? "…" : ""}
            </p>
          </section>

          <section className="admin-settings-card admin-settings-card--compact">
            <p className="admin-settings-card__eyebrow">Статус</p>
            <div className="admin-stock-strip admin-stock-strip--settings">
              <div>
                <span className="admin-stock-strip__label">Полей</span>
                <strong>{filled}/6</strong>
              </div>
              <div>
                <span className="admin-stock-strip__label">Бренд</span>
                <strong>{logoUrl || faviconUrl ? "OK" : "—"}</strong>
              </div>
            </div>
            <ul className="admin-settings-links">
              <li>
                <Link href="/admin/home">Текст героя главной →</Link>
              </li>
              <li>
                <Link href="/admin/integrations">AmoCRM и интеграции →</Link>
              </li>
              <li>
                <Link href="/admin/pages">Статические страницы →</Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
