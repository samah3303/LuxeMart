import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShoppingCart, IndianRupee, TrendingUp, PackageCheck, ArrowUpRight, Truck, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
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

  const products = await prisma.product.findMany();

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const upiOrdersCount = orders.filter((o) => o.paymentMethod === 'UPI').length;
  const codOrdersCount = orders.filter((o) => o.paymentMethod === 'COD').length;

  let totalSupplierCost = 0;
  orders.forEach((o) => {
    o.items.forEach((item) => {
      totalSupplierCost += Number(item.product.costPrice || 0) * item.quantity;
    });
  });

  const estimatedGrossProfit = totalRevenue - totalSupplierCost;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-[#f4efe6] px-2.5 py-0.5 rounded border border-[#dfd8cc] inline-block mb-1.5">
            Operations &bull; Live Hub
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#090d16] tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Live orders, supplier margins, and courier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <span>+ Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white hover:bg-slate-50 text-slate-800 border border-[#e8e3d9] font-bold text-xs px-3.5 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Truck size={14} className="text-amber-800" />
            <span>Fulfillment</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#eee9df] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Gross Sales</span>
            <div className="p-2 bg-[#faf8f5] text-amber-800 rounded-xl border border-[#eee9df]">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#090d16]">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-emerald-700 text-[11px] font-bold mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>Customer receipts</span>
            </p>
          </div>
        </div>

        {/* Card 2: Estimated Profit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#eee9df] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Gross Profit</span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-700">
              ₹{Math.max(0, estimatedGrossProfit).toLocaleString('en-IN')}
            </p>
            <p className="text-slate-400 text-[11px] mt-1 font-light">
              Wholesale spread
            </p>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#eee9df] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Orders Placed</span>
            <div className="p-2 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-100">
              <ShoppingCart size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#090d16]">{totalOrders}</p>
            <p className="text-slate-500 text-[11px] mt-1">
              <strong className="text-emerald-700">{upiOrdersCount} UPI</strong> &bull; <strong className="text-indigo-800">{codOrdersCount} COD</strong>
            </p>
          </div>
        </div>

        {/* Card 4: Sourced Items */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#eee9df] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Catalog Items</span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#090d16]">{products.length}</p>
            <p className="text-slate-400 text-[11px] mt-1 font-light">Direct supplier links</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#eee9df] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#eee9df] flex items-center justify-between">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#090d16]">
              Customer Orders Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any order to copy customer address for Roposo/GlowRoad and attach AWB
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All &rarr;</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#faf8f5] text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#eee9df]">
              <ShoppingCart size={24} />
            </div>
            <p className="font-bold text-slate-800 text-sm">No orders yet</p>
            <p className="text-slate-500 text-xs mt-1">Customer purchases will be queued here.</p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Responsive Touch Cards (Hidden on sm screens) */}
            <div className="sm:hidden divide-y divide-[#eee9df]">
              {orders.map((order) => {
                const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;
                const isPrepaid = order.paymentMethod === 'UPI';

                return (
                  <div key={order.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#090d16]">{orderRef}</span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
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
                        <p className="text-slate-500 text-[11px]">{[order.city, order.district].filter(Boolean).join(', ') || 'Doorstep'} &bull; {order.customerPhone}</p>
                      </div>
                      <span className="font-black text-slate-900 text-sm">₹{Number(order.total)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold bg-[#faf8f5] text-slate-600 px-2 py-0.5 rounded border border-[#eee9df]">
                        {order.fulfillmentStatus.replace(/_/g, ' ')}
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="bg-[#090d16] text-[#faf8f5] font-bold text-[11px] px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                      >
                        <span>Fulfill</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Rich Table (Hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#faf8f5] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-[#eee9df]">
                  <tr>
                    <th className="px-5 py-3.5">Order ID & Date</th>
                    <th className="px-5 py-3.5">Customer & Destination</th>
                    <th className="px-5 py-3.5">Payment</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee9df]">
                  {orders.map((order) => {
                    const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;
                    const isPrepaid = order.paymentMethod === 'UPI';

                    return (
                      <tr key={order.id} className="hover:bg-[#faf8f5] transition">
                        <td className="px-5 py-4">
                          <span className="font-mono font-black text-[#090d16] block">{orderRef}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-[#090d16] block">{order.customerName}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-amber-900">{order.city || order.district || 'Express'}</span>
                            <span>&bull;</span>
                            <span className="font-mono">{order.customerPhone}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                              isPrepaid
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isPrepaid ? 'UPI PAID' : 'COD'}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-black text-[#090d16] text-sm">
                          ₹{Number(order.total)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-block font-bold text-[10px] bg-[#faf8f5] text-slate-700 px-2.5 py-1 rounded-md border border-[#eee9df]">
                            {order.fulfillmentStatus.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] font-bold px-3 py-1.5 rounded-lg transition text-xs shadow-2xs"
                          >
                            <span>Fulfill</span>
                            <ArrowUpRight size={12} />
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
