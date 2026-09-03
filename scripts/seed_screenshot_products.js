const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pdeooqamevjpkcnaokac.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZW9vcWFtZXZqcGtjbmFva2FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE3NDQxMiwiZXhwIjoyMTAzNzUwNDEyfQ.QH1LdHfsvzujL5S6blcW4bAUqim5vy5FbJhJk2XDVfE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function seedScreenshotProducts() {
  console.log('Seeding exact screenshot products...');

  // Ensure brands
  const brandsData = [
    { name: 'Lux', slug: 'lux', description: 'Lux fine fragrance body washes', status: 'active' },
    { name: 'Simple', slug: 'simple', description: 'Simple kind to skin skincare', status: 'active' },
    { name: "Pond's", slug: 'ponds', description: "Pond's skin institute", status: 'active' },
  ];

  const { data: brands } = await supabase.from('brands').upsert(brandsData, { onConflict: 'slug' }).select();
  const brandMap = new Map((brands || []).map(b => [b.slug, b.id]));

  // Ensure categories
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = new Map((categories || []).map(c => [c.slug, c.id]));

  const productsList = [
    {
      name: 'Lux Body Wash Black Orchid Scent & Juniper Oil (245ml)',
      slug: 'lux-body-wash-black-orchid-scent-juniper-oil-245ml',
      sku: 'LUX-BOD-245',
      barcode: '8941100234599',
      product_type: 'simple',
      brand_id: brandMap.get('lux'),
      status: 'active',
      is_featured: true,
      categorySlug: 'body-care',
      short_description: 'Magical Orchid fragrance body wash for 24h glowing long-lasting aroma.',
      description: 'Pamper your skin with Lux Magical Orchid Scent Body Wash, infused with floral fusion oil and black orchid extracts.',
      cost_price: 110,
      regular_price: 200,
      sale_price: 149,
      weight: 0.3,
      og_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Simple Kind to Skin Hydrating Light Moisturiser (125ml)',
      slug: 'simple-kind-to-skin-hydrating-light-moisturiser-125ml',
      sku: 'SMP-HYD-125',
      barcode: '5011451103999',
      product_type: 'simple',
      brand_id: brandMap.get('simple'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Fast-absorbing lightweight lotion enriched with Pro-Vitamin B5 and Vitamin E.',
      description: 'Simple Hydrating Light Moisturiser keeps skin moisturised and hydrated for up to 12 hours.',
      cost_price: 550,
      regular_price: 950,
      sale_price: 749,
      weight: 0.18,
      og_image_url: 'https://images.unsplash.com/photo-1608248597359-5f2187f54c5e?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ponds Hydra Miracle Super Light Gel 100g',
      slug: 'ponds-hydra-miracle-super-light-gel-100g',
      sku: 'PND-HYD-100',
      barcode: '8901030889999',
      product_type: 'simple',
      brand_id: brandMap.get('ponds'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Non-oily 24hr hydration gel with Hyaluronic Acid & Vitamin E.',
      description: "Pond's Hydra Miracle Super Light Gel with 72hr hydration locks in moisture without feeling sticky.",
      cost_price: 190,
      regular_price: 350,
      sale_price: 265,
      weight: 0.15,
      og_image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Simple Kind To Skin Refreshing Facial Wash (150ml)',
      slug: 'simple-kind-to-skin-refreshing-facial-wash-150ml',
      sku: 'SMP-REF-150',
      barcode: '5011451103863',
      product_type: 'simple',
      brand_id: brandMap.get('simple'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: '100% soap-free gel cleanser packed with Pro-Vitamin B5 and Vitamin E.',
      description: 'Simple Refreshing Facial Wash thoroughly cleanses without leaving skin dry or tight.',
      cost_price: 550,
      regular_price: 950,
      sale_price: 749,
      weight: 0.2,
      og_image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    },
  ];

  for (const item of productsList) {
    const { categorySlug, ...prodData } = item;
    const { data: prod, error: pErr } = await supabase
      .from('products')
      .upsert(prodData, { onConflict: 'slug' })
      .select()
      .single();

    if (pErr) {
      console.error(`Error with ${item.name}:`, pErr.message);
      continue;
    }

    const catId = catMap.get(categorySlug);
    if (catId) {
      await supabase.from('product_categories').upsert(
        { product_id: prod.id, category_id: catId },
        { onConflict: 'product_id,category_id' }
      );
    }

    await supabase.from('inventory').upsert(
      {
        product_id: prod.id,
        variant_id: null,
        on_hand: 50,
        reserved: 0,
        available: 50,
        sold: 10,
        damaged: 0,
        low_stock_threshold: 5,
      },
      { onConflict: 'product_id,variant_id' }
    );

    console.log(`Seeded: ${prod.name}`);
  }

  console.log('Done seeding screenshot products!');
}

seedScreenshotProducts().catch(console.error);
