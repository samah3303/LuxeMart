import Link from "next/link";
import React from 'react';
import { getProducts } from '@/actions/productActions';
import { AddToCartButton } from '@/components/AddToCartButton';
import { HomeBannerSlider } from '@/components/HomeBannerSlider';
import { DealsSection } from '@/components/DealsSection';
import { Truck, ShieldCheck, Banknote, RefreshCw, Star, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products } = await getProducts();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Flipkart-style Top Banner Slider */}
      <HomeBannerSlider />

      {/* 2. Deals of the Day with Live Countdown */}
      <DealsSection products={products} />

      {/* 3. Trust & Flipkart-grade Guarantee Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full">
        <div className="bg-white p-3 rounded-xl border border-[#dfe3dd] shadow-2xs flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-[#f5f6f1] text-[#2f7a54] rounded-lg flex-shrink-0 border border-[#dfe3dd]">
            <Truck size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#182018] text-xs truncate">Speedy Delivery</h4>
            <p className="text-[#687068] text-[10px] truncate">Fast 3–5 Days Doorstep</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#dfe3dd] shadow-2xs flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-[#f5f6f1] text-[#2f7a54] rounded-lg flex-shrink-0 border border-[#dfe3dd]">
            <Banknote size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#182018] text-xs truncate">Cash on Delivery</h4>
            <p className="text-[#687068] text-[10px] truncate">Pay When Parcel Arrives</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#dfe3dd] shadow-2xs flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-[#f5f6f1] text-[#2f7a54] rounded-lg flex-shrink-0 border border-[#dfe3dd]">
            <ShieldCheck size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#182018] text-xs truncate">Goodfinds Assured</h4>
            <p className="text-[#687068] text-[10px] truncate">100% Quality Inspected</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#dfe3dd] shadow-2xs flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-[#f5f6f1] text-[#ff745e] rounded-lg flex-shrink-0 border border-[#dfe3dd]">
            <RefreshCw size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#182018] text-xs truncate">7-Day Easy Returns</h4>
            <p className="text-[#687068] text-[10px] truncate">Hassle-Free Support</p>
          </div>
        </div>
      </section>

      {/* 4. Curated Catalog Section */}
      <section id="catalog" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 border-b border-[#dfe3dd] pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2f7a54] uppercase tracking-widest mb-0.5">
              <Zap size={12} className="fill-[#2f7a54]" />
              <span>Direct Manufacturer Sourcing</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-[#182018]">
              Trending Discoveries & Popular Picks
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#182018] hover:text-[#2f7a54] flex items-center gap-1 group self-start sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-[#dfe3dd] transition shadow-2xs"
          >
            <span>Explore All ({products.length})</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* 2 Columns on Mobile, 3 on Tablet, 4 on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
          {products.map((product) => {
            const retailPrice = product.price;
            const fakeOriginalPrice = Math.round(retailPrice * 1.55);
            const discountPercent = Math.round(((fakeOriginalPrice - retailPrice) / fakeOriginalPrice) * 100);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-[#dfe3dd] hover:border-[#2f7a54] hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Product Image Container */}
                <Link
                  href={`/products/${product.id}`}
                  className="block relative aspect-square bg-[#f5f6f1] overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Flipkart-style Discount Badge */}
                  <span className="absolute top-2 left-2 bg-[#ff745e] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                    {discountPercent}% OFF
                  </span>
                  {product.category?.name && (
                    <span className="hidden sm:inline-block absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-[#182018] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#dfe3dd] shadow-2xs">
                      {product.category.name}
                    </span>
                  )}
                </Link>

                {/* Info Container */}
                <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    {/* Rating & Assured pill */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="inline-flex items-center gap-0.5 bg-[#2f7a54] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded">
                        <span>4.4</span>
                        <Star size={9} fill="currentColor" />
                      </span>
                      <span className="text-[#687068] text-[10px] font-medium hidden sm:inline">(840+)</span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#183d2f] bg-[#baf2cd]/40 px-1.5 py-0.5 rounded">
                        <CheckCircle2 size={10} className="text-[#2f7a54]" />
                        <span>Assured</span>
                      </span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-[#182018] text-xs sm:text-sm leading-snug line-clamp-2 hover:text-[#2f7a54] transition">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-[#dfe3dd] space-y-2">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base md:text-lg font-black text-[#182018]">
                        ₹{retailPrice}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#687068] line-through">
                        ₹{fakeOriginalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-[#2f7a54]">
                        Save ₹{fakeOriginalPrice - retailPrice}
                      </span>
                    </div>

                    <div className="text-[9.5px] text-[#687068]">
                      Free Delivery • <span className="text-[#2f7a54] font-semibold">COD Available</span>
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
