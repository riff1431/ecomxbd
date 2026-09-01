import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], categories: [], brands: [] });
  }

  const supabase = await createClient();

  // Search Products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, regular_price, sale_price, og_image_url, brands(name)")
    .eq("status", "active")
    .is("deleted_at", null)
    .ilike("name", `%${query}%`)
    .limit(6);

  // Search Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("status", "active")
    .ilike("name", `%${query}%`)
    .limit(4);

  // Search Brands
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .eq("status", "active")
    .ilike("name", `%${query}%`)
    .limit(4);

  return NextResponse.json({
    products: products || [],
    categories: categories || [],
    brands: brands || [],
  });
}
