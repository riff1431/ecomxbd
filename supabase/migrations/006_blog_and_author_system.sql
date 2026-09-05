-- ==============================================================================
-- Migration: 006_blog_and_author_system.sql
-- Description: Content marketing system with Authors (E-E-A-T), Categories,
--              Posts, and in-article Shoppable Product tags.
-- ==============================================================================

-- 1. Blog Authors Table (Google E-E-A-T Authority Profiles)
CREATE TABLE IF NOT EXISTS public.blog_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    job_title TEXT DEFAULT 'Beauty Editor & Skincare Specialist',
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    website_url TEXT,
    is_verified_expert BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'BookOpen',
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    reading_time_minutes INT DEFAULT 4,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Post Shoppable Products Relation (In-Article Product Embeds)
CREATE TABLE IF NOT EXISTS public.blog_post_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    position INT DEFAULT 0,
    callout_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, product_id)
);

-- Indices for high-speed queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_authors_slug ON public.blog_authors(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_products ENABLE ROW LEVEL SECURITY;

-- Public read policies for published articles
CREATE POLICY "Public read published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read authors" ON public.blog_authors
    FOR SELECT USING (true);

CREATE POLICY "Public read categories" ON public.blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Public read post products" ON public.blog_post_products
    FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Admin manage posts" ON public.blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage authors" ON public.blog_authors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage categories" ON public.blog_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage post products" ON public.blog_post_products
    FOR ALL USING (auth.role() = 'authenticated');
