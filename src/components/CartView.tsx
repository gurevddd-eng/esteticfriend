"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { PageFormPanel } from "@/components/PageFormPanel";
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
      <div className="page-empty">
        <h2 className="page-empty__title">Заявка отправлена</h2>
        <p className="page-empty__text">
          Менеджер свяжется с вами, чтобы подтвердить заказ и условия поставки.
        </p>
        <div className="page-empty__actions">
          <Link href="/catalog" className="btn-primary">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-empty">
        <h2 className="page-empty__title">Корзина пуста</h2>
        <p className="page-empty__text">
          Добавьте аппараты из каталога — оформим заказ заявкой без онлайн-оплаты.
        </p>
        <div className="page-empty__actions">
          <Link href="/catalog" className="btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div>
        <p className="section-kicker">Позиций: {count}</p>
        <div className="cart-list">
          {items.map((item) => (
            <article key={item.productId} className="cart-row">
              <Link href={`/product/${item.slug}`} className="cart-row__media">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="88px"
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="device-silhouette !opacity-40" />
                )}
              </Link>

              <div className="min-w-0">
                <Link href={`/product/${item.slug}`} className="cart-row__name">
                  {item.name}
                </Link>
                <div className="cart-row__meta">
                  <QuantityStepper
                    quantity={item.quantity}
                    label={`Количество: ${item.name}`}
                    disableAtOne
                    onDecrease={() => setQuantity(item.productId, item.quantity - 1)}
                    onIncrease={() => setQuantity(item.productId, item.quantity + 1)}
                  />
                  <button
                    type="button"
                    className="cart-row__remove"
                    onClick={() => removeItem(item.productId)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <PageFormPanel
        title="Оформить заказ"
        lead="Отправим заявку менеджеру со списком выбранных аппаратов."
      >
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
      </PageFormPanel>
    </div>
  );
}
