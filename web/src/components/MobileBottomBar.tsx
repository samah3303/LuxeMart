'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function MobileBottomBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Don't show bottom dock on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Catalog', icon: Compass },
    { href: '/cart', label: 'Cart', icon: ShoppingBag, badge: totalItems },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-50">
      <div className="glass-dock rounded-2xl p-1.5 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 bg-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Direct WhatsApp Quick Chat */}
        <a
          href="https://wa.me/919999999999?text=Hi%20Goodfinds,%20I%20have%20an%20inquiry%20regarding%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center py-1.5 px-3 text-emerald-400 hover:text-emerald-300 transition-all"
        >
          <MessageCircle size={20} />
          <span className="text-[10px] font-bold tracking-tight mt-1">Support</span>
        </a>
      </div>
    </div>
  );
}
