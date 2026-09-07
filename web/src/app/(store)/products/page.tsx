import Link from 'next/link';
import React from 'react';
import { getProducts } from '@/actions/productActions';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Star, ArrowLeft } from 'lucide-react';

export default async function ProductsPage() {
  const { products } = await getProducts();

  return (
    <div className="pb-20 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e3d9] pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#090d16] mb-2 transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#090d16] tracking-tight">
            Curated Sourced Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Direct from manufacturer warehouses &bull; Free express delivery on orders over ₹499
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-[#e8e3d9] shadow-2xs self-start sm:self-auto">
          {products.length} Products Available
        </div>
      </div>

      {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {products.map((product) => {
          const retail = product.price;
          const fakeOriginal = Math.round(retail * 1.5);
          const discount = Math.round(((fakeOriginal - retail) / fakeOriginal) * 100);

          return (
            <div
              key={product.id}
              className="luxury-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
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
                  {discount}% OFF
                </span>
                <span className="hidden sm:inline-block absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#090d16] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {product.category?.name || 'Exclusive'}
                </span>
              </Link>

              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-amber-600 text-[10px] sm:text-xs font-bold mb-1">
                    <Star size={12} fill="currentColor" />
                    <span>4.8</span>
                    <span className="text-slate-400 font-normal hidden sm:inline">(Verified)</span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-[#090d16] text-xs sm:text-sm md:text-base leading-snug line-clamp-2 hover:text-amber-800 transition">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="pt-2 border-t border-[#f4efe6] space-y-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-xl font-black text-[#090d16]">₹{retail}</span>
                    <span className="text-[11px] sm:text-xs text-slate-400 line-through">₹{fakeOriginal}</span>
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
