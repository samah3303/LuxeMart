import Link from "next/link";
import React from 'react';
import { getProducts } from '@/actions/productActions';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Truck, ShieldCheck, Banknote, RefreshCw, Star, ArrowRight, Sparkles, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products } = await getProducts();

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Editorial Luxury Hero */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#090d16] text-[#faf8f5] p-5 sm:p-10 md:p-16 shadow-2xl border border-white/10 w-full">
        {/* Subtle decorative lighting glow */}
        <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            <Sparkles size={12} className="text-amber-400 flex-shrink-0" />
            <span className="truncate">Handpicked For Modern Living</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#faf8f5] break-words">
            Everyday Essentials, <span className="italic font-normal text-amber-200">Elevated.</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base md:text-lg leading-relaxed font-light">
            Discover smart kitchen tools, premium lifestyle accessories, and innovative home gadgets. Sourced directly with verified quality checks.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <Link
              href="#catalog"
              className="bg-[#faf8f5] hover:bg-white text-[#090d16] font-extrabold text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl transition shadow-lg flex items-center gap-2 active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/products"
              className="bg-white/10 hover:bg-white/15 text-[#faf8f5] font-semibold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl backdrop-blur-sm border border-white/15 transition"
            >
              All Categories
            </Link>
          </div>
        </div>

        {/* Floating Desktop Highlight Card */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-3 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-xs text-xs">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              ₹70
            </div>
            <div>
              <p className="font-bold text-white">Instant UPI Discount</p>
              <p className="text-slate-400 text-[11px]">Save automatically at checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              COD
            </div>
            <div>
              <p className="font-bold text-white">Doorstep Cash Option</p>
              <p className="text-slate-400 text-[11px]">Pay when parcel reaches home</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#eee9df] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-[#faf8f5] text-amber-800 rounded-lg sm:rounded-xl flex-shrink-0 border border-[#eee9df]">
            <Truck size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">Express Shipping</h4>
            <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">3–5 Days Doorstep</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#eee9df] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-[#faf8f5] text-emerald-800 rounded-lg sm:rounded-xl flex-shrink-0 border border-[#eee9df]">
            <Banknote size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">COD Eligible</h4>
            <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">Pay at Doorstep</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#eee9df] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-[#faf8f5] text-indigo-800 rounded-lg sm:rounded-xl flex-shrink-0 border border-[#eee9df]">
            <ShieldCheck size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">Inspected Hub</h4>
            <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">100% Quality Check</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#eee9df] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-[#faf8f5] text-rose-800 rounded-lg sm:rounded-xl flex-shrink-0 border border-[#eee9df]">
            <RefreshCw size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">7-Day Return</h4>
            <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">Hassle-Free Support</p>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#e8e3d9] pb-4">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Curated Catalog
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-[#090d16]">
              Trending Discoveries
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-slate-700 hover:text-amber-800 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All ({products.length})</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* 2 Columns on Mobile, 3 on Tablet, 3-4 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {products.map((product) => {
            const retailPrice = product.price;
            const fakeOriginalPrice = Math.round(retailPrice * 1.5);
            const discountPercent = Math.round(((fakeOriginalPrice - retailPrice) / fakeOriginalPrice) * 100);

            return (
              <div
                key={product.id}
                className="luxury-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Product Image Container */}
                <Link
                  href={`/products/${product.id}`}
                  className="block relative aspect-[4/3] sm:aspect-square bg-slate-100 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#090d16] text-[#faf8f5] text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </span>
                  <span className="hidden sm:inline-block absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#090d16] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {product.category?.name || 'Exclusive'}
                  </span>
                </Link>

                {/* Info Container */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-amber-600 text-[10px] sm:text-xs font-bold mb-1">
                      <Star size={12} fill="currentColor" />
                      <span>4.8</span>
                      <span className="text-slate-400 font-normal hidden sm:inline">(140+ reviews)</span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-[#090d16] text-xs sm:text-sm md:text-base leading-snug line-clamp-2 hover:text-amber-800 transition">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-slate-500 text-[11px] sm:text-xs mt-1 line-clamp-2 hidden sm:block font-light">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#f4efe6] space-y-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-xl md:text-2xl font-black text-[#090d16]">
                        ₹{retailPrice}
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                        ₹{fakeOriginalPrice}
                      </span>
                    </div>

                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: retailPrice,
                        image: product.image,
                      }}
                      showBuyNow={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
