-- ==============================================================================
-- ecomXbangladesh / Blush & Budget - Consolidated Database Synchronization Script
-- Description: Applies all missing tables, columns, indexes, and RLS policies
-- Target Supabase Project: pdeooqamevjpkcnaokac
-- Safe & Idempotent: Can be run multiple times without error.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BLOG & AUTHOR SYSTEM (E-E-A-T)
-- ------------------------------------------------------------------------------

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

CREATE TABLE IF NOT EXISTS public.blog_post_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    position INT DEFAULT 0,
    callout_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_authors_slug ON public.blog_authors(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);

ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public read authors" ON public.blog_authors;
    CREATE POLICY "Public read authors" ON public.blog_authors FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin manage authors" ON public.blog_authors;
    CREATE POLICY "Admin manage authors" ON public.blog_authors FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read categories" ON public.blog_categories;
    CREATE POLICY "Public read categories" ON public.blog_categories FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin manage categories" ON public.blog_categories;
    CREATE POLICY "Admin manage categories" ON public.blog_categories FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read posts" ON public.blog_posts;
    CREATE POLICY "Public read posts" ON public.blog_posts FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin manage posts" ON public.blog_posts;
    CREATE POLICY "Admin manage posts" ON public.blog_posts FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read post products" ON public.blog_post_products;
    CREATE POLICY "Public read post products" ON public.blog_post_products FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin manage post products" ON public.blog_post_products;
    CREATE POLICY "Admin manage post products" ON public.blog_post_products FOR ALL USING (true);
END $$;


-- ------------------------------------------------------------------------------
-- 2. FRAUD PREVENTION & RISK SCORING
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.fraud_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('phone', 'email', 'ip', 'address')),
  identifier_value TEXT NOT NULL,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  cancellation_count INTEGER NOT NULL DEFAULT 0,
  rejected_delivery_count INTEGER NOT NULL DEFAULT 0,
  return_abuse_count INTEGER NOT NULL DEFAULT 0,
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  blacklist_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fraud_profiles_val ON public.fraud_profiles(identifier_type, identifier_value);
CREATE INDEX IF NOT EXISTS idx_fraud_profiles_blacklisted ON public.fraud_profiles(is_blacklisted) WHERE is_blacklisted = TRUE;

CREATE TABLE IF NOT EXISTS public.fraud_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  risk_signals JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  action_taken TEXT NOT NULL DEFAULT 'flagged',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fraud_events_order ON public.fraud_events(order_id);
CREATE INDEX IF NOT EXISTS idx_fraud_events_created ON public.fraud_events(created_at DESC);

CREATE TABLE IF NOT EXISTS public.abandoned_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  district TEXT,
  address TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]',
  cart_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  recovery_status TEXT NOT NULL DEFAULT 'abandoned' CHECK (recovery_status IN ('abandoned', 'sms_sent', 'recovered')),
  recovered_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_phone ON public.abandoned_checkouts(customer_phone);
CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_status ON public.abandoned_checkouts(recovery_status);

ALTER TABLE public.fraud_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admin manage fraud profiles" ON public.fraud_profiles;
    CREATE POLICY "Admin manage fraud profiles" ON public.fraud_profiles FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage fraud events" ON public.fraud_events;
    CREATE POLICY "Admin manage fraud events" ON public.fraud_events FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage abandoned checkouts" ON public.abandoned_checkouts;
    CREATE POLICY "Admin manage abandoned checkouts" ON public.abandoned_checkouts FOR ALL USING (true);
END $$;


-- ------------------------------------------------------------------------------
-- 3. LOGISTICS, SHIPMENTS, SMS & EXPENSES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.couriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  api_base_url TEXT,
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.courier_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL,
  courier_name TEXT NOT NULL,
  consignment_id TEXT,
  tracking_id TEXT,
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'booked', 'failed', 'cancelled')),
  delivery_status TEXT NOT NULL DEFAULT 'in_review',
  cod_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  provider_response JSONB DEFAULT '{}',
  booked_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON public.courier_shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.courier_shipments(tracking_id);

CREATE TABLE IF NOT EXISTS public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_type TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.sms_templates(id) ON DELETE SET NULL,
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
  provider_response JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON public.sms_logs(recipient_phone);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admin manage couriers" ON public.couriers;
    CREATE POLICY "Admin manage couriers" ON public.couriers FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage courier shipments" ON public.courier_shipments;
    CREATE POLICY "Admin manage courier shipments" ON public.courier_shipments FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage sms templates" ON public.sms_templates;
    CREATE POLICY "Admin manage sms templates" ON public.sms_templates FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage sms logs" ON public.sms_logs;
    CREATE POLICY "Admin manage sms logs" ON public.sms_logs FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage suppliers" ON public.suppliers;
    CREATE POLICY "Admin manage suppliers" ON public.suppliers FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin manage expenses" ON public.expenses;
    CREATE POLICY "Admin manage expenses" ON public.expenses FOR ALL USING (true);
END $$;

INSERT INTO public.couriers (name, code, api_base_url, status, config) VALUES
  ('SteadFast Courier', 'steadfast', 'https://portal.steadfast.com.bd/api/v1', 'active', '{"auto_booking": false}'),
  ('Pathao Courier', 'pathao', 'https://api-hermes.pathao.com/aladdin/api/v1', 'active', '{"auto_booking": false}')
ON CONFLICT (code) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 4. BEAUTY CATALOG TAXONOMY COLUMNS & INDICES
-- ------------------------------------------------------------------------------

ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS skin_types TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS skin_concerns TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS key_ingredients TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
    ADD COLUMN IF NOT EXISTS batch_number TEXT,
    ADD COLUMN IF NOT EXISTS expiry_date DATE,
    ADD COLUMN IF NOT EXISTS how_to_use TEXT,
    ADD COLUMN IF NOT EXISTS full_ingredients TEXT,
    ADD COLUMN IF NOT EXISTS routine_step INT DEFAULT 0;

ALTER TABLE public.product_variants 
    ADD COLUMN IF NOT EXISTS hex_color TEXT,
    ADD COLUMN IF NOT EXISTS shade_name TEXT,
    ADD COLUMN IF NOT EXISTS volume_size TEXT,
    ADD COLUMN IF NOT EXISTS variant_image_url TEXT;

CREATE INDEX IF NOT EXISTS idx_products_skin_types ON public.products USING GIN (skin_types);
CREATE INDEX IF NOT EXISTS idx_products_skin_concerns ON public.products USING GIN (skin_concerns);
CREATE INDEX IF NOT EXISTS idx_products_key_ingredients ON public.products USING GIN (key_ingredients);
CREATE INDEX IF NOT EXISTS idx_products_country_of_origin ON public.products(country_of_origin);
CREATE INDEX IF NOT EXISTS idx_products_routine_step ON public.products(routine_step);
CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON public.products(expiry_date);
