export interface ImageBannerItem {
  id: string;
  title: string;
  href: string;
  image: string;
}

export interface WavyOfferCard {
  id: string;
  ribbonText: string;
  mainText: string;
  href: string;
}

export interface CategoryCardItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface TrustPillarItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  imageUrl?: string;
}

export interface CampaignPillItem {
  id: string;
  label: string;
  href: string;
  bgClass: string;
}

export interface ProductCardConfig {
  freeShippingText: string;
  addToCartText: string;
  orderNowText: string;
  showDiscountBadge: boolean;
  showWishlistButton: boolean;
  showFreeShippingStrip: boolean;
  showRating: boolean;
  showSizeBadge: boolean;
}

export interface HeaderNavSubcategory {
  name: string;
  href: string;
}

export interface HeaderNavCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  subcategories: HeaderNavSubcategory[];
  featuredBrands: string[];
  promoBanner?: {
    title: string;
    subtitle: string;
    image: string;
    href: string;
  };
}

export interface HeaderConfig {
  logoText: string;
  logoImageUrl: string;
  logoLink: string;
  mobileLogoText?: string;
  mobileLogoImageUrl?: string;
  drawerLogoText?: string;
  drawerLogoImageUrl?: string;
  searchPlaceholders: string[];
  navCategories: HeaderNavCategory[];
}

export interface BeforeAfterConfig {
  enabled?: boolean;
  title: string;
  subtitle: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  imageFit?: "cover" | "contain" | "top";
  aspectRatio?: "4/3" | "16/10" | "1/1" | "auto";
  eyebrowBadge?: string;
  heading: string;
  description: string;
  metric1?: string;
  metric2?: string;
  metric3?: string;
  buttonText: string;
  buttonHref: string;
}

export interface HomepageFullConfig {
  headerConfig: HeaderConfig;
  announcementBadgeText: string;
  announcementText: string;
  freeDeliveryThreshold: number;
  routineFinderText: string;
  routineFinderHref: string;
  trackOrderText: string;
  trackOrderHref: string;
  authenticGuaranteeText: string;
  supportPhone: string;
  campaignPills: CampaignPillItem[];
  heroSlides: ImageBannerItem[];
  stripBanner: ImageBannerItem;
  dealsYouCannotMiss: ImageBannerItem[];
  topBrandsAndOffers: ImageBannerItem[];
  limitedTimeOffers: WavyOfferCard[];
  shopByCategories: CategoryCardItem[];
  beforeAfterSection?: BeforeAfterConfig;
  trendingTitle: string;
  trendingSubtitle: string;
  trendingViewAllText: string;
  cardSettings: ProductCardConfig;
  trustPillars: TrustPillarItem[];
  footerBrandText?: string;
  footerLogoImageUrl?: string;
  footerAboutText?: string;
  footerCopyright: string;
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageFullConfig = {
  // 0. Header & Mega-Menu Configuration
  headerConfig: {
    logoText: "Blush & Budget",
    logoImageUrl: "",
    logoLink: "/",
    mobileLogoText: "Blush & Budget",
    mobileLogoImageUrl: "",
    drawerLogoText: "Blush & Budget",
    drawerLogoImageUrl: "",
    searchPlaceholders: [
      "Ordinary",
      "COSRX Snail Mucin",
      "CeraVe Cleanser",
      "Beauty of Joseon Sunscreen",
      "Niacinamide Serum",
      "Shampoo & Hair Care",
    ],
    navCategories: [
      {
        id: "nav-makeup",
        name: "Makeup",
        slug: "makeup",
        href: "/products?category=makeup",
        subcategories: [
          { name: "Foundations & BB Creams", href: "/products?category=makeup&type=foundation" },
          { name: "Lipsticks & Lip Tints", href: "/products?category=makeup&type=lipstick" },
          { name: "Eyeshadows & Mascaras", href: "/products?category=makeup&type=eyes" },
          { name: "Eyeliners & Kajal", href: "/products?category=makeup&type=eyeliner" },
          { name: "Setting Sprays & Powders", href: "/products?category=makeup&type=powder" },
          { name: "Blushes & Highlighters", href: "/products?category=makeup&type=blush" },
        ],
        featuredBrands: ["L'Oréal Paris", "Maybelline", "MAC", "Revolution"],
        promoBanner: {
          title: "Makeup Fest Up to 40% Off",
          subtitle: "100% Original Global Cosmetics",
          image: "/categories/cat_makeup.jpg",
          href: "/products?category=makeup",
        },
      },
      {
        id: "nav-skin",
        name: "Skin",
        slug: "skin-care",
        href: "/products?category=skin-care",
        subcategories: [
          { name: "Cleansers & Facewash", href: "/products?category=skin-care&type=cleanser" },
          { name: "Toners & Mists", href: "/products?category=skin-care&type=toner" },
          { name: "Serums & Ampoules", href: "/products?category=skin-care&type=serum" },
          { name: "Moisturizers & Creams", href: "/products?category=skin-care&type=moisturizer" },
          { name: "Sunscreen & SPF 50", href: "/products?category=skin-care&type=sunscreen" },
          { name: "Eye & Lip Treatments", href: "/products?category=skin-care&type=eye-lip" },
        ],
        featuredBrands: ["COSRX", "The Ordinary", "CeraVe", "Beauty of Joseon"],
        promoBanner: {
          title: "Glass Skin Glow Routine",
          subtitle: "Top Korean & US Formulations",
          image: "/categories/cat_k_beauty.jpg",
          href: "/products?category=skin-care",
        },
      },
      {
        id: "nav-hair",
        name: "Hair",
        slug: "hair-care",
        href: "/products?category=hair-care",
        subcategories: [
          { name: "Shampoos & Cleansers", href: "/products?category=hair-care&type=shampoo" },
          { name: "Conditioners & Hair Masks", href: "/products?category=hair-care&type=conditioner" },
          { name: "Hair Oils & Serums", href: "/products?category=hair-care&type=oil" },
          { name: "Anti-Dandruff Treatments", href: "/products?category=hair-care&type=treatment" },
          { name: "Hair Styling & Colors", href: "/products?category=hair-care&type=styling" },
        ],
        featuredBrands: ["Vatika", "L'Oréal", "Himalaya", "Tresemme"],
        promoBanner: {
          title: "Zero Dandruff Festival",
          subtitle: "7-Day Clinically Proven Scalp Therapy",
          image: "/categories/cat_hair_care.jpg",
          href: "/products?category=hair-care",
        },
      },
      {
        id: "nav-body",
        name: "Personal care",
        slug: "body-care",
        href: "/products?category=body-care",
        subcategories: [
          { name: "Body Lotions & Butters", href: "/products?category=body-care&type=lotion" },
          { name: "Shower Gels & Body Wash", href: "/products?category=body-care&type=wash" },
          { name: "Body Scrubs & Exfoliators", href: "/products?category=body-care&type=scrub" },
          { name: "Hand & Foot Care", href: "/products?category=body-care&type=hand-foot" },
        ],
        featuredBrands: ["Nivea", "Vaseline", "Cetaphil", "Meril"],
        promoBanner: {
          title: "Luxury Body Hydration",
          subtitle: "Smooth, velvety soft skin 24h",
          image: "/categories/cat_mom_baby.jpg",
          href: "/products?category=body-care",
        },
      },
      {
        id: "nav-mom-baby",
        name: "Mom & Baby",
        slug: "mom-baby",
        href: "/products?category=mom-baby",
        subcategories: [
          { name: "Baby Lotions & Creams", href: "/products?category=mom-baby&type=lotion" },
          { name: "Baby Shampoos & Wash", href: "/products?category=mom-baby&type=wash" },
          { name: "Diaper Rash Care", href: "/products?category=mom-baby&type=diaper" },
          { name: "Maternity Skincare", href: "/products?category=mom-baby&type=maternity" },
        ],
        featuredBrands: ["Aveeno Baby", "Johnson's", "Cetaphil Baby", "Sebamed"],
        promoBanner: {
          title: "Gentle Pure Baby Care",
          subtitle: "100% Tear-Free & Pediatrician Approved",
          image: "/categories/cat_mom_baby.jpg",
          href: "/products?category=mom-baby",
        },
      },
      {
        id: "nav-fragrance",
        name: "Fragrance",
        slug: "fragrance",
        href: "/products?category=fragrance",
        subcategories: [
          { name: "Women's Perfumes", href: "/products?category=fragrance&type=women" },
          { name: "Men's Cologne & EDT", href: "/products?category=fragrance&type=men" },
          { name: "Body Mists & Sprays", href: "/products?category=fragrance&type=mist" },
          { name: "Attars & Oils", href: "/products?category=fragrance&type=attar" },
        ],
        featuredBrands: ["Chanel", "Dior", "Victoria's Secret", "Armaf"],
        promoBanner: {
          title: "Signature Global Scents",
          subtitle: "Long-lasting luxury notes",
          image: "/categories/cat_fragrance.jpg",
          href: "/products?category=fragrance",
        },
      },
    ],
  },

  announcementBadgeText: "FREE DELIVERY",
  announcementText: "Free nationwide delivery on orders over ৳2,000!",
  freeDeliveryThreshold: 2000,
  routineFinderText: "Routine Finder",
  routineFinderHref: "/products?category=skin-care",
  trackOrderText: "Track Order",
  trackOrderHref: "/account/orders",
  authenticGuaranteeText: "100% Authentic Guarantee",
  supportPhone: "+880 1700-000000",

  // Top Subnavigation Campaign Badges
  campaignPills: [
    { id: "pill-1", label: "UNDERGARMENTS", href: "/products?category=body-care", bgClass: "bg-[#2563eb]" },
    { id: "pill-2", label: "COMBO", href: "/products?category=combo", bgClass: "bg-[#c026d3]" },
    { id: "pill-3", label: "JEWELLERY", href: "/products?category=jewellery", bgClass: "bg-[#9333ea]" },
    { id: "pill-4", label: "CLEARANCE SALE", href: "/products?discount=true", bgClass: "bg-[#0284c7]" },
    { id: "pill-5", label: "MEN", href: "/products?category=skin-care", bgClass: "bg-[#059669]" },
  ],

  // 1. Hero Carousel Banners (Formatted in 1920x650 Wide Ratio)
  heroSlides: [
    {
      id: "hero-1",
      title: "Himalaya Skincare & Haircare Up to 50% Off",
      href: "/products?search=himalaya",
      image: "/banners/hero_himalaya.jpg",
    },
    {
      id: "hero-2",
      title: "The Ordinary Clinical Serums 33% Off",
      href: "/products?search=the%20ordinary",
      image: "/banners/hero_ordinary.svg",
    },
    {
      id: "hero-3",
      title: "COSRX K-Beauty Festival Up to 41% Off",
      href: "/products?search=cosrx",
      image: "/banners/hero_cosrx.svg",
    },
    {
      id: "hero-4",
      title: "Vatika Naturals Hair Care Festival",
      href: "/products?category=hair-care",
      image: "/banners/hero_vatika.svg",
    },
  ],

  // 2. Secondary Strip Banner (Pond's Miracle Me)
  stripBanner: {
    id: "strip-ponds",
    title: "POND'S MIRACLE ME UP TO 25% OFF",
    href: "/products?search=ponds",
    image: "/banners/strip_ponds.svg",
  },

  // 3. DEALS YOU CANNOT MISS (Exact 4 100% Unbreakable Local Banners)
  dealsYouCannotMiss: [
    {
      id: "deal-1",
      title: "MEGA OFFERS 50% OFF - Free Delivery",
      href: "/products?discount=true",
      image: "/banners/deal_mega_offers.jpg",
    },
    {
      id: "deal-2",
      title: "SAY GOODBYE TO DANDRUFF IN 7 DAYS",
      href: "/products?category=hair-care",
      image: "/banners/deal_anti_dandruff.jpg",
    },
    {
      id: "deal-3",
      title: "Meril Perfumed Shower Gel 51 TK OFF",
      href: "/products?category=body-care",
      image: "/banners/deal_shower_gel.svg",
    },
    {
      id: "deal-4",
      title: "JEWELLERY & ACCESSORIES BLUSH & BUDGET NEW ARRIVALS",
      href: "/products?category=jewellery",
      image: "/banners/deal_jewellery.svg",
    },
  ],

  // 4. TOP BRANDS & OFFERS (Exact 6 100% Unbreakable Local Banners)
  topBrandsAndOffers: [
    {
      id: "brand-1",
      title: "the only trimmer you'll ever need",
      href: "/products?search=trimmer",
      image: "/banners/brand_trimmer.svg",
    },
    {
      id: "brand-2",
      title: "skino Summer Protection UP TO 50% OFF",
      href: "/products?search=sunscreen",
      image: "/banners/brand_skino.svg",
    },
    {
      id: "brand-3",
      title: "INTRODUCING Vatika Naturals",
      href: "/products?category=hair-care",
      image: "/banners/brand_vatika.svg",
    },
    {
      id: "brand-4",
      title: "Treasure of Glow - UP TO 35% OFF + FREE DELIVERY",
      href: "/products?discount=true",
      image: "/banners/brand_glow.svg",
    },
    {
      id: "brand-5",
      title: "The Ordinary. UP TO 33% OFF",
      href: "/products?search=the%20ordinary",
      image: "/banners/brand_ordinary.svg",
    },
    {
      id: "brand-6",
      title: "Soft skin - Luxury Daily Body Care",
      href: "/products?category=body-care",
      image: "/banners/brand_softskin.svg",
    },
  ],

  // 5. LIMITED TIME OFFERS
  limitedTimeOffers: [
    {
      id: "bogo",
      ribbonText: "DOUBLE THE FUN WITH",
      mainText: "BOGO",
      href: "/products?discount=true",
    },
    {
      id: "combo",
      ribbonText: "PERFECT MATCH",
      mainText: "COMBO",
      href: "/products?category=combo",
    },
    {
      id: "offers",
      ribbonText: "EXCLUSIVE",
      mainText: "OFFERS",
      href: "/products?discount=true",
    },
    {
      id: "clearance",
      ribbonText: "CLEARANCE",
      mainText: "SALE",
      href: "/products?discount=true",
    },
  ],

  // 6. SHOP BEAUTY PRODUCTS BY CATEGORY (Girl Model Cards with Name)
  shopByCategories: [
    { id: "cat-1", name: "MAKEUP", slug: "makeup", image: "/categories/cat_makeup.jpg" },
    { id: "cat-2", name: "K-BEAUTY", slug: "skin-care", image: "/categories/cat_k_beauty.jpg" },
    { id: "cat-3", name: "HAIR CARE", slug: "hair-care", image: "/categories/cat_hair_care.jpg" },
    { id: "cat-4", name: "MOM & BABY", slug: "mom-baby", image: "/categories/cat_mom_baby.jpg" },
    { id: "cat-5", name: "SKIN CARE", slug: "skin-care", image: "/categories/cat_skin_care.jpg" },
    { id: "cat-6", name: "FRAGRANCE", slug: "fragrance", image: "/categories/cat_fragrance.jpg" },
  ],

  // 6.5. Before & After Beauty Tech Slider
  beforeAfterSection: {
    enabled: true,
    title: "SEE REAL SKIN RESULTS",
    subtitle: "Interactive 7-Day Skincare Transformation",
    beforeImage: "/banners/before_skin.jpg",
    afterImage: "/banners/after_skin.jpg",
    beforeLabel: "DAY 1 • DULL & DEHYDRATED",
    afterLabel: "DAY 7 • RADIANT GLASS SKIN",
    imageFit: "top",
    aspectRatio: "4/3",
    eyebrowBadge: "CLINICALLY FORMULATED",
    heading: "Restore Skin Barrier in 7 Days",
    description: "Target hyperpigmentation, uneven skin tone, and deep dehydration using our certified 3-step routine.",
    metric1: "96% Noticeable reduction in redness and irritation",
    metric2: "24h Non-greasy moisture barrier protection",
    metric3: "100% Direct Certified Authentic Global Imports",
    buttonText: "SHOP THE TRANSFORMATION ROUTINE",
    buttonHref: "/products?category=skin-care",
  },

  // 7. Trending Products Showcase Section Titles & Card Controls
  trendingTitle: "TRENDING PRODUCTS",
  trendingSubtitle: "100% Certified Direct Imports",
  trendingViewAllText: "View All →",
  cardSettings: {
    freeShippingText: "FREE SHIPPING",
    addToCartText: "ADD TO CART",
    orderNowText: "ORDER NOW",
    showDiscountBadge: true,
    showWishlistButton: true,
    showFreeShippingStrip: true,
    showRating: true,
    showSizeBadge: true,
  },

  // 8. Trust Pillars
  trustPillars: [
    { id: "tp-1", title: "100% Authentic", subtitle: "Direct from Brands", iconName: "shield" },
    { id: "tp-2", title: "Fast Delivery", subtitle: "24-48h Nationwide", iconName: "truck" },
    { id: "tp-3", title: "Cash on Delivery", subtitle: "Pay on parcel delivery", iconName: "zap" },
    { id: "tp-4", title: "Easy Returns", subtitle: "7-Day Return Policy", iconName: "rotate" },
  ],

  // 9. Footer
  footerBrandText: "Blush & Budget",
  footerLogoImageUrl: "",
  footerAboutText: "Bangladesh's most trusted beauty and personal care destination for 100% authentic international skincare, hair care, and cosmetics with nationwide Cash on Delivery.",
  footerCopyright: "© 2026 Blush & Budget. All rights reserved. 100% Genuine Certified Cosmetics.",
};
