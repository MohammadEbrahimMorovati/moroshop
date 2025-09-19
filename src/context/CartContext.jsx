import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ذخیره در localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // افزودن محصول
  const addItem = (product, quantity = 1) => {
    let added = false;
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id
            ? {
                ...it,
                quantity: Math.min(it.quantity + quantity, product.stock ?? 99),
              }
            : it
        );
      }
      added = true;
      return [...prev, { product, quantity }];
    });
    return added; // برای نمایش toast در UI
  };

  // حذف محصول
  const removeItem = (productId) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  // آپدیت تعداد
  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((it) =>
        it.product.id === productId
          ? {
              ...it,
              quantity: Math.max(1, Math.min(quantity, it.product.stock ?? 99)),
            }
          : it
      )
    );
  };

  // پاک کردن کل سبد
  const clear = () => setItems([]);

  // محاسبه totals
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, it) => sum + it.product.price * it.quantity,
      0
    );
    const itemCount = items.length;
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    return { subtotal, itemCount, totalItems };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear, totals }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
