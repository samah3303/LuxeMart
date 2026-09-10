import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShoppingCart, ArrowUpRight, ArrowLeft, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-1 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <h2 className="font-display text-xl sm:text-2xl font-black text-[#090d16] tracking-tight">
            Order Fulfillment Queue
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {orders.length} total order{orders.length > 1 ? 's' : ''} logged in system
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xs border border-[#eee9df] overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-10 h-10 bg-[#faf8f5] text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-[#eee9df]">
              <ShoppingCart size={20} />
            </div>
            <p className="font-bold text-slate-800 text-xs sm:text-sm">No orders in queue</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Customer purchases will be displayed here.</p>
          </div>
        ) : (
          <div>
            {/* Mobile Touch Cards View */}
            <div className="sm:hidden divide-y divide-[#eee9df]">
              {orders.map((order) => {
                const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;
                const isPrepaid = order.paymentMethod === 'UPI';

                return (
                  <div key={order.id} className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#090d16]">{orderRef}</span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isPrepaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPrepaid ? 'UPI PAID' : 'COD'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-slate-500 text-[10px]">{[order.city, order.district].filter(Boolean).join(', ') || 'Doorstep'} &bull; {order.customerPhone}</p>
                      </div>
                      <span className="font-black text-slate-900 text-xs sm:text-sm">₹{Number(order.total)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9px] font-bold bg-[#faf8f5] text-slate-600 px-2 py-0.5 rounded border border-[#eee9df]">
                        {order.fulfillmentStatus.replace(/_/g, ' ')}
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="bg-[#090d16] text-[#faf8f5] font-bold text-[10px] px-2.5 py-1 rounded-md inline-flex items-center gap-1"
                      >
                        <span>Fulfill</span>
                        <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#faf8f5] text-slate-700 font-bold uppercase tracking-wider text-[9px] border-b border-[#eee9df]">
                  <tr>
                    <th className="px-3.5 py-2.5">Order ID</th>
                    <th className="px-3.5 py-2.5">Customer & Phone</th>
                    <th className="px-3.5 py-2.5">Destination / Region</th>
                    <th className="px-3.5 py-2.5">Payment</th>
                    <th className="px-3.5 py-2.5">Total</th>
                    <th className="px-3.5 py-2.5">Fulfillment Status</th>
                    <th className="px-3.5 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee9df]">
                  {orders.map((order) => {
                    const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;
                    const isPrepaid = order.paymentMethod === 'UPI';

                    return (
                      <tr key={order.id} className="hover:bg-[#faf8f5] transition">
                        <td className="px-3.5 py-2.5">
                          <span className="font-mono font-black text-[#090d16] block">{orderRef}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span className="font-bold text-[#090d16] block">{order.customerName}</span>
                          <span className="text-[10px] font-mono text-slate-500">{order.customerPhone}</span>
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span className="font-bold text-slate-800 block">{order.city || order.district || 'Express'}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                            {order.houseName || order.city}
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span
                            className={`inline-block font-black text-[9px] px-2 py-0.5 rounded-full ${
                              isPrepaid
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isPrepaid ? 'UPI PAID' : 'COD'}
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5 font-black text-[#090d16] text-xs">
                          ₹{Number(order.total)}
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span className="inline-block font-bold text-[9px] bg-[#faf8f5] text-slate-700 px-2 py-0.5 rounded border border-[#eee9df]">
                            {order.fulfillmentStatus.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] font-bold px-2.5 py-1 rounded-md transition text-xs shadow-2xs"
                          >
                            <span>Manage</span>
                            <ArrowUpRight size={11} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
