'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    tag: '⚡ SPECIAL LAUNCH OFFER',
    title: 'Instant ₹70 Flat Savings on Every UPI Order',
    description: 'Pay securely with Google Pay, PhonePe, or Paytm. Automated discount applied at checkout.',
    cta: 'Explore Discoveries',
    href: '/products',
    bgGradient: 'from-[#183d2f] via-[#123024] to-[#102c23]',
    accentColor: '#baf2cd',
    visualBadge: 'FLAT ₹70 OFF',
    subBadge: 'All Prepaid Orders',
  },
  {
    id: 2,
    tag: '🍳 HOME & KITCHEN ESSENTIALS',
    title: 'Smart Kitchen Tools That Save Hours Daily',
    description: 'Cordless electric choppers, automatic water pumps, and multi-blade vegetable slicers.',
    cta: 'Shop Kitchen Finds',
    href: '/products?category=Kitchen+%26+Home',
    bgGradient: 'from-[#163a2d] via-[#1c4736] to-[#102c23]',
    accentColor: '#74dc98',
    visualBadge: 'UP TO 55% OFF',
    subBadge: 'Direct Factory Prices',
  },
  {
    id: 3,
    tag: '🚗 SMART TECH & GADGETS',
    title: 'Top-Rated Solar & Compact Car Accessories',
    description: 'Kinetic dual-ring solar aroma diffusers, phone mounts, and travel essentials with doorstep COD.',
    cta: 'Discover Tech',
    href: '/products?category=Car+%26+Tech+Gadgets',
    bgGradient: 'from-[#102c23] via-[#1a4435] to-[#183d2f]',
    accentColor: '#baf2cd',
    visualBadge: 'STARTING ₹399',
    subBadge: 'Free Delivery > ₹499',
  },
];

export function HomeBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  const banner = BANNERS[current];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-[#dfe3dd] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient & Animated Glow */}
      <div
        className={`w-full bg-gradient-to-r ${banner.bgGradient} transition-all duration-700 ease-in-out p-5 sm:p-7 md:p-9 min-h-[200px] sm:min-h-[240px] md:min-h-[260px] flex items-center relative overflow-hidden`}
      >
        <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-[#baf2cd]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-10 w-48 h-48 rounded-full bg-[#74dc98]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-[#baf2cd] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
            <Zap size={11} className="text-[#baf2cd] flex-shrink-0" />
            <span>{banner.tag}</span>
          </div>

          <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            {banner.title}
          </h2>

          <p className="text-[#aebfb7] text-xs sm:text-sm font-light leading-relaxed max-w-md line-clamp-2">
            {banner.description}
          </p>

          <div className="pt-1 flex items-center gap-3">
            <Link
              href={banner.href}
              className="bg-[#baf2cd] hover:bg-white text-[#183d2f] font-black text-xs px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>{banner.cta}</span>
              <ArrowRight size={13} />
            </Link>
            <span className="text-[11px] text-[#aebfb7] hidden sm:flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#74dc98]" />
              <span>Cash on Delivery Available</span>
            </span>
          </div>
        </div>

        {/* Visual Badge Card - Desktop Only */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center shadow-lg min-w-[200px]">
          <span className="text-[10px] uppercase font-extrabold text-[#baf2cd] tracking-wider mb-1">
            Featured Highlight
          </span>
          <span className="font-display text-2xl font-black text-white leading-none">
            {banner.visualBadge}
          </span>
          <span className="text-xs text-[#aebfb7] mt-1 font-medium">
            {banner.subBadge}
          </span>
          <div className="mt-3 w-full border-t border-white/10 pt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-[#74dc98]">
            <Sparkles size={11} />
            <span>Goodfinds Verified</span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#182018] shadow-md flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#182018] shadow-md flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all rounded-full ${
              idx === current ? 'w-5 h-1.5 bg-[#baf2cd]' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
