'use client';

import React, { useState } from 'react';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  showBuyNow?: boolean;
}

export function AddToCartButton({ product, showBuyNow = false }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
      <button
        onClick={handleAdd}
        className={`flex-1 min-h-[36px] py-2 px-3 rounded-lg font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
          added
            ? 'bg-emerald-700 text-white'
            : 'bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check size={14} className="text-emerald-300" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingBag size={14} className="text-amber-300" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {showBuyNow && (
        <button
          onClick={handleBuyNow}
          className="flex-1 min-h-[36px] py-2 px-3 rounded-lg font-bold text-xs tracking-wide bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white flex items-center justify-center gap-1 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <Zap size={14} className="text-amber-200" />
          <span>Buy Now &rarr;</span>
        </button>
      )}
    </div>
  );
}
