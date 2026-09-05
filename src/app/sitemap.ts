import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const supabase = createAdminClient();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/wishlist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/track-order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/page/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/page/authenticity`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/page/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/page/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/page/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const [
      { data: products },
      { data: categories },
      { data: brands },
      { data: posts },
      { data: authors },
    ] = await Promise.all([
      supabase.from("products").select("slug, updated_at").eq("status", "published"),
      supabase.from("categories").select("slug, updated_at"),
      supabase.from("brands").select("slug, updated_at"),
      supabase.from("blog_posts").select("slug, updated_at").eq("status", "published"),
      supabase.from("blog_authors").select("slug, updated_at"),
    ]);

    const productUrls: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(p.updated_at || Date.now()),
      changeFrequency: "daily",
      priority: 0.9,
    }));

    const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: new Date(c.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const brandUrls: MetadataRoute.Sitemap = (brands || []).map((b) => ({
      url: `${baseUrl}/brands/${b.slug}`,
      lastModified: new Date(b.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const postUrls: MetadataRoute.Sitemap = (posts || []).map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const authorUrls: MetadataRoute.Sitemap = (authors || []).map((a) => ({
      url: `${baseUrl}/author/${a.slug}`,
      lastModified: new Date(a.updated_at || Date.now()),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...productUrls, ...categoryUrls, ...brandUrls, ...postUrls, ...authorUrls];
  } catch (e) {
    return staticRoutes;
  }
}
