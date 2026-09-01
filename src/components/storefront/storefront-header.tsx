"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  Phone,
  Truck,
  ChevronDown,
  ShieldCheck,
  Tag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/shared/ui/button";
import { createClient } from "@/lib/supabase/client";

interface SearchResult {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    regular_price: number;
    sale_price: number | null;
    og_image_url: string | null;
    brands: { name: string } | null;
  }>;
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
}

export function StorefrontHeader() {
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const { itemCount, openCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Check auth user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white shadow-sm">
      {/* 1. Announcement Bar */}
      <div className="bg-zinc-900 px-4 py-2 text-white text-[11px] sm:text-xs">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              Flash Deal
            </span>
            <span className="hidden sm:inline">
              🚚 Free delivery on all orders over ৳2,500 inside Dhaka!
            </span>
            <span className="sm:hidden">🚚 Free delivery over ৳2,500!</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <Link href="/quiz" className="flex items-center gap-1 text-primary-300 hover:text-white font-semibold transition-colors">
              <Sparkles className="h-3 w-3" />
              <span>Routine Quiz</span>
            </Link>
            <span className="hidden md:inline text-zinc-600">|</span>
            <a href="tel:+8801700000000" className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="h-3 w-3" />
              <span>+880 1700-000000</span>
            </a>
            <span className="hidden md:inline text-zinc-600">|</span>
            <Link href="/track-order" className="hover:text-white transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="container-main py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-text hover:bg-surface-secondary lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 font-extrabold text-white text-base shadow-sm">
                eX
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-text">
                ecom<span className="text-primary-600">X</span>
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar with Live Suggestions */}
          <div ref={searchContainerRef} className="relative hidden lg:block flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search authentic skincare, brands, makeup..."
                className="w-full rounded-full border border-border bg-surface-secondary/70 py-2.5 pl-11 pr-24 text-xs sm:text-sm text-text placeholder:text-text-muted focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-600/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-4 h-7 text-xs font-semibold"
              >
                Search
              </Button>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {showSearchDropdown && searchResults && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl animate-in fade-in-0 zoom-in-95">
                {isSearching ? (
                  <div className="p-6 text-center text-xs text-text-muted">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary-600" />
                    <p className="mt-2">Searching catalogue...</p>
                  </div>
                ) : (
                  <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
                    {/* Matching Categories */}
                    {searchResults.categories.length > 0 && (
                      <div>
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Categories
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {searchResults.categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setShowSearchDropdown(false)}
                              className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-text hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Brands */}
                    {searchResults.brands.length > 0 && (
                      <div>
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Brands
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {searchResults.brands.map((b) => (
                            <Link
                              key={b.id}
                              href={`/products?brand=${b.slug}`}
                              onClick={() => setShowSearchDropdown(false)}
                              className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-text hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            >
                              {b.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products */}
                    {searchResults.products.length > 0 ? (
                      <div className="pt-2 border-t border-border">
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Products
                        </span>
                        <div className="mt-1 space-y-1">
                          {searchResults.products.map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/products/${prod.slug}`}
                              onClick={() => setShowSearchDropdown(false)}
                              className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-secondary transition-colors"
                            >
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-secondary">
                                {prod.og_image_url ? (
                                  <img
                                    src={prod.og_image_url}
                                    alt={prod.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                                    <ShoppingBag className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-xs font-medium text-text">
                                  {prod.name}
                                </p>
                                <div className="flex items-center gap-2 text-[11px]">
                                  <span className="font-bold text-primary-700">
                                    {formatPrice(prod.sale_price ?? prod.regular_price)}
                                  </span>
                                  {prod.sale_price && (
                                    <span className="text-text-muted line-through">
                                      {formatPrice(prod.regular_price)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="p-4 text-center text-xs text-text-muted">
                        No direct product matches. Press Enter to view all results.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons (Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex items-center justify-center rounded-xl p-2 text-text hover:bg-surface-secondary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center rounded-xl p-2 text-text hover:bg-surface-secondary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Account / Login */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-secondary transition-colors"
              >
                <User className="h-4 w-4 text-primary-600" />
                <span className="hidden sm:inline">Account</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-border bg-surface-secondary/70 py-2 pl-10 pr-4 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:bg-white focus:outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          </form>
        </div>
      </div>

      {/* 3. Category Desktop Navigation Bar */}
      <nav className="hidden lg:block border-t border-border bg-surface-secondary/50">
        <div className="container-main flex items-center gap-8 text-xs font-semibold text-text py-2.5">
          <Link href="/products" className="flex items-center gap-1 text-primary-700 hover:text-primary-800">
            <Sparkles className="h-3.5 w-3.5" />
            All Products
          </Link>
          <Link href="/products?category=skin-care" className="hover:text-primary-600 transition-colors">
            Skin Care
          </Link>
          <Link href="/products?category=hair-care" className="hover:text-primary-600 transition-colors">
            Hair Care
          </Link>
          <Link href="/products?category=makeup" className="hover:text-primary-600 transition-colors">
            Makeup
          </Link>
          <Link href="/products?category=body-care" className="hover:text-primary-600 transition-colors">
            Body Care
          </Link>
          <Link href="/brands" className="hover:text-primary-600 transition-colors">
            Brands
          </Link>
          <Link href="/offers" className="flex items-center gap-1 text-accent-600 hover:text-accent-700 font-bold ml-auto">
            <Tag className="h-3.5 w-3.5" />
            Special Offers
          </Link>
        </div>
      </nav>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 font-extrabold text-white text-sm">
                  eX
                </div>
                <span className="text-xl font-extrabold tracking-tight text-text">
                  ecom<span className="text-primary-600">X</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto space-y-4 text-sm">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-bold text-primary-600"
              >
                <Sparkles className="h-4 w-4" />
                All Products
              </Link>
              <div className="space-y-2 border-t border-border pt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Categories
                </span>
                <div className="space-y-1 text-text font-medium">
                  <Link href="/products?category=skin-care" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-primary-600">Skin Care</Link>
                  <Link href="/products?category=hair-care" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-primary-600">Hair Care</Link>
                  <Link href="/products?category=makeup" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-primary-600">Makeup</Link>
                  <Link href="/products?category=body-care" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-primary-600">Body Care</Link>
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Explore
                </span>
                <div className="space-y-1 text-text font-medium">
                  <Link href="/brands" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-primary-600">Brands</Link>
                  <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-accent-600 font-bold">Special Offers</Link>
                  <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-primary-600">Track Order</Link>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-surface-secondary py-2.5 text-sm font-bold text-text"
                >
                  <User className="h-4 w-4" /> My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  <User className="h-4 w-4" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
