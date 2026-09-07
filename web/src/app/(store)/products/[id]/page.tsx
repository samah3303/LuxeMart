import Link from 'next/link';
import React from 'react';
import { getProductById } from '@/actions/productActions';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ArrowLeft, Star, Truck, ShieldCheck, Banknote, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { product } = await getProductById(resolvedParams.id);

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-display text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link href="/" className="mt-4 inline-block text-amber-800 font-bold hover:underline text-sm">
          &larr; Return to Store
        </Link>
      </div>
    );
  }

  const retailPrice = product.price;
  const fakeOriginalPrice = Math.round(retailPrice * 1.5);
  const discountPercent = Math.round(((fakeOriginalPrice - retailPrice) / fakeOriginalPrice) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Breadcrumb Back Link */}
      <Link
        href="/"
        className="inline-flex items-center text-slate-500 hover:text-[#090d16] transition-colors text-xs font-bold gap-1.5"
      >
        <ArrowLeft size={16} />
        <span>Back to Curated Deals</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-[#eee9df] shadow-sm">
        {/* Left Column: Product Image */}
        <div className="aspect-square bg-[#faf8f5] rounded-2xl overflow-hidden shadow-inner relative border border-[#eee9df]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-[#090d16] text-[#faf8f5] text-xs font-black px-3 py-1 rounded-full shadow-md">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Right Column: Product Narrative */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#f4efe6] text-[#090d16] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-[#dfd8cc]">
                {product.category?.name || 'Exclusive'}
              </span>
              <div className="flex items-center text-amber-600 text-xs font-bold gap-1">
                <Star size={14} fill="currentColor" />
                <span>4.9 (210+ verified buyers)</span>
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#090d16] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 border-b border-[#eee9df] pb-4">
              <span className="text-3xl sm:text-4xl font-black text-[#090d16]">₹{retailPrice}</span>
              <span className="text-base text-slate-400 line-through">₹{fakeOriginalPrice}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                In Stock &bull; Ready to Dispatch
              </span>
            </div>

            {/* Instant UPI Offer Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-emerald-700 text-white rounded-xl flex-shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">Instant ₹70 UPI Discount</span>
                <span className="text-emerald-800 text-[11px]">Pay online via Google Pay, PhonePe, or Paytm at checkout.</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About this product</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons & Desktop Trust */}
          <div className="space-y-4 pt-4 border-t border-[#eee9df]">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: retailPrice,
                image: product.image,
              }}
              showBuyNow={true}
            />

            {/* Delivery Reassurance */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2">
              <div className="flex items-center gap-2.5 bg-[#faf8f5] p-3 rounded-xl border border-[#eee9df]">
                <Truck size={18} className="text-amber-700 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900">Express Delivery</span>
                  <span className="text-[10px] text-slate-500">3–5 Business Days Doorstep</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#faf8f5] p-3 rounded-xl border border-[#eee9df]">
                <Banknote size={18} className="text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500">Pay cash at doorstep</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Care Banner */}
            <a
              href={`https://wa.me/919999999999?text=Hi%20Goodfinds,%20I%20have%20questions%20about%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 py-2.5 rounded-xl border border-emerald-200 transition"
            >
              <MessageCircle size={15} />
              <span>Questions? Chat with our Support on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
