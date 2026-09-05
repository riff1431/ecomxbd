import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  User,
  ChevronRight,
  Share2,
  Bookmark,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/features/blog/actions";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ShoppableArticleProducts } from "@/features/blog/components/shoppable-article-products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.seo_title || `${post.title} | ecomX Beauty Journal`,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
      publishedTime: post.published_at,
      authors: post.author ? [post.author.name] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const authorUrl = post.author ? `${baseUrl}/author/${post.author.slug}` : undefined;

  const breadcrumbItems = [
    { name: "Home", url: `${baseUrl}` },
    { name: "Beauty Journal", url: `${baseUrl}/blog` },
  ];
  if (post.category) {
    breadcrumbItems.push({
      name: post.category.name,
      url: `${baseUrl}/blog?category=${post.category.slug}`,
    });
  }
  breadcrumbItems.push({
    name: post.title,
    url: postUrl,
  });

  const relatedPosts = (await getBlogPosts({ limit: 3 })).filter((p) => p.slug !== post.slug);

  // Load shoppable products (custom tagged or top active catalog items)
  let shoppableProducts = post.products || [];
  if (shoppableProducts.length === 0) {
    const supabase = await createClient();
    const { data: fallbackProducts } = await supabase
      .from("products")
      .select("id, name, slug, regular_price, sale_price, og_image_url, brands(name)")
      .eq("status", "active")
      .is("deleted_at", null)
      .limit(4);
    if (fallbackProducts) {
      shoppableProducts = fallbackProducts as any;
    }
  }

  return (
    <div className="container-main py-6 sm:py-10 space-y-8 max-w-4xl">
      {/* Schema.org Article & Breadcrumb Structured Data */}
      <ArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        image={post.featured_image}
        datePublished={post.published_at}
        author={{
          name: post.author?.name || "ecomX Editorial Team",
          url: authorUrl,
          jobTitle: post.author?.job_title,
          avatarUrl: post.author?.avatar_url,
        }}
        url={postUrl}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-text shrink-0 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        <Link href="/blog" className="hover:text-text shrink-0 transition-colors">
          Beauty Journal
        </Link>
        {post.category && (
          <>
            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
            <Link
              href={`/blog?category=${post.category.slug}`}
              className="hover:text-text shrink-0 transition-colors"
            >
              {post.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        <span className="text-text font-bold truncate max-w-[200px] sm:max-w-md">
          {post.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        {post.category && (
          <span className="inline-block bg-pink-50 text-[#e91e63] font-bold text-xs px-3 py-1 rounded-full border border-pink-200">
            {post.category.name}
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl font-black text-text tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
          {post.excerpt}
        </p>

        {/* Author Byline Strip (E-E-A-T Indicator) */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border">
          {post.author ? (
            <Link
              href={`/author/${post.author.slug}`}
              className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
            >
              {post.author.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-primary-200"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-text group-hover:text-primary-600 transition-colors">
                    {post.author.name}
                  </span>
                  {post.author.is_verified_expert && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      <ShieldCheck className="h-3 w-3" /> Verified Expert
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted">{post.author.job_title}</p>
              </div>
            </Link>
          ) : (
            <span className="text-xs text-text-muted">By ecomX Beauty Team</span>
          )}

          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.reading_time_minutes} min read
            </span>
            <span>•</span>
            <span>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      {post.featured_image && (
        <div className="rounded-3xl overflow-hidden border border-border shadow-card bg-zinc-100 aspect-16/9 relative">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content */}
      <div className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:text-text prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-[#e91e63] prose-img:rounded-2xl space-y-4">
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-800"
        />
      </div>

      {/* Shoppable Products Mentioned In-Article */}
      {shoppableProducts.length > 0 && (
        <ShoppableArticleProducts
          products={shoppableProducts}
          articleTitle={post.title}
        />
      )}

      {/* Author Bio Box (E-E-A-T Authority Box) */}
      {post.author && (
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-primary-200 shrink-0"
            />
          ) : (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xl shrink-0">
              {post.author.name.charAt(0)}
            </div>
          )}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">
                Written By
              </span>
              <span className="text-xs font-bold text-text">•</span>
              <Link
                href={`/author/${post.author.slug}`}
                className="text-sm font-bold text-text hover:text-primary-600 transition-colors"
              >
                {post.author.name}
              </Link>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{post.author.bio}</p>
            <Link
              href={`/author/${post.author.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#e91e63] hover:underline pt-1"
            >
              View Author Profile &amp; All Articles &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Related Articles Strip */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-lg font-bold text-text">More Guides You May Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.slug}`}
                className="rounded-2xl border border-border bg-white p-4 shadow-card hover:shadow-md transition-shadow flex items-center gap-4 group"
              >
                {rp.featured_image && (
                  <img
                    src={rp.featured_image}
                    alt={rp.title}
                    className="h-16 w-16 rounded-xl object-cover shrink-0 border border-border"
                  />
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-[#e91e63]">
                    {rp.category?.name || "Skincare"}
                  </span>
                  <h4 className="text-xs font-bold text-text group-hover:text-primary-600 transition-colors line-clamp-2">
                    {rp.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
