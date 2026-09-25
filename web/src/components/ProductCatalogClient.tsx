'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  Grid,
  List as ListIcon,
  Star,
  CheckCircle2,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { AddToCartButton } from '@/components/AddToCartButton';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  image: string;
  stock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  } | null;
  createdAt?: string | Date;
}

export interface CategoryItem {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

interface ProductCatalogClientProps {
  products: ProductItem[];
  categories: CategoryItem[];
  initialCategory?: string;
  initialSearch?: string;
}

type SortOption = 'relevance' | 'popularity' | 'price_low' | 'price_high' | 'newest' | 'discount';

const PRICE_PRESETS = [
  { label: 'Under ₹499', min: 0, max: 499 },
  { label: '₹500 - ₹999', min: 500, max: 999 },
  { label: '₹1,000 - ₹1,499', min: 1000, max: 1499 },
  { label: '₹1,500 & Above', min: 1500, max: 99999 },
];

const RATING_PRESETS = [
  { label: '4★ & above', value: 4 },
  { label: '3★ & above', value: 3 },
];

const DISCOUNT_PRESETS = [
  { label: '50% or more', value: 50 },
  { label: '40% or more', value: 40 },
  { label: '30% or more', value: 30 },
  { label: '20% or more', value: 20 },
];

export function ProductCatalogClient({
  products,
  categories,
  initialCategory = '',
  initialSearch = '',
}: ProductCatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get('category') || initialCategory;
    return cat ? [cat] : [];
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return searchParams.get('search') || initialSearch || '';
  });

  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [assuredOnly, setAssuredOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Sorting & View mode
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Collapsible section state for sidebar
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    ratings: true,
    discount: true,
    assured: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && !selectedCategories.includes(cat)) {
      setSelectedCategories([cat]);
    }
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Handle category toggle
  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(null);
    setMinDiscount(null);
    setAssuredOnly(false);
    setInStockOnly(false);
    setSortOption('relevance');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    searchQuery.trim().length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    minRating !== null ||
    minDiscount !== null ||
    assuredOnly ||
    inStockOnly;

  // Filtered and sorted products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category?.name.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      // Categories filter
      if (selectedCategories.length > 0) {
        if (!product.category || !selectedCategories.includes(product.category.name)) {
          return false;
        }
      }

      // Price filter
      if (minPrice !== '' && product.price < Number(minPrice)) return false;
      if (maxPrice !== '' && product.price > Number(maxPrice)) return false;

      // In stock filter
      if (inStockOnly && product.stock <= 0) return false;

      // Discount calculation
      const fakeOriginal = Math.round(product.price * 1.55);
      const discountPercent = Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);

      if (minDiscount !== null && discountPercent < minDiscount) return false;

      // Simulated rating (4.4 baseline)
      if (minRating !== null && 4.4 < minRating) return false;

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategories,
    minPrice,
    maxPrice,
    inStockOnly,
    minDiscount,
    minRating,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'price_low':
        return list.sort((a, b) => a.price - b.price);
      case 'price_high':
        return list.sort((a, b) => b.price - a.price);
      case 'discount':
        return list.sort((a, b) => {
          const discA = Math.round(((a.price * 1.55 - a.price) / (a.price * 1.55)) * 100);
          const discB = Math.round(((b.price * 1.55 - b.price) / (b.price * 1.55)) * 100);
          return discB - discA;
        });
      case 'newest':
        return list.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case 'popularity':
      case 'relevance':
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  // Compute category count based on current unfiltered catalog
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const name = p.category?.name || 'Other';
      counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Sidebar Filter Content (Shared between desktop and mobile bottom drawer)
  const FilterContent = (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dfe3dd]">
        <div className="flex items-center gap-1.5 font-bold text-sm text-[#182018]">
          <SlidersHorizontal size={15} className="text-[#2f7a54]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[11px] font-bold text-[#ff745e] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} />
            <span>CLEAR ALL</span>
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="pb-3 border-b border-[#dfe3dd] space-y-1.5">
          <span className="text-[10px] font-extrabold text-[#687068] uppercase tracking-wider block">
            Active Filters
          </span>
          <div className="flex flex-wrap gap-1.5">
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 bg-[#f5f6f1] border border-[#dfe3dd] text-[#182018] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 bg-[#baf2cd]/30 border border-[#baf2cd] text-[#183d2f] px-2 py-0.5 rounded-full text-[10px] font-semibold"
              >
                {cat}
                <button onClick={() => toggleCategory(cat)} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            ))}
            {(minPrice !== '' || maxPrice !== '') && (
              <span className="inline-flex items-center gap-1 bg-[#f5f6f1] border border-[#dfe3dd] text-[#182018] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="hover:text-red-500"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {minRating !== null && (
              <span className="inline-flex items-center gap-1 bg-[#f5f6f1] border border-[#dfe3dd] text-[#182018] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                {minRating}★ & above
                <button onClick={() => setMinRating(null)} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
            {minDiscount !== null && (
              <span className="inline-flex items-center gap-1 bg-[#f5f6f1] border border-[#dfe3dd] text-[#182018] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                {minDiscount}%+ Off
                <button onClick={() => setMinDiscount(null)} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
            {assuredOnly && (
              <span className="inline-flex items-center gap-1 bg-[#2f7a54]/10 border border-[#2f7a54]/30 text-[#2f7a54] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                Assured
                <button onClick={() => setAssuredOnly(false)} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Goodfinds Assured Checkbox */}
      <div className="pb-3 border-b border-[#dfe3dd]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={assuredOnly}
            onChange={(e) => setAssuredOnly(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#2f7a54] rounded cursor-pointer"
          />
          <div className="flex items-center gap-1 font-bold text-[#183d2f] text-xs">
            <CheckCircle2 size={13} className="text-[#2f7a54]" />
            <span>Goodfinds Assured</span>
          </div>
        </label>
        <p className="text-[10px] text-[#687068] ml-5 mt-0.5">
          Quality verified, instant refund guarantee
        </p>
      </div>

      {/* Categories Accordion */}
      <div className="pb-3 border-b border-[#dfe3dd]">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between font-bold text-[#182018] py-1 cursor-pointer"
        >
          <span className="uppercase text-[11px] tracking-wider text-[#687068]">CATEGORIES</span>
          {openSections.categories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.categories && (
          <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const count = categoryCounts[cat.name] || 0;
              const isChecked = selectedCategories.includes(cat.name);
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between py-1 px-1 rounded hover:bg-[#f5f6f1] cursor-pointer text-[#182018]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat.name)}
                      className="w-3.5 h-3.5 accent-[#2f7a54] rounded cursor-pointer flex-shrink-0"
                    />
                    <span className={`truncate text-xs ${isChecked ? 'font-bold text-[#2f7a54]' : ''}`}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#687068] font-medium flex-shrink-0 ml-1">
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Accordion */}
      <div className="pb-3 border-b border-[#dfe3dd]">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-bold text-[#182018] py-1 cursor-pointer"
        >
          <span className="uppercase text-[11px] tracking-wider text-[#687068]">PRICE</span>
          {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.price && (
          <div className="mt-2 space-y-2.5">
            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRICE_PRESETS.map((preset, idx) => {
                const isSelected = minPrice === preset.min && maxPrice === preset.max;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isSelected) {
                        setMinPrice('');
                        setMaxPrice('');
                      } else {
                        setMinPrice(preset.min);
                        setMaxPrice(preset.max);
                      }
                    }}
                    className={`text-[10.5px] py-1 px-1.5 rounded-lg border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#183d2f] text-white border-[#183d2f] font-bold'
                        : 'bg-[#f5f6f1] text-[#182018] border-[#dfe3dd] hover:border-[#2f7a54]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Min / Max Inputs */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1">
                <span className="text-[10px] text-[#687068] block mb-0.5">Min (₹)</span>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-[#f5f6f1] border border-[#dfe3dd] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#2f7a54]"
                />
              </div>
              <span className="text-[#687068] mt-4 font-bold text-xs">to</span>
              <div className="flex-1">
                <span className="text-[10px] text-[#687068] block mb-0.5">Max (₹)</span>
                <input
                  type="number"
                  placeholder="2000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-[#f5f6f1] border border-[#dfe3dd] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#2f7a54]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Ratings Accordion */}
      <div className="pb-3 border-b border-[#dfe3dd]">
        <button
          onClick={() => toggleSection('ratings')}
          className="w-full flex items-center justify-between font-bold text-[#182018] py-1 cursor-pointer"
        >
          <span className="uppercase text-[11px] tracking-wider text-[#687068]">CUSTOMER RATINGS</span>
          {openSections.ratings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.ratings && (
          <div className="mt-2 space-y-1.5">
            {RATING_PRESETS.map((preset) => (
              <label
                key={preset.value}
                className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-[#f5f6f1]"
              >
                <input
                  type="checkbox"
                  checked={minRating === preset.value}
                  onChange={() => setMinRating(minRating === preset.value ? null : preset.value)}
                  className="w-3.5 h-3.5 accent-[#2f7a54] rounded cursor-pointer"
                />
                <span className="text-xs text-[#182018] flex items-center gap-1 font-medium">
                  {preset.value} <Star size={11} className="fill-[#2f7a54] text-[#2f7a54]" /> & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount Accordion */}
      <div className="pb-3 border-b border-[#dfe3dd]">
        <button
          onClick={() => toggleSection('discount')}
          className="w-full flex items-center justify-between font-bold text-[#182018] py-1 cursor-pointer"
        >
          <span className="uppercase text-[11px] tracking-wider text-[#687068]">DISCOUNT</span>
          {openSections.discount ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSections.discount && (
          <div className="mt-2 space-y-1.5">
            {DISCOUNT_PRESETS.map((preset) => (
              <label
                key={preset.value}
                className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-[#f5f6f1]"
              >
                <input
                  type="checkbox"
                  checked={minDiscount === preset.value}
                  onChange={() => setMinDiscount(minDiscount === preset.value ? null : preset.value)}
                  className="w-3.5 h-3.5 accent-[#2f7a54] rounded cursor-pointer"
                />
                <span className="text-xs text-[#182018] font-medium">{preset.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#2f7a54] rounded cursor-pointer"
          />
          <span className="text-xs font-semibold text-[#182018]">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Mobile Top Controls Bar: Sticky Filter & Sort trigger */}
      <div className="lg:hidden flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#dfe3dd] shadow-2xs">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#182018] px-3 py-1.5 rounded-lg bg-[#f5f6f1] border border-[#dfe3dd] cursor-pointer"
        >
          <SlidersHorizontal size={14} className="text-[#2f7a54]" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#ff745e]" />
          )}
        </button>

        {/* Mobile Sort Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-[#f5f6f1] text-[#182018] text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-[#dfe3dd] focus:outline-none"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="popularity">Popularity</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="discount">Discount</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[#dfe3dd] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#183d2f] text-white' : 'bg-white text-[#687068]'}`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-[#183d2f] text-white' : 'bg-white text-[#687068]'}`}
            >
              <ListIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Flipkart Layout: Left Sidebar + Right Products Grid */}
      <div className="flex items-start gap-4">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-[#dfe3dd] p-4 shadow-2xs sticky top-20">
          {FilterContent}
        </aside>

        {/* Right Catalog Main Container */}
        <main className="flex-1 min-w-0 space-y-3">
          {/* Desktop Flipkart Horizontal Sort Tabs */}
          <div className="hidden lg:flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#dfe3dd] shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#182018]">Sort By</span>
              <div className="flex items-center gap-1 text-xs">
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'popularity', label: 'Popularity' },
                  { id: 'price_low', label: 'Price -- Low to High' },
                  { id: 'price_high', label: 'Price -- High to Low' },
                  { id: 'newest', label: 'Newest First' },
                  { id: 'discount', label: 'Discount' },
                ].map((tab) => {
                  const isActive = sortOption === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSortOption(tab.id as SortOption)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        isActive
                          ? 'text-[#2f7a54] border-b-2 border-[#2f7a54] bg-[#f5f6f1]'
                          : 'text-[#687068] hover:text-[#182018] hover:bg-[#f5f6f1]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid vs List View Toggle */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#687068] font-medium mr-2">
                Showing {sortedProducts.length} items
              </span>
              <div className="flex items-center border border-[#dfe3dd] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-[#183d2f] text-white' : 'bg-white text-[#687068] hover:bg-[#f5f6f1]'}`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition ${viewMode === 'list' ? 'bg-[#183d2f] text-white' : 'bg-white text-[#687068] hover:bg-[#f5f6f1]'}`}
                  title="List View"
                >
                  <ListIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Items Display */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#dfe3dd] p-8 sm:p-12 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#f5f6f1] text-[#2f7a54] flex items-center justify-center mx-auto">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182018]">No products match your criteria</h3>
                <p className="text-xs text-[#687068] mt-1">
                  Try adjusting or clearing some filters to see available catalog selections.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 bg-[#183d2f] hover:bg-[#2f7a54] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4">
              {sortedProducts.map((product) => {
                const retail = product.price;
                const fakeOriginal = Math.round(retail * 1.55);
                const discount = Math.round(((fakeOriginal - retail) / fakeOriginal) * 100);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-[#dfe3dd] hover:border-[#2f7a54] hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="block relative aspect-square bg-[#f5f6f1] overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-[#ff745e] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        {discount}% OFF
                      </span>
                      {product.category?.name && (
                        <span className="hidden sm:inline-block absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-[#182018] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#dfe3dd] shadow-2xs">
                          {product.category.name}
                        </span>
                      )}
                    </Link>

                    <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="inline-flex items-center gap-0.5 bg-[#2f7a54] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded">
                            <span>4.4</span>
                            <Star size={9} fill="currentColor" />
                          </span>
                          <span className="text-[#687068] text-[10px] font-medium hidden sm:inline">(840+)</span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#183d2f] bg-[#baf2cd]/40 px-1.5 py-0.5 rounded">
                            <CheckCircle2 size={10} className="text-[#2f7a54]" />
                            <span>Assured</span>
                          </span>
                        </div>

                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-bold text-[#182018] text-xs sm:text-sm leading-snug line-clamp-2 hover:text-[#2f7a54] transition">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-[#dfe3dd] space-y-2">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base md:text-lg font-black text-[#182018]">
                            ₹{retail}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-[#687068] line-through">
                            ₹{fakeOriginal}
                          </span>
                          <span className="text-[10px] font-bold text-[#2f7a54]">
                            Save ₹{fakeOriginal - retail}
                          </span>
                        </div>

                        <div className="text-[9.5px] text-[#687068]">
                          Free Delivery • <span className="text-[#2f7a54] font-semibold">COD Available</span>
                        </div>

                        <AddToCartButton
                          product={{
                            id: product.id,
                            name: product.name,
                            price: retail,
                            image: product.image,
                          }}
                          showBuyNow={true}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST ROW VIEW (Flipkart Style Rows) */
            <div className="space-y-3">
              {sortedProducts.map((product) => {
                const retail = product.price;
                const fakeOriginal = Math.round(retail * 1.55);
                const discount = Math.round(((fakeOriginal - retail) / fakeOriginal) * 100);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#dfe3dd] hover:border-[#2f7a54] hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-5 group"
                  >
                    {/* Left Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-[#f5f6f1] flex-shrink-0 relative"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-[#ff745e] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        {discount}% OFF
                      </span>
                    </Link>

                    {/* Middle Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-0.5 bg-[#2f7a54] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                            <span>4.4</span>
                            <Star size={10} fill="currentColor" />
                          </span>
                          <span className="text-[#687068] text-xs font-medium">(1,240 ratings)</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#183d2f] bg-[#baf2cd]/40 px-2 py-0.5 rounded">
                            <CheckCircle2 size={11} className="text-[#2f7a54]" />
                            <span>Goodfinds Assured</span>
                          </span>
                        </div>

                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-bold text-[#182018] text-sm sm:text-base hover:text-[#2f7a54] transition leading-snug">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#687068] line-clamp-2 mt-1">
                          {product.description}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[#687068]">
                          <span className="bg-[#f5f6f1] px-2 py-0.5 rounded border border-[#dfe3dd]">
                            Category: {product.category?.name || 'Exclusive'}
                          </span>
                          <span className="bg-[#f5f6f1] px-2 py-0.5 rounded border border-[#dfe3dd] text-[#2f7a54] font-semibold">
                            ✓ 7 Days Replacement
                          </span>
                          <span className="bg-[#f5f6f1] px-2 py-0.5 rounded border border-[#dfe3dd] text-[#183d2f] font-semibold">
                            ✓ Cash on Delivery Eligible
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#2f7a54] font-medium">
                        Free delivery by <span className="font-bold">Tomorrow, 9 PM</span>
                      </div>
                    </div>

                    {/* Right Pricing & Actions */}
                    <div className="sm:w-52 flex-shrink-0 pt-3 sm:pt-0 sm:border-l sm:border-[#dfe3dd] sm:pl-5 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-black text-[#182018]">
                            ₹{retail}
                          </span>
                          <span className="text-xs text-[#687068] line-through">
                            ₹{fakeOriginal}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#2f7a54] block mt-0.5">
                          {discount}% off • Save ₹{fakeOriginal - retail}
                        </span>
                        <span className="text-[10px] text-[#687068] block mt-0.5">
                          Free Express Shipping
                        </span>
                      </div>

                      <div className="w-full">
                        <AddToCartButton
                          product={{
                            id: product.id,
                            name: product.name,
                            price: retail,
                            image: product.image,
                          }}
                          showBuyNow={true}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer (Bottom Sheet) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#dfe3dd] flex items-center justify-between bg-[#f5f6f1]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#2f7a54]" />
                <h3 className="font-bold text-sm text-[#182018]">Filters & Refinements</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 text-[#182018]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Filter Area */}
            <div className="p-4 overflow-y-auto flex-1">
              {FilterContent}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-[#dfe3dd] bg-white flex items-center gap-3">
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#dfe3dd] text-xs font-bold text-[#182018] hover:bg-[#f5f6f1] transition"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#183d2f] text-white text-xs font-bold hover:bg-[#2f7a54] transition shadow-md"
              >
                Apply ({sortedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
