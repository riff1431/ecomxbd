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
  DollarSign,
  Search,
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
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

const PRICE_PRESETS = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ৳500", min: null, max: "500" },
  { label: "৳500 - ৳1,000", min: "500", max: "1000" },
  { label: "৳1,000 - ৳2,000", min: "1000", max: "2000" },
  { label: "Above ৳2,000", min: "2000", max: null },
];

export function ProductsListingClient({
  products,
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
}: ProductsListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Custom price input local state
  const [customMin, setCustomMin] = useState(currentMinPrice || "");
  const [customMax, setCustomMax] = useState(currentMaxPrice || "");

  // Search within brand & category lists
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [catSearchTerm, setCatSearchTerm] = useState("");

  const activeFiltersCount = [
    currentCategory,
    currentBrand,
    currentSearch,
    currentMinPrice || currentMaxPrice ? "price" : null,
  ].filter(Boolean).length;

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const updatePriceRange = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("min_price", min);
    else params.delete("min_price");

    if (max) params.set("max_price", max);
    else params.delete("max_price");

    router.push(`/products?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const applyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updatePriceRange(customMin.trim() || null, customMax.trim() || null);
  };

  const handleSortChange = (newSort: string) => {
    updateParam("sort", newSort === "default" ? null : newSort);
  };

  const clearAllFilters = () => {
    router.push("/products");
    setCustomMin("");
    setCustomMax("");
    setMobileFilterOpen(false);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearchTerm.toLowerCase())
  );

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
  );

  // Filter content component reused in both desktop sidebar & mobile drawer
  const FilterContent = () => (
    <div className="space-y-6">
      {/* 1. FILTER BY PRICE (Top Section) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
            <span className="text-[#e91e63]">৳</span> Filter by Price
          </span>
          {(currentMinPrice || currentMaxPrice) && (
            <button
              type="button"
              onClick={() => updatePriceRange(null, null)}
              className="text-[10px] font-bold text-red-600 hover:underline"
            >
              Reset Price
            </button>
          )}
        </div>

        {/* Quick Price Preset Chips */}
        <div className="grid grid-cols-1 gap-1.5">
          {PRICE_PRESETS.map((preset, idx) => {
            const isSelected =
              preset.min === (currentMinPrice || null) &&
              preset.max === (currentMaxPrice || null);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomMin(preset.min || "");
                  setCustomMax(preset.max || "");
                  updatePriceRange(preset.min, preset.max);
                }}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all text-left",
                  isSelected
                    ? "bg-pink-50 text-[#e91e63] border border-pink-200 shadow-2xs"
                    : "text-gray-700 bg-gray-50/70 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[#e91e63]" />}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <form onSubmit={applyCustomPrice} className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">৳</span>
              <input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-6 pr-2 py-1.5 text-xs font-bold focus:border-[#e91e63] focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-gray-400 font-bold text-xs">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">৳</span>
              <input
                type="number"
                placeholder="Max"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-6 pr-2 py-1.5 text-xs font-bold focus:border-[#e91e63] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 py-1.5 text-[11px] font-bold text-white hover:bg-[#e91e63] transition-colors"
          >
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* 2. FILTER BY BRAND (Middle Section) */}
      <div className="space-y-3 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-gray-900">
            Filter by Brand
          </span>
          {currentBrand && (
            <button
              type="button"
              onClick={() => updateParam("brand", null)}
              className="text-[10px] font-bold text-red-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Brand Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={brandSearchTerm}
            onChange={(e) => setBrandSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-2 py-1 text-[11px] focus:border-[#e91e63] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => {
              updateParam("brand", null);
              setMobileFilterOpen(false);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left",
              !currentBrand
                ? "bg-pink-50 text-[#e91e63] font-bold border border-pink-200 shadow-2xs"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <span>All Brands</span>
            {!currentBrand && <Check className="h-3.5 w-3.5 text-[#e91e63]" />}
          </button>

          {filteredBrands.map((b) => {
            const isSelected = currentBrand === b.slug;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  updateParam("brand", isSelected ? null : b.slug);
                  setMobileFilterOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left",
                  isSelected
                    ? "bg-pink-50 text-[#e91e63] font-bold border border-pink-200 shadow-2xs"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span>{b.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[#e91e63]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRODUCT CATEGORIES (Bottom Section) */}
      <div className="space-y-3 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-gray-900">
            Product Categories
          </span>
          {currentCategory && (
            <button
              type="button"
              onClick={() => updateParam("category", null)}
              className="text-[10px] font-bold text-red-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Category Search Filter if > 6 categories */}
        {categories.length > 6 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={catSearchTerm}
              onChange={(e) => setCatSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-2 py-1 text-[11px] focus:border-[#e91e63] focus:bg-white focus:outline-none"
            />
          </div>
        )}

        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => {
              updateParam("category", null);
              setMobileFilterOpen(false);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left",
              !currentCategory
                ? "bg-pink-50 text-[#e91e63] font-bold border border-pink-200 shadow-2xs"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <span>All Categories</span>
            {!currentCategory && <Check className="h-3.5 w-3.5 text-[#e91e63]" />}
          </button>

          {filteredCategories.map((c) => {
            const isSelected = currentCategory === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  updateParam("category", isSelected ? null : c.slug);
                  setMobileFilterOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left",
                  isSelected
                    ? "bg-pink-50 text-[#e91e63] font-bold border border-pink-200 shadow-2xs"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span>{c.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-[#e91e63]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. Mobile Filter & Sort Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 lg:hidden shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 h-9 rounded-xl text-xs font-bold gap-1.5 border-gray-200 text-gray-800"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#e91e63]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#e91e63] px-1 text-[10px] font-black text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        <div className="flex-1">
          <select
            value={currentSort || "default"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs font-bold text-gray-800 focus:border-[#e91e63] focus:bg-white focus:outline-none"
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
          <span className="text-gray-500 font-semibold">Active Filters:</span>

          {currentMinPrice && (
            <button
              onClick={() => updatePriceRange(null, currentMaxPrice || null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-3 py-1 font-bold text-[#e91e63] hover:bg-pink-100 transition-colors"
            >
              <span>Min Price: ৳{currentMinPrice}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {currentMaxPrice && (
            <button
              onClick={() => updatePriceRange(currentMinPrice || null, null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-3 py-1 font-bold text-[#e91e63] hover:bg-pink-100 transition-colors"
            >
              <span>Max Price: ৳{currentMaxPrice}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {currentCategory && (
            <button
              onClick={() => updateParam("category", null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-3 py-1 font-bold text-[#e91e63] hover:bg-pink-100 transition-colors"
            >
              <span>Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {currentBrand && (
            <button
              onClick={() => updateParam("brand", null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-3 py-1 font-bold text-[#e91e63] hover:bg-pink-100 transition-colors"
            >
              <span>Brand: {brands.find((b) => b.slug === currentBrand)?.name || currentBrand}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {currentSearch && (
            <button
              onClick={() => updateParam("search", null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200 px-3 py-1 font-bold text-[#e91e63] hover:bg-pink-100 transition-colors"
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
        {/* Desktop Sidebar (Left 1 Col) - Structured exactly: Filter by Price -> Product Categories -> Filter by Brand */}
        <aside className="hidden lg:block space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#e91e63]" />
              Filter Catalogue
            </h3>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Render Reusable Filter Content */}
          <FilterContent />
        </aside>

        {/* Products Grid Column (Right 3 Cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Top Desktop Sort & Results Counter */}
          <div className="hidden lg:flex items-center justify-between border-b border-gray-100 pb-3">
            <p className="text-xs font-bold text-gray-500">
              Showing <strong className="text-gray-900">{products.length}</strong> authentic products
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={currentSort || "default"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-8 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-800 focus:border-[#e91e63] focus:outline-none"
              >
                <option value="default">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid with Staggered Fade-In */}
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 mx-auto text-gray-400">
                <ShoppingBag className="h-7 w-7 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">No Products Match Your Filter</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting the price range, category, or brand filter to see more results.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="rounded-xl text-xs font-bold text-[#e91e63] border-pink-200 hover:bg-pink-50"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  className="animate-stagger-item"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#e91e63]" />
                <h3 className="text-sm font-black text-gray-900">Filter Products</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent />
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50">
              <Button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-xl bg-[#e91e63] hover:bg-[#d81b60] text-white font-black text-xs py-2.5 shadow-md"
              >
                Show Results ({products.length})
              </Button>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="w-full text-center text-xs font-bold text-gray-500 hover:text-red-600"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
