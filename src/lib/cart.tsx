import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Product } from "@/lib/products";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageKey: string;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "buxmart.cart.v1";
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 6.99;

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          imageKey: product.image_key,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        const next = Math.min(Math.max(quantity, 0), item.stock);
        return next <= 0 ? [] : [{ ...item, quantity: next }];
      }),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [items, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };
