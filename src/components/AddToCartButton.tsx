"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string | null;
  };
  className?: string;
  label?: string;
};

export function AddToCartButton({
  product,
  className = "btn-primary",
  label = "В корзину",
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function onClick() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {added ? "Добавлено" : label}
    </button>
  );
}
