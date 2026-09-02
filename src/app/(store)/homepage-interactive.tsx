"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  Star,
  CheckCircle2,
  Heart,
  Droplets,
  Sun,
  Shield,
  Zap,
  Check,
  Clock,
  Sparkle,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { Button } from "@/components/shared/ui/button";

interface HomepageInteractiveProps {
  products: ProductCardData[];
}

const HERO_SLIDES = [
  {
    tag: "Authentic Korean Skincare",
    headline: "Korean Glass Skin & Deep Barrier Care",
    description: "Directly imported K-Beauty essences, soothing toners, and ceramide creams certified 100% genuine with Cash on Delivery.",
    ctaText: "Shop Korean Skincare",
    ctaHref: "/products?category=skin-care",
    badge: "100% Brand Authorized",
    accentColor: "from-rose-500 via-pink-600 to-indigo-700",
    featuredProduct: {
      brand: "COSRX",
      name: "Advanced Snail 96 Mucin Power Essence (100ml)",
      price: 1450,
      regularPrice: 1800,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80",
      slug: "cosrx-advanced-snail-96-mucin-power-essence",
    },
  },
  {
    tag: "Clinical Actives & Serums",
    headline: "Target Acne, Dark Spots & Hyperpigmentation",
    description: "Dermatologist-formulated Niacinamide, Salicylic Acid, and Vitamin C serums for clear, luminous, healthy skin.",
    ctaText: "Explore Clinical Actives",
    ctaHref: "/products?category=skin-care",
    badge: "Dermatologist Approved",
    accentColor: "from-blue-600 via-indigo-600 to-slate-900",
    featuredProduct: {
      brand: "The Ordinary",
      name: "Niacinamide 10% + Zinc 1% High-Strength Serum",
      price: 1250,
      regularPrice: 1500,
      image: "https://images.unsplash.com/photo-1608248597359-5f2187f54c5e?auto=format&fit=crop&w=300&q=80",
      slug: "the-ordinary-niacinamide-10-zinc-1",
    },
  },
  {
    tag: "Daily Broad Spectrum SPF",
    headline: "Zero White Cast, Non-Greasy Sunscreens",
    description: "Lightweight sun relief formulated specifically for warm and humid Bangladesh climates with SPF 50+ PA++++.",
    ctaText: "Discover Sunscreens",
    ctaHref: "/products?search=sunscreen",
    badge: "SPF 50+ PA++++",
    accentColor: "from-amber-600 via-orange-600 to-rose-700",
    featuredProduct: {
      brand: "Beauty of Joseon",
      name: "Relief Sun: Rice + Probiotics SPF 50+ PA++++",
      price: 1350,
      regularPrice: 1650,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=300&q=80",
      slug: "beauty-of-joseon-relief-sun-rice-probiotics",
    },
  },
];

const QUICK_CATEGORIES = [
  {
    name: "Skin Care",
    slug: "skin-care",
    tagline: "Serums & Toners",
    icon: Droplets,
    color: "text-rose-600",
    bg: "from-rose-50 to-pink-100/70",
    border: "border-pink-200/80",
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    tagline: "Oils & Shampoos",
    icon: Sparkles,
    color: "text-amber-600",
    bg: "from-amber-50 to-orange-100/70",
    border: "border-amber-200/80",
  },
  {
    name: "Makeup",
    slug: "makeup",
    tagline: "Lips & Foundations",
    icon: Star,
    color: "text-purple-600",
    bg: "from-purple-50 to-indigo-100/70",
    border: "border-purple-200/80",
  },
  {
    name: "Body Care",
    slug: "body-care",
    tagline: "Lotions & Washes",
    icon: Shield,
    color: "text-emerald-600",
    bg: "from-emerald-50 to-teal-100/70",
    border: "border-emerald-200/80",
  },
  {
    name: "Sun Care",
    slug: "skin-care?type=sunscreen",
    tagline: "SPF 50+ Protection",
    icon: Sun,
    color: "text-amber-600",
    bg: "from-yellow-50 to-amber-100/70",
    border: "border-yellow-200/80",
  },
  {
    name: "Flash Deals",
    slug: "products?discount=true",
    tagline: "Up to 40% Off",
    icon: Flame,
    color: "text-orange-600",
    bg: "from-orange-50 to-red-100/70",
    border: "border-orange-200/80",
  },
];

const SKIN_CONCERNS = [
  { label: "Acne & Blemishes", href: "/products?search=salicylic", desc: "Salicylic & Tea Tree Actives" },
  { label: "Glass Skin & Glow", href: "/products?search=mucin", desc: "Snail Mucin & Rice Extracts" },
  { label: "Hydration & Barrier", href: "/products?search=hyaluronic", desc: "Hyaluronic & Ceramides" },
  { label: "Dark Spots & Melasma", href: "/products?search=niacinamide", desc: "Niacinamide & Alpha Arbutin" },
  { label: "Sun Defense SPF 50", href: "/products?search=sunscreen", desc: "Broad Spectrum PA++++" },
  { label: "Anti-Aging & Firming", href: "/products?search=retinol", desc: "Retinol & Peptide Complex" },
];

const ROUTINE_STEPS = [
  { step: "01", name: "Gentle Cleanse", desc: "Remove impurities & excess oil without stripping moisture barrier.", slug: "skin-care?type=cleanser" },
  { step: "02", name: "Hydrating Toner", desc: "Rebalance skin pH and prep for optimal active absorption.", slug: "skin-care?type=toner" },
  { step: "03", name: "Targeted Serum", desc: "Concentrated actives targeting pigmentation, acne, and texture.", slug: "skin-care?type=serum" },
  { step: "04", name: "Moisturizer", desc: "Seal in hydration and lock the skin lipid barrier.", slug: "skin-care?type=moisturizer" },
  { step: "05", name: "Sun Protection", desc: "Essential daily SPF 50+ shielding against UV damage and dark spots.", slug: "skin-care?type=sunscreen" },
];

const BRAND_PARTNERS = [
  { name: "COSRX", country: "South Korea", slug: "cosrx" },
  { name: "The Ordinary", country: "Canada", slug: "the-ordinary" },
  { name: "CeraVe", country: "USA", slug: "cerave" },
  { name: "Beauty of Joseon", country: "South Korea", slug: "beauty-of-joseon" },
  { name: "L'Oréal Paris", country: "France", slug: "loreal" },
  { name: "Cetaphil", country: "Switzerland", slug: "cetaphil" },
  { name: "Simple", country: "United Kingdom", slug: "simple" },
  { name: "Neutrogena", country: "USA", slug: "neutrogena" },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Authentic Guarantee",
    desc: "Directly imported from authorized brand distributors or 2x money-back guarantee.",
  },
  {
    icon: Truck,
    title: "Fast Doorstep Delivery",
    desc: "24–48 hours delivery in Dhaka, 3–5 days nationwide via SteadFast & Pathao.",
  },
  {
    icon: Zap,
    title: "Cash on Delivery",
    desc: "Pay comfortably with Cash, bKash, or Nagad upon receiving and verifying your parcel.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Hassle-Free Returns",
    desc: "Instant replacement or full wallet refund for any damaged or mismatched products.",
  },
];

export function HomepageInteractive({ products }: HomepageInteractiveProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
  const [flashTimeLeft, setFlashTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 19,
  });

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Flash sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products based on selected tab
  const filteredProducts = products.filter((p) => {
    if (activeCategoryFilter === "all") return true;
    if (activeCategoryFilter === "discount") return Boolean(p.sale_price && p.sale_price < p.regular_price);
    if (activeCategoryFilter === "k-beauty") {
      const name = p.name.toLowerCase();
      const brand = (p.brand_name || "").toLowerCase();
      return brand.includes("cosrx") || brand.includes("joseon") || name.includes("mucin") || name.includes("snail");
    }
    if (activeCategoryFilter === "clinical") {
      const name = p.name.toLowerCase();
      const brand = (p.brand_name || "").toLowerCase();
      return brand.includes("ordinary") || brand.includes("cerave") || name.includes("niacinamide") || name.includes("salicylic");
    }
    return true;
  });

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-10 sm:space-y-14 pb-12">
      {/* 1. Dynamic Visual Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-primary-950 to-slate-900 text-white">
        {/* Subtle decorative radial glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

        <div className="container-main relative py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold backdrop-blur-md border border-white/15 text-zinc-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                <span>{slide.tag}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-none transition-all duration-500">
                {slide.headline.split(" & ")[0]} &{" "}
                <span className="bg-gradient-to-r from-accent-400 via-amber-300 to-accent-300 bg-clip-text text-transparent">
                  {slide.headline.split(" & ")[1] || "Radiance"}
                </span>
              </h1>

              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {slide.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 hover:bg-accent-600 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-xl transition-all active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {slide.ctaText}
                </Link>

                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all"
                >
                  <Sparkle className="h-4 w-4 text-amber-300" />
                  Take Skin Routine Quiz
                </Link>
              </div>

              {/* Social Proof & Guarantee Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-semibold text-zinc-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 100% Genuine Direct Imports
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Free Delivery over ৳2,500
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Cash on Delivery Nationwide
                </span>
              </div>
            </div>

            {/* Right Hero Showcase Spotlight Box */}
            <div className="lg:col-span-5 hidden sm:block">
              <div className="relative rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-accent-400">
                    Curated Spotlight
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    {slide.badge}
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/10">
                  <div className="h-20 w-20 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                    <img
                      src={slide.featuredProduct.image}
                      alt={slide.featuredProduct.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-primary-300 tracking-wider">
                      {slide.featuredProduct.brand}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight">
                      {slide.featuredProduct.name}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-sm font-black text-amber-300">
                        {formatPrice(slide.featuredProduct.price)}
                      </span>
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(slide.featuredProduct.regularPrice)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300">
                        -
                        {Math.round(
                          ((slide.featuredProduct.regularPrice - slide.featuredProduct.price) /
                            slide.featuredProduct.regularPrice) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slide indicator dots */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          currentSlide === idx ? "w-6 bg-accent-400" : "w-2 bg-white/30"
                        )}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-accent-300 transition-colors"
                  >
                    <span>View Collection</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Quick Category Hub (Snap scroll on mobile, grid on desktop) */}
      <section className="container-main">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary-600">
              Browse Categories
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-text mt-0.5">
              Shop by Beauty Routine
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            All Categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/products?category=${cat.slug}`}
                className={`group min-w-[140px] sm:min-w-0 flex-1 flex flex-col justify-between rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.bg} p-4 transition-all hover:shadow-card-hover hover:scale-[1.02] active:scale-95`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs mb-3">
                  <Icon className={`h-5 w-5 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-text group-hover:text-primary-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium">{cat.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Limited-Time Flash Deals Spotlight Banner */}
      <section className="container-main">
        <div className="rounded-3xl border border-accent-200/80 bg-gradient-to-r from-accent-500 via-rose-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                <Flame className="h-4 w-4 text-amber-300 animate-bounce" />
                <span>Limited Time Flash Sale</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Up to 35% OFF Authentic K-Beauty
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-md leading-relaxed">
                Directly imported essences, sunscreens, and serums at special limited-time prices with cash on delivery.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-center">
                <div className="rounded-2xl bg-black/40 px-3.5 py-2.5 backdrop-blur-sm border border-white/20 min-w-14">
                  <span className="block text-xl sm:text-2xl font-black">
                    {String(flashTimeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
                    Hours
                  </span>
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="rounded-2xl bg-black/40 px-3.5 py-2.5 backdrop-blur-sm border border-white/20 min-w-14">
                  <span className="block text-xl sm:text-2xl font-black">
                    {String(flashTimeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
                    Mins
                  </span>
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="rounded-2xl bg-black/40 px-3.5 py-2.5 backdrop-blur-sm border border-white/20 min-w-14">
                  <span className="block text-xl sm:text-2xl font-black">
                    {String(flashTimeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70 font-bold">
                    Secs
                  </span>
                </div>
              </div>

              <Link
                href="/products?discount=true"
                className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-xs font-black text-accent-600 shadow-md hover:bg-white/90 hover:scale-105 transition-all"
              >
                Shop Deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Skin Concern Discovery Hub */}
      <section className="container-main">
        <div className="rounded-3xl border border-border bg-surface-secondary/70 p-5 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary-600">
                Personalized Care
              </span>
              <h3 className="text-base sm:text-lg font-black text-text mt-0.5">
                Target Your Specific Skin Concern
              </h3>
            </div>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Take 1-Minute Skin Quiz &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SKIN_CONCERNS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-2xl border border-border bg-white p-3.5 text-left transition-all hover:border-primary-500 hover:shadow-card-hover group"
              >
                <p className="text-xs font-extrabold text-text group-hover:text-primary-600 transition-colors">
                  {c.label}
                </p>
                <p className="text-[10px] text-text-muted mt-1 leading-tight font-medium">
                  {c.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Bestsellers Section with Dynamic Filter Tabs */}
      <section className="container-main space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary-600">
              Curated Selection
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text mt-0.5">
              Trending Authentic Products
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Loved and re-ordered by thousands of skincare enthusiasts in Bangladesh.
            </p>
          </div>

          {/* Interactive filter pills on homepage */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "all", label: "All Trending" },
              { id: "k-beauty", label: "K-Beauty Classics" },
              { id: "clinical", label: "Clinical Actives" },
              { id: "discount", label: "Special Offers" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap",
                  activeCategoryFilter === tab.id
                    ? "bg-primary-600 text-white shadow-xs"
                    : "bg-surface-secondary border border-border text-text-secondary hover:text-text"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-text-muted space-y-2">
            <ShoppingBag className="h-8 w-8 mx-auto text-text-muted stroke-[1.5]" />
            <p className="text-sm font-bold text-text">No products in this filter right now.</p>
            <Button size="sm" onClick={() => setActiveCategoryFilter("all")} className="text-xs font-bold mt-2">
              Show All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Step-by-Step Daily Skincare Routine Guide */}
      <section className="container-main">
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-9 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary-600">
                Skincare Education
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-text mt-0.5">
                The 5-Step Core Skincare Routine
              </h2>
            </div>
            <p className="text-xs text-text-muted max-w-sm">
              Layer your skincare correctly for maximum hydration and clear results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {ROUTINE_STEPS.map((r) => (
              <Link
                key={r.step}
                href={`/products?category=${r.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface-secondary/60 p-4 transition-all hover:bg-primary-50/50 hover:border-primary-300 hover:shadow-card-hover"
              >
                <div>
                  <span className="text-xs font-black text-primary-600 font-mono">{r.step}</span>
                  <h4 className="text-xs sm:text-sm font-black text-text group-hover:text-primary-700 mt-1">
                    {r.name}
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-snug">
                    {r.desc}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-primary-600 mt-3 flex items-center gap-1 group-hover:underline">
                  Browse {r.name} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Direct Authorized Brand Partners Showcase */}
      <section className="border-y border-border bg-surface-secondary/40 py-10 sm:py-12">
        <div className="container-main text-center space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600">
              100% Authorized Imports
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-text mt-0.5">
              Direct Certified Brand Partners
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mt-1">
              Guaranteed genuine international skincare imported directly from brand manufacturers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {BRAND_PARTNERS.map((brand) => (
              <Link
                key={brand.name}
                href={`/products?search=${encodeURIComponent(brand.name)}`}
                className="flex flex-col items-center justify-center rounded-2xl bg-white border border-border p-3.5 text-text-secondary hover:text-primary-600 hover:border-primary-300 shadow-xs transition-all hover:scale-105"
              >
                <span className="font-extrabold text-xs sm:text-sm text-text">{brand.name}</span>
                <span className="text-[9px] font-semibold text-text-muted mt-0.5">{brand.country}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trust Pillars & Delivery Guarantee */}
      <section className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-white p-5 shadow-card"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-text">{pillar.title}</h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
