import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./product-detail-client";
import { getFrequentlyBoughtTogetherBundle } from "@/features/products/combo-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, seo_title, seo_description, og_image_url")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seo_title || `${product.name} — 100% Authentic Online Bangladesh`,
    description:
      product.seo_description ||
      `Buy genuine ${product.name} with fast delivery and Cash on Delivery in Bangladesh from ecomXbangladesh.`,
    openGraph: {
      images: product.og_image_url ? [product.og_image_url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      brands (id, name, slug),
      inventory (on_hand, available),
      product_variants (*),
      product_media (
        id,
        is_featured,
        position,
        media (secure_url, alt_text)
      )
    `)
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products and frequently bought together combo bundle
  const [{ data: related }, bundleData] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, slug, regular_price, sale_price, og_image_url, brands(name)")
      .neq("id", product.id)
      .eq("status", "active")
      .limit(4),
    getFrequentlyBoughtTogetherBundle(product.id),
  ]);

  return (
    <div className="container-main py-4 sm:py-6 space-y-4">
      {/* Clean Compact Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-text shrink-0 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        <Link href="/products" className="hover:text-text shrink-0 transition-colors">
          Products
        </Link>
        {product.brands && (
          <>
            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
            <Link
              href={`/products?brand=${product.brands.slug}`}
              className="hover:text-text shrink-0 transition-colors"
            >
              {product.brands.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        <span className="text-text font-bold truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Product Interactive Client Section */}
      <ProductDetailClient
        product={product}
        relatedProducts={related || []}
        bundleData={bundleData}
      />
    </div>
  );
}
