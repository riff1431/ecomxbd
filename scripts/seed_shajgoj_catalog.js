const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Read env variables directly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pdeooqamevjpkcnaokac.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZW9vcWFtZXZqcGtjbmFva2FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE3NDQxMiwiZXhwIjoyMTAzNzUwNDEyfQ.QH1LdHfsvzujL5S6blcW4bAUqim5vy5FbJhJk2XDVfE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function seedShajgojCatalog() {
  console.log('🚀 Seeding rich Shajgoj beauty products & photography to Supabase...');

  // 1. Categories
  const categoriesData = [
    { name: 'Skin Care', slug: 'skin-care', description: 'Cleansers, toners, serums, moisturizers, and sunscreens.', sort_order: 1, status: 'active' },
    { name: 'Hair Care', slug: 'hair-care', description: 'Anti-dandruff shampoos, conditioners, hair oils, and serums.', sort_order: 2, status: 'active' },
    { name: 'Makeup', slug: 'makeup', description: 'Foundations, lipsticks, eyeliners, and powders.', sort_order: 3, status: 'active' },
    { name: 'Body Care', slug: 'body-care', description: 'Shower gels, body lotions, body washes, and scrubs.', sort_order: 4, status: 'active' },
    { name: 'Fragrance', slug: 'fragrance', description: 'Perfumes, body mists, and deos.', sort_order: 5, status: 'active' },
  ];

  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'slug' })
    .select();
  if (catErr) console.error('Categories error:', catErr);
  else console.log(`✅ Seeded ${categories.length} categories`);

  // 2. Brands
  const brandsData = [
    { name: 'COSRX', slug: 'cosrx', description: 'Expect Tomorrow: South Korean Derm Skincare.', status: 'active' },
    { name: 'The Ordinary', slug: 'the-ordinary', description: 'Clinical formulations with integrity.', status: 'active' },
    { name: 'CeraVe', slug: 'cerave', description: 'Developed with dermatologists, ceramides skincare.', status: 'active' },
    { name: 'Beauty of Joseon', slug: 'beauty-of-joseon', description: 'Traditional Korean Hanbang herbal skincare.', status: 'active' },
    { name: "Pond's", slug: 'ponds', description: 'Advanced Miracle skincare and brightening serums.', status: 'active' },
    { name: 'Meril', slug: 'meril', description: 'Luxury perfumed body care and shower essentials.', status: 'active' },
    { name: 'Naturale Zero', slug: 'naturale-zero', description: 'Herbal anti-dandruff scalp care.', status: 'active' },
    { name: 'Simple', slug: 'simple', description: 'Kind to skin facial cleansers & toners.', status: 'active' },
    { name: 'Cetaphil', slug: 'cetaphil', description: 'Gentle dermatological skin cleansing.', status: 'active' },
    { name: "L'Oréal Paris", slug: 'loreal', description: 'Hyaluronic acid and anti-aging skincare.', status: 'active' },
  ];

  const { data: brands, error: brandErr } = await supabase
    .from('brands')
    .upsert(brandsData, { onConflict: 'slug' })
    .select();
  if (brandErr) console.error('Brands error:', brandErr);
  else console.log(`✅ Seeded ${brands.length} brands`);

  const brandMap = new Map((brands || []).map(b => [b.slug, b.id]));
  const catMap = new Map((categories || []).map(c => [c.slug, c.id]));

  // 3. Products
  const productsList = [
    {
      name: 'COSRX Advanced Snail 96 Mucin Power Essence (100ml)',
      slug: 'cosrx-advanced-snail-96-mucin-power-essence-100ml',
      sku: 'CSX-SNL-96',
      barcode: '8809416470009',
      product_type: 'simple',
      brand_id: brandMap.get('cosrx'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Lightweight essence with 96.3% snail secretion filtrate for glowing glass skin.',
      description: 'COSRX Advanced Snail 96 Mucin Power Essence contains 96.3% Snail Secretion Filtrate, helping protect the skin from moisture loss while improving skin elasticity. Snail mucin helps repair and soothe red, sensitive skin post-breakouts.',
      cost_price: 1100,
      regular_price: 1850,
      sale_price: 1450,
      weight: 0.25,
      og_image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'The Ordinary Niacinamide 10% + Zinc 1% (30ml)',
      slug: 'the-ordinary-niacinamide-10-zinc-1-30ml',
      sku: 'ORD-NIA-30',
      barcode: '769915190311',
      product_type: 'simple',
      brand_id: brandMap.get('the-ordinary'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'High-strength vitamin and mineral blemish formula with 10% pure Niacinamide.',
      description: 'Niacinamide (Vitamin B3) reduces the appearance of skin blemishes and congestion. A high 10% concentration balances visible aspects of sebum activity.',
      cost_price: 800,
      regular_price: 1400,
      sale_price: 1150,
      weight: 0.15,
      og_image_url: 'https://images.unsplash.com/photo-1608248597359-bb433140523f?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'CeraVe Hydrating Facial Cleanser (237ml)',
      slug: 'cerave-hydrating-facial-cleanser-237ml',
      sku: 'CRV-HYD-237',
      barcode: '3606000537750',
      product_type: 'simple',
      brand_id: brandMap.get('cerave'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Gentle, hydrating foaming lotion cleanser formulated with 3 essential ceramides.',
      description: 'Developed with dermatologists, CeraVe Hydrating Cleanser cleanses, hydrates and helps restore the protective skin barrier with 3 essential ceramides.',
      cost_price: 1200,
      regular_price: 1950,
      sale_price: 1650,
      weight: 0.35,
      og_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+ (50ml)',
      slug: 'beauty-of-joseon-relief-sun-rice-probiotics-spf-50',
      sku: 'BOJ-SUN-50',
      barcode: '8809738313498',
      product_type: 'simple',
      brand_id: brandMap.get('beauty-of-joseon'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Organic chemical sunscreen with 30% Rice Extract and Grain Probiotics.',
      description: 'Lightweight creamy sunscreen that applies smoothly without white cast. Enriched with 30% Rice Extract and Grain Fermented Extracts for deep hydration.',
      cost_price: 1000,
      regular_price: 1650,
      sale_price: 1350,
      weight: 0.1,
      og_image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: "Pond's Miracle Me Brightening Serum (30ml)",
      slug: 'ponds-miracle-me-brightening-serum-30ml',
      sku: 'PND-MRC-30',
      barcode: '8901030889211',
      product_type: 'simple',
      brand_id: brandMap.get('ponds'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Instant glow brightening serum with Gluta-Boost-C and Vitamin B3.',
      description: "Pond's Miracle Me serum delivers glowing, spot-free radiant skin in 7 days. Clinically proven formulation with 60x more brightening power than Vitamin C.",
      cost_price: 600,
      regular_price: 1150,
      sale_price: 850,
      weight: 0.15,
      og_image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Meril Perfumed Shower Gel Bliss (250ml)',
      slug: 'meril-perfumed-shower-gel-bliss-250ml',
      sku: 'MRL-SHW-250',
      barcode: '8941100234512',
      product_type: 'simple',
      brand_id: brandMap.get('meril'),
      status: 'active',
      is_featured: true,
      categorySlug: 'body-care',
      short_description: 'Exotic floral perfumed shower gel for fresh and aromatic silky skin.',
      description: 'Pamper your senses with Meril Perfumed Shower Gel Bliss. Formulated with rich botanical moisturizers that leave your skin deeply cleansed, fragrant, and hydrated.',
      cost_price: 240,
      regular_price: 380,
      sale_price: 320,
      weight: 0.3,
      og_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Naturale Zero Anti-Dandruff Herbal Scalp Shampoo (200ml)',
      slug: 'naturale-zero-anti-dandruff-herbal-shampoo-200ml',
      sku: 'NTZ-DND-200',
      barcode: '8941200345621',
      product_type: 'simple',
      brand_id: brandMap.get('naturale-zero'),
      status: 'active',
      is_featured: true,
      categorySlug: 'hair-care',
      short_description: 'Say goodbye to dandruff in 7 days with Tea tree and Neem herbal extracts.',
      description: 'Naturale Zero Anti-Dandruff Shampoo combines active zinc pyrithione with organic tea tree oil to eliminate flakes and sooth itchy scalp from the very first wash.',
      cost_price: 320,
      regular_price: 580,
      sale_price: 450,
      weight: 0.28,
      og_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Simple Kind to Skin Refreshing Facial Wash (150ml)',
      slug: 'simple-kind-to-skin-refreshing-facial-wash-150ml',
      sku: 'SMP-REF-150',
      barcode: '5011451103863',
      product_type: 'simple',
      brand_id: brandMap.get('simple'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: '100% soap-free gel cleanser packed with Pro-Vitamin B5 and Vitamin E.',
      description: 'Simple Refreshing Facial Wash thoroughly cleanses your skin without leaving it dry or tight. 100% soap-free, no artificial perfume, color, or harsh chemicals.',
      cost_price: 550,
      regular_price: 950,
      sale_price: 750,
      weight: 0.2,
      og_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Cetaphil Gentle Skin Cleanser (125ml)',
      slug: 'cetaphil-gentle-skin-cleanser-125ml',
      sku: 'CTP-GNT-125',
      barcode: '9318637043323',
      product_type: 'simple',
      brand_id: brandMap.get('cetaphil'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Dermatologist recommended daily gentle formula for sensitive dry skin.',
      description: 'Cetaphil Gentle Skin Cleanser hydrates as it cleanses to soothe and replenish skin moisture barrier. Hypoallergenic and non-irritating formula.',
      cost_price: 900,
      regular_price: 1450,
      sale_price: 1200,
      weight: 0.18,
      og_image_url: 'https://images.unsplash.com/photo-1608248597359-bb433140523f?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: "L'Oréal Paris Revitalift 1.5% Pure Hyaluronic Acid Serum (30ml)",
      slug: 'loreal-paris-revitalift-hyaluronic-acid-serum-30ml',
      sku: 'LOR-HYA-30',
      barcode: '3600523882748',
      product_type: 'simple',
      brand_id: brandMap.get('loreal'),
      status: 'active',
      is_featured: true,
      categorySlug: 'skin-care',
      short_description: 'Plumps skin with intense moisture and visibly reduces fine lines.',
      description: "L'Oréal Paris Revitalift 1.5% Pure Hyaluronic Acid Serum intensely hydrates and replumps skin in 1 hour. Validated by dermatologists for all skin types.",
      cost_price: 1300,
      regular_price: 2200,
      sale_price: 1750,
      weight: 0.15,
      og_image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    }
  ];

  for (const item of productsList) {
    const { categorySlug, ...prodData } = item;
    const { data: prod, error: pErr } = await supabase
      .from('products')
      .upsert(prodData, { onConflict: 'slug' })
      .select()
      .single();

    if (pErr) {
      console.error(`Error seeding ${item.name}:`, pErr.message);
      continue;
    }

    const catId = catMap.get(categorySlug);
    if (catId) {
      await supabase.from('product_categories').upsert(
        { product_id: prod.id, category_id: catId },
        { onConflict: 'product_id,category_id' }
      );
    }

    // Seed inventory stock
    await supabase.from('inventory').upsert(
      {
        product_id: prod.id,
        variant_id: null,
        on_hand: 50,
        reserved: 2,
        available: 48,
        sold: 22,
        damaged: 0,
        low_stock_threshold: 5,
      },
      { onConflict: 'product_id,variant_id' }
    );

    console.log(`✅ Seeded: ${prod.name}`);
  }

  console.log('\n🎉 ALL 10 AUTHENTIC SHAJGOJ BEAUTY PRODUCTS SEEDED SUCCESSFULLY!');
}

seedShajgojCatalog().catch(console.error);
