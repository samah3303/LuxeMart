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
    <div className="max-w-4xl mx-auto pb-16 space-y-5">
      <div className="flex items-center justify-between border-b border-[#dfe3dd] pb-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-black text-[#182018] tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-[#687068] text-xs mt-0.5">
            {items.length} unique item{items.length > 1 ? 's' : ''} ready for fulfillment
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-[#687068] hover:text-[#ff745e] transition"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 sm:p-3.5 rounded-xl flex gap-3 border border-[#dfe3dd] shadow-2xs items-center"
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#f5f6f1] rounded-lg flex-shrink-0 overflow-hidden border border-[#dfe3dd]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between min-h-[70px]">
                <div>
                  <h3 className="font-bold text-[#182018] text-xs line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-bold text-[#2f7a54] mt-0.5">₹{item.price} each</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#dfe3dd] rounded-md overflow-hidden bg-[#f5f6f1]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#182018] hover:bg-[#dfe3dd] font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#182018]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#182018] hover:bg-[#dfe3dd] font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#687068] hover:text-[#ff745e] p-1 transition"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right pl-2">
                <p className="font-black text-[#182018] text-sm sm:text-base">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* Prepaid UPI Promo Card */}
          <div className="bg-[#baf2cd]/15 border border-[#baf2cd] p-3 rounded-xl flex items-start gap-2.5">
            <div className="p-1.5 bg-[#183d2f] text-[#baf2cd] rounded-lg flex-shrink-0">
              <Sparkles size={14} />
            </div>
            <div>
              <h4 className="font-bold text-[#182018] text-xs">Instant ₹70 UPI Discount Available</h4>
              <p className="text-[#2f7a54] text-[10px] sm:text-[11px] mt-0.5">
                Pay online using Google Pay, PhonePe, or Paytm at checkout to save flat ₹70 automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#dfe3dd] shadow-xs sticky top-20 space-y-4">
            <h3 className="font-display text-base font-bold text-[#182018] border-b border-[#dfe3dd] pb-2.5">
              Summary
            </h3>

            {/* Payment Method Switcher */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#687068] uppercase tracking-wider block">
                Select Payment Mode:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrepaid(true)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                    isPrepaid
                      ? 'border-[#2f7a54] bg-[#baf2cd]/20 text-[#182018] ring-2 ring-[#baf2cd]/40'
                      : 'border-[#dfe3dd] text-[#687068] hover:border-slate-300'
                  }`}
                >
                  <span>UPI / Online</span>
                  <span className="text-[9px] text-[#2f7a54] font-extrabold mt-0.5">SAVE ₹70</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrepaid(false)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                    !isPrepaid
                      ? 'border-[#183d2f] bg-[#f5f6f1] text-[#182018] ring-2 ring-[#183d2f]/20'
                      : 'border-[#dfe3dd] text-[#687068] hover:border-slate-300'
                  }`}
                >
                  <span>Cash on Delivery</span>
                  <span className="text-[9px] text-[#687068] mt-0.5">Doorstep Cash</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#687068] pt-1">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#182018]">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Express Shipping</span>
                {shippingFee === 0 ? (
                  <span className="font-bold text-[#2f7a54] bg-[#baf2cd]/20 px-1.5 py-0.5 rounded text-[10px]">
                    FREE EXPRESS
                  </span>
                ) : (
                  <span className="font-semibold text-[#182018]">₹{shippingFee}</span>
                )}
              </div>

              {isPrepaid && prepaidDiscount > 0 && (
                <div className="flex justify-between items-center text-[#2f7a54] font-bold bg-[#baf2cd]/20 p-2 rounded-lg">
                  <span>Prepaid Discount (UPI)</span>
                  <span>- ₹{prepaidDiscount}</span>
                </div>
              )}

              <div className="border-t border-[#dfe3dd] pt-2.5 flex justify-between items-baseline text-sm font-black text-[#182018]">
                <span>Total Amount</span>
                <span className="text-lg font-black text-[#182018]">₹{finalTotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-[#183d2f] hover:bg-[#102c23] text-[#f5f6f1] text-center py-3 rounded-lg font-extrabold text-xs tracking-wider uppercase transition shadow-md active:scale-95"
            >
              Proceed to Checkout &rarr;
            </Link>

            <div className="flex items-center justify-center gap-1 text-[10px] text-[#687068] pt-0.5">
              <ShieldCheck size={13} className="text-[#2f7a54]" />
              <span>100% Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
