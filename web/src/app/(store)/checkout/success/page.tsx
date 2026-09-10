import React from 'react';
import Link from 'next/link';
import { getOrderById } from '@/actions/orderActions';
import { CheckCircle2, Truck, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-display text-2xl font-bold text-[#090d16]">Order not found</h2>
        <Link href="/" className="mt-4 inline-block text-amber-800 font-bold hover:underline text-xs">
          Return to Catalog &rarr;
        </Link>
      </div>
    );
  }

  const { order } = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-display text-2xl font-bold text-[#090d16]">Invalid Order Reference</h2>
        <Link href="/" className="mt-4 inline-block text-amber-800 font-bold hover:underline text-xs">
          Return to Catalog &rarr;
        </Link>
      </div>
    );
  }

  const orderNumber = `ORD-${order.id.slice(-6).toUpperCase()}`;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-24 space-y-6">
      {/* Luxury Confirmation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#dfe3dd] shadow-xs text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-[#baf2cd]/30 text-[#183d2f] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#baf2cd]">
          <CheckCircle2 size={36} className="text-[#2f7a54]" />
        </div>

        <span className="inline-block bg-[#baf2cd] text-[#183d2f] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-[#2f7a54]/20">
          Order Confirmed
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-black text-[#182018] mb-2">
          Thank you, {order.customerName}!
        </h1>

        <p className="text-[#687068] text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed">
          Your order is received. Our fulfillment hub is preparing your package for express courier dispatch to your doorstep.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5 bg-[#f5f6f1] p-4 rounded-2xl border border-[#dfe3dd] text-xs">
          <div>
            <span className="text-[#687068] block text-[10px] uppercase font-bold tracking-wider">Order No.</span>
            <span className="font-mono font-black text-[#182018] text-sm">{orderNumber}</span>
          </div>
          <div className="h-6 w-px bg-[#dfe3dd]" />
          <div>
            <span className="text-[#687068] block text-[10px] uppercase font-bold tracking-wider">Payment Mode</span>
            <span className="font-black text-[#183d2f] uppercase">{order.paymentMethod}</span>
          </div>
          <div className="h-6 w-px bg-[#dfe3dd]" />
          <div>
            <span className="text-[#687068] block text-[10px] uppercase font-bold tracking-wider">Total</span>
            <span className="font-black text-[#2f7a54] text-sm">₹{Number(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Dispatch Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dfe3dd] shadow-xs space-y-5">
        <h3 className="font-display text-lg font-bold text-[#182018] flex items-center gap-2">
          <Truck size={20} className="text-[#183d2f]" />
          <span>Fulfillment Progress</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-[#baf2cd]/20 border border-[#baf2cd] rounded-2xl">
            <span className="text-[10px] font-extrabold text-[#183d2f] uppercase tracking-wider block mb-1">Step 1: Confirmed</span>
            <p className="font-bold text-[#182018]">Order Logged</p>
            <p className="text-[#687068] text-[11px] mt-0.5 font-light">Assigned to fulfillment hub</p>
          </div>

          <div className="p-4 bg-[#f5f6f1] border border-[#dfe3dd] rounded-2xl">
            <span className="text-[10px] font-bold text-[#687068] uppercase tracking-wider block mb-1">Step 2: Dispatch</span>
            <p className="font-bold text-[#182018]">AWB & Packaging</p>
            <p className="text-[#687068] text-[11px] mt-0.5 font-light">Within 24–48 hours</p>
          </div>

          <div className="p-4 bg-[#f5f6f1] border border-[#dfe3dd] rounded-2xl">
            <span className="text-[10px] font-bold text-[#687068] uppercase tracking-wider block mb-1">Step 3: Delivery</span>
            <p className="font-bold text-[#182018]">Doorstep Arrival</p>
            <p className="text-[#687068] text-[11px] mt-0.5 font-light">3–5 business days</p>
          </div>
        </div>

        {/* WhatsApp Customer Care Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-[#baf2cd]/15 rounded-2xl border border-[#baf2cd]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#183d2f] text-[#baf2cd] rounded-xl flex-shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#182018] text-xs sm:text-sm">Direct WhatsApp Support</h4>
              <p className="text-[#687068] text-[11px] font-light">Need live delivery status or address changes? Chat with us directly.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/919999999999?text=Hi%20Goodfinds,%20checking%20status%20for%20order%20${orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#183d2f] hover:bg-[#102c23] text-[#baf2cd] font-bold text-xs px-5 py-2.5 rounded-xl transition text-center shadow-xs"
          >
            WhatsApp Support
          </a>
        </div>
      </div>

      {/* Address & Ordered Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#dfe3dd] shadow-xs space-y-2 text-xs">
          <h4 className="font-display font-bold text-sm text-[#182018] border-b border-[#dfe3dd] pb-2">Shipping Destination</h4>
          <p className="font-bold text-[#182018]">{order.customerName}</p>
          <p className="text-[#687068] font-light"><strong className="font-bold text-[#182018]">House/Apt:</strong> {order.houseName}</p>
          {order.streetAddress && <p className="text-[#687068] font-light">{order.streetAddress}</p>}
          {order.landmark && <p className="text-[#687068] font-light"><strong className="font-bold text-[#182018]">Landmark:</strong> {order.landmark}</p>}
          <p className="text-[#687068] font-light">{[order.city, order.district, order.state].filter(Boolean).filter((val, i, arr) => arr.indexOf(val) === i).join(', ')} - <strong className="font-mono font-bold text-[#182018]">{order.pincode}</strong></p>
          <p className="text-[#687068] font-light pt-1"><strong className="font-bold text-[#182018]">Contact:</strong> {order.customerPhone}</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#dfe3dd] shadow-xs space-y-3 text-xs">
          <h4 className="font-display font-bold text-sm text-[#182018] border-b border-[#dfe3dd] pb-2">Items Summary</h4>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#182018]">{item.product.name}</p>
                  <p className="text-[#687068]">Qty: {item.quantity} &bull; ₹{Number(item.price)}</p>
                </div>
                <span className="font-bold text-[#182018]">₹{Number(item.price) * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#dfe3dd] pt-2 flex justify-between font-black text-sm text-[#182018]">
            <span>Total</span>
            <span>₹{Number(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#183d2f] hover:bg-[#102c23] text-white font-bold px-8 py-3.5 rounded-xl transition text-xs shadow-md"
        >
          <span>Continue Browsing</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
