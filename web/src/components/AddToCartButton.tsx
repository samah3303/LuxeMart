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
            ? 'bg-[#2f7a54] text-white'
            : 'bg-[#183d2f] hover:bg-[#102c23] text-[#f5f6f1] active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check size={14} className="text-[#baf2cd]" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingBag size={14} className="text-[#baf2cd]" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {showBuyNow && (
        <button
          onClick={handleBuyNow}
          className="flex-1 min-h-[36px] py-2 px-3 rounded-lg font-bold text-xs tracking-wide bg-[#2f7a54] hover:bg-[#183d2f] text-white flex items-center justify-center gap-1 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <Zap size={14} className="text-[#baf2cd]" />
          <span>Buy Now &rarr;</span>
        </button>
      )}
    </div>
  );
}
