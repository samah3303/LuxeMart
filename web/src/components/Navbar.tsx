'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CategoryStrip } from '@/components/CategoryStrip';

export function Navbar() {
  const { totalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <>
      {/* Flipkart-style Ticker Bar */}
      <div className="w-full bg-[#102c23] text-[#f5f6f1] text-[9px] sm:text-[10px] font-medium py-1 px-3 sm:px-4 border-b border-white/5 tracking-wider overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#74dc98] animate-ping flex-shrink-0" />
            <span className="font-semibold text-[#baf2cd] sm:hidden truncate">
              Express Doorstep Delivery &bull; COD Available
            </span>
            <span className="hidden sm:inline font-semibold text-[#baf2cd]">
              EXPRESS DOORSTEP DISPATCH &bull; 3–5 Day Fast Delivery &bull; Free Shipping over ₹499
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold">
            <span className="text-[#baf2cd]">⚡ Flat ₹70 Instant UPI Saving</span>
            <span className="text-[#aebfb7]">&bull;</span>
            <span className="text-[#f5f6f1]">100% Verified Quality</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dfe3dd] shadow-2xs">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#183d2f] text-[#baf2cd] flex items-center justify-center font-serif text-sm sm:text-base font-black shadow-xs group-hover:scale-105 transition">
              G
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#182018] block leading-none">
                Goodfinds
              </span>
              <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.2em] font-extrabold text-[#2f7a54] block mt-0.5">
                Explore Plus
              </span>
            </div>
          </Link>

          {/* Search Bar - Center Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-3">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and smart discoveries..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#f5f6f1] border border-[#dfe3dd] focus:border-[#2f7a54] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#baf2cd]/40 text-[#182018] placeholder:text-[#687068] transition font-medium"
              />
              <Search className="absolute left-3 top-2.5 text-[#687068]" size={15} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#687068] hover:text-[#182018]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Right Navigation */}
          <nav className="flex items-center space-x-1.5 sm:space-x-3">
            <Link
              href="/admin"
              className="text-xs font-bold text-[#182018] hover:text-[#183d2f] bg-[#f5f6f1] hover:bg-[#e8ece5] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-[#dfe3dd]"
              title="Admin Dropship Hub"
            >
              <ShieldCheck size={15} className="text-[#2f7a54]" />
              <span className="hidden sm:inline">Admin Hub</span>
            </Link>

            <Link
              href="/cart"
              className="relative px-3 py-1.5 rounded-xl bg-[#183d2f] text-white hover:bg-[#102c23] transition shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <ShoppingBag size={16} className="text-[#baf2cd]" />
              <span className="hidden sm:inline text-xs font-bold tracking-tight">Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#baf2cd] text-[#183d2f] text-[9.5px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Mobile Search Bar (Directly below logo on mobile screens) */}
        <div className="md:hidden px-3 pb-2 pt-0.5">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, essentials & gadgets..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-[#f5f6f1] border border-[#dfe3dd] focus:border-[#2f7a54] text-xs focus:bg-white focus:outline-none text-[#182018] placeholder:text-[#687068]"
            />
            <Search className="absolute left-2.5 top-2 text-[#687068]" size={14} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-[#687068]"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Flipkart-Style Horizontal Category Strip */}
        <Suspense fallback={<div className="h-14 bg-white border-b border-[#dfe3dd]" />}>
          <CategoryStrip />
        </Suspense>
      </header>
    </>
  );
}

