import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { ProductDetailClient } from "./product-detail-client";

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
    title: product.seo_title || `${product.name} — ecomXbangladesh`,
    description: product.seo_description || `Buy ${product.name} authentic products online in Bangladesh.`,
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

  // Fetch related products from the same brand or general active products
  const { data: related } = await supabase
    .from("products")
    .select("id, name, slug, regular_price, sale_price, og_image_url, brands(name)")
    .neq("id", product.id)
    .eq("status", "active")
    .limit(4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-text">Products</Link>
        <span>/</span>
        {product.brands && (
          <>
            <Link href={`/products?brand=${product.brands.slug}`} className="hover:text-text">
              {product.brands.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-text font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Interactive Client Section */}
      <ProductDetailClient
        product={product}
        relatedProducts={related || []}
      />
    </div>
  );
}
