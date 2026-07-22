"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";

export function CartView() {
  const { items, ready, setQuantity, removeItem, clear, count } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!agree || items.length === 0) return;
    setStatus("loading");

    const itemsList = items
      .map((item) => `${item.name} × ${item.quantity}`)
      .join("; ");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: [
            `Заказ из корзины: ${itemsList}`,
            message ? `Комментарий: ${message}` : null,
          ]
            .filter(Boolean)
            .join(". "),
          source: "cart",
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error("failed");
      clear();
      setStatus("ok");
      setName("");
      setPhone("");
      setMessage("");
      setAgree(false);
    } catch {
      setStatus("error");
    }
  }

  if (!ready) {
    return <p className="text-muted">Загрузка корзины...</p>;
  }

  if (status === "ok") {
    return (
      <div className="max-w-xl rounded-[1.4rem] border border-[var(--line)] bg-accent-soft p-8 text-navy">
        <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold">
          Заявка отправлена
        </h2>
        <p className="mt-3 text-sm text-muted">
          Менеджер свяжется с вами, чтобы подтвердить заказ и условия поставки.
        </p>
        <Link href="/catalog" className="btn-primary mt-6 inline-flex">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-[var(--line)] bg-white p-8">
        <p className="text-navy">Корзина пуста.</p>
        <Link href="/catalog" className="btn-primary mt-5 inline-flex">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <p className="text-sm font-semibold text-muted">Позиций: {count}</p>
        {items.map((item) => (
          <article
            key={item.productId}
            className="flex flex-col gap-4 rounded-[1.2rem] border border-[var(--line)] bg-white p-4 sm:flex-row sm:items-center"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-pearl sm:mx-0"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              ) : (
                <span className="device-silhouette !opacity-40" />
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${item.slug}`}
                className="font-[family-name:var(--font-syne)] text-lg font-bold text-navy"
              >
                {item.name}
              </Link>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <QuantityStepper
                  quantity={item.quantity}
                  label={`Количество: ${item.name}`}
                  disableAtOne
                  onDecrease={() => setQuantity(item.productId, item.quantity - 1)}
                  onIncrease={() => setQuantity(item.productId, item.quantity + 1)}
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-muted transition hover:text-azure"
                  onClick={() => removeItem(item.productId)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="h-fit rounded-[1.4rem] border border-[var(--line)] bg-white p-6">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
          Оформить заказ
        </h2>
        <p className="mt-2 mb-5 text-sm text-muted">
          Отправим заявку менеджеру со списком выбранных аппаратов.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
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
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">
              Комментарий
            </span>
            <textarea
              className="input-field min-h-24 resize-y"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Город, сроки, вопросы по комплектации"
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-1"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <span>
              Согласен(а) на{" "}
              <Link href="/privacy" className="text-azure underline">
                обработку персональных данных
              </Link>
            </span>
          </label>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Отправляем..." : "Отправить заказ"}
          </button>
          {status === "error" ? (
            <p className="text-sm text-red-600">
              Не удалось отправить. Попробуйте ещё раз или позвоните нам.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
