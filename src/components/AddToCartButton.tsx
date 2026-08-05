"use client";

import { useCart } from "@/components/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string | null;
  };
  className?: string;
  label?: string;
  compact?: boolean;
};

export function AddToCartButton({
  product,
  className = "btn-primary",
  label = "В корзину",
  compact = false,
}: Props) {
  const { items, ready, addItem, setQuantity } = useCart();
  const cartItem = items.find((item) => item.productId === product.id);

  if (ready && cartItem) {
    return (
      <QuantityStepper
        quantity={cartItem.quantity}
        label={`Количество: ${product.name}`}
        compact={compact}
        onDecrease={() => setQuantity(product.id, cartItem.quantity - 1)}
        onIncrease={() => setQuantity(product.id, cartItem.quantity + 1)}
      />
    );
  }

  return (
    <button
      type="button"
      className={className}
      disabled={!ready}
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
        })
      }
    >
      {label}
    </button>
  );
}
