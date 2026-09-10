'use client';

import Link from 'next/link';
import { ShoppingBag, Search, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <>
      {/* Luxury Ticker Bar */}
      <div className="w-full bg-[#102c23] text-[#f5f6f1] text-[9px] sm:text-[10px] font-medium py-1 px-3 sm:px-4 border-b border-white/5 tracking-wider overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#74dc98] animate-ping flex-shrink-0" />
            <span className="font-semibold text-[#baf2cd] sm:hidden truncate">Express Doorstep Delivery &bull; COD</span>
            <span className="hidden sm:inline font-semibold text-[#baf2cd]">EXPRESS DOORSTEP DISPATCH &bull; 3–5 Day Fast Delivery &bull; Free Shipping over ₹499</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold">
            <span className="text-[#baf2cd]">⚡ Flat ₹70 Instant UPI Saving</span>
            <span className="text-[#aebfb7]">&bull;</span>
            <span className="text-[#f5f6f1]">COD Available</span>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dfe3dd] transition-all">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 h-13 sm:h-15 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#183d2f] text-[#baf2cd] flex items-center justify-center font-serif text-xs sm:text-sm font-black shadow-xs group-hover:scale-105 transition">
              G
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#182018] block leading-none">
                Goodfinds
              </span>
              <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.2em] font-extrabold text-[#2f7a54] block mt-0.5">
                Curated Finds
              </span>
            </div>
          </Link>

          {/* Search Bar - Center Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search trending gadgets, smart home tools, lifestyle..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#f5f6f1] border border-[#dfe3dd] focus:border-[#2f7a54] text-xs focus:outline-none focus:ring-2 focus:ring-[#baf2cd]/40 text-[#182018] placeholder:text-[#687068] transition"
              />
              <Search className="absolute left-2.5 top-2 text-[#687068]" size={14} />
            </div>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2.5">
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#182018] hover:text-[#2f7a54] py-1.5 px-2.5 rounded-lg hover:bg-[#f5f6f1] transition"
            >
              <Compass size={15} />
              <span>Catalog</span>
            </Link>

            <Link
              href="/admin"
              className="text-xs font-bold text-[#182018] hover:text-[#183d2f] bg-[#f5f6f1] hover:bg-[#e8ece5] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-[#dfe3dd]"
              title="Admin Dropship Hub"
            >
              <ShieldCheck size={15} className="text-[#2f7a54]" />
              <span className="hidden sm:inline">Dropship Hub</span>
            </Link>

            <Link
              href="/cart"
              className="relative px-2.5 py-1.5 rounded-lg bg-[#183d2f] text-[#f5f6f1] hover:bg-[#102c23] transition shadow-xs flex items-center gap-1.5"
            >
              <ShoppingBag size={15} className="text-[#baf2cd]" />
              <span className="hidden md:inline text-xs font-bold tracking-tight">Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#baf2cd] text-[#183d2f] text-[9px] font-black rounded-full min-w-3.5 h-3.5 px-0.5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
