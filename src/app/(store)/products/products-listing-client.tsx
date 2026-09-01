"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils";

interface ProductsListingClientProps {
  products: ProductCardData[];
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
  currentCategory?: string;
  currentBrand?: string;
  currentSort?: string;
  currentSearch?: string;
}

export function ProductsListingClient({
  products,
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort,
  currentSearch,
}: ProductsListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFiltersCount = [currentCategory, currentBrand, currentSearch].filter(Boolean).length;

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    updateParam("sort", newSort === "default" ? null : newSort);
  };

  const clearAllFilters = () => {
    router.push("/products");
    setMobileFilterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Mobile Filter & Sort Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-border lg:hidden shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 h-9 rounded-xl text-xs font-bold gap-1.5"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-black text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        <div className="flex-1">
          <select
            value={currentSort || "default"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-border bg-surface-secondary/80 px-3 text-xs font-bold text-text focus:border-primary-600 focus:outline-none"
          >
            <option value="default">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 2. Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-text-muted font-semibold">Active:</span>

          {currentCategory && (
            <button
              onClick={() => updateParam("category", null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 px-3 py-1 font-bold text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <span>Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {currentBrand && (
            <button
              onClick={() => updateParam("brand", null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 px-3 py-1 font-bold text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <span>Brand: {brands.find((b) => b.slug === currentBrand)?.name || currentBrand}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {currentSearch && (
            <button
              onClick={() => updateParam("search", null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 px-3 py-1 font-bold text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <span>Search: "{currentSearch}"</span>
              <X className="h-3 w-3" />
            </button>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[11px] font-bold text-red-600 hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 3. Main Grid Layout: Sidebar + Products Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
        {/* Desktop Sidebar (Left 1 Col) */}
        <aside className="hidden lg:block space-y-6 rounded-3xl border border-border bg-white p-6 shadow-card sticky top-24">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-sm font-black text-text flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-primary-600" />
              Filter Catalogue
            </h3>
            {activeFiltersCount > 0 && (
              <button onClick={clearAllFilters} className="text-xs font-bold text-red-600 hover:underline">
                Reset
              </button>
            )}
          </div>

          {/* Categories Section */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-text">Categories</span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam("category", null)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                  !currentCategory
                    ? "bg-primary-50 text-primary-700 font-bold"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text"
                )}
              >
                <span>All Categories</span>
                {!currentCategory && <Check className="h-3.5 w-3.5" />}
              </button>

              {categories.map((c) => {
                const isSelected = currentCategory === c.slug;
                return (
                  <button
                    key={c.id}
                    onClick={() => updateParam("category", isSelected ? null : c.slug)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-primary-50 text-primary-700 font-bold"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text"
                    )}
                  >
                    <span>{c.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Section */}
          <div className="space-y-2.5 pt-4 border-t border-border">
            <span className="text-xs font-black uppercase tracking-wider text-text">Brands</span>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam("brand", null)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                  !currentBrand
                    ? "bg-primary-50 text-primary-700 font-bold"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text"
                )}
              >
                <span>All Brands</span>
                {!currentBrand && <Check className="h-3.5 w-3.5" />}
              </button>

              {brands.map((b) => {
                const isSelected = currentBrand === b.slug;
                return (
                  <button
                    key={b.id}
                    onClick={() => updateParam("brand", isSelected ? null : b.slug)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-primary-50 text-primary-700 font-bold"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text"
                    )}
                  >
                    <span>{b.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Products Grid Column (Right 3 Cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Top Desktop Sort & Results Counter */}
          <div className="hidden lg:flex items-center justify-between border-b border-border pb-3">
            <p className="text-xs font-bold text-text-muted">
              Showing <strong className="text-text">{products.length}</strong> authentic products
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-medium">Sort by:</span>
              <select
                value={currentSort || "default"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-8 rounded-xl border border-border bg-white px-3 text-xs font-bold text-text focus:border-primary-600 focus:outline-none"
              >
                <option value="default">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary mx-auto text-text-muted">
                <ShoppingBag className="h-7 w-7 stroke-[1.2]" />
              </div>
              <h3 className="text-base font-bold text-text">No products match your filter criteria</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Try removing applied filters or searching for alternative skincare actives and brands.
              </p>
              <Button size="sm" onClick={clearAllFilters} className="text-xs font-bold mt-2">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Mobile Filter Bottom Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary-600" />
                <h3 className="font-extrabold text-base text-text">Filter Products</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* Categories */}
              <div className="space-y-2">
                <span className="font-bold text-text uppercase tracking-wider text-[11px]">Categories</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => updateParam("category", null)}
                    className={cn(
                      "rounded-xl border p-2.5 text-left font-semibold",
                      !currentCategory ? "border-primary-600 bg-primary-50 text-primary-700" : "border-border bg-white text-text"
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateParam("category", currentCategory === c.slug ? null : c.slug)}
                      className={cn(
                        "rounded-xl border p-2.5 text-left font-semibold truncate",
                        currentCategory === c.slug ? "border-primary-600 bg-primary-50 text-primary-700 font-bold" : "border-border bg-white text-text"
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2 pt-3 border-t border-border">
                <span className="font-bold text-text uppercase tracking-wider text-[11px]">Brands</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => updateParam("brand", null)}
                    className={cn(
                      "rounded-xl border p-2.5 text-left font-semibold",
                      !currentBrand ? "border-primary-600 bg-primary-50 text-primary-700" : "border-border bg-white text-text"
                    )}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateParam("brand", currentBrand === b.slug ? null : b.slug)}
                      className={cn(
                        "rounded-xl border p-2.5 text-left font-semibold truncate",
                        currentBrand === b.slug ? "border-primary-600 bg-primary-50 text-primary-700 font-bold" : "border-border bg-white text-text"
                      )}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-border p-4 bg-surface-secondary/50 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex-1 h-11 rounded-xl text-xs font-bold"
              >
                Reset All
              </Button>
              <Button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 h-11 rounded-xl text-xs font-bold bg-primary-600 text-white"
              >
                Show Results ({products.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
