import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { ShieldCheck, ChevronRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name, seo_title, seo_description")
    .eq("slug", slug)
    .single();

  if (!brand) return { title: "Brand Not Found" };

  return {
    title: brand.seo_title || `${brand.name} Authentic Products — ecomXbangladesh`,
    description: brand.seo_description || `Shop 100% genuine ${brand.name} products in Bangladesh with cash on delivery.`,
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch Brand
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!brand) notFound();

  // Fetch Products by Brand
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
    .eq("brand_id", brand.id)
    .eq("status", "active")
    .is("deleted_at", null);

  const productCards: ProductCardData[] = (products || []).map((p) => {
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
      review_count: 14,
    };
  });

  return (
    <div className="container-main py-4 sm:py-6 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-text transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3 text-zinc-400" />
        <Link href="/products" className="hover:text-text transition-colors">Brands</Link>
        <ChevronRight className="h-3 w-3 text-zinc-400" />
        <span className="text-text font-bold">{brand.name}</span>
      </nav>

      {/* Brand Hero Card */}
      <div className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card">
        {brand.logo_url ? (
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-2 shadow-xs">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 font-black text-2xl border border-primary-100">
            {brand.name.substring(0, 2).toUpperCase()}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-text">
              {brand.name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Authorized & Authentic
            </span>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            {brand.description || `Browse genuine ${brand.name} skincare and cosmetics with certified authenticity and nationwide Cash on Delivery.`}
          </p>
        </div>
      </div>

      {/* Brand Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base sm:text-lg font-black text-text">
            Products from {brand.name}
          </h2>
          <span className="text-xs font-semibold text-text-muted">
            {productCards.length} product{productCards.length === 1 ? "" : "s"}
          </span>
        </div>

        {productCards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-text-muted space-y-2">
            <p className="text-sm font-bold text-text">No products available from this brand currently.</p>
            <Link href="/products" className="text-xs font-bold text-primary-600 hover:underline inline-block">
              Browse Other Brands &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
