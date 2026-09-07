'use client';

import Link from 'next/link';
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, ArrowRight, ShieldCheck, Truck, Sparkles, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    prepaidDiscount,
    shippingFee,
    finalTotal,
    isPrepaid,
    setIsPrepaid,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <div className="w-20 h-20 bg-[#f4efe6] text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#e8e3d9]">
          <ShoppingBag size={32} />
        </div>
        <h2 className="font-display text-3xl font-bold text-[#090d16] mb-2">Your Bag is Empty</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto font-light">
          Discover curated utility gadgets, premium lifestyle finds, and smart essentials with express doorstep delivery.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] font-bold text-xs px-8 py-3.5 rounded-xl transition shadow-md active:scale-95"
        >
          <span>Explore Collection</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      <div className="flex items-center justify-between border-b border-[#e8e3d9] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#090d16] tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {items.length} unique item{items.length > 1 ? 's' : ''} ready for fulfillment
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl flex gap-4 border border-[#eee9df] shadow-xs items-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#faf8f5] rounded-xl flex-shrink-0 overflow-hidden border border-[#eee9df]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[85px]">
                <div>
                  <h3 className="font-bold text-[#090d16] text-xs sm:text-sm line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 mt-1">₹{item.price} each</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#e8e3d9] rounded-lg overflow-hidden bg-[#faf8f5]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-[#e8e3d9] font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-[#090d16]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-[#e8e3d9] font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="text-right pl-2">
                <p className="font-black text-[#090d16] text-base sm:text-lg">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* Prepaid UPI Promo Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-emerald-700 text-white rounded-xl flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">Instant ₹70 UPI Discount Available</h4>
              <p className="text-emerald-800 text-[11px] sm:text-xs mt-0.5">
                Pay online using Google Pay, PhonePe, or Paytm at checkout to save flat ₹70 automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-[#eee9df] shadow-sm sticky top-24 space-y-5">
            <h3 className="font-display text-lg font-bold text-[#090d16] border-b border-[#eee9df] pb-3">
              Summary
            </h3>

            {/* Payment Method Switcher */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Payment Mode:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrepaid(true)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                    isPrepaid
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-[#eee9df] text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>UPI / Online</span>
                  <span className="text-[10px] text-emerald-700 font-extrabold mt-1">SAVE ₹70</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrepaid(false)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                    !isPrepaid
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20'
                      : 'border-[#eee9df] text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400 mt-1">Doorstep Cash</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 pt-2">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#090d16]">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Express Shipping</span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    FREE EXPRESS
                  </span>
                ) : (
                  <span className="font-semibold text-slate-900">₹{shippingFee}</span>
                )}
              </div>

              {isPrepaid && prepaidDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl">
                  <span>Prepaid Discount (UPI)</span>
                  <span>- ₹{prepaidDiscount}</span>
                </div>
              )}

              <div className="border-t border-[#eee9df] pt-3 flex justify-between items-baseline text-base font-black text-[#090d16]">
                <span>Total Amount</span>
                <span className="text-xl font-black">₹{finalTotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] text-center py-4 rounded-xl font-extrabold text-xs tracking-wider uppercase transition shadow-lg active:scale-95"
            >
              Proceed to Checkout &rarr;
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>100% Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
