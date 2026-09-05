import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { Sparkles, FolderTree, ChevronRight } from "lucide-react";
import { ItemListTracker } from "@/components/analytics/item-list-tracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, seo_title, seo_description")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.seo_title || `${category.name} — Authentic Online Bangladesh`,
    description: category.seo_description || `Buy authentic ${category.name} online in Bangladesh with Cash on Delivery.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch Category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!category) notFound();

  // Fetch Subcategories
  const { data: subcategories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("parent_id", category.id)
    .eq("status", "active");

  // Fetch Products in this category
  const { data: productCategories } = await supabase
    .from("product_categories")
    .select("product_id")
    .eq("category_id", category.id);

  const productIds = (productCategories || []).map((pc) => pc.product_id);

  let products: any[] = [];
  if (productIds.length > 0) {
    const { data: prods } = await supabase
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
      .in("id", productIds)
      .eq("status", "active")
      .is("deleted_at", null);
    products = prods || [];
  }

  const productCards: ProductCardData[] = products.map((p) => {
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
    <div className="container-main py-4 sm:py-6 space-y-6">
      <ItemListTracker
        items={productCards.map((p, idx) => ({
          item_id: p.id,
          item_name: p.name,
          item_brand: p.brand_name || undefined,
          item_category: category.name,
          price: p.sale_price ?? p.regular_price,
          index: idx + 1,
        }))}
        listName={`Category: ${category.name}`}
        listId={`category_${category.slug}`}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-text transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3 text-zinc-400" />
        <Link href="/products" className="hover:text-text transition-colors">Categories</Link>
        <ChevronRight className="h-3 w-3 text-zinc-400" />
        <span className="text-text font-bold">{category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-primary-950 to-slate-950 p-6 sm:p-10 text-white shadow-lg">
        <div className="max-w-xl space-y-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md border border-white/15">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Verified Authentic Category
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {category.description || "Discover verified genuine formulas and authentic imported beauty items curated for maximum effectiveness."}
          </p>
        </div>
      </div>

      {/* Subcategories Horizontal Scroll */}
      {subcategories && subcategories.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Popular Subcategories
          </span>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-text hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all shadow-xs"
              >
                <FolderTree className="h-3.5 w-3.5 text-primary-600" />
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base sm:text-lg font-black text-text">
            Products in {category.name}
          </h2>
          <span className="text-xs font-semibold text-text-muted">
            {productCards.length} product{productCards.length === 1 ? "" : "s"} found
          </span>
        </div>

        {productCards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center text-text-muted space-y-2">
            <p className="text-sm font-bold text-text">No products found in this category yet.</p>
            <Link href="/products" className="text-xs font-bold text-primary-600 hover:underline inline-block">
              Browse All Available Products &rarr;
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
