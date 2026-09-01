import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, Tag, ArrowRight } from "lucide-react";

export const metadata = {
  title: "All Brands — ecomXbangladesh",
  description: "Explore 100% authentic international skincare, K-beauty, and cosmetics brands in Bangladesh.",
};

export default async function BrandsIndexPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url, description")
    .eq("status", "active")
    .order("name");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <span className="text-text font-medium">Brands</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600">
          <ShieldCheck className="h-4 w-4" />
          Authorized Brand Directory
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-text">
          Featured Authentic Brands
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-text-secondary">
          We partner directly with leading beauty & skincare manufacturers worldwide.
        </p>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(brands || []).map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 text-center transition-all hover:border-primary-500 hover:shadow-card-hover"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-secondary/70 p-2 group-hover:scale-105 transition-transform">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="font-extrabold text-primary-600 text-lg">
                  {brand.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <h3 className="mt-3 text-xs sm:text-sm font-bold text-text group-hover:text-primary-600 transition-colors">
              {brand.name}
            </h3>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600">
              View Collection
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
