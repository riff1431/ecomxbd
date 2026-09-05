import { createClient } from "@/lib/supabase/server";
import { BrandsClient } from "./brands-client";

export const metadata = {
  title: "All Brands — Blush & Budget",
  description: "Explore 100% authentic international skincare, K-beauty, and cosmetics brands in Bangladesh.",
};

export default async function BrandsIndexPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url, description")
    .eq("status", "active")
    .order("name");

  return <BrandsClient brands={brands || []} />;
}

