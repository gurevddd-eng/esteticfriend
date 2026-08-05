import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Оформление заказа косметологического оборудования через заявку",
};

export default function CartPage() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">Заказ</p>
        <h1 className="section-title mt-3">Корзина</h1>
        <p className="page__lead">
          Оформление без онлайн-оплаты: оставьте заявку — менеджер подтвердит наличие и
          условия поставки.
        </p>
      </header>
      <CartView />
    </div>
  );
}
