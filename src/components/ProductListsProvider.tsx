"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SavedProduct = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  shortDesc: string | null;
  categoryName: string | null;
  inStock: boolean;
};

type ListContextValue = {
  items: SavedProduct[];
  ready: boolean;
  count: number;
  has: (productId: string) => boolean;
  toggle: (item: SavedProduct) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
};

const COMPARE_LIMIT = 4;

function createListProvider(storageKey: string, maxItems?: number) {
  const Context = createContext<ListContextValue | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<SavedProduct[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) setItems(JSON.parse(raw) as SavedProduct[]);
      } catch {
        /* ignore */
      }
      setReady(true);
    }, []);

    useEffect(() => {
      if (!ready) return;
      localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, ready]);

    const has = useCallback(
      (productId: string) => items.some((item) => item.productId === productId),
      [items],
    );

    const toggle = useCallback((item: SavedProduct) => {
      let nowPresent = false;
      setItems((prev) => {
        const exists = prev.some((p) => p.productId === item.productId);
        if (exists) {
          nowPresent = false;
          return prev.filter((p) => p.productId !== item.productId);
        }
        nowPresent = true;
        if (maxItems && prev.length >= maxItems) {
          return [...prev.slice(1), item];
        }
        return [...prev, item];
      });
      return nowPresent;
    }, []);

    const remove = useCallback((productId: string) => {
      setItems((prev) => prev.filter((p) => p.productId !== productId));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const value = useMemo(
      () => ({
        items,
        ready,
        count: items.length,
        has,
        toggle,
        remove,
        clear,
      }),
      [items, ready, has, toggle, remove, clear],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useList(hookName: string) {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`${hookName} must be used within its provider`);
    return ctx;
  }

  return { Provider, useList };
}

const favoritesApi = createListProvider("sevens_favorites_v1");
const compareApi = createListProvider("sevens_compare_v1", COMPARE_LIMIT);

export const FavoritesProvider = favoritesApi.Provider;
export const CompareProvider = compareApi.Provider;

export function useFavorites() {
  return favoritesApi.useList("useFavorites");
}

export function useCompare() {
  return compareApi.useList("useCompare");
}

export const COMPARE_MAX = COMPARE_LIMIT;

export function toSavedProduct(product: {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price?: number | null;
  shortDesc?: string | null;
  inStock?: boolean;
  category?: { name: string } | null;
}): SavedProduct {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price ?? null,
    shortDesc: product.shortDesc ?? null,
    categoryName: product.category?.name ?? null,
    inStock: product.inStock ?? true,
  };
}
