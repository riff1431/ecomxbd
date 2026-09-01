import Link from "next/link";
import {
  ShoppingBag, Shield, Truck, Star,
  ArrowRight, ChevronRight, Sparkles, FolderTree,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { FlashSaleBanner } from "@/components/storefront/flash-sale-banner";

const trustSignals = [
  { icon: Truck, title: "Fast Delivery", desc: "24-48h Dhaka, 3-5d nationwide" },
  { icon: Shield, title: "100% Authentic", desc: "Guaranteed genuine or 2x refund" },
  { icon: Star, title: "Cash on Delivery", desc: "Pay upon receiving items" },
  { icon: ShoppingBag, title: "7 Days Return", desc: "Hassle-free return policy" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured products
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
    .limit(8);

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
      review_count: 12,
    };
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="container-main relative py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center text-white">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              100% Authentic Premium Beauty & Skincare
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Elevate Your Daily
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-amber-300 bg-clip-text text-transparent">
                Beauty Ritual
              </span>
            </h1>
            <p className="mt-5 text-base text-primary-100/90 sm:text-lg max-w-xl mx-auto">
              Discover authentic K-beauty, dermatologist-developed skincare, and luxury cosmetics curated for Bangladeshi skin.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-600 hover:shadow-xl"
              >
                Shop All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?category=skin-care"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Explore Skincare
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-b border-border bg-white shadow-sm">
        <div className="container-main py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-text">{signal.title}</p>
                    <p className="text-[11px] sm:text-xs text-text-muted">{signal.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner & Category Grid Section */}
      <section className="container-main pt-10 sm:pt-14 space-y-12">
        <FlashSaleBanner />

        {/* Shop by Category Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Explore Categories
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-text mt-0.5">
                Shop By Beauty Routine
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Skin Care", slug: "skin-care", count: "Serums, Toners & Creams", color: "from-rose-50 to-pink-100", textColor: "text-rose-700" },
              { name: "Hair Care", slug: "hair-care", count: "Oils, Masks & Shampoos", color: "from-amber-50 to-orange-100", textColor: "text-amber-700" },
              { name: "Makeup", slug: "makeup", count: "Foundations & Lipsticks", color: "from-purple-50 to-indigo-100", textColor: "text-purple-700" },
              { name: "Body Care", slug: "body-care", count: "Lotions & Body Washes", color: "from-emerald-50 to-teal-100", textColor: "text-emerald-700" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`group flex flex-col justify-between rounded-2xl border border-border/80 bg-gradient-to-br ${cat.color} p-5 transition-all hover:shadow-card-hover hover:scale-[1.02]`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-xs mb-3">
                  <FolderTree className={`h-5 w-5 ${cat.textColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900 group-hover:text-primary-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container-main py-12 sm:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mt-1">
              Trending Authentic Products
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Bestselling authentic skincare tested and loved by thousands.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            View All ({productCardItems.length})
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {productCardItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-text-muted">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productCardItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Partners */}
      <section className="border-t border-border bg-surface-secondary/60 py-10">
        <div className="container-main text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
            100% Authorized & Direct From Brands
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-xl font-bold tracking-tight text-zinc-400">
            <span className="hover:text-text transition-colors">COSRX</span>
            <span className="hover:text-text transition-colors">The Ordinary</span>
            <span className="hover:text-text transition-colors">CeraVe</span>
            <span className="hover:text-text transition-colors">Beauty of Joseon</span>
            <span className="hover:text-text transition-colors">L&apos;Oréal</span>
          </div>
        </div>
      </section>
    </div>
  );
}
