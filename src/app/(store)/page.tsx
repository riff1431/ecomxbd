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
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { FlashSaleBanner } from "@/components/storefront/flash-sale-banner";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Authentic Guarantee",
    desc: "Directly imported from authorized brand distributors or 2x money-back.",
  },
  {
    icon: Truck,
    title: "Fast Doorstep Delivery",
    desc: "24–48 hours in Dhaka, 3–5 days nationwide via SteadFast & Pathao.",
  },
  {
    icon: Zap,
    title: "Cash on Delivery",
    desc: "Pay easily in cash or via bKash / Nagad upon receiving your parcel.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Hassle-Free Returns",
    desc: "Instant replacement or full wallet refund for damaged/wrong items.",
  },
];

const QUICK_CATEGORIES = [
  {
    name: "Skin Care",
    slug: "skin-care",
    tagline: "Serums & Toners",
    bg: "from-rose-50 to-pink-100/60",
    border: "border-pink-200/60",
    icon: Droplets,
    color: "text-rose-600",
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    tagline: "Oils & Shampoos",
    bg: "from-amber-50 to-orange-100/60",
    border: "border-amber-200/60",
    icon: Sparkles,
    color: "text-amber-600",
  },
  {
    name: "Makeup",
    slug: "makeup",
    tagline: "Lips & Foundations",
    bg: "from-purple-50 to-indigo-100/60",
    border: "border-purple-200/60",
    icon: Star,
    color: "text-purple-600",
  },
  {
    name: "Body Care",
    slug: "body-care",
    tagline: "Lotions & Washes",
    bg: "from-emerald-50 to-teal-100/60",
    border: "border-emerald-200/60",
    icon: Shield,
    color: "text-emerald-600",
  },
  {
    name: "Sunscreen",
    slug: "skin-care?type=sunscreen",
    tagline: "SPF 50+ Protection",
    bg: "from-yellow-50 to-amber-100/60",
    border: "border-yellow-200/60",
    icon: Sun,
    color: "text-amber-600",
  },
  {
    name: "Flash Deals",
    slug: "products?discount=true",
    tagline: "Up to 40% Off",
    bg: "from-orange-50 to-red-100/60",
    border: "border-orange-200/60",
    icon: Flame,
    color: "text-orange-600",
  },
];

const SKIN_CONCERNS = [
  { label: "Acne & Blemishes", href: "/products?search=salicylic" },
  { label: "Hydration & Barrier", href: "/products?search=hyaluronic" },
  { label: "Brightening & Glow", href: "/products?search=niacinamide" },
  { label: "Sun Protection", href: "/products?search=sunscreen" },
  { label: "Anti-Aging & Firming", href: "/products?search=retinol" },
  { label: "Calming & Redness", href: "/products?search=centella" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      regular_price,
      sale_price,
      og_image_url,
      brands (name),
      inventory (available)
    `)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(12);

  // Map to ProductCardData
  const productCardItems: ProductCardData[] = (products || []).map((p) => {
    const inv = p.inventory as Array<{ available: number }> | null;
    const isAvailable = inv ? inv.some((i) => i.available > 0) : true;
    const brandData = (Array.isArray(p.brands) ? p.brands[0] : p.brands) as { name: string } | null;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      image_url: p.og_image_url || null,
      brand_name: brandData?.name || null,
      is_in_stock: isAvailable,
      rating: 5.0,
      review_count: 18,
    };
  });

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* 1. Hero Promotional Area */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
        
        <div className="container-main relative py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/15 text-zinc-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                <span>100% Authentic Beauty & Dermatologist Skincare</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-none">
                Pure, Authentic Care for{" "}
                <span className="bg-gradient-to-r from-accent-400 via-amber-300 to-accent-300 bg-clip-text text-transparent">
                  Bangladeshi Skin
                </span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Directly imported K-Beauty, clinical treatments, and luxury makeup. Certified genuine, delivered safely to your doorstep with Cash on Delivery.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-500 hover:bg-accent-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop All Products
                </Link>

                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-sm transition-all"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Take Skin Routine Quiz
                </Link>
              </div>

              {/* Mini trust features under hero */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-semibold text-zinc-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Authorized Sourcing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Free Shipping &gt; ৳2,500
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 7-Day Easy Return
                </span>
              </div>
            </div>

            {/* Right Visual Highlight Box */}
            <div className="lg:col-span-5 hidden sm:block">
              <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-accent-400">
                    Bestseller of the Week
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    In High Demand
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-3.5 border border-white/10">
                  <div className="h-16 w-16 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80"
                      alt="Featured product"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-primary-300 tracking-wider">
                      COSRX
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                      Advanced Snail 96 Mucin Power Essence
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-sm font-black text-amber-300">৳1,450</span>
                      <span className="text-xs text-zinc-400 line-through">৳1,800</span>
                      <span className="text-[10px] font-bold text-emerald-300">-19%</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/products?category=skin-care"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 p-3 text-xs font-bold text-white transition-colors"
                >
                  <span>Explore Korean Skincare Collection</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Quick Categories (Snap horizontal scroll on mobile, clean grid on desktop) */}
      <section className="container-main">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary-600">
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
                className={`group min-w-[135px] sm:min-w-0 flex-1 flex flex-col justify-between rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.bg} p-3.5 transition-all hover:shadow-card-hover hover:scale-[1.02] active:scale-95`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-xs mb-3">
                  <Icon className={`h-4.5 w-4.5 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-text group-hover:text-primary-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium">{cat.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Limited-Time Flash Deals */}
      <section className="container-main">
        <FlashSaleBanner />
      </section>

      {/* 4. Skin Concern Discovery Chips */}
      <section className="container-main">
        <div className="rounded-2xl border border-border bg-surface-secondary/60 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <h3 className="text-xs sm:text-sm font-extrabold text-text">
              Target Your Specific Skin Concern:
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {SKIN_CONCERNS.map((concern) => (
              <Link
                key={concern.label}
                href={concern.href}
                className="rounded-full bg-white border border-border px-3.5 py-1.5 text-xs font-semibold text-text hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all shadow-xs"
              >
                {concern.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Bestsellers Product Grid */}
      <section className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary-600">
              Curated Selection
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text mt-0.5">
              Trending Authentic Skincare & Cosmetics
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Loved and re-ordered by thousands of beauty lovers in Bangladesh.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors shrink-0"
          >
            View All ({productCardItems.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {productCardItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-text-muted">
            <ShoppingBag className="h-8 w-8 mx-auto text-text-muted stroke-[1.5]" />
            <p className="mt-2 text-xs sm:text-sm font-semibold text-text">Catalog is being updated.</p>
            <Link href="/products" className="mt-3 inline-block">
              <button className="text-xs font-bold text-primary-600 hover:underline">
                Explore Available Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productCardItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Top Authentic Brand Showcase */}
      <section className="border-y border-border bg-surface-secondary/40 py-8 sm:py-10">
        <div className="container-main text-center space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600">
              Authorized Distributors
            </span>
            <h2 className="text-base sm:text-lg font-black text-text mt-0.5">
              100% Genuine Direct Brand Partners
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-sm sm:text-base font-extrabold text-zinc-400">
            {["COSRX", "The Ordinary", "CeraVe", "Beauty of Joseon", "L'Oréal Paris", "Simple", "Cetaphil", "Neutrogena"].map((brand) => (
              <Link
                key={brand}
                href={`/products?search=${encodeURIComponent(brand)}`}
                className="rounded-xl bg-white border border-border px-4 py-2 text-text-secondary hover:text-primary-600 hover:border-primary-300 shadow-xs transition-all"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trust Pillars Strip */}
      <section className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-white p-4.5 shadow-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-text">{pillar.title}</h4>
                  <p className="text-[11px] text-text-secondary leading-snug">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
