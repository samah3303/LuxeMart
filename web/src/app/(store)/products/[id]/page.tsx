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
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Breadcrumb Back Link */}
      <Link
        href="/"
        className="inline-flex items-center text-slate-500 hover:text-[#090d16] transition-colors text-xs font-bold gap-1"
      >
        <ArrowLeft size={14} />
        <span>Back to Curated Deals</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 bg-white p-4 sm:p-6 rounded-2xl border border-[#eee9df] shadow-xs">
        {/* Left Column: Product Image */}
        <div className="aspect-square bg-[#faf8f5] rounded-xl overflow-hidden shadow-inner relative border border-[#eee9df]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2.5 left-2.5 bg-[#090d16] text-[#faf8f5] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Right Column: Product Narrative */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#f4efe6] text-[#090d16] text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border border-[#dfd8cc]">
                {product.category?.name || 'Exclusive'}
              </span>
              <div className="flex items-center text-amber-600 text-xs font-bold gap-1">
                <Star size={12} fill="currentColor" />
                <span>4.9 (210+ buyers)</span>
              </div>
            </div>

            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#090d16] leading-snug">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2.5 border-b border-[#eee9df] pb-3">
              <span className="text-2xl sm:text-3xl font-black text-[#090d16]">₹{retailPrice}</span>
              <span className="text-sm text-slate-400 line-through">₹{fakeOriginalPrice}</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                Ready to Dispatch
              </span>
            </div>

            {/* Instant UPI Offer Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/80 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-700 text-white rounded-lg flex-shrink-0">
                <Sparkles size={14} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block text-[11px]">Instant ₹70 UPI Discount</span>
                <span className="text-emerald-800 text-[10px]">Auto-applied at checkout for Google Pay, PhonePe, Paytm.</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About this product</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons & Desktop Trust */}
          <div className="space-y-3 pt-3 border-t border-[#eee9df]">
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
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2 bg-[#faf8f5] p-2.5 rounded-lg border border-[#eee9df]">
                <Truck size={15} className="text-amber-700 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900 text-[11px]">Express Delivery</span>
                  <span className="text-[9px] text-slate-500">3–5 Days Doorstep</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#faf8f5] p-2.5 rounded-lg border border-[#eee9df]">
                <Banknote size={15} className="text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900 text-[11px]">Cash on Delivery</span>
                  <span className="text-[9px] text-slate-500">Pay cash at doorstep</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Care Banner */}
            <a
              href={`https://wa.me/919999999999?text=Hi%20Goodfinds,%20I%20have%20questions%20about%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 py-2 rounded-lg border border-emerald-200 transition"
            >
              <MessageCircle size={14} />
              <span>Questions? Chat with Support on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
