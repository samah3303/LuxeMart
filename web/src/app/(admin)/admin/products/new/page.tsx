'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProduct } from '@/actions/productActions';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    supplierName: 'Roposo Clout',
    supplierUrl: '',
    image: '',
    categoryName: 'Kitchen & Home',
    stock: '100',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const retail = parseFloat(formData.price) || 0;
  const cost = parseFloat(formData.costPrice) || 0;
  const grossMargin = retail - cost;
  const marginPercent = retail > 0 ? Math.round((grossMargin / retail) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.price) {
      setError('Please provide a title and retail price.');
      return;
    }

    setSaving(true);

    try {
      const res = await createProduct({
        name: formData.name,
        description: formData.description,
        price: retail,
        costPrice: cost,
        supplierName: formData.supplierName,
        supplierUrl: formData.supplierUrl,
        image: formData.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        categoryName: formData.categoryName,
        stock: parseInt(formData.stock) || 50,
      });

      if (res.success) {
        router.push('/admin/products');
      } else {
        setError(res.error || 'Failed to publish product.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687068] hover:text-[#182018] mb-2 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-[#182018] tracking-tight">
          Add Dropship Item
        </h2>
        <p className="text-[#687068] text-xs mt-0.5">
          Configure retail prices, wholesale supplier costs, and automated margin calculations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe3dd] shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-[#182018] text-sm border-b border-[#dfe3dd] pb-2">
            1. Item Details
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#182018] mb-1.5">Product Title *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electric Garlic & Vegetable Mini Chopper"
              required
              className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182018] mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Highlight problem-solving features, usage, and material benefits..."
              className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-light"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#182018] mb-1.5">Category</label>
              <select
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
              >
                <option value="Kitchen & Home">Kitchen & Home</option>
                <option value="Fashion & Ethnic">Fashion & Ethnic</option>
                <option value="Car & Tech Gadgets">Car & Tech Gadgets</option>
                <option value="Baby & Kids">Baby & Kids</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182018] mb-1.5">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://... (Unsplash or CDN link)"
                className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Margins */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-[#182018] text-sm border-b border-[#dfe3dd] pb-2">
            2. Pricing & Markup Calculator
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#182018] mb-1.5">Retail Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 899"
                required
                className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-black text-[#182018]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182018] mb-1.5">Supplier Cost Price (₹)</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="e.g. 290"
                className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <div className="bg-[#baf2cd]/25 border border-[#baf2cd] p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-[#2f7a54]" />
              <div>
                <span className="text-xs font-bold text-[#183d2f] block">Live Profit Margin</span>
                <span className="text-[11px] text-[#2f7a54] font-light">Calculated before freight</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-[#2f7a54]">₹{grossMargin > 0 ? grossMargin : 0}</span>
              <span className="text-[11px] font-bold text-[#183d2f] block">({marginPercent}% profit spread)</span>
            </div>
          </div>
        </div>

        {/* Sourcing Supplier */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-[#183d2f] text-sm border-b border-[#dfe3dd] pb-2">
            3. Supplier Logistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#182018] mb-1.5">Supplier Source</label>
              <select
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition"
              >
                <option value="Roposo Clout">Roposo Clout</option>
                <option value="GlowRoad">GlowRoad</option>
                <option value="Baapstore">Baapstore (Fast Dispatch)</option>
                <option value="Textiles Direct">Textiles Direct</option>
                <option value="Apparel Weavers Hub">Apparel Weavers Hub</option>
                <option value="Wholesale B2B Supplier">Wholesale B2B Supplier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182018] mb-1.5">Supplier Product URL</label>
              <input
                type="url"
                name="supplierUrl"
                value={formData.supplierUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm border border-[#dfe3dd] bg-[#f5f6f1] text-[#182018] rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#2f7a54] focus:outline-none transition font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#dfe3dd] flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#687068] hover:text-[#182018] px-4 py-2.5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#183d2f] hover:bg-[#102c23] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>{saving ? 'Publishing...' : 'Publish to Catalog'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
