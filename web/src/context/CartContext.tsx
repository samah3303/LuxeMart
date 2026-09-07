'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number | string; image: string }, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  prepaidDiscount: number;
  shippingFee: number;
  totalItems: number;
  isPrepaid: boolean;
  setIsPrepaid: (val: boolean) => void;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isPrepaid, setIsPrepaid] = useState<boolean>(true); // Default to prepaid to encourage online payment
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('goodfinds_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('goodfinds_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart', e);
      }
    }
  }, [items, mounted]);

  const addItem = (product: { id: string; name: string; price: number | string; image: string }, quantity = 1) => {
    const numPrice = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, price: numPrice, image: product.image, quantity }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingFee = subtotal > 499 || subtotal === 0 ? 0 : 79;
  
  // Flat ₹70 Instant UPI Discount for prepaid orders over ₹499
  const prepaidDiscount = isPrepaid && subtotal >= 499 ? 70 : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee - prepaidDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        prepaidDiscount,
        shippingFee,
        totalItems,
        isPrepaid,
        setIsPrepaid,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
