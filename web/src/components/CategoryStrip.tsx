'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Flame,
  UtensilsCrossed,
  Shirt,
  Car,
  Laptop,
  Sparkles,
  Baby,
  ChevronRight,
} from 'lucide-react';

export const CATEGORIES_NAV = [
  { id: 'all', name: 'Top Offers', icon: Flame, badge: 'HOT', query: '' },
  { id: 'kitchen', name: 'Kitchen & Home', icon: UtensilsCrossed, query: 'Kitchen & Home' },
  { id: 'fashion', name: 'Fashion & Ethnic', icon: Shirt, query: 'Fashion & Ethnic' },
  { id: 'car-tech', name: 'Car & Tech Gadgets', icon: Car, query: 'Car & Tech Gadgets' },
  { id: 'electronics', name: 'Smart Electronics', icon: Laptop, query: 'Smart Electronics' },
  { id: 'beauty', name: 'Beauty & Care', icon: Sparkles, query: 'Beauty & Wellness' },
  { id: 'baby', name: 'Baby & Kids', icon: Baby, query: 'Baby & Kids' },
];

export function CategoryStrip() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  return (
    <div className="w-full bg-white border-b border-[#dfe3dd] shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 no-scrollbar scroll-smooth">
          {CATEGORIES_NAV.map((cat) => {
            const Icon = cat.icon;
            const isActive =
              cat.id === 'all'
                ? !currentCategory
                : currentCategory.toLowerCase() === cat.query.toLowerCase();

            const href = cat.query ? `/products?category=${encodeURIComponent(cat.query)}` : '/products';

            return (
              <Link
                key={cat.id}
                href={href}
                className={`group flex flex-col items-center flex-shrink-0 px-2 sm:px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#baf2cd]/30 text-[#183d2f] font-bold ring-1 ring-[#2f7a54]/30'
                    : 'text-[#182018] hover:bg-[#f5f6f1] hover:text-[#183d2f]'
                }`}
              >
                <div className="relative mb-1">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'bg-[#183d2f] text-[#baf2cd] shadow-xs'
                        : 'bg-[#f5f6f1] text-[#2f7a54] group-hover:bg-[#183d2f] group-hover:text-[#baf2cd]'
                    }`}
                  >
                    <Icon size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 bg-[#ff745e] text-white text-[7.5px] font-black px-1 py-0.2 rounded-full uppercase tracking-tighter">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold whitespace-nowrap text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
