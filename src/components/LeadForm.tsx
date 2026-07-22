"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  source?: string;
  productId?: string;
  productName?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function LeadForm({
  source = "site",
  productId,
  productName,
  compact = false,
  onSuccess,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!agree) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: productName
            ? `Интерес к аппарату: ${productName}${message ? `. ${message}` : ""}`
            : message || undefined,
          source,
          productId,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      setName("");
      setPhone("");
      setMessage("");
      setAgree(false);
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-accent-soft p-6 text-navy">
        <p className="font-[family-name:var(--font-syne)] text-xl font-bold">
          Заявка отправлена
        </p>
        <p className="mt-2 text-sm text-muted">
          Мы свяжемся с вами в ближайшее время и подберём оборудование.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
            Имя
          </span>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
            Телефон
          </span>
          <input
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 999-99-99"
            required
          />
        </label>
      </div>

      {!compact ? (
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
            Вопрос
          </span>
          <textarea
            className="input-field min-h-24 resize-y"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Расскажите, какое оборудование ищете"
          />
        </label>
      ) : null}

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-1"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
        />
        <span>
          Заполняя форму, я соглашаюсь на обработку и хранение персональных данных
        </span>
      </label>

      <button
        type="submit"
        className="btn-primary w-full sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Отправляем..." : "Отправить заявку"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-600">
          Не удалось отправить. Попробуйте ещё раз или позвоните нам.
        </p>
      ) : null}
    </form>
  );
}
