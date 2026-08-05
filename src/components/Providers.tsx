"use client";

import { CartProvider } from "@/components/CartProvider";
import {
  CompareProvider,
  FavoritesProvider,
} from "@/components/ProductListsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <CompareProvider>{children}</CompareProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}
