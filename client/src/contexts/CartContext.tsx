// AirFiltersDirect — Cart Context
// Persists to sessionStorage (current browser session only)
// Provides cart CRUD, totals, HST, and navigation helpers

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Product, FilterSize } from '@/lib/products';

export const HST_RATE = 0.13; // 13% Ontario HST
export const DELIVERY_CHARGE = 12.00; // $12 flat delivery fee
const STORAGE_KEY = 'afd_cart_v1';

export type CartItem = {
  id: string;
  product: Product;
  size: FilterSize;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, size: FilterSize, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  hst: number;
  delivery: number;
  total: number;
  lastAdded: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

function loadFromSession(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveToSession(items: CartItem[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable — fail silently
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromSession());
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  // Sync to sessionStorage whenever items change
  useEffect(() => {
    saveToSession(items);
  }, [items]);

  const addItem = useCallback((product: Product, size: FilterSize, quantity: number) => {
    const itemId = `${product.id}-${size.label}`;
    setItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) {
        return prev.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { id: itemId, product, size, quantity }];
    });
    setLastAdded(itemId);
    setTimeout(() => setLastAdded(null), 400);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.size.price * i.quantity, 0);
  const hst = subtotal * HST_RATE;
  const delivery = items.length > 0 ? DELIVERY_CHARGE : 0;
  const total = subtotal + hst + delivery;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal, hst, delivery, total, lastAdded,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
