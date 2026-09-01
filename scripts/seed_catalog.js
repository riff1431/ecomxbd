const { createClient } = require('@supabase/supabase-js');
const path = require('path');
// Load environment variables from .env.local if present
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
} catch {
  // dotenv optional
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log('Seeding demo catalog data...');

  // 1. Categories
  const categoriesData = [
    { name: 'Skin Care', slug: 'skin-care', description: 'Serums, moisturizers, cleansers, and toners.', sort_order: 1, status: 'active' },
    { name: 'Hair Care', slug: 'hair-care', description: 'Shampoos, conditioners, hair oils, and serums.', sort_order: 2, status: 'active' },
    { name: 'Makeup', slug: 'makeup', description: 'Foundations, lipsticks, mascaras, and eyeliners.', sort_order: 3, status: 'active' },
  ];

  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'slug' })
    .select();
  if (catErr) throw catErr;
  console.log(`✅ Seeded ${categories.length} categories`);

  // 2. Brands
  const brandsData = [
    { name: 'COSRX', slug: 'cosrx', description: 'Expect Tomorrow: South Korean derm skincare.', status: 'active' },
    { name: 'The Ordinary', slug: 'the-ordinary', description: 'Clinical formulations with integrity.', status: 'active' },
    { name: 'CeraVe', slug: 'cerave', description: 'Developed with dermatologists, ceramides skincare.', status: 'active' },
  ];

  const { data: brands, error: brandErr } = await supabase
    .from('brands')
    .upsert(brandsData, { onConflict: 'slug' })
    .select();
  if (brandErr) throw brandErr;
  console.log(`✅ Seeded ${brands.length} brands`);

  const cosrx = brands.find(b => b.slug === 'cosrx');
  const theOrdinary = brands.find(b => b.slug === 'the-ordinary');
  const cerave = brands.find(b => b.slug === 'cerave');
  const skinCare = categories.find(c => c.slug === 'skin-care');

  // 3. Products
  const productsData = [
    {
      name: 'COSRX Advanced Snail 96 Mucin Power Essence (100ml)',
      slug: 'cosrx-advanced-snail-96-mucin-power-essence-100ml',
      sku: 'CSX-SNL-96',
      barcode: '8809416470009',
      product_type: 'simple',
      brand_id: cosrx.id,
      status: 'active',
      is_featured: true,
      short_description: 'Lightweight essence which absorbs quickly into skin to give skin natural glow from within.',
      description: 'COSRX Advanced Snail 96 Mucin Power Essence contains 96.3% Snail Secretion Filtrate, helping protect the skin from moisture loss while improving skin elasticity. Snail mucin helps repair and soothe red, sensitive skin post-breakouts by replenishing moisture.',
      benefits: '• Nourishes and plumps skin\n• Anti-aging\n• Deep hydration\n• Calms damaged skin',
      usage: 'After cleansing and toning, apply a small amount on your entire face. Gently pat using fingertips to aid absorption.',
      ingredients_specifications: 'Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Polyacrylate, Phenoxyethanol, Sodium Hyaluronate, Allantoin, Ethyl Hexanediol, Carbomer, Panthenol, Arginine.',
      country: 'South Korea',
      warranty: '100% Authentic Guaranteed or 2x Refund',
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
      brand_id: theOrdinary.id,
      status: 'active',
      is_featured: true,
      short_description: 'High-strength vitamin and mineral blemish formula with 10% pure Niacinamide and 1% Zinc PCA.',
      description: 'Niacinamide (Vitamin B3) reduces the appearance of skin blemishes and congestion. A high 10% concentration of this vitamin is supported in the formula by zinc salt of pyrrolidone carboxylic acid to balance visible aspects of sebum activity.',
      benefits: '• Regulates sebum production\n• Minimizes enlarged pores\n• Evens out skin texture\n• Brightens dull skin',
      usage: 'Apply to entire face morning and evening before heavier creams.',
      ingredients_specifications: 'Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin.',
      country: 'Canada',
      warranty: '100% Authentic Guaranteed',
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
      brand_id: cerave.id,
      status: 'active',
      is_featured: true,
      short_description: 'Gentle, hydrating foaming lotion cleanser formulated with 3 essential ceramides and hyaluronic acid.',
      description: 'Developed with dermatologists, CeraVe Hydrating Cleanser is a unique formula that cleanses, hydrates and helps restore the protective skin barrier with three essential ceramides (1, 3, 6-II). The formula also contains hyaluronic acid to help retain skins natural moisture.',
      benefits: '• Non-comedogenic\n• Fragrance-free\n• Formulated with MVE delivery technology\n• For normal to dry skin',
      usage: 'Wet skin with lukewarm water. Massage cleanser into skin in a gentle, circular motion. Rinse well.',
      ingredients_specifications: 'Aqua / Water / Eau, Glycerin, Cetearyl Alcohol, Peg-40 Stearate, Stearyl Alcohol, Potassium Phosphate, Ceramide Np, Ceramide Ap, Ceramide Eop, Carbomer, Glyceryl Stearate, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Disodium Edta, Dipotassium Phosphate, Tocopherol, Phytosphingosine, Xanthan Gum, Ethylhexylglycerin.',
      country: 'United States',
      warranty: 'Original USA Import Guaranteed',
      cost_price: 1200,
      regular_price: 1950,
      sale_price: 1650,
      weight: 0.35,
      og_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    }
  ];

  for (const prodData of productsData) {
    const { data: prod, error: pErr } = await supabase
      .from('products')
      .upsert(prodData, { onConflict: 'slug' })
      .select()
      .single();

    if (pErr) throw pErr;

    // Link category
    if (skinCare) {
      await supabase.from('product_categories').upsert(
        { product_id: prod.id, category_id: skinCare.id },
        { onConflict: 'product_id,category_id' }
      );
    }

    // Seed inventory (50 in stock)
    await supabase.from('inventory').upsert(
      {
        product_id: prod.id,
        variant_id: null,
        on_hand: 50,
        reserved: 2,
        available: 48,
        sold: 14,
        damaged: 0,
        low_stock_threshold: 5,
      },
      { onConflict: 'product_id,variant_id' }
    );

    console.log(`✅ Seeded product: ${prod.name}`);
  }

  console.log('\n🎉 Demo catalog seeded successfully!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
