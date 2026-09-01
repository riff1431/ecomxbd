import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { Sparkles, FolderTree } from "lucide-react";

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
    title: category.seo_title || `${category.name} — ecomXbangladesh`,
    description: category.seo_description || `Buy authentic ${category.name} online in Bangladesh.`,
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
      review_count: 8,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-text">Categories</Link>
        <span>/</span>
        <span className="text-text font-medium">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 to-zinc-900 p-8 sm:p-12 text-white">
        <div className="max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Verified Authentic Category
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-primary-100/90 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Subcategories Pills */}
      {subcategories && subcategories.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Subcategories
          </span>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-text hover:border-primary-500 hover:text-primary-600 transition-colors shadow-xs"
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
          <h2 className="text-lg font-bold text-text">
            Products in {category.name}
          </h2>
          <span className="text-xs text-text-secondary">
            {productCards.length} product{productCards.length === 1 ? "" : "s"} found
          </span>
        </div>

        {productCards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-text-muted">
            No products found in this category yet.
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
