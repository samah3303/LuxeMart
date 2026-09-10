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
        <h2 className="font-display text-2xl font-bold text-[#182018] mb-4">Your bag is empty</h2>
        <Link href="/" className="inline-block bg-[#183d2f] hover:bg-[#102c23] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-4">
      <div className="flex items-center justify-between border-b border-[#dfe3dd] pb-3">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687068] hover:text-[#182018] transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Bag</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#687068]">
          <Lock size={13} className="text-[#2f7a54]" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Delivery Details & Payment */}
        <div className="lg:col-span-7 space-y-4">
          {/* Address Form Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#dfe3dd] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#dfe3dd] pb-2.5">
              <h2 className="font-display text-lg font-bold text-[#182018]">
                1. Delivery Address
              </h2>
              <span className="text-[9px] font-extrabold uppercase bg-[#f5f6f1] text-[#183d2f] px-2 py-0.5 rounded border border-[#dfe3dd]">
                Express Doorstep
              </span>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-3">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Recipient's Name"
                    required
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
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
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#182018]">
                    House / Apartment / Suite Name *
                  </label>
                  <span className="text-[9px] text-[#2f7a54] font-bold">Apartment / Flat / House</span>
                </div>
                <input
                  type="text"
                  name="houseName"
                  value={formData.houseName}
                  onChange={handleChange}
                  placeholder="e.g. Apartment 4B, Hillcrest, Suite 12"
                  required
                  className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
                    Street / Locality
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="e.g. 5th Main Road / Central Ave"
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Near City Center / Post Office"
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Metro City"
                    required
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. State / Region"
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#182018] mb-1">
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
                    className="w-full text-xs border border-[#dfe3dd] bg-[#f5f6f1] rounded-lg px-3 py-2 text-[#182018] focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-mono"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#dfe3dd] shadow-xs space-y-3">
            <h2 className="font-display text-lg font-bold text-[#182018] flex items-center justify-between">
              <span>2. Payment Choice</span>
              {isPrepaid && (
                <span className="text-[9px] font-extrabold uppercase bg-[#baf2cd] text-[#183d2f] px-2 py-0.5 rounded-full border border-[#2f7a54]/20">
                  ₹70 OFF Applied
                </span>
              )}
            </h2>

            <div className="space-y-2.5">
              {/* UPI Option */}
              <label
                onClick={() => setIsPrepaid(true)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isPrepaid
                    ? 'border-[#2f7a54] bg-[#baf2cd]/15 ring-2 ring-[#2f7a54]/20'
                    : 'border-[#dfe3dd] hover:border-[#687068]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={isPrepaid}
                  onChange={() => setIsPrepaid(true)}
                  className="mt-0.5 text-[#183d2f] focus:ring-[#2f7a54]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#182018] text-xs flex items-center gap-1.5">
                      <QrCode size={16} className="text-[#2f7a54]" />
                      <span>UPI / Online Payment (Recommended)</span>
                    </span>
                    <span className="text-[9px] font-black text-[#183d2f] bg-[#baf2cd] px-2 py-0.5 rounded-full border border-[#2f7a54]/20">
                      SAVE ₹70
                    </span>
                  </div>
                  <p className="text-[#687068] text-[10px] sm:text-[11px] mt-0.5 font-light">
                    Google Pay, PhonePe, Paytm, or NetBanking with priority same-day dispatch.
                  </p>
                </div>
              </label>

              {/* COD Option */}
              <label
                onClick={() => setIsPrepaid(false)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  !isPrepaid
                    ? 'border-[#183d2f] bg-[#f5f6f1] ring-2 ring-[#183d2f]/10'
                    : 'border-[#dfe3dd] hover:border-[#687068]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={!isPrepaid}
                  onChange={() => setIsPrepaid(false)}
                  className="mt-0.5 text-[#183d2f] focus:ring-[#183d2f]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#182018] text-xs flex items-center gap-1.5">
                      <Banknote size={16} className="text-[#687068]" />
                      <span>Cash on Delivery (COD)</span>
                    </span>
                    <span className="text-[9px] text-[#687068] font-bold">Standard</span>
                  </div>
                  <p className="text-[#687068] text-[10px] sm:text-[11px] mt-0.5 font-light">
                    Pay in cash or UPI directly to the courier executive upon arrival.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Action */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#dfe3dd] shadow-xs sticky top-20 space-y-3.5">
            <h3 className="font-display text-base font-bold text-[#182018] border-b border-[#dfe3dd] pb-2.5">
              Order Review
            </h3>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 text-xs">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-[#dfe3dd] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#182018] truncate text-[11px]">{item.name}</p>
                    <p className="text-[#687068] text-[10px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#182018] text-xs">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-[#687068] border-t border-[#dfe3dd] pt-2.5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#182018]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Express Courier Dispatch</span>
                <span className="font-bold text-[#2f7a54]">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              {isPrepaid && prepaidDiscount > 0 && (
                <div className="flex justify-between items-center text-[#183d2f] font-bold bg-[#baf2cd]/20 border border-[#baf2cd]/50 p-2 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Sparkles size={13} className="text-[#2f7a54]" />
                    <span>Instant UPI Discount</span>
                  </span>
                  <span>- ₹{prepaidDiscount}</span>
                </div>
              )}
              <div className="border-t border-[#dfe3dd] pt-2 flex justify-between items-baseline text-sm font-black text-[#182018]">
                <span>Total Payable</span>
                <span className="text-xl font-black text-[#182018]">₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#183d2f] hover:bg-[#102c23] text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Securing Order...</span>
              ) : (
                <span>Confirm Order &bull; ₹{finalTotal}</span>
              )}
            </button>

            <div className="pt-0.5 text-[10px] text-[#687068] text-center">
              <p className="flex items-center justify-center gap-1 text-[#687068] font-medium">
                <ShieldCheck size={13} className="text-[#2f7a54]" />
                <span>Doorstep Delivery via Verified Couriers</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
