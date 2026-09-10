'use client';

import Link from 'next/link';
import { ShoppingBag, Search, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <>
      {/* Luxury Ticker Bar */}
      <div className="w-full bg-[#090d16] text-[#faf8f5] text-[9px] sm:text-[10px] font-medium py-1 px-3 sm:px-4 border-b border-white/5 tracking-wider overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
            <span className="font-semibold text-amber-300 sm:hidden truncate">Express Doorstep Delivery &bull; COD</span>
            <span className="hidden sm:inline font-semibold text-amber-300">EXPRESS DOORSTEP DISPATCH &bull; 3–5 Day Fast Delivery &bull; Free Shipping over ₹499</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold">
            <span className="text-emerald-400">⚡ Flat ₹70 Instant UPI Saving</span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-300">COD Available</span>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e3d9] transition-all">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 h-13 sm:h-15 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#090d16] text-amber-300 flex items-center justify-center font-serif text-xs sm:text-sm font-black shadow-xs group-hover:scale-105 transition">
              G
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#090d16] block leading-none">
                Goodfinds
              </span>
              <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.2em] font-extrabold text-amber-800 block mt-0.5">
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
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#f4efe6] border border-transparent focus:border-amber-600/40 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-[#090d16] transition"
              />
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            </div>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2.5">
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-amber-800 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition"
            >
              <Compass size={15} />
              <span>Catalog</span>
            </Link>

            <Link
              href="/admin"
              className="text-xs font-bold text-slate-700 hover:text-indigo-900 bg-[#f4efe6] hover:bg-[#e8e3d9] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-[#dfd8cc]"
              title="Admin Dropship Hub"
            >
              <ShieldCheck size={15} className="text-emerald-700" />
              <span className="hidden sm:inline">Dropship Hub</span>
            </Link>

            <Link
              href="/cart"
              className="relative px-2.5 py-1.5 rounded-lg bg-[#090d16] text-[#faf8f5] hover:bg-slate-800 transition shadow-xs flex items-center gap-1.5"
            >
              <ShoppingBag size={15} className="text-amber-300" />
              <span className="hidden md:inline text-xs font-bold tracking-tight">Cart</span>
              {totalItems > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full min-w-3.5 h-3.5 px-0.5 flex items-center justify-center">
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
