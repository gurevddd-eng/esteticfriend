import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Оформление заказа косметологического оборудования через заявку",
};

export default function CartPage() {
  return (
    <div className="section-pad">
      <div className="container-shell">
        <h1 className="section-title">Корзина</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Оформление без онлайн-оплаты: оставьте заявку — менеджер подтвердит наличие и
          условия поставки.
        </p>
        <div className="mt-10">
          <CartView />
        </div>
      </div>
    </div>
  );
}
