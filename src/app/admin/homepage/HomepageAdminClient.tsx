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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      await saveHomepage(JSON.stringify(home));
      setMessage("Главная страница сохранена");
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
    <form onSubmit={onSubmit} className="space-y-8">
      <AdminPageHeader
        title="Главная страница"
        description="Редактируйте тексты и блоки главной. Хиты, категории и отзывы берутся из соответствующих разделов."
        actions={
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? "Сохраняем..." : "Сохранить"}
          </button>
        }
      />
      {message ? <p className="text-sm text-[#b53d4a]">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <section className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">Hero</h2>
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
          <label key={key} className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">{label}</span>
            {key === "text" ? (
              <textarea
                className="input-field min-h-24"
                value={home.hero[key]}
                onChange={(e) =>
                  setHome((prev) => ({ ...prev, hero: { ...prev.hero, [key]: e.target.value } }))
                }
              />
            ) : (
              <input
                className="input-field"
                value={home.hero[key]}
                onChange={(e) =>
                  setHome((prev) => ({ ...prev, hero: { ...prev.hero, [key]: e.target.value } }))
                }
              />
            )}
          </label>
        ))}
      </section>

      <section className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Промо-баннеры
          </h2>
          <button type="button" className="btn-outline !min-h-9 !text-sm" onClick={() => addListItem("promos")}>
            Добавить
          </button>
        </div>
        {home.promos.map((promo, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-[var(--line)] p-4">
            <div className="flex justify-between">
              <p className="text-xs font-bold text-muted uppercase">Баннер {index + 1}</p>
              <button
                type="button"
                className="text-sm font-semibold text-azure"
                onClick={() => removeListItem("promos", index)}
              >
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
              <label key={key} className="block">
                <span className="mb-1.5 block text-xs font-bold text-muted uppercase">{label}</span>
                {key === "text" ? (
                  <textarea
                    className="input-field min-h-20"
                    value={promo[key]}
                    onChange={(e) => updatePromo(index, { [key]: e.target.value })}
                  />
                ) : (
                  <input
                    className="input-field"
                    value={promo[key]}
                    onChange={(e) => updatePromo(index, { [key]: e.target.value })}
                  />
                )}
              </label>
            ))}
          </div>
        ))}
      </section>

      {(
        [
          ["hits", "Блок хитов", { kicker: "Надзаголовок", title: "Заголовок", ctaLabel: "Текст кнопки" }],
          ["categories", "Блок категорий", { kicker: "Надзаголовок", title: "Заголовок", ctaLabel: "Текст кнопки" }],
          ["reviews", "Блок отзывов", { kicker: "Надзаголовок", title: "Заголовок" }],
        ] as const
      ).map(([key, title, labels]) => (
        <section
          key={key}
          className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            {title}
          </h2>
          {Object.entries(home[key]).map(([field, value]) => (
            <label key={field} className="block">
              <span className="mb-1.5 block text-xs font-bold text-muted uppercase">
                {labels[field as keyof typeof labels] || field}
              </span>
              <input
                className="input-field"
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
        </section>
      ))}

      <section className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Менеджеры
          </h2>
          <button
            type="button"
            className="btn-outline !min-h-9 !text-sm"
            onClick={() => addListItem("managers")}
          >
            Добавить
          </button>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Надзаголовок</span>
          <input
            className="input-field"
            value={home.managers.kicker}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                managers: { ...prev.managers, kicker: e.target.value },
              }))
            }
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Заголовок</span>
          <input
            className="input-field"
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
          <div key={index} className="grid gap-3 rounded-xl border border-[var(--line)] p-4 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className="input-field"
              value={item.name}
              placeholder="Имя"
              onChange={(e) => updateListItem("managers", index, { name: e.target.value })}
            />
            <input
              className="input-field"
              value={item.role}
              placeholder="Роль"
              onChange={(e) => updateListItem("managers", index, { role: e.target.value })}
            />
            <button
              type="button"
              className="text-sm font-semibold text-azure"
              onClick={() => removeListItem("managers", index)}
            >
              Удалить
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
            Преимущества
          </h2>
          <button
            type="button"
            className="btn-outline !min-h-9 !text-sm"
            onClick={() => addListItem("advantages")}
          >
            Добавить
          </button>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Надзаголовок</span>
          <input
            className="input-field"
            value={home.advantages.kicker}
            onChange={(e) =>
              setHome((prev) => ({
                ...prev,
                advantages: { ...prev.advantages, kicker: e.target.value },
              }))
            }
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-muted uppercase">Заголовок</span>
          <input
            className="input-field"
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
          <div key={index} className="space-y-3 rounded-xl border border-[var(--line)] p-4">
            <div className="flex justify-between">
              <p className="text-xs font-bold text-muted uppercase">Пункт {index + 1}</p>
              <button
                type="button"
                className="text-sm font-semibold text-azure"
                onClick={() => removeListItem("advantages", index)}
              >
                Удалить
              </button>
            </div>
            <input
              className="input-field"
              value={item.title}
              placeholder="Заголовок"
              onChange={(e) => updateListItem("advantages", index, { title: e.target.value })}
            />
            <textarea
              className="input-field min-h-20"
              value={item.text}
              placeholder="Текст"
              onChange={(e) => updateListItem("advantages", index, { text: e.target.value })}
            />
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-5">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
          Блок заявки
        </h2>
        {(
          [
            ["kicker", "Надзаголовок"],
            ["title", "Заголовок"],
            ["text", "Текст"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-xs font-bold text-muted uppercase">{label}</span>
            {key === "text" || key === "title" ? (
              <textarea
                className="input-field min-h-20"
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
                className="input-field"
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
      </section>

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Сохраняем..." : "Сохранить главную"}
      </button>
    </form>
  );
}
