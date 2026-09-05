import { getBlogPosts, getBlogCategories } from "@/features/blog/actions";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getBaseUrl } from "@/lib/utils";
import { BlogListingClient } from "./blog-listing-client";

export const metadata = {
  title: "Beauty & Skincare Journal — Expert Advice, Routines & Ingredient Guides",
  description:
    "Expert skincare advice, routine breakdowns, and active ingredient guides curated for Bangladeshi climate and Asian skin types.",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await searchParams;
  const [posts, categories] = await Promise.all([
    getBlogPosts({ categorySlug: category, tag }),
    getBlogCategories(),
  ]);

  const baseUrl = getBaseUrl();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${baseUrl}` },
          { name: "Beauty Journal", url: `${baseUrl}/blog` },
        ]}
      />
      <BlogListingClient
        posts={posts as any}
        categories={categories as any}
        activeCategory={category}
      />
    </>
  );
}

