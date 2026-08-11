"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveHomeContent } from "@/actions/admin";
import { AdminModal } from "@/components/AdminModal";

const RELATED = [
  { href: "/admin/slides", title: "Слайды", text: "Карусель акций" },
  { href: "/admin/promos", title: "Промо", text: "Баннеры под слайдером" },
  { href: "/admin/faq", title: "FAQ", text: "Частые вопросы" },
  { href: "/admin/brands", title: "Бренды", text: "Раздел /brands и привязка к товарам" },
  { href: "/admin/advantages", title: "Преимущества", text: "Почему выбирают" },
] as const;

export function HomeAdminClient({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const heroTitle = settings.heroTitle || "Косметологические аппараты";
  const heroTitleLine = settings.heroTitleLine || "для салонов красоты";
  const heroText =
    settings.heroText ||
    "Более 1000 специалистов уже работают на подобном оборудовании. Подберём аппарат под задачи вашего кабинета.";
  const heroCtaPrimary = settings.heroCtaPrimary || "Перейти в каталог";
  const heroCtaSecondary = settings.heroCtaSecondary || "Получить консультацию";
  const tagline =
    settings.tagline || "Профессиональное косметическое оборудование";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    await saveHomeContent({
      heroTitle: String(fd.get("heroTitle") || ""),
      heroTitleLine: String(fd.get("heroTitleLine") || ""),
      heroText: String(fd.get("heroText") || ""),
      heroCtaPrimary: String(fd.get("heroCtaPrimary") || ""),
      heroCtaSecondary: String(fd.get("heroCtaSecondary") || ""),
      tagline: String(fd.get("tagline") || ""),
    });
    setPending(false);
    setMessage("Сохранено");
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-page__kicker">Главная страница</p>
          <h1 className="admin-page__title">Герой</h1>
          <p className="admin-page__lead">
            Первый экран лендинга. Остальные блоки главной — в соседних разделах меню.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
            Редактировать герой
          </button>
        </div>
      </header>

      {message ? <p className="admin-toast">{message}</p> : null}

      <section className="admin-hero-preview">
        <div className="admin-hero-preview__meta">
          <span className="admin-status is-live">На сайте</span>
          <p className="admin-hero-preview__tagline">{tagline}</p>
        </div>
        <h2 className="admin-hero-preview__title">
          {heroTitle}
          <span>{heroTitleLine}</span>
        </h2>
        <p className="admin-hero-preview__text">{heroText}</p>
        <div className="admin-hero-preview__ctas">
          <span className="admin-chip">{heroCtaPrimary}</span>
          <span className="admin-chip admin-chip--ghost">{heroCtaSecondary}</span>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="admin-panel__title">Блоки главной</h3>
        </div>
        <div className="admin-related-grid">
          {RELATED.map((item) => (
            <Link key={item.href} href={item.href} className="admin-related-card">
              <span className="admin-related-card__title">{item.title}</span>
              <span className="admin-related-card__text">{item.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title="Редактировать герой"
        description="Текст и кнопки первого экрана"
        wide
      >
        <form key={String(open)} onSubmit={onSubmit} className="admin-modal-form">
          <label className="admin-field">
            <span>Заголовок</span>
            <input name="heroTitle" className="input-field" defaultValue={heroTitle} />
          </label>
          <label className="admin-field">
            <span>Вторая строка</span>
            <input name="heroTitleLine" className="input-field" defaultValue={heroTitleLine} />
          </label>
          <label className="admin-field">
            <span>Текст</span>
            <textarea name="heroText" className="input-field min-h-28" defaultValue={heroText} />
          </label>
          <div className="admin-modal-form__row">
            <label className="admin-field">
              <span>Кнопка каталога</span>
              <input
                name="heroCtaPrimary"
                className="input-field"
                defaultValue={heroCtaPrimary}
              />
            </label>
            <label className="admin-field">
              <span>Кнопка консультации</span>
              <input
                name="heroCtaSecondary"
                className="input-field"
                defaultValue={heroCtaSecondary}
              />
            </label>
          </div>
          <label className="admin-field">
            <span>Слоган</span>
            <input name="tagline" className="input-field" defaultValue={tagline} />
          </label>
          <div className="admin-modal-form__actions">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
