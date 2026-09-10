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
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#183d2f] bg-[#baf2cd]/40 px-2 py-0.5 rounded border border-[#2f7a54]/20 inline-block mb-1">
            Operations &bull; Live Hub
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-black text-[#182018] tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-[#687068] text-xs mt-0.5">
            Live orders, supplier margins, and courier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="bg-[#183d2f] hover:bg-[#102c23] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <span>+ Add Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white hover:bg-[#f5f6f1] text-[#182018] border border-[#dfe3dd] font-bold text-xs px-3 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Truck size={13} className="text-[#183d2f]" />
            <span>Fulfillment</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Card 1: Revenue */}
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#dfe3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#687068] text-[9px] font-bold uppercase tracking-wider">
            <span>Gross Sales</span>
            <div className="p-1.5 bg-[#f5f6f1] text-[#183d2f] rounded-lg border border-[#dfe3dd]">
              <IndianRupee size={14} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg sm:text-xl md:text-2xl font-black text-[#182018]">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[#2f7a54] text-[10px] font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#74dc98]" />
              <TrendingUp size={11} />
              <span>Customer receipts</span>
            </p>
          </div>
        </div>

        {/* Card 2: Estimated Profit */}
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#dfe3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#687068] text-[9px] font-bold uppercase tracking-wider">
            <span>Gross Profit</span>
            <div className="p-1.5 bg-[#baf2cd]/30 text-[#183d2f] rounded-lg border border-[#baf2cd]">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg sm:text-xl md:text-2xl font-black text-[#2f7a54]">
              ₹{Math.max(0, estimatedGrossProfit).toLocaleString('en-IN')}
            </p>
            <p className="text-[#687068] text-[10px] mt-0.5 font-light">
              Wholesale spread
            </p>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#dfe3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#687068] text-[9px] font-bold uppercase tracking-wider">
            <span>Orders Placed</span>
            <div className="p-1.5 bg-[#e5ddff] text-[#183d2f] rounded-lg border border-[#e5ddff]">
              <ShoppingCart size={14} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg sm:text-xl md:text-2xl font-black text-[#182018]">{totalOrders}</p>
            <p className="text-[#687068] text-[10px] mt-0.5 flex items-center gap-1.5">
              <span className="font-bold text-[#2f7a54]">{upiOrdersCount} UPI</span> &bull; <span className="font-bold text-[#687068]">{codOrdersCount} COD</span>
            </p>
          </div>
        </div>

        {/* Card 4: Sourced Items */}
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#dfe3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#687068] text-[9px] font-bold uppercase tracking-wider">
            <span>Catalog Items</span>
            <div className="p-1.5 bg-[#baf2cd]/30 text-[#183d2f] rounded-lg border border-[#baf2cd]">
              <PackageCheck size={14} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg sm:text-xl md:text-2xl font-black text-[#182018]">{products.length}</p>
            <p className="text-[#687068] text-[10px] mt-0.5 font-light">Direct supplier links</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#dfe3dd] overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-[#dfe3dd] flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-[#182018]">
              Customer Orders Queue
            </h3>
            <p className="text-[11px] text-[#687068] mt-0.5">
              Select any order to copy customer address for Roposo/GlowRoad and attach AWB
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#183d2f] hover:text-[#2f7a54] flex items-center gap-1"
          >
            <span>View All &rarr;</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#f5f6f1] text-[#687068] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#dfe3dd]">
              <ShoppingCart size={24} />
            </div>
            <p className="font-bold text-[#182018] text-sm">No orders yet</p>
            <p className="text-[#687068] text-xs mt-1">Customer purchases will be queued here.</p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Responsive Touch Cards (Hidden on sm screens) */}
            <div className="sm:hidden divide-y divide-[#dfe3dd]">
              {orders.map((order) => {
                const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;
                const isPrepaid = order.paymentMethod === 'UPI';

                return (
                  <div key={order.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#182018]">{orderRef}</span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          isPrepaid
                            ? 'bg-[#baf2cd] text-[#183d2f] border border-[#2f7a54]/20'
                            : 'bg-[#f5f6f1] text-[#182018] border border-[#dfe3dd]'
                        }`}
                      >
                        {isPrepaid ? 'UPI PAID' : 'COD'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#182018]">{order.customerName}</p>
                        <p className="text-[#687068] text-[11px]">{[order.city, order.district].filter(Boolean).join(', ') || 'Doorstep'} &bull; {order.customerPhone}</p>
                      </div>
                      <span className="font-black text-[#182018] text-sm">₹{Number(order.total)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold bg-[#f5f6f1] text-[#182018] px-2 py-0.5 rounded border border-[#dfe3dd] inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#74dc98]" />
                        <span>{order.fulfillmentStatus.replace(/_/g, ' ')}</span>
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="bg-[#183d2f] text-white hover:bg-[#102c23] font-bold text-[11px] px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition"
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
              <table className="w-full text-left text-xs text-[#687068]">
                <thead className="bg-[#f5f6f1] text-[#182018] font-bold uppercase tracking-wider text-[9px] border-b border-[#dfe3dd]">
                  <tr>
                    <th className="px-3.5 py-2.5">Order ID & Date</th>
                    <th className="px-3.5 py-2.5">Customer & Destination</th>
                    <th className="px-3.5 py-2.5">Payment</th>
                    <th className="px-3.5 py-2.5">Amount</th>
                    <th className="px-3.5 py-2.5">Status</th>
                    <th className="px-3.5 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe3dd]">
                  {orders.map((order) => {
                    const orderRef = `ORD-${order.id.slice(-6).toUpperCase()}`;
                    const isPrepaid = order.paymentMethod === 'UPI';

                    return (
                      <tr key={order.id} className="hover:bg-[#f5f6f1]/60 transition">
                        <td className="px-3.5 py-2.5">
                          <span className="font-mono font-black text-[#182018] block">{orderRef}</span>
                          <span className="text-[10px] text-[#687068]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span className="font-bold text-[#182018] block">{order.customerName}</span>
                          <span className="text-[10px] text-[#687068] flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-[#183d2f]">{order.city || order.district || 'Express'}</span>
                            <span>&bull;</span>
                            <span className="font-mono">{order.customerPhone}</span>
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span
                            className={`inline-block font-extrabold text-[9px] px-2 py-0.5 rounded-full ${
                              isPrepaid
                                ? 'bg-[#baf2cd] text-[#183d2f] border border-[#2f7a54]/30'
                                : 'bg-[#f5f6f1] text-[#182018] border border-[#dfe3dd]'
                            }`}
                          >
                            {isPrepaid ? 'UPI PAID' : 'COD'}
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5 font-black text-[#182018] text-xs">
                          ₹{Number(order.total)}
                        </td>

                        <td className="px-3.5 py-2.5">
                          <span className="inline-flex items-center gap-1.5 font-bold text-[9px] bg-[#f5f6f1] text-[#182018] px-2 py-0.5 rounded border border-[#dfe3dd]">
                            <span className={`w-1.5 h-1.5 rounded-full ${order.fulfillmentStatus === 'DELIVERED' ? 'bg-[#74dc98]' : order.fulfillmentStatus === 'CANCELLED' ? 'bg-[#9c4337]' : 'bg-[#d7a14b]'}`} />
                            <span>{order.fulfillmentStatus.replace(/_/g, ' ')}</span>
                          </span>
                        </td>

                        <td className="px-3.5 py-2.5 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 bg-[#183d2f] hover:bg-[#102c23] text-white font-bold px-2.5 py-1 rounded-lg transition text-xs shadow-xs"
                          >
                            <span>Fulfill</span>
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
