import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Package, Plus, ExternalLink, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687068] hover:text-[#182018] mb-1 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <h2 className="font-display text-xl sm:text-2xl font-black text-[#182018] tracking-tight">
            Products & Sourcing Catalog
          </h2>
          <p className="text-[#687068] text-xs mt-0.5">
            Manage wholesale supplier costs and retail profit margins
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#183d2f] hover:bg-[#102c23] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus size={14} />
          <span>Add Dropship Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-[#dfe3dd] overflow-hidden">
        {/* Mobile View: Product Cards */}
        <div className="sm:hidden divide-y divide-[#dfe3dd]">
          {products.map((product) => {
            const retail = Number(product.price);
            const cost = Number(product.costPrice || 0);
            const margin = retail - cost;
            const marginPercent = retail > 0 ? Math.round((margin / retail) * 100) : 0;

            return (
              <div key={product.id} className="p-3 flex gap-3 items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-[#dfe3dd] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#182018] truncate">{product.name}</h4>
                  <p className="text-[10px] text-[#687068] mt-0.5">Supplier: {product.supplierName}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-black text-[#182018]">₹{retail}</span>
                    <span className="text-[9px] text-[#687068] font-mono">(Cost: ₹{cost})</span>
                    <span className="text-[9px] font-bold text-[#183d2f] bg-[#baf2cd] px-1.5 py-0.5 rounded ml-auto border border-[#2f7a54]/20">
                      +{marginPercent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#687068]">
            <thead className="bg-[#f5f6f1] text-[#182018] font-bold uppercase tracking-wider text-[9px] border-b border-[#dfe3dd]">
              <tr>
                <th className="px-3.5 py-2.5">Product</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Retail Price</th>
                <th className="px-3.5 py-2.5">Supplier Cost</th>
                <th className="px-3.5 py-2.5">Gross Margin</th>
                <th className="px-3.5 py-2.5">Supplier Partner</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe3dd]">
              {products.map((product) => {
                const retail = Number(product.price);
                const cost = Number(product.costPrice || 0);
                const margin = retail - cost;
                const marginPercent = retail > 0 ? Math.round((margin / retail) * 100) : 0;

                return (
                  <tr key={product.id} className="hover:bg-[#f5f6f1]/60 transition">
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#dfe3dd] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-[#182018] block truncate max-w-xs text-xs">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-[#687068]">Stock: {product.stock} units</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-3.5 py-2.5 font-semibold text-[#182018] text-xs">
                      {product.category?.name || 'General'}
                    </td>

                    <td className="px-3.5 py-2.5 font-black text-[#182018] text-xs">
                      ₹{retail}
                    </td>

                    <td className="px-3.5 py-2.5 font-mono text-[#687068] text-xs">
                      ₹{cost}
                    </td>

                    <td className="px-3.5 py-2.5">
                      <span className="font-black text-[#2f7a54] block text-xs">
                        ₹{margin}
                      </span>
                      <span className="text-[9px] font-bold text-[#183d2f] bg-[#baf2cd] px-1.5 py-0.5 rounded border border-[#2f7a54]/20">
                        {marginPercent}% Margin
                      </span>
                    </td>

                    <td className="px-3.5 py-2.5">
                      <span className="font-semibold text-[#182018] block text-xs">
                        {product.supplierName}
                      </span>
                      {product.supplierUrl && (
                        <a
                          href={product.supplierUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#183d2f] hover:underline flex items-center gap-1 mt-0.5 font-medium"
                        >
                          <span>Portal</span>
                          <ExternalLink size={9} />
                        </a>
                      )}
                    </td>

                    <td className="px-3.5 py-2.5 text-right">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[#687068] hover:text-[#182018] font-bold text-xs"
                      >
                        <span>Storefront</span>
                        <ExternalLink size={11} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
