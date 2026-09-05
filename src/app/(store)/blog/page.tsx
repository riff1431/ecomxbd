import Link from "next/link";
import Image from "next/image";
import { Sparkles, Clock, User, ChevronRight, BookOpen, Tag, ArrowRight } from "lucide-react";
import { getBlogPosts, getBlogCategories } from "@/features/blog/actions";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getBaseUrl } from "@/lib/utils";

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
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="container-main py-6 sm:py-10 space-y-10">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${baseUrl}` },
          { name: "Beauty Journal", url: `${baseUrl}/blog` },
        ]}
      />

      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-zinc-900 via-purple-950 to-zinc-900 text-white p-8 sm:p-12 shadow-xl border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e91e63] animate-pulse" />
          <span className="text-[11px] font-bold text-pink-300 bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30 uppercase tracking-wider">
            Verified Skincare Science &amp; Beauty Guides
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          The Beauty &amp; Skincare Journal
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
          Expert dermatologist routines, ingredient breakdowns, and curated formulas tested for Bangladesh’s hot &amp; humid climate.
        </p>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              !category
                ? "bg-[#e91e63] text-white shadow-md"
                : "bg-white/10 text-zinc-200 hover:bg-white/20"
            }`}
          >
            All Articles
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                category === cat.slug
                  ? "bg-[#e91e63] text-white shadow-md"
                  : "bg-white/10 text-zinc-200 hover:bg-white/20"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Featured Article */}
      {featuredPost && (
        <div className="rounded-3xl border border-border bg-white overflow-hidden shadow-card hover:shadow-xl transition-all group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] overflow-hidden bg-zinc-100">
              {featuredPost.featured_image ? (
                <img
                  src={featuredPost.featured_image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <BookOpen className="h-16 w-16" />
                </div>
              )}
              <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Featured Guide
              </span>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="font-bold text-[#e91e63]">
                    {featuredPost.category?.name || "Skincare"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredPost.reading_time_minutes} min read
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-xl sm:text-2xl font-black text-text group-hover:text-primary-600 transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                {featuredPost.author && (
                  <Link
                    href={`/author/${featuredPost.author.slug}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    {featuredPost.author.avatar_url ? (
                      <img
                        src={featuredPost.author.avatar_url}
                        alt={featuredPost.author.name}
                        className="h-10 w-10 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                        {featuredPost.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-text">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-text-muted truncate max-w-[150px]">
                        {featuredPost.author.job_title}
                      </p>
                    </div>
                  </Link>
                )}

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e91e63] group-hover:translate-x-1 transition-transform"
                >
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Latest Articles &amp; Guides</h2>
          <span className="text-xs text-text-muted">{posts.length} articles available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl border border-border bg-white overflow-hidden shadow-card hover:shadow-lg transition-all flex flex-col group"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative h-48 w-full overflow-hidden bg-zinc-100 block"
              >
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
                {post.category && (
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {post.category.name}
                  </span>
                )}
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <Clock className="h-3 w-3" />
                    <span>{post.reading_time_minutes} min read</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-sm sm:text-base font-bold text-text group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  {post.author ? (
                    <Link
                      href={`/author/${post.author.slug}`}
                      className="flex items-center gap-2 text-[11px] font-semibold text-text-secondary hover:text-text truncate"
                    >
                      <User className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span className="truncate">{post.author.name}</span>
                    </Link>
                  ) : null}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[11px] font-bold text-[#e91e63] shrink-0"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 sm:p-16 text-center space-y-4 shadow-card">
          <BookOpen className="h-12 w-12 text-[#e91e63] mx-auto opacity-70" />
          <h3 className="text-base font-bold text-text">No articles published yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            Our beauty editorial team is crafting expert skincare guides, ingredient breakdowns, and routine advice. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
