export type Language = "bn" | "en";

export interface Translations {
  header: {
    announcementBadge: string;
    announcementText: string;
    routineFinder: string;
    trackOrder: string;
    authenticGuarantee: string;
    brands: string;
    topBrands: string;
    viewAll: string;
    searchPlaceholder: string;
    wishlist: string;
    account: string;
    login: string;
    admin: string;
    cart: string;
    noResults: string;
    viewAllResults: string;
    categories: string;
    concerns: string;
    actives: string;
    products: string;
    menu: string;
  };
  home: {
    heroDiscountBadge: string;
    trendingTitle: string;
    trendingSubtitle: string;
    trendingViewAll: string;
    dealsTitle: string;
    dealsSubtitle: string;
    topBrandsTitle: string;
    topBrandsSubtitle: string;
    shopByCategoryTitle: string;
    shopByCategorySubtitle: string;
    limitedOffersTitle: string;
    limitedOffersSubtitle: string;
    authenticProducts: string;
    authenticDesc: string;
    fastDelivery: string;
    fastDeliveryDesc: string;
    codAvailable: string;
    codDesc: string;
    easyReturns: string;
    easyReturnsDesc: string;
    consultation: string;
    consultationDesc: string;
    viewAll: string;
    beforeAfterTitle: string;
    beforeAfterSubtitle: string;
  };
  product: {
    freeShipping: string;
    inStock: string;
    outOfStock: string;
    addToCart: string;
    buyNow: string;
    addedToCart: string;
    off: string;
    reviews: string;
    itemCode: string;
    quickView: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    shopNow: string;
    subtotal: string;
    delivery: string;
    checkout: string;
    freeDeliveryUnlocked: string;
    addMoreForFreeDelivery: string;
  };
  mobileNav: {
    home: string;
    categories: string;
    wishlist: string;
    cart: string;
    account: string;
  };
  common: {
    bangla: string;
    english: string;
    language: string;
  };
}

export const translations: Record<Language, Translations> = {
  bn: {
    header: {
      announcementBadge: "ফ্রি ডেলিভারি",
      announcementText: "২,০০০ টাকার অর্ডারে সারা দেশে ফ্রি ডেলিভারি!",
      routineFinder: "রুটিন ফাইন্ডার",
      trackOrder: "অর্ডার ট্র্যাক",
      authenticGuarantee: "১০০% অরিজিনাল গ্যারান্টি",
      brands: "ব্র্যান্ডস",
      topBrands: "শীর্ষ ব্র্যান্ডসমূহ",
      viewAll: "সব দেখুন",
      searchPlaceholder: "প্রোডাক্ট, ব্র্যান্ড বা উপাদান খুঁজুন...",
      wishlist: "উইশলিস্ট",
      account: "অ্যাকাউন্ট",
      login: "লগইন",
      admin: "অ্যাডমিন",
      cart: "কার্ট",
      noResults: "কোনো ফলাফল পাওয়া যায়নি",
      viewAllResults: "সকল ফলাফল দেখুন",
      categories: "ক্যাটাগরি",
      concerns: "স্কিন কনসার্ন",
      actives: "উপাদান (Actives)",
      products: "প্রোডাক্টসমূহ",
      menu: "মেনু",
    },
    home: {
      heroDiscountBadge: "বিশেষ অফার",
      trendingTitle: "ট্রেন্ডিং বিউটি কালেকশন",
      trendingSubtitle: "সেরা রেটেড ও সর্বাধিক বিক্রিত খাঁটি প্রসাধনী",
      trendingViewAll: "সব দেখুন",
      dealsTitle: "মিস করবেন না এমন দারুণ ডিল",
      dealsSubtitle: "সেরা ডিসকাউন্টে আপনার পছন্দের বিউটি কেয়ার",
      topBrandsTitle: "শীর্ষ ব্র্যান্ড ও অফার",
      topBrandsSubtitle: "কোরিয়ান ও গ্লোবাল সেরা অথেনটিক ব্র্যান্ডসমূহ",
      shopByCategoryTitle: "ক্যাটাগরি অনুযায়ী কিনুন",
      shopByCategorySubtitle: "আপনার ত্বকের যত্নে প্রয়োজনীয় সঠিক ক্যাটাগরি বেছে নিন",
      limitedOffersTitle: "সীমিত সময়ের অফার",
      limitedOffersSubtitle: "স্টক শেষ হওয়ার আগেই লুফে নিন বিশেষ ছাড়",
      authenticProducts: "১০০% অরিজিনাল প্রসাধনী",
      authenticDesc: "সরাসরি অথরাইজড ডিস্ট্রিবিউটর থেকে আমদানিকৃত",
      fastDelivery: "দ্রুততম ডেলিভারি",
      fastDeliveryDesc: "ঢাকায় ২৪-৪৮ ঘণ্টা ও সারা দেশে দ্রুত হোম ডেলিভারি",
      codAvailable: "ক্যাশ অন ডেলিভারি",
      codDesc: "পণ্য হাতে পেয়ে নিশ্চিন্তে মূল্য পরিশোধ করুন",
      easyReturns: "সহজ রিটার্ন পলিসি",
      easyReturnsDesc: "কোনো সমস্যা হলে ৭ দিনের মধ্যে সহজ এক্সচেঞ্জ",
      consultation: "বিউটি এক্সপার্ট সাপোর্ট",
      consultationDesc: "ত্বকের সঠিক পরামর্শে ২৪/৭ সার্বক্ষণিক সহায়তা",
      viewAll: "সব দেখুন",
      beforeAfterTitle: "আসল পরিবর্তন দেখুন",
      beforeAfterSubtitle: "সঠিক স্কিনকেয়ার রুটিন ব্যবহারের দৃশ্যমান ফলাফল",
    },
    product: {
      freeShipping: "ফ্রি ডেলিভারি",
      inStock: "স্টকে আছে",
      outOfStock: "স্টক শেষ",
      addToCart: "কার্ট-এ যোগ করুন",
      buyNow: "এখনই কিনুন",
      addedToCart: "যোগ হয়েছে",
      off: "ছাড়",
      reviews: "রিভিউ",
      itemCode: "প্রোডাক্ট আইডি / এসকেইউ",
      quickView: "একনজরে",
    },
    cart: {
      title: "আপনার কার্ট",
      emptyTitle: "আপনার কার্ট খালি",
      emptySubtitle: "এখনই আপনার পছন্দের বিউটি প্রোডাক্ট কার্টে যোগ করুন",
      shopNow: "কেনাকাটা করুন",
      subtotal: "সাবটোটাল",
      delivery: "ডেলিভারি চার্জ",
      checkout: "অর্ডার কনফার্ম করুন",
      freeDeliveryUnlocked: "অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন 🎉",
      addMoreForFreeDelivery: "ফ্রি ডেলিভারির জন্য আরও যোগ করুন",
    },
    mobileNav: {
      home: "হোম",
      categories: "ক্যাটাগরি",
      wishlist: "উইশলিস্ট",
      cart: "কার্ট",
      account: "অ্যাকাউন্ট",
    },
    common: {
      bangla: "বাংলা",
      english: "English",
      language: "ভাষা",
    },
  },
  en: {
    header: {
      announcementBadge: "FREE DELIVERY",
      announcementText: "Free nationwide delivery on orders over ৳2,000!",
      routineFinder: "Routine Finder",
      trackOrder: "Track Order",
      authenticGuarantee: "100% Authentic Guarantee",
      brands: "Brands",
      topBrands: "Top Brands",
      viewAll: "View All",
      searchPlaceholder: "Search products, brands, or ingredients...",
      wishlist: "WISHLIST",
      account: "ACCOUNT",
      login: "LOGIN",
      admin: "ADMIN",
      cart: "CART",
      noResults: "No results found",
      viewAllResults: "View all results",
      categories: "Categories",
      concerns: "Skin Concerns",
      actives: "Key Actives",
      products: "Products",
      menu: "Menu",
    },
    home: {
      heroDiscountBadge: "SPECIAL OFFER",
      trendingTitle: "Trending Beauty Collection",
      trendingSubtitle: "Top-rated skincare & cosmetics authentic bestsellers",
      trendingViewAll: "View All",
      dealsTitle: "Deals You Cannot Miss",
      dealsSubtitle: "Grab your favorite beauty staples at unbeatable prices",
      topBrandsTitle: "Top Brands & Offers",
      topBrandsSubtitle: "Authorized Korean & global dermatological leaders",
      shopByCategoryTitle: "Shop by Categories",
      shopByCategorySubtitle: "Find precisely what your daily skincare routine needs",
      limitedOffersTitle: "Limited Time Flash Offers",
      limitedOffersSubtitle: "Exclusive limited deals before quantities run out",
      authenticProducts: "100% Authentic Products",
      authenticDesc: "Directly imported from authorized official distributors",
      fastDelivery: "Fast Delivery",
      fastDeliveryDesc: "24-48h in Dhaka & rapid nationwide doorstep delivery",
      codAvailable: "Cash on Delivery",
      codDesc: "Inspect package & pay upon delivery with ease",
      easyReturns: "Easy Returns Policy",
      easyReturnsDesc: "Hassle-free 7-day exchange guarantee",
      consultation: "Expert Beauty Support",
      consultationDesc: "24/7 personalized skincare recommendations",
      viewAll: "View All",
      beforeAfterTitle: "Real Visual Results",
      beforeAfterSubtitle: "Visible clinical improvements with active regimens",
    },
    product: {
      freeShipping: "FREE SHIPPING",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      addedToCart: "Added",
      off: "OFF",
      reviews: "Reviews",
      itemCode: "Item ID / SKU",
      quickView: "Quick View",
    },
    cart: {
      title: "Your Cart",
      emptyTitle: "Your cart is empty",
      emptySubtitle: "Discover and add authentic beauty products to your cart",
      shopNow: "Shop Now",
      subtotal: "Subtotal",
      delivery: "Delivery",
      checkout: "Checkout",
      freeDeliveryUnlocked: "Congratulations! Free Delivery unlocked 🎉",
      addMoreForFreeDelivery: "Add more to get Free Delivery",
    },
    mobileNav: {
      home: "HOME",
      categories: "CATEGORIES",
      wishlist: "WISHLIST",
      cart: "CART",
      account: "ACCOUNT",
    },
    common: {
      bangla: "বাংলা",
      english: "English",
      language: "Language",
    },
  },
};

export const bnNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(val: string | number): string {
  return String(val).replace(/[0-9]/g, (digit) => bnNumerals[+digit] ?? digit);
}
