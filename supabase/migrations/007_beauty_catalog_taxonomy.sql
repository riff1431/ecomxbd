-- ==============================================================================
-- Migration: 007_beauty_catalog_taxonomy.sql
-- Description: Adds beauty & skincare specific taxonomy columns to products
--              and product_variants for multi-dimensional filtering, shades,
--              sizes, batch codes, and routine placement.
-- ==============================================================================

-- 1. Add Beauty Specific Columns to products Table
ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS skin_types TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS skin_concerns TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS key_ingredients TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
    ADD COLUMN IF NOT EXISTS batch_number TEXT,
    ADD COLUMN IF NOT EXISTS expiry_date DATE,
    ADD COLUMN IF NOT EXISTS how_to_use TEXT,
    ADD COLUMN IF NOT EXISTS full_ingredients TEXT,
    ADD COLUMN IF NOT EXISTS routine_step INT DEFAULT 0; -- 0: General, 1: Cleanser, 2: Toner, 3: Serum/Treatment, 4: Moisturizer, 5: Sunscreen

-- 2. Add Shade, Color, and Volume Columns to product_variants Table
ALTER TABLE public.product_variants 
    ADD COLUMN IF NOT EXISTS hex_color TEXT,
    ADD COLUMN IF NOT EXISTS shade_name TEXT,
    ADD COLUMN IF NOT EXISTS volume_size TEXT,
    ADD COLUMN IF NOT EXISTS variant_image_url TEXT;

-- 3. Create Index for Multi-Dimensional Facet Filtering
CREATE INDEX IF NOT EXISTS idx_products_skin_types ON public.products USING GIN (skin_types);
CREATE INDEX IF NOT EXISTS idx_products_skin_concerns ON public.products USING GIN (skin_concerns);
CREATE INDEX IF NOT EXISTS idx_products_key_ingredients ON public.products USING GIN (key_ingredients);
CREATE INDEX IF NOT EXISTS idx_products_country_of_origin ON public.products(country_of_origin);
CREATE INDEX IF NOT EXISTS idx_products_routine_step ON public.products(routine_step);
CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON public.products(expiry_date);
