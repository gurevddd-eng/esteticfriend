"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveHomepage } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/ui";
import type { HomepageContent } from "@/lib/site";

export function HomepageAdminClient({ initial }: { initial: HomepageContent }) {
  const router = useRouter();
  const [home, setHome] = useState<HomepageContent>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      await saveHomepage(JSON.stringify(home));
      setMessage("Главная страница сохранена");
      setPreviewKey((k) => k + 1);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setPending(false);
    }
  }

  function updatePromo(index: number, patch: Partial<HomepageContent["promos"][number]>) {
    setHome((prev) => ({
      ...prev,
      promos: prev.promos.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateListItem<K extends "managers" | "advantages">(
    section: K,
    index: number,
    patch: Partial<HomepageContent[K]["items"][number]>,
  ) {
    setHome((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: prev[section].items.map((item, i) =>
          i === index ? { ...item, ...patch } : item,
        ),
      },
    }));
  }

  function addListItem(section: "managers" | "advantages" | "promos") {
    setHome((prev) => {
      if (section === "promos") {
        return {
          ...prev,
          promos: [...prev.promos, { title: "Новый баннер", text: "", cta: "Подробнее", href: "/#consult" }],
        };
      }
      if (section === "managers") {
        return {
          ...prev,
          managers: {
            ...prev.managers,
            items: [...prev.managers.items, { name: "Имя", role: "Менеджер" }],
          },
        };
      }
      return {
        ...prev,
        advantages: {
          ...prev.advantages,
          items: [...prev.advantages.items, { title: "Заголовок", text: "Описание" }],
        },
      };
    });
  }

  function removeListItem(section: "managers" | "advantages" | "promos", index: number) {
    setHome((prev) => {
      if (section === "promos") {
        return { ...prev, promos: prev.promos.filter((_, i) => i !== index) };
      }
      if (section === "managers") {
        return {
          ...prev,
          managers: {
            ...prev.managers,
            items: prev.managers.items.filter((_, i) => i !== index),
          },
        };
      }
      return {
        ...prev,
        advantages: {
          ...prev.advantages,
          items: prev.advantages.items.filter((_, i) => i !== index),
        },
      };
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title="Главная страница"
        description="Редактор слева, живой превью сайта справа. Сохраните, чтобы обновить превью."
        actions={
          <>
            <a href="/" target="_blank" className="ea-btn ea-btn--secondary">
              Открыть сайт
            </a>
            <button type="submit" className="ea-btn ea-btn--primary" disabled={pending}>
              {pending ? "Сохраняем..." : "Сохранить"}
            </button>
          </>
        }
      />
      {message ? <p style={{ color: "var(--ea-ok)", fontWeight: 700 }}>{message}</p> : null}
      {error ? <p style={{ color: "var(--ea-danger)", fontWeight: 700 }}>{error}</p> : null}

      <div className="ea-split">
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <section className="ea-panel" style={{ padding: "1rem" }}>
            <h2 className="ea-panel__title">Hero</h2>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
              {(
                [
                  ["brand", "Бренд"],
                  ["title", "Заголовок"],
                  ["text", "Текст"],
                  ["primaryCtaLabel", "Кнопка 1 — текст"],
                  ["primaryCtaHref", "Кнопка 1 — ссылка"],
                  ["secondaryCtaLabel", "Кнопка 2 — текст"],
                  ["secondaryCtaHref", "Кнопка 2 — ссылка"],
                  ["videoSrc", "Видео (путь)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <span className="ea-label">{label}</span>
                  {key === "text" ? (
                    <textarea
                      className="ea-textarea"
                      value={home.hero[key]}
                      onChange={(e) =>
                        setHome((prev) => ({ ...prev, hero: { ...prev.hero, [key]: e.target.value } }))
                      }
                    />
                  ) : (
                    <input
                      className="ea-input"
                      value={home.hero[key]}
                      onChange={(e) =>
                        setHome((prev) => ({ ...prev, hero: { ...prev.hero, [key]: e.target.value } }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          </section>

          <section className="ea-panel" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
              <h2 className="ea-panel__title">Промо-баннеры</h2>
              <button type="button" className="ea-btn ea-btn--secondary ea-btn--sm" onClick={() => addListItem("promos")}>
                Добавить
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
              {home.promos.map((promo, index) => (
                <div key={index} className="ea-panel" style={{ padding: "0.85rem", background: "var(--ea-panel-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p className="ea-label" style={{ margin: 0 }}>Баннер {index + 1}</p>
                    <button type="button" className="ea-btn ea-btn--ghost ea-btn--sm" onClick={() => removeListItem("promos", index)}>
                      Удалить
                    </button>
                  </div>
                  {(
                    [
                      ["title", "Заголовок"],
                      ["text", "Текст"],
                      ["cta", "Кнопка"],
                      ["href", "Ссылка"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} style={{ display: "block", marginTop: "0.55rem" }}>
                      <span className="ea-label">{label}</span>
                      {key === "text" ? (
                        <textarea
                          className="ea-textarea"
                          value={promo[key]}
                          onChange={(e) => updatePromo(index, { [key]: e.target.value })}
                        />
                      ) : (
                        <input
                          className="ea-input"
                          value={promo[key]}
                          onChange={(e) => updatePromo(index, { [key]: e.target.value })}
                        />
                      )}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {(
            [
              ["hits", "Блок хитов", { kicker: "Надзаголовок", title: "Заголовок", ctaLabel: "Текст кнопки" }],
              ["categories", "Блок категорий", { kicker: "Надзаголовок", title: "Заголовок", ctaLabel: "Текст кнопки" }],
              ["reviews", "Блок отзывов", { kicker: "Надзаголовок", title: "Заголовок" }],
            ] as const
          ).map(([key, title, labels]) => (
            <section key={key} className="ea-panel" style={{ padding: "1rem" }}>
              <h2 className="ea-panel__title">{title}</h2>
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
                {Object.entries(home[key]).map(([field, value]) => (
                  <label key={field}>
                    <span className="ea-label">{labels[field as keyof typeof labels] || field}</span>
                    <input
                      className="ea-input"
                      value={String(value)}
                      onChange={(e) =>
                        setHome((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], [field]: e.target.value },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <section className="ea-panel" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
              <h2 className="ea-panel__title">Менеджеры</h2>
              <button type="button" className="ea-btn ea-btn--secondary ea-btn--sm" onClick={() => addListItem("managers")}>
                Добавить
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
              <label>
                <span className="ea-label">Надзаголовок</span>
                <input
                  className="ea-input"
                  value={home.managers.kicker}
                  onChange={(e) =>
                    setHome((prev) => ({
                      ...prev,
                      managers: { ...prev.managers, kicker: e.target.value },
                    }))
                  }
                />
              </label>
              <label>
                <span className="ea-label">Заголовок</span>
                <input
                  className="ea-input"
                  value={home.managers.title}
                  onChange={(e) =>
                    setHome((prev) => ({
                      ...prev,
                      managers: { ...prev.managers, title: e.target.value },
                    }))
                  }
                />
              </label>
              {home.managers.items.map((item, index) => (
                <div key={index} style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr auto" }}>
                  <input
                    className="ea-input"
                    value={item.name}
                    placeholder="Имя"
                    onChange={(e) => updateListItem("managers", index, { name: e.target.value })}
                  />
                  <input
                    className="ea-input"
                    value={item.role}
                    placeholder="Роль"
                    onChange={(e) => updateListItem("managers", index, { role: e.target.value })}
                  />
                  <button type="button" className="ea-btn ea-btn--ghost ea-btn--sm" onClick={() => removeListItem("managers", index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="ea-panel" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
              <h2 className="ea-panel__title">Преимущества</h2>
              <button type="button" className="ea-btn ea-btn--secondary ea-btn--sm" onClick={() => addListItem("advantages")}>
                Добавить
              </button>
            </div>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
              <label>
                <span className="ea-label">Надзаголовок</span>
                <input
                  className="ea-input"
                  value={home.advantages.kicker}
                  onChange={(e) =>
                    setHome((prev) => ({
                      ...prev,
                      advantages: { ...prev.advantages, kicker: e.target.value },
                    }))
                  }
                />
              </label>
              <label>
                <span className="ea-label">Заголовок</span>
                <input
                  className="ea-input"
                  value={home.advantages.title}
                  onChange={(e) =>
                    setHome((prev) => ({
                      ...prev,
                      advantages: { ...prev.advantages, title: e.target.value },
                    }))
                  }
                />
              </label>
              {home.advantages.items.map((item, index) => (
                <div key={index} className="ea-panel" style={{ padding: "0.85rem", background: "var(--ea-panel-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p className="ea-label" style={{ margin: 0 }}>Пункт {index + 1}</p>
                    <button type="button" className="ea-btn ea-btn--ghost ea-btn--sm" onClick={() => removeListItem("advantages", index)}>
                      Удалить
                    </button>
                  </div>
                  <input
                    className="ea-input"
                    style={{ marginTop: "0.55rem" }}
                    value={item.title}
                    placeholder="Заголовок"
                    onChange={(e) => updateListItem("advantages", index, { title: e.target.value })}
                  />
                  <textarea
                    className="ea-textarea"
                    style={{ marginTop: "0.55rem" }}
                    value={item.text}
                    placeholder="Текст"
                    onChange={(e) => updateListItem("advantages", index, { text: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="ea-panel" style={{ padding: "1rem" }}>
            <h2 className="ea-panel__title">Блок заявки</h2>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
              {(
                [
                  ["kicker", "Надзаголовок"],
                  ["title", "Заголовок"],
                  ["text", "Текст"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <span className="ea-label">{label}</span>
                  {key === "text" || key === "title" ? (
                    <textarea
                      className="ea-textarea"
                      value={home.consult[key]}
                      onChange={(e) =>
                        setHome((prev) => ({
                          ...prev,
                          consult: { ...prev.consult, [key]: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    <input
                      className="ea-input"
                      value={home.consult[key]}
                      onChange={(e) =>
                        setHome((prev) => ({
                          ...prev,
                          consult: { ...prev.consult, [key]: e.target.value },
                        }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          </section>

          <button type="submit" className="ea-btn ea-btn--primary" disabled={pending}>
            {pending ? "Сохраняем..." : "Сохранить главную"}
          </button>
        </div>

        <div className="ea-preview">
          <div className="ea-preview__bar">
            <span>Live preview · главная</span>
            <button type="button" className="ea-btn ea-btn--ghost ea-btn--sm" onClick={() => setPreviewKey((k) => k + 1)}>
              Обновить
            </button>
          </div>
          <iframe key={previewKey} src={`/?preview=${previewKey}`} title="Превью главной" />
        </div>
      </div>
    </form>
  );
}
