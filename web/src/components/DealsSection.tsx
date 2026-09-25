'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Star, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: { name: string } | null;
}

export function DealsSection({ products }: { products: ProductItem[] }) {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Take first 5 products as featured deals
  const dealProducts = products.slice(0, 5);

  return (
    <div className="w-full bg-white rounded-2xl border border-[#dfe3dd] p-3.5 sm:p-5 shadow-xs space-y-4">
      {/* Header with Title, Timer & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dfe3dd] pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-black text-[#182018] tracking-tight">
              Deals of the Day
            </h3>
            <p className="text-[11px] text-[#687068] font-light">
              Limited-time discounts sourced direct from verified manufacturers
            </p>
          </div>

          {/* Flipkart-style Countdown Timer */}
          <div className="flex items-center gap-1.5 bg-[#ff745e]/10 text-[#182018] px-2.5 py-1 rounded-lg border border-[#ff745e]/25">
            <Clock size={13} className="text-[#ff745e]" />
            <span className="text-[10px] font-bold text-[#687068]">Ends in:</span>
            <div className="flex items-center gap-0.5 font-mono text-xs font-black text-[#ff745e]">
              <span>{formatNumber(timeLeft.hours)}h</span>
              <span>:</span>
              <span>{formatNumber(timeLeft.minutes)}m</span>
              <span>:</span>
              <span>{formatNumber(timeLeft.seconds)}s</span>
            </div>
          </div>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#183d2f] hover:text-[#2f7a54] self-start sm:self-center bg-[#f5f6f1] hover:bg-[#e8ece5] px-3 py-1.5 rounded-lg border border-[#dfe3dd] transition"
        >
          <span>VIEW ALL</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Horizontal Rail of Deals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {dealProducts.map((p) => {
          const retail = p.price;
          const original = Math.round(retail * 1.6);
          const discount = Math.round(((original - retail) / original) * 100);

          return (
            <div
              key={p.id}
              className="group flex flex-col justify-between rounded-xl p-2.5 sm:p-3 border border-[#dfe3dd] hover:border-[#2f7a54] hover:shadow-md transition-all bg-white relative"
            >
              <div>
                <Link href={`/products/${p.id}`} className="block relative aspect-square rounded-lg overflow-hidden bg-[#f5f6f1] mb-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-[#ff745e] text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs">
                    {discount}% OFF
                  </span>
                </Link>

                <div className="flex items-center gap-1 text-[#2f7a54] text-[9.5px] font-bold mb-1">
                  <span className="bg-[#2f7a54] text-white px-1 py-0.2 rounded text-[9px] flex items-center gap-0.5 font-black">
                    4.4 <Star size={9} fill="currentColor" />
                  </span>
                  <span className="text-[#687068] font-normal">(1.4k)</span>
                </div>

                <Link href={`/products/${p.id}`}>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#182018] line-clamp-2 hover:text-[#2f7a54] leading-snug">
                    {p.name}
                  </h4>
                </Link>
              </div>

              <div className="pt-2 mt-2 border-t border-[#dfe3dd]/80 space-y-1.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-black text-[#182018]">₹{retail}</span>
                  <span className="text-[10px] text-[#687068] line-through">₹{original}</span>
                </div>

                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="text-[#2f7a54] font-bold">Goodfinds Assured</span>
                  <button
                    onClick={() =>
                      addItem({
                        id: p.id,
                        name: p.name,
                        price: retail,
                        image: p.image,
                      })
                    }
                    className="p-1 rounded bg-[#f5f6f1] hover:bg-[#183d2f] text-[#183d2f] hover:text-[#baf2cd] transition cursor-pointer"
                    title="Add to Bag"
                  >
                    <ShoppingCart size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
