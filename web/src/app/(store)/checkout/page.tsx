'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/actions/orderActions';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, QrCode, Banknote, Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, subtotal, shippingFee, prepaidDiscount, finalTotal, isPrepaid, setIsPrepaid, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    houseName: '',
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.houseName.trim()) {
      setErrorMessage('Please enter your House, Building, or Apartment name.');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal / PIN code.');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || `${formData.customerPhone}@customer.goodfinds.store`,
        customerPhone: formData.customerPhone,
        houseName: formData.houseName,
        streetAddress: formData.streetAddress,
        landmark: formData.landmark,
        city: formData.city || formData.district || 'City',
        district: formData.district || formData.city || 'Region',
        state: formData.state || '',
        pincode: formData.pincode,
        paymentMethod: isPrepaid ? 'UPI' : 'COD',
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      if (res.success && res.orderId) {
        clearCart();
        router.push(`/checkout/success?orderId=${res.orderId}`);
      } else {
        setErrorMessage(res.error || 'Unable to place order. Please verify your details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-display text-2xl font-bold text-[#090d16] mb-4">Your bag is empty</h2>
        <Link href="/" className="inline-block bg-[#090d16] text-[#faf8f5] px-6 py-3 rounded-xl font-bold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-6">
      <div className="flex items-center justify-between border-b border-[#e8e3d9] pb-4">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#090d16] transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Bag</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Lock size={14} className="text-emerald-700" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Details & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Address Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee9df] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#eee9df] pb-3">
              <h2 className="font-display text-xl font-bold text-[#090d16]">
                1. Delivery Address
              </h2>
              <span className="text-[10px] font-extrabold uppercase bg-[#f4efe6] text-amber-900 px-2 py-0.5 rounded border border-[#dfd8cc]">
                Express Doorstep
              </span>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Recipient's Name"
                    required
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    required
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    House / Apartment / Suite Name *
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold">Apartment / Flat / House</span>
                </div>
                <input
                  type="text"
                  name="houseName"
                  value={formData.houseName}
                  onChange={handleChange}
                  placeholder="e.g. Apartment 4B, Hillcrest, Suite 12"
                  required
                  className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-amber-50/20 rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Street / Locality
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="e.g. 5th Main Road / Central Ave"
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Near City Center / Post Office"
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Metro City"
                    required
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. State / Region"
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Postal / PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 Digits"
                    maxLength={6}
                    required
                    className="w-full text-xs sm:text-sm border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-3 focus:bg-white focus:border-amber-700 focus:outline-none transition font-mono"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee9df] shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-[#090d16] flex items-center justify-between">
              <span>2. Payment Choice</span>
              {isPrepaid && (
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  ₹70 OFF Applied
                </span>
              )}
            </h2>

            <div className="space-y-3">
              {/* UPI Option */}
              <label
                onClick={() => setIsPrepaid(true)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isPrepaid
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-[#eee9df] hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={isPrepaid}
                  onChange={() => setIsPrepaid(true)}
                  className="mt-1 text-emerald-700 focus:ring-emerald-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#090d16] text-xs sm:text-sm flex items-center gap-2">
                      <QrCode size={18} className="text-emerald-700" />
                      <span>UPI / Online Payment (Recommended)</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      SAVE ₹70
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] sm:text-xs mt-1 font-light">
                    Google Pay, PhonePe, Paytm, or NetBanking with priority same-day dispatch.
                  </p>
                </div>
              </label>

              {/* COD Option */}
              <label
                onClick={() => setIsPrepaid(false)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  !isPrepaid
                    ? 'border-[#090d16] bg-[#faf8f5] ring-2 ring-slate-900/10'
                    : 'border-[#eee9df] hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={!isPrepaid}
                  onChange={() => setIsPrepaid(false)}
                  className="mt-1 text-[#090d16] focus:ring-slate-900"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#090d16] text-xs sm:text-sm flex items-center gap-2">
                      <Banknote size={18} className="text-slate-700" />
                      <span>Cash on Delivery (COD)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Standard</span>
                  </div>
                  <p className="text-slate-500 text-[11px] sm:text-xs mt-1 font-light">
                    Pay in cash or UPI directly to the courier executive upon arrival.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Action */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-[#eee9df] shadow-sm sticky top-24 space-y-5">
            <h3 className="font-display text-lg font-bold text-[#090d16] border-b border-[#eee9df] pb-3">
              Order Review
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[#eee9df] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#090d16] truncate">{item.name}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#090d16]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-[#eee9df] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#090d16]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Express Courier Dispatch</span>
                <span className="font-bold text-emerald-700">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              {isPrepaid && prepaidDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} />
                    <span>Instant UPI Discount</span>
                  </span>
                  <span>- ₹{prepaidDiscount}</span>
                </div>
              )}
              <div className="border-t border-[#eee9df] pt-3 flex justify-between items-baseline text-base font-black text-[#090d16]">
                <span>Total Payable</span>
                <span className="text-2xl font-black text-[#090d16]">₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] font-extrabold py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Securing Order...</span>
              ) : (
                <span>Confirm Order &bull; ₹{finalTotal}</span>
              )}
            </button>

            <div className="pt-1 text-[11px] text-slate-400 text-center space-y-1">
              <p className="flex items-center justify-center gap-1 text-slate-600 font-semibold">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Doorstep Delivery via Verified Express Couriers</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
