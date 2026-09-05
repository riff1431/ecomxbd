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

export interface HomepageFaqItem {
  id: string;
  question: string;
  questionBn?: string;
  answer: string;
  answerBn?: string;
  category?: string;
}

export interface HomepageFaqSectionConfig {
  enabled: boolean;
  heading: string;
  headingBn?: string;
  subtitle: string;
  subtitleBn?: string;
  seoDescriptionHtml?: string;
  seoDescriptionHtmlBn?: string;
  faqs: HomepageFaqItem[];
}

export interface FooterLinkItem {
  label: string;
  labelBn?: string;
  href: string;
  badge?: string;
  isHighlight?: boolean;
}

export interface FooterConfig {
  brandText?: string;
  logoImageUrl?: string;
  aboutText?: string;
  aboutTextBn?: string;
  copyrightText?: string;
  supportPhone?: string;
  supportEmail?: string;
  supportAddress?: string;
  supportAddressBn?: string;
  supportWhatsapp?: string;
  newsletterTitle?: string;
  newsletterTitleBn?: string;
  newsletterSubtitle?: string;
  newsletterSubtitleBn?: string;
  showTrustPillars?: boolean;
  showNewsletter?: boolean;
  showPaymentBadges?: boolean;
  showSocialLinks?: boolean;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  acceptedPaymentMethods?: {
    bkash?: boolean;
    nagad?: boolean;
    visa?: boolean;
    mastercard?: boolean;
    cod?: boolean;
  };
  categoryLinks?: FooterLinkItem[];
  customerCareLinks?: FooterLinkItem[];
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
  supportEmail?: string;
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
  faqSection?: HomepageFaqSectionConfig;
  footerConfig?: FooterConfig;
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
    { id: "pill-blog", label: "BEAUTY BLOG", href: "/blog", bgClass: "bg-[#e11d48]" },
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

  // 9. SEO & Humanized FAQ Section (Inspired by Beauty Booth & Ogerio)
  faqSection: {
    enabled: true,
    heading: "Frequently Asked Questions & Beauty Guide",
    headingBn: "প্রয়োজনীয় প্রশ্নোত্তর ও বিউটি শপিং গাইড",
    subtitle: "Everything you need to know about authentic cosmetics, delivery, and skincare in Bangladesh",
    subtitleBn: "বাংলাদেশে ১০০% অথেনটিক কসমেটিকস, দ্রুত ডেলিভারি ও স্কিনকেয়ার সম্পর্কিত সাধারণ তথ্যাবলী",
    seoDescriptionHtml:
      "Welcome to <strong>Blush &amp; Budget</strong>, your premier destination for 100% authentic international skincare, hair care, and beauty products in Bangladesh. We bring you the most beloved Korean, Japanese, UK, and USA brands directly from authorized distributors. From cult-favorite snail mucin essences and soothing centella serums to dermatologist-tested cleansers and sunscreens, every item is guaranteed original with nationwide Cash on Delivery and dedicated customer support.",
    seoDescriptionHtmlBn:
      "<strong>ব্লাশ অ্যান্ড বাজেট (Blush &amp; Budget)</strong>-এ আপনাকে স্বাগতম। আমরা বাংলাদেশে ১০০% খাঁটি ও সার্টিফাইড আন্তর্জাতিক স্কিনকেয়ার, হেয়ার কেয়ার এবং মেকআপের নির্ভরযোগ্য প্ল্যাটফর্ম। কোরিয়ান গ্লাস স্কিন রুটিন থেকে শুরু করে ইউকে এবং ইউএসএ-এর স্বনামধন্য ডার্মাটোলজিক্যাল ব্র্যান্ডগুলো সরাসরি অনুমোদিত ডিস্ট্রিবিউটর থেকে সংগ্রহ করে সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে দ্রুত পৌঁছে দেওয়া হয়।",
    faqs: [
      {
        id: "faq-1",
        category: "Authenticity & Quality",
        question: "How can I be sure that the products on Blush & Budget are 100% authentic?",
        questionBn: "আপনাদের প্রোডাক্টগুলো যে ১০০% আসল ও অরিজিনাল, তা কীভাবে নিশ্চিত হব?",
        answer:
          "Every product in our inventory is directly procured from official brand partners or authorized global distributors in Seoul, London, and Dubai. Every item features original manufacturer batch codes verifiable on international batch checkers like CheckFresh, hygiene seals, and authentic hologram stickers. If proven non-authentic, we offer an unconditional 300% money-back guarantee.",
        answerBn:
          "আমাদের প্রতিটি পণ্য সরাসরি ব্র্যান্ড অথবা আন্তর্জাতিক অনুমোদিত ডিস্ট্রিবিউটর থেকে সরাসরি আমদানি করা হয়। প্রতিটি বক্সে আসল ব্যাচ কোড, সিল ও হলোগ্রাম স্টিকার থাকে যা CheckFresh বা ব্র্যান্ড অ্যাপে ভেরিফাই করা যায়। কোনো পণ্য নকল প্রমাণিত হলে আমরা ৩০০% মানিব্যাক গ্যারান্টি প্রদান করি।",
      },
      {
        id: "faq-2",
        category: "Delivery & Courier",
        question: "How fast is delivery, and do you offer Cash on Delivery across all 64 districts?",
        questionBn: "ডেলিভারি পেতে কত দিন সময় লাগে এবং সারা বাংলাদেশে কি ক্যাশ অন ডেলিভারি আছে?",
        answer:
          "Yes! We offer nationwide Cash on Delivery (COD) across all 64 districts in Bangladesh via SteadFast and Pathao Courier. Delivery within Dhaka City takes 24 to 48 hours, while deliveries outside Dhaka typically arrive within 3 to 5 business days with real-time SMS tracking updates.",
        answerBn:
          "হ্যাঁ! সমগ্র বাংলাদেশের ৬৪টি জেলা ও থানা পর্যায়ে SteadFast এবং Pathao কুরিয়ারের মাধ্যমে হোম ডেলিভারি ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে। ঢাকা সিটির মধ্যে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে আপনার দোরগোড়ায় পার্সেল পৌঁছে দেওয়া হয়।",
      },
      {
        id: "faq-3",
        category: "Doorstep Inspection",
        question: "Can I inspect the parcel before paying the delivery rider?",
        questionBn: "ডেলিভারিম্যানের সামনে পার্সেলটি কি খুলে চেক করে নেওয়া যাবে?",
        answer:
          "Absolutely! We encourage all our valued customers to inspect the outer packaging and ensure the ordered items are intact before handing over the payment to the delivery rider.",
        answerBn:
          "অবশ্যই! আমাদের সম্মানিত গ্রাহকদের সুবিধার্থে ক্যাশ অন ডেলিভারিতে ডেলিভারিম্যানের সামনে পার্সেলটি ভালো করে চেক করে মূল্য পরিশোধ করার সম্পূর্ণ স্বাধীনতা রয়েছে।",
      },
      {
        id: "faq-4",
        category: "Returns & Exchanges",
        question: "What is your return or replacement policy if I receive a damaged product?",
        questionBn: "প্রোডাক্টে কোনো সমস্যা হলে রিটার্ন বা পরিবর্তনের নিয়ম কী?",
        answer:
          "We provide a hassle-free 7-day replacement guarantee. If your product is damaged during transit, leaked, or has a manufacturing defect, simply contact our support hotline or WhatsApp with an unboxing video within 7 days. We will arrange a free courier pickup from your home and dispatch a fresh replacement immediately.",
        answerBn:
          "আমাদের রয়েছে সহজ ৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট সুবিধা। কোনো কারণে ক্ষতিগ্রস্ত পার্সেল বা ভুল প্রোডাক্ট পৌঁছালে আনবক্সিং ভিডিও সহ আমাদের সাপোর্ট নম্বরে জানান। আমাদের কুরিয়ার প্রতিনিধি সরাসরি আপনার বাসা থেকে পার্সেল নিয়ে আসবেন এবং সম্পূর্ণ ফ্রিতে নতুন প্রোডাক্ট পাঠানো হবে।",
      },
      {
        id: "faq-5",
        category: "Skincare Advice",
        question: "Can I get customized skincare consultation for my skin type?",
        questionBn: "আমার ত্বকের ধরন অনুযায়ী কি ফ্রি স্কিনকেয়ার পরামর্শ পেতে পারি?",
        answer:
          "Yes! Our trained beauty advisors are available on WhatsApp, live chat, and hotline to help you choose the right cleanser, toner, serum, or moisturizer for acne, pigmentation, dryness, or anti-aging based on your unique skin profile.",
        answerBn:
          "অবশ্যই! আপনার ত্বকের সমস্যা (যেমন: ব্রণের দাগ, রোদে পোড়া ভাব, বয়সের ছাপ বা শুষ্কতা) অনুযায়ী সঠিক প্রোডাক্ট বেছে নিতে আমাদের বিউটি এক্সপার্টরা হোয়াটসঅ্যাপ ও লাইভ সাপোর্টে সম্পূর্ণ বিনামূল্যে পরামর্শ দিয়ে থাকেন।",
      },
    ],
  },

  // 10. Footer Comprehensive Configuration
  footerConfig: {
    brandText: "Blush & Budget",
    logoImageUrl: "",
    aboutText:
      "Bangladesh's most trusted beauty and personal care destination for 100% authentic international skincare, hair care, and cosmetics with nationwide Cash on Delivery.",
    aboutTextBn:
      "বাংলাদেশের সবচেয়ে নির্ভরযোগ্য বিউটি ও স্কিনকেয়ার গন্তব্য। ১০০% অরিজিনাল কোরিয়ান ও ওয়েস্টার্ন কসমেটিকস সারা দেশে ক্যাশ অন ডেলিভারিতে দ্রুত পৌঁছানো হয়।",
    copyrightText: "© 2026 Blush & Budget. All rights reserved. 100% Genuine Certified Cosmetics.",
    supportPhone: "+880 1700-000000",
    supportEmail: "support@example.com",
    supportAddress: "Gulshan, Dhaka, Bangladesh",
    supportAddressBn: "গুলশান, ঢাকা, বাংলাদেশ",
    supportWhatsapp: "+880 1700-000000",
    newsletterTitle: "Get Exclusive Deals & Beauty Tips",
    newsletterTitleBn: "এক্সক্লুসিভ অফার ও বিউটি টিপস পান",
    newsletterSubtitle: "Subscribe for new arrivals, flash sale coupons & skincare routine guides.",
    newsletterSubtitleBn: "নতুন প্রোডাক্ট রিলিজ, ডিসকাউন্ট ভাউচার ও স্কিনকেয়ার গাইড পেতে সাবস্ক্রাইব করুন।",
    showTrustPillars: true,
    showNewsletter: true,
    showPaymentBadges: true,
    showSocialLinks: true,
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      tiktok: "https://tiktok.com",
      whatsapp: "https://wa.me/8801700000000",
    },
    acceptedPaymentMethods: {
      bkash: true,
      nagad: true,
      visa: true,
      mastercard: true,
      cod: true,
    },
    categoryLinks: [
      { label: "Skin Care", labelBn: "স্কিন কেয়ার", href: "/products?category=skin-care" },
      { label: "Hair Care", labelBn: "হেয়ার কেয়ার", href: "/products?category=hair-care" },
      { label: "Makeup", labelBn: "মেকআপ", href: "/products?category=makeup" },
      { label: "Body Care", labelBn: "বডি কেয়ার", href: "/products?category=body-care" },
      { label: "Top Brands", labelBn: "শীর্ষ ব্র্যান্ডসমূহ", href: "/brands" },
      { label: "Beauty Journal & Guides", labelBn: "বিউটি জার্নাল ও গাইড", href: "/blog", isHighlight: true },
      { label: "Special Offers", labelBn: "স্পেশাল অফার", href: "/products?discount=true", isHighlight: true },
    ],
    customerCareLinks: [
      { label: "My Account", labelBn: "আমার অ্যাকাউন্ট", href: "/account" },
      { label: "Track Order", labelBn: "অর্ডার ট্র্যাক", href: "/track-order", isHighlight: true },
      { label: "Wishlist", labelBn: "উইশলিস্ট", href: "/wishlist" },
      { label: "Return Policy", labelBn: "রিটার্ন পলিসি", href: "/page/returns" },
      { label: "Terms & Conditions", labelBn: "শর্তাবলী ও নিয়মাবলী", href: "/page/terms" },
      { label: "Privacy Policy", labelBn: "গোপনীয়তা নীতি", href: "/page/privacy" },
      { label: "FAQ & Help Center", labelBn: "প্রশ্নোত্তর ও হেল্প সেন্টার", href: "/page/faq" },
    ],
  },

  footerBrandText: "Blush & Budget",
  footerLogoImageUrl: "",
  footerAboutText:
    "Bangladesh's most trusted beauty and personal care destination for 100% authentic international skincare, hair care, and cosmetics with nationwide Cash on Delivery.",
  footerCopyright: "© 2026 Blush & Budget. All rights reserved. 100% Genuine Certified Cosmetics.",
};
