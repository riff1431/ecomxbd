import { createClient } from "@/lib/supabase/server";
import { type ProductCardData } from "@/components/storefront/product-card";
import { HomepageInteractive } from "./homepage-interactive";

export const metadata = {
  title: "ecomXbangladesh — 100% Authentic Skincare, K-Beauty & Cosmetics",
  description:
    "Shop certified authentic Korean skincare, clinical serums, sunscreen SPF 50+, and luxury cosmetics online with Cash on Delivery nationwide.",
};

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
    .limit(16);

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

  return <HomepageInteractive products={productCardItems} />;
}
