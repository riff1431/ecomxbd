import { createClient } from "@/lib/supabase/server";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "All Products — ecomXbangladesh",
  description: "Browse authentic skincare, cosmetics, and premium beauty essentials in Bangladesh.",
};

export default async function ProductsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; sort?: string; search?: string }>;
}) {
  const { category, brand, sort, search } = await searchParams;
  const supabase = await createClient();

  // Fetch Categories & Brands for filters
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").eq("status", "active"),
    supabase.from("brands").select("id, name, slug").eq("status", "active"),
  ]);

  // Query products
  let query = supabase
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
    .is("deleted_at", null);

  if (category) {
    const selectedCat = categories?.find((c) => c.slug === category);
    if (selectedCat) {
      const { data: productIds } = await supabase
        .from("product_categories")
        .select("product_id")
        .eq("category_id", selectedCat.id);

      if (productIds && productIds.length > 0) {
        query = query.in("id", productIds.map((p) => p.product_id));
      }
    }
  }

  if (brand) {
    const selectedBrand = brands?.find((b) => b.slug === brand);
    if (selectedBrand) {
      query = query.eq("brand_id", selectedBrand.id);
    }
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // Sort
  if (sort === "price_asc") {
    query = query.order("regular_price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("regular_price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

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
      review_count: 0,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-2">
          <Link href="/" className="hover:text-text">Home</Link>
          <span>/</span>
          <span className="text-text font-medium">All Products</span>
        </nav>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            {search ? `Search results for "${search}"` : "Catalog"}
          </h1>
          <span className="text-xs sm:text-sm text-text-secondary">
            Showing {productCardItems.length} products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <aside className="space-y-6 lg:block">
          <div className="rounded-xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 border-b border-border pb-3 font-semibold text-text">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </div>

            {/* Categories */}
            <div className="pt-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Categories
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <Link
                  href="/products"
                  className={`block text-xs py-1 px-2 rounded-md transition-colors ${
                    !category ? "bg-primary-50 text-primary-700 font-semibold" : "text-text-secondary hover:text-text"
                  }`}
                >
                  All Categories
                </Link>
                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block text-xs py-1 px-2 rounded-md transition-colors ${
                      category === cat.slug
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Brands
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <Link
                  href="/products"
                  className={`block text-xs py-1 px-2 rounded-md transition-colors ${
                    !brand ? "bg-primary-50 text-primary-700 font-semibold" : "text-text-secondary hover:text-text"
                  }`}
                >
                  All Brands
                </Link>
                {brands?.map((b) => (
                  <Link
                    key={b.id}
                    href={`/products?brand=${b.slug}`}
                    className={`block text-xs py-1 px-2 rounded-md transition-colors ${
                      brand === b.slug
                        ? "bg-primary-50 text-primary-700 font-semibold"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {productCardItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white p-16 text-center">
              <p className="text-base font-semibold text-text">No products found</p>
              <p className="mt-1 text-xs text-text-secondary">
                Try selecting a different filter or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {productCardItems.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
