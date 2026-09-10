import Link from 'next/link';
import React from 'react';
import { getProducts } from '@/actions/productActions';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Star, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const { products } = await getProducts();

  return (
    <div className="pb-16 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#e8e3d9] pb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#090d16] mb-1.5 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#090d16] tracking-tight">
            Curated Sourced Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-light">
            Direct from manufacturer warehouses &bull; Free express delivery on orders over ₹499
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-[#e8e3d9] shadow-2xs self-start sm:self-auto">
          {products.length} Products Available
        </div>
      </div>

      {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {products.map((product) => {
          const retail = product.price;
          const fakeOriginal = Math.round(retail * 1.5);
          const discount = Math.round(((fakeOriginal - retail) / fakeOriginal) * 100);

          return (
            <div
              key={product.id}
              className="luxury-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <Link
                href={`/products/${product.id}`}
                className="block relative aspect-square bg-slate-100 overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-[#090d16] text-[#faf8f5] text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                  {discount}% OFF
                </span>
                <span className="hidden sm:inline-block absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#090d16] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                  {product.category?.name || 'Exclusive'}
                </span>
              </Link>

              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-amber-600 text-[9px] sm:text-[10px] font-bold mb-0.5">
                    <Star size={11} fill="currentColor" />
                    <span>4.8</span>
                    <span className="text-slate-400 font-normal hidden sm:inline">(Verified)</span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-[#090d16] text-xs sm:text-sm leading-snug line-clamp-2 hover:text-amber-800 transition">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="pt-1.5 border-t border-[#f4efe6] space-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-[#090d16]">₹{retail}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">₹{fakeOriginal}</span>
                  </div>

                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: retail,
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
    </div>
  );
}
