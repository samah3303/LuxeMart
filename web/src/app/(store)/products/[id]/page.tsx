import Link from 'next/link';
import React from 'react';
import { getProductById } from '@/actions/productActions';
import { AddToCartButton } from '@/components/AddToCartButton';
import { PincodeDeliveryChecker } from '@/components/PincodeDeliveryChecker';
import {
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  Banknote,
  Sparkles,
  CheckCircle2,
  Tag,
  Zap,
  RefreshCw,
  Award,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

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
        <h2 className="font-display text-2xl font-bold text-[#182018]">Product Not Found</h2>
        <Link href="/products" className="mt-4 inline-block text-[#2f7a54] font-bold hover:underline text-sm">
          &larr; Return to Catalog
        </Link>
      </div>
    );
  }

  const retailPrice = product.price;
  const fakeOriginalPrice = Math.round(retailPrice * 1.55);
  const discountPercent = Math.round(((fakeOriginalPrice - retailPrice) / fakeOriginalPrice) * 100);
  const savings = fakeOriginalPrice - retailPrice;

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16">
      {/* Flipkart Breadcrumb Trail */}
      <nav className="flex items-center gap-1.5 text-xs text-[#687068] overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-[#183d2f] font-semibold transition">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-[#183d2f] font-semibold transition">
          Products
        </Link>
        {product.category?.name && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/products?category=${encodeURIComponent(product.category.name)}`}
              className="hover:text-[#183d2f] font-semibold transition"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="font-bold text-[#182018] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Flipkart Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#dfe3dd] shadow-2xs">
        {/* LEFT COLUMN: Sticky Media Gallery & Dual Action Buttons (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 self-start">
          {/* Main Hero Product Image Container */}
          <div className="aspect-square bg-[#f5f6f1] rounded-2xl overflow-hidden relative border border-[#dfe3dd] shadow-xs group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Discount Pill */}
            <span className="absolute top-3 left-3 bg-[#ff745e] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>

            {/* Goodfinds Assured Stamp */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg border border-[#dfe3dd] shadow-xs flex items-center gap-1 text-[10px] font-bold text-[#183d2f]">
              <CheckCircle2 size={12} className="text-[#2f7a54]" />
              <span>Assured</span>
            </div>
          </div>

          {/* Flipkart Dual CTA Action Buttons (Full Width side-by-side) */}
          <div className="pt-2">
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

          {/* Direct Support & Trust Reassurance */}
          <div className="pt-2 border-t border-[#dfe3dd] space-y-2">
            <a
              href={`https://wa.me/919999999999?text=Hi%20Goodfinds,%20I%20have%20questions%20about%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#183d2f] hover:text-[#102c23] bg-[#baf2cd]/30 hover:bg-[#baf2cd]/50 py-2.5 rounded-xl border border-[#baf2cd] transition cursor-pointer"
            >
              <MessageCircle size={15} className="text-[#2f7a54]" />
              <span>Have questions? Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Details, Offers, Highlights, Pincode & Reviews (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header & Title */}
          <div>
            <span className="text-[11px] font-bold text-[#2f7a54] uppercase tracking-wider block mb-1">
              {product.category?.name || 'Exclusive Catalog'}
            </span>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#182018] leading-snug">
              {product.name}
            </h1>

            {/* Rating & Review summary pill */}
            <div className="flex items-center gap-2.5 mt-2">
              <span className="inline-flex items-center gap-1 bg-[#2f7a54] text-white text-xs font-black px-2 py-0.5 rounded">
                <span>4.4</span>
                <Star size={11} fill="currentColor" />
              </span>
              <span className="text-xs font-semibold text-[#687068]">
                1,428 Ratings &bull; 236 Reviews
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#183d2f] bg-[#baf2cd]/40 px-2 py-0.5 rounded">
                <CheckCircle2 size={12} className="text-[#2f7a54]" />
                <span>Goodfinds Assured</span>
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3.5 bg-[#f5f6f1] rounded-xl border border-[#dfe3dd] space-y-1">
            <span className="text-[10px] font-bold text-[#2f7a54] uppercase tracking-widest block">
              Special Price
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-[#182018]">
                ₹{retailPrice}
              </span>
              <span className="text-sm text-[#687068] line-through">
                ₹{fakeOriginalPrice}
              </span>
              <span className="text-sm font-bold text-[#2f7a54]">
                {discountPercent}% off
              </span>
              <span className="text-xs font-bold text-[#183d2f] ml-auto bg-[#baf2cd]/60 px-2 py-0.5 rounded">
                You Save ₹{savings}
              </span>
            </div>
            <p className="text-[11px] text-[#687068]">
              Inclusive of all taxes &bull; Free express delivery over ₹499
            </p>
          </div>

          {/* Flipkart Available Offers Box */}
          <div className="border border-[#dfe3dd] rounded-xl p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#182018]">
              <Tag size={14} className="text-[#2f7a54]" />
              <span>Available Offers</span>
            </div>
            <div className="space-y-2 text-xs text-[#182018]">
              <div className="flex items-start gap-2">
                <Zap size={14} className="text-[#2f7a54] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Instant UPI Offer:</span> Flat ₹70 discount automatically deducted when paying via Google Pay, PhonePe, or Paytm.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={14} className="text-[#2f7a54] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Doorstep Cash On Delivery:</span> Pay when your package arrives at your home.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw size={14} className="text-[#ff745e] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">7-Day Replacement Guarantee:</span> If damaged or defective, get a hassle-free swap or refund.
                </div>
              </div>
            </div>
          </div>

          {/* Pincode & Delivery Checker Widget */}
          <PincodeDeliveryChecker />

          {/* Highlights Section */}
          <div className="space-y-2 pt-2 border-t border-[#dfe3dd]">
            <h3 className="text-xs font-bold text-[#687068] uppercase tracking-wider">
              Product Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#182018]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2f7a54]" />
                <span>100% Factory Direct Quality Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2f7a54]" />
                <span>Category: {product.category?.name || 'Exclusive'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2f7a54]" />
                <span>Express 3–5 Days Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2f7a54]" />
                <span>Hassle-Free 7 Days Returns</span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2 pt-2 border-t border-[#dfe3dd]">
            <h3 className="text-xs font-bold text-[#687068] uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-xs sm:text-sm text-[#182018] leading-relaxed whitespace-pre-line font-light">
              {product.description}
            </p>
          </div>

          {/* Ratings & Customer Reviews Breakdown */}
          <div className="space-y-3 pt-3 border-t border-[#dfe3dd]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#687068] uppercase tracking-wider">
                Ratings & Customer Reviews
              </h3>
              <span className="text-[11px] font-bold text-[#2f7a54]">100% Verified Buyers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#f5f6f1] rounded-xl border border-[#dfe3dd]">
              {/* Overall Score */}
              <div className="flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-[#dfe3dd] pb-3 sm:pb-0 sm:pr-3">
                <span className="text-3xl font-black text-[#182018] flex items-center gap-1">
                  4.4 <Star size={20} className="fill-[#2f7a54] text-[#2f7a54]" />
                </span>
                <span className="text-xs text-[#687068] mt-1">1,428 Verified Ratings</span>
              </div>

              {/* Rating Bars */}
              <div className="sm:col-span-2 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-7 font-bold text-[#182018]">5 ★</span>
                  <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-[#dfe3dd]">
                    <div className="bg-[#2f7a54] h-full w-[70%]" />
                  </div>
                  <span className="text-[#687068] w-8 text-right">70%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-7 font-bold text-[#182018]">4 ★</span>
                  <div className="bg-white flex-1 h-2 rounded-full overflow-hidden border border-[#dfe3dd]">
                    <div className="bg-[#2f7a54] h-full w-[20%]" />
                  </div>
                  <span className="text-[#687068] w-8 text-right">20%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-7 font-bold text-[#182018]">3 ★</span>
                  <div className="bg-white flex-1 h-2 rounded-full overflow-hidden border border-[#dfe3dd]">
                    <div className="bg-[#f39c12] h-full w-[7%]" />
                  </div>
                  <span className="text-[#687068] w-8 text-right">7%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-7 font-bold text-[#182018]">2 ★</span>
                  <div className="bg-white flex-1 h-2 rounded-full overflow-hidden border border-[#dfe3dd]">
                    <div className="bg-[#ff745e] h-full w-[2%]" />
                  </div>
                  <span className="text-[#687068] w-8 text-right">2%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-7 font-bold text-[#182018]">1 ★</span>
                  <div className="bg-white flex-1 h-2 rounded-full overflow-hidden border border-[#dfe3dd]">
                    <div className="bg-[#ff745e] h-full w-[1%]" />
                  </div>
                  <span className="text-[#687068] w-8 text-right">1%</span>
                </div>
              </div>
            </div>

            {/* Sample Verified Reviews */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-[#dfe3dd] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2f7a54] text-white px-1.5 py-0.2 rounded text-[10px] font-black flex items-center gap-0.5">
                    5 <Star size={9} fill="currentColor" />
                  </span>
                  <span className="font-bold text-xs text-[#182018]">Superb product & fast delivery</span>
                </div>
                <p className="text-xs text-[#687068]">
                  Ordered this last week, received within 3 days in neat bubble packaging. Works seamlessly as advertised.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#687068] pt-1">
                  <span className="font-semibold text-[#182018]">Verified Buyer</span>
                  <span>&bull;</span>
                  <span>Certified Purchase</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#dfe3dd] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2f7a54] text-white px-1.5 py-0.2 rounded text-[10px] font-black flex items-center gap-0.5">
                    4 <Star size={9} fill="currentColor" />
                  </span>
                  <span className="font-bold text-xs text-[#182018]">Value for money find</span>
                </div>
                <p className="text-xs text-[#687068]">
                  Very useful daily item. Paid via UPI and got the ₹70 instant discount. Highly recommended!
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#687068] pt-1">
                  <span className="font-semibold text-[#182018]">Verified Buyer</span>
                  <span>&bull;</span>
                  <span>Certified Purchase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
