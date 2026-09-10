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
    <div className="md:hidden fixed bottom-2 left-3 right-3 z-50">
      <div className="glass-dock rounded-xl p-1 shadow-xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg transition-all ${
                isActive
                  ? 'text-[#baf2cd] bg-white/10'
                  : 'text-[#aebfb7] hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon size={18} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#baf2cd] text-[#183d2f] text-[9px] font-black rounded-full min-w-3.5 h-3.5 px-0.5 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* Direct WhatsApp Quick Chat */}
        <a
          href="https://wa.me/919999999999?text=Hi%20Goodfinds,%20I%20have%20an%20inquiry%20regarding%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center py-1 px-2.5 text-[#74dc98] hover:text-[#baf2cd] transition-all"
        >
          <MessageCircle size={18} />
          <span className="text-[9px] font-bold tracking-tight mt-0.5">Support</span>
        </a>
      </div>
    </div>
  );
}
