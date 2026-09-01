import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { ShieldCheck, Tag } from "lucide-react";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/brands" className="hover:text-text">Brands</Link>
        <span>/</span>
        <span className="text-text font-medium">{brand.name}</span>
      </nav>

      {/* Brand Hero Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card">
        {brand.logo_url ? (
          <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-2 shadow-xs">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 font-extrabold text-2xl">
            {brand.name.substring(0, 2).toUpperCase()}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
              {brand.name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Authorized & Authentic
            </span>
          </div>

          {brand.description && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              {brand.description}
            </p>
          )}
        </div>
      </div>

      {/* Brand Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-bold text-text">
            All Products from {brand.name}
          </h2>
          <span className="text-xs text-text-secondary">
            {productCards.length} product{productCards.length === 1 ? "" : "s"}
          </span>
        </div>

        {productCards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-text-muted">
            No products available from this brand currently.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
