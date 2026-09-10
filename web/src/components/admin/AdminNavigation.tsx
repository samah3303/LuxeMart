'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ExternalLink,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export function AdminNavigation({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Fulfillment & Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products & Sourcing', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f6f1]">
      {/* Mobile Admin Header */}
      <header className="md:hidden bg-[#102c23] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#baf2cd] text-[#102c23] flex items-center justify-center font-serif text-xs font-black shadow-xs">
            G
          </div>
          <div>
            <span className="font-display font-black text-xs tracking-tight text-white block leading-none">
              Goodfinds Admin
            </span>
            <span className="text-[8px] uppercase font-bold text-[#baf2cd]">Operations Hub</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-64 bg-[#102c23] text-white h-full p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="font-display font-bold text-base text-white">Operations Hub</span>
                <button onClick={() => setMobileOpen(false)} className="text-[#aebfb7] p-1">
                  <X size={16} />
                </button>
              </div>

              <nav className="space-y-1 text-xs font-bold">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                        isActive
                          ? 'bg-[rgba(255,255,255,0.09)] text-white font-black'
                          : 'text-[#aebfb7] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-[#baf2cd]' : 'text-[#aebfb7]'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-white/10">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between text-xs font-bold px-3 py-2 rounded-xl bg-white/5 text-[#aebfb7] hover:text-white hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-1.5">
                  <ExternalLink size={13} />
                  <span>View Live Store</span>
                </span>
                <span className="text-[9px] bg-[#baf2cd]/20 text-[#baf2cd] px-1.5 py-0.5 rounded font-mono">
                  Live
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-56 bg-[#102c23] text-white p-4 flex-col justify-between border-r border-[#183d2f] flex-shrink-0 min-h-screen sticky top-0 h-screen">
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#baf2cd] text-[#102c23] flex items-center justify-center font-serif text-sm font-black shadow-xs">
                G
              </div>
              <div>
                <h1 className="font-display text-base font-black text-white tracking-tight leading-none">
                  Goodfinds
                </h1>
                <span className="text-[8px] uppercase tracking-widest font-extrabold text-[#baf2cd]">
                  Operations Hub
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#9db4aa] mt-2 font-light">
              Direct Sourcing & Fulfillment
            </p>
          </div>

          <nav className="space-y-1.5 text-xs font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                    isActive
                      ? 'bg-[rgba(255,255,255,0.09)] text-white font-bold'
                      : 'text-[#aebfb7] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#baf2cd]' : 'text-[#aebfb7]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-bold px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#aebfb7] hover:text-white transition"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink size={13} />
              <span>Live Storefront</span>
            </span>
            <span className="text-[9px] bg-[#baf2cd]/20 text-[#baf2cd] px-1.5 py-0.5 rounded font-mono">
              Store
            </span>
          </Link>

          <div className="p-3 bg-[rgba(255,255,255,0.04)] rounded-xl border border-white/10 text-xs text-[#9db4aa]">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
              <Sparkles size={13} className="text-[#baf2cd]" />
              <span className="text-[11px]">Direct Hub</span>
            </div>
            <p className="text-[10px] leading-relaxed text-[#9db4aa] font-light">
              Doorstep express delivery with automated ₹70 UPI savings.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">{children}</main>
    </div>
  );
}
