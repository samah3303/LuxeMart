import React from 'react';
import Link from 'next/link';
import { getOrderById } from '@/actions/orderActions';
import { FulfillmentForm } from '@/components/admin/FulfillmentForm';
import { ArrowLeft, MessageCircle, MapPin, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { order } = await getOrderById(resolvedParams.id);

  if (!order) {
    return (
      <div className="p-10 text-center">
        <h2 className="font-display text-xl font-bold text-slate-800">Order not found</h2>
        <Link href="/admin" className="text-amber-800 font-bold text-xs mt-3 inline-block">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;

  const destinationLine = [order.city, order.district, order.state].filter(Boolean).filter((val, i, arr) => arr.indexOf(val) === i).join(', ');
  const addressText = `${order.customerName}
${order.houseName}
${order.streetAddress ? order.streetAddress + '\n' : ''}${order.landmark ? 'Landmark: ' + order.landmark + '\n' : ''}${destinationLine} - ${order.pincode}
Mobile: ${order.customerPhone}`;

  const customerTotal = Number(order.total);
  let orderSupplierCost = 0;
  order.items.forEach((item) => {
    orderSupplierCost += Number(item.product.costPrice || 0) * item.quantity;
  });
  const netEstimatedMargin = customerTotal - orderSupplierCost;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Orders Queue</span>
        </Link>
        <span className="font-mono text-xs text-slate-400">ID: {order.id}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#eee9df] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#090d16]">{orderRef}</h2>
            <span
              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                order.paymentMethod === 'UPI'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.paymentMethod === 'UPI' ? 'Prepaid UPI' : 'COD'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        <a
          href={`https://wa.me/91${order.customerPhone}?text=Hello%20${encodeURIComponent(
            order.customerName || ''
          )},%20this%20is%20Goodfinds%20regarding%20your%20order%20${orderRef}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <MessageCircle size={16} />
          <span>WhatsApp Customer</span>
        </a>
      </div>

      {/* Dropship Profit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#eee9df] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Paid</span>
          <p className="text-2xl font-black text-[#090d16] mt-1">₹{customerTotal}</p>
          <span className="text-xs text-slate-500 mt-0.5 block">{order.items.length} item(s) ordered</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#eee9df] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wholesale Cost</span>
          <p className="text-2xl font-black text-slate-600 mt-1">₹{orderSupplierCost}</p>
          <span className="text-xs text-slate-400 mt-0.5 block">Supplier base price</span>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Gross Margin</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">₹{netEstimatedMargin}</p>
          <span className="text-xs text-emerald-800 mt-0.5 block font-semibold">
            {customerTotal > 0 ? `${Math.round((netEstimatedMargin / customerTotal) * 100)}% estimated markup` : ''}
          </span>
        </div>
      </div>

      {/* Fulfillment Form */}
      <FulfillmentForm
        orderId={order.id}
        initialData={{
          supplierOrderId: order.supplierOrderId,
          courierName: order.courierName,
          trackingNumber: order.trackingNumber,
          fulfillmentStatus: order.fulfillmentStatus,
          paymentStatus: order.paymentStatus,
        }}
        addressText={addressText}
      />

      {/* Items to Fulfill */}
      <div className="bg-white p-6 rounded-3xl border border-[#eee9df] shadow-xs space-y-4">
        <h3 className="font-display font-bold text-base text-[#090d16]">Ordered Products</h3>
        <div className="divide-y divide-[#eee9df]">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#eee9df] flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Qty: <strong>{item.quantity}</strong></span>
                    <span>&bull;</span>
                    <span>Retail: <strong>₹{Number(item.price)}</strong></span>
                    <span>&bull;</span>
                    <span>Wholesale: <strong>₹{Number(item.product.costPrice)}</strong></span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs">
                    <span className="bg-[#faf8f5] text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px] border border-[#eee9df]">
                      Supplier: {item.product.supplierName}
                    </span>
                    {item.product.supplierUrl && (
                      <a
                        href={item.product.supplierUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:underline flex items-center gap-1 text-[11px] font-bold"
                      >
                        <span>Supplier Portal</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right sm:pl-4">
                <span className="text-xs text-slate-400 block">Line Total</span>
                <span className="font-black text-slate-900 text-base">
                  ₹{Number(item.price) * item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Delivery Address */}
      <div className="bg-white p-6 rounded-3xl border border-[#eee9df] shadow-xs space-y-3">
        <h3 className="font-display font-bold text-base text-[#090d16] flex items-center gap-2">
          <MapPin size={18} className="text-emerald-700" />
          <span>Customer Address</span>
        </h3>
        <div className="bg-[#faf8f5] p-4 rounded-2xl text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-line border border-[#e8e3d9]">
          {addressText}
        </div>
      </div>
    </div>
  );
}
