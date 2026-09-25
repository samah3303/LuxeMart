import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/actions/productActions';
import { ProductCatalogClient } from '@/components/ProductCatalogClient';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams?: Promise<{ category?: string; search?: string }> | { category?: string; search?: string };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialCategory = resolvedParams.category || '';
  const initialSearch = resolvedParams.search || '';

  const [{ products }, { categories }] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="pb-16 space-y-4 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Catalog Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dfe3dd] pb-3">
        <div className="flex items-center gap-2 text-xs text-[#687068]">
          <Link href="/" className="hover:text-[#183d2f] font-semibold flex items-center gap-1 transition">
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-[#182018]">
            {initialCategory ? initialCategory : 'All Products'}
          </span>
          {initialSearch && (
            <>
              <span>/</span>
              <span className="italic text-[#2f7a54]">Search: "{initialSearch}"</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2f7a54] bg-[#baf2cd]/30 px-2.5 py-1 rounded-full border border-[#baf2cd]">
            <Sparkles size={11} />
            <span>{products.length} Verified Items</span>
          </div>
        </div>
      </div>

      {/* Catalog Client Engine with Suspense */}
      <Suspense fallback={<CatalogLoadingSkeleton />}>
        <ProductCatalogClient
          products={products}
          categories={categories}
          initialCategory={initialCategory}
          initialSearch={initialSearch}
        />
      </Suspense>
    </div>
  );
}

function CatalogLoadingSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <div className="hidden lg:block w-64 h-96 bg-white rounded-2xl border border-[#dfe3dd] animate-pulse" />
      <div className="flex-1 space-y-4">
        <div className="h-12 bg-white rounded-xl border border-[#dfe3dd] animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-[#dfe3dd] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
