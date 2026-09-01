"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight,
  Loader2,
  HelpCircle,
  Clock,
  Compass,
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

const CATEGORY_NAV = [
  {
    name: "Skin Care",
    slug: "skin-care",
    subcategories: [
      { name: "Cleansers & Facewash", slug: "skin-care?type=cleanser" },
      { name: "Toners & Mists", slug: "skin-care?type=toner" },
      { name: "Serums & Ampoules", slug: "skin-care?type=serum" },
      { name: "Moisturizers & Creams", slug: "skin-care?type=moisturizer" },
      { name: "Sunscreen & SPF", slug: "skin-care?type=sunscreen" },
      { name: "Eye Care & Lip Care", slug: "skin-care?type=eye-lip" },
    ],
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    subcategories: [
      { name: "Shampoos", slug: "hair-care?type=shampoo" },
      { name: "Conditioners & Masks", slug: "hair-care?type=conditioner" },
      { name: "Hair Oils & Serums", slug: "hair-care?type=oil" },
      { name: "Scalp Treatments", slug: "hair-care?type=treatment" },
    ],
  },
  {
    name: "Makeup",
    slug: "makeup",
    subcategories: [
      { name: "Foundations & BB Creams", slug: "makeup?type=foundation" },
      { name: "Lipsticks & Tints", slug: "makeup?type=lip" },
      { name: "Eyes & Eyeliners", slug: "makeup?type=eyes" },
      { name: "Setting Sprays & Powders", slug: "makeup?type=setting" },
    ],
  },
  {
    name: "Body Care",
    slug: "body-care",
    subcategories: [
      { name: "Body Lotions & Creams", slug: "body-care?type=lotion" },
      { name: "Body Washes & Scrubs", slug: "body-care?type=wash" },
      { name: "Hand & Foot Care", slug: "body-care?type=hand-foot" },
    ],
  },
  { name: "Brands", slug: "brands", isDirect: true },
  { name: "Flash Deals", slug: "products?discount=true", isDirect: true, isSpecial: true },
  { name: "Skin Quiz", slug: "quiz", isDirect: true, isQuiz: true },
];

export function StorefrontHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();
  const { itemCount, subtotal, openCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

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

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setActiveMegaMenu(null);
  }, [pathname]);

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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white shadow-xs">
      {/* 1. Top Utility Announcement Bar */}
      <div className="bg-zinc-950 px-4 py-1.5 text-white text-[11px] sm:text-xs">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
              Free Delivery
            </span>
            <span className="hidden sm:inline text-zinc-300 font-medium">
              Free shipping inside Dhaka on orders over <strong>৳2,500</strong>!
            </span>
            <span className="sm:hidden text-zinc-300 font-medium">Free shipping over ৳2,500!</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 font-medium">
            <Link
              href="/quiz"
              className="flex items-center gap-1 text-primary-300 hover:text-white transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>Routine Finder</span>
            </Link>
            <span className="hidden md:inline text-zinc-700">|</span>
            <Link
              href="/track-order"
              className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Truck className="h-3 w-3" />
              <span>Track Order</span>
            </Link>
            <span className="hidden md:inline text-zinc-700">|</span>
            <span className="hidden sm:inline text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Authentic Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Desktop & Mobile Header Bar */}
      <div className="container-main py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Hamburger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-text hover:bg-surface-secondary lg:hidden transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 font-black text-white text-base shadow-sm group-hover:bg-primary-700 transition-colors">
                eX
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-text leading-none">
                  ecom<span className="text-primary-600">X</span>
                </span>
                <span className="text-[9px] font-semibold text-text-muted tracking-widest uppercase mt-0.5">
                  Bangladesh
                </span>
              </div>
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
                placeholder="Search authentic skincare, COSRX, serums, sunscreens..."
                className="w-full rounded-full border border-border bg-surface-secondary/80 py-2.5 pl-11 pr-24 text-xs sm:text-sm text-text placeholder:text-text-muted focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
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
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl animate-in fade-in-0 zoom-in-95">
                {isSearching ? (
                  <div className="p-6 text-center text-xs text-text-muted">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary-600" />
                    <p className="mt-2 font-medium">Searching authentic catalogue...</p>
                  </div>
                ) : searchResults && (searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.brands.length > 0) ? (
                  <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
                    {/* Matching Categories */}
                    {searchResults.categories.length > 0 && (
                      <div>
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Categories
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
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
                        <div className="mt-1 flex flex-wrap gap-1.5">
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
                    {searchResults.products.length > 0 && (
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
                              className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-surface-secondary transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {prod.og_image_url ? (
                                  <img
                                    src={prod.og_image_url}
                                    alt={prod.name}
                                    className="h-10 w-10 shrink-0 rounded-lg object-cover border border-border"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-tertiary">
                                    <ShoppingBag className="h-4 w-4 text-text-muted" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-text">{prod.name}</p>
                                  {prod.brands && (
                                    <span className="text-[10px] font-medium text-text-muted">
                                      {prod.brands.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-bold text-text">
                                  {formatPrice(prod.sale_price ?? prod.regular_price)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Trending Searches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["COSRX Snail Mucin", "Sunscreen SPF 50", "Niacinamide Serum", "Ceramide Cream", "Beauty of Joseon", "Salicylic Cleanser"].map((trend) => (
                        <button
                          key={trend}
                          onClick={() => {
                            setSearchQuery(trend);
                            router.push(`/products?search=${encodeURIComponent(trend)}`);
                            setShowSearchDropdown(false);
                          }}
                          className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-text-secondary hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          {trend}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Skin Quiz Pill Button */}
            <Link
              href="/quiz"
              className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200/80 px-3.5 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
              <span>Skin Quiz</span>
            </Link>

            {/* Wishlist Icon Button */}
            <Link
              href="/wishlist"
              className="relative rounded-xl p-2 text-text hover:bg-surface-secondary transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link Button */}
            <Link
              href={user ? "/account" : "/login"}
              className="hidden sm:flex items-center gap-2 rounded-xl p-2 text-text hover:bg-surface-secondary transition-colors text-xs font-semibold"
            >
              <User className="h-5 w-5" />
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-[10px] text-text-muted">Welcome</span>
                <span className="text-xs font-bold text-text mt-0.5">
                  {user ? "My Account" : "Sign In"}
                </span>
              </div>
            </Link>

            {/* Cart Button */}
            <Button
              onClick={openCart}
              size="sm"
              className="relative flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold px-3.5 py-2 text-xs shadow-sm transition-all active:scale-95"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-extrabold text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {itemCount > 0 ? formatPrice(subtotal) : "Bag"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Search Row (Always visible on mobile for quick discovery) */}
        <div className="mt-2.5 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skincare, makeup, brands..."
              className="w-full rounded-xl border border-border bg-surface-secondary/80 py-2 pl-10 pr-4 text-xs text-text placeholder:text-text-muted focus:border-primary-600 focus:bg-white focus:outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </form>
        </div>
      </div>

      {/* 3. Desktop Category Navigation Menu Bar */}
      <nav className="hidden lg:block border-t border-border bg-surface-secondary/40">
        <div className="container-main">
          <ul className="flex items-center gap-1 text-xs font-semibold text-text">
            <li>
              <Link
                href="/products"
                className="flex items-center gap-1 px-3.5 py-2.5 hover:text-primary-600 transition-colors"
              >
                <span>All Products</span>
              </Link>
            </li>

            {CATEGORY_NAV.map((cat) => (
              <li
                key={cat.name}
                className="relative"
                onMouseEnter={() => !cat.isDirect && setActiveMegaMenu(cat.name)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    "flex items-center gap-1 px-3.5 py-2.5 transition-colors",
                    cat.isSpecial
                      ? "text-accent-600 font-bold hover:text-accent-700"
                      : cat.isQuiz
                      ? "text-primary-600 font-bold hover:text-primary-700"
                      : "text-text hover:text-primary-600"
                  )}
                >
                  {cat.isQuiz && <Sparkles className="h-3 w-3 mr-0.5" />}
                  {cat.isSpecial && <Tag className="h-3 w-3 mr-0.5" />}
                  <span>{cat.name}</span>
                  {!cat.isDirect && <ChevronDown className="h-3 w-3 text-text-muted" />}
                </Link>

                {/* Dropdown Mega Subcategories */}
                {!cat.isDirect && activeMegaMenu === cat.name && (
                  <div className="absolute top-full left-0 z-50 w-64 rounded-2xl border border-border bg-white p-3 shadow-xl animate-in fade-in-0 zoom-in-95">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      {cat.name} Categories
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {cat.subcategories?.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            href={`/products?category=${sub.slug}`}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            <span>{sub.name}</span>
                            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Category Drill-Down Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 font-extrabold text-white text-sm">
                  eX
                </div>
                <span className="font-extrabold text-text text-base">Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Routine Finder Promo Card */}
              <Link
                href="/quiz"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 p-3.5 text-white shadow-sm"
              >
                <div className="space-y-0.5">
                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                    <Sparkles className="h-3 w-3" /> Personalized Routine
                  </span>
                  <p className="text-xs font-bold">Find Products for Your Skin Type</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/80" />
              </Link>

              {/* Main Categories */}
              <div className="space-y-1">
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Categories
                </span>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-text hover:bg-surface-secondary"
                >
                  <span>All Products</span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </Link>

                {CATEGORY_NAV.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-surface-secondary",
                        cat.isSpecial ? "text-accent-600" : "text-text"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {cat.isSpecial && <Tag className="h-3.5 w-3.5" />}
                        {cat.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-text-muted" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Account & Service Links */}
              <div className="pt-3 border-t border-border space-y-1">
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Account & Services
                </span>
                <Link
                  href={user ? "/account" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-text hover:bg-surface-secondary"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-600" />
                    {user ? "My Account" : "Sign In / Register"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </Link>

                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-text hover:bg-surface-secondary"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary-600" />
                    Track Your Order
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </Link>

                <Link
                  href="/return-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-text hover:bg-surface-secondary"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary-600" />
                    7-Day Authentic Returns
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </Link>
              </div>
            </div>

            {/* Hotline footer in drawer */}
            <div className="border-t border-border p-4 bg-surface-secondary/50 text-xs">
              <a
                href="tel:+8801700000000"
                className="flex items-center justify-center gap-2 rounded-xl bg-white border border-border p-2.5 font-bold text-text hover:bg-primary-50 transition-colors"
              >
                <Phone className="h-4 w-4 text-primary-600" />
                <span>Customer Care: 01700-000000</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
