// Site-wide configuration constants

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "ecomXbangladesh",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description: "Premium e-commerce platform for Bangladesh",
  defaultCurrency: "BDT",
  defaultLocale: "en-BD",
  defaultTimezone: "Asia/Dhaka",
} as const;

// Bangladesh divisions, districts, areas for checkout
export const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

// Admin sidebar navigation structure
export const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  {
    title: "Orders",
    icon: "ShoppingBag",
    children: [
      { title: "All Orders", href: "/admin/orders" },
      { title: "Incomplete Orders", href: "/admin/orders/incomplete" },
      { title: "Returns", href: "/admin/returns" },
      { title: "Tracking", href: "/admin/orders/tracking" },
    ],
  },
  {
    title: "Products",
    icon: "Package",
    children: [
      { title: "All Products", href: "/admin/products" },
      { title: "Categories", href: "/admin/categories" },
      { title: "Brands", href: "/admin/brands" },
      { title: "Attributes", href: "/admin/attributes" },
      { title: "Reviews", href: "/admin/reviews" },
      { title: "Q&A", href: "/admin/qa" },
    ],
  },
  { title: "Inventory", href: "/admin/inventory", icon: "Warehouse" },
  { title: "Customers", href: "/admin/customers", icon: "Users" },
  {
    title: "Marketing",
    icon: "Megaphone",
    children: [
      { title: "Coupons", href: "/admin/coupons" },
      { title: "SMS Campaigns", href: "/admin/marketing/sms" },
      { title: "Meta Pixel", href: "/admin/marketing/meta" },
      { title: "Catalog Feed", href: "/admin/marketing/catalog" },
      { title: "Search Analytics", href: "/admin/marketing/search" },
    ],
  },
  {
    title: "Shipping",
    icon: "Truck",
    children: [
      { title: "Delivery Partners", href: "/admin/shipping" },
      { title: "SteadFast", href: "/admin/shipping/steadfast" },
      { title: "Pathao", href: "/admin/shipping/pathao" },
    ],
  },
  {
    title: "Finance",
    icon: "DollarSign",
    children: [
      { title: "Sales Reports", href: "/admin/finance/sales" },
      { title: "Profit & Loss", href: "/admin/finance/pnl" },
      { title: "Costs", href: "/admin/finance/costs" },
      { title: "Accounting", href: "/admin/finance/accounting" },
      { title: "Suppliers", href: "/admin/finance/suppliers" },
      { title: "Due Manager", href: "/admin/finance/dues" },
      { title: "Investors", href: "/admin/finance/investors" },
    ],
  },
  { title: "Media", href: "/admin/media", icon: "Image" },
  { title: "Pages", href: "/admin/pages", icon: "FileText" },
  { title: "Appearance", href: "/admin/appearance", icon: "Palette" },
  { title: "Users & Roles", href: "/admin/users", icon: "Shield" },
  { title: "Reports", href: "/admin/reports", icon: "BarChart3" },
  { title: "Settings", href: "/admin/settings", icon: "Settings" },
  { title: "Activity Logs", href: "/admin/logs", icon: "ScrollText" },
] as const;

// Customer dashboard navigation
export const customerNavItems = [
  { title: "Overview", href: "/account", icon: "LayoutDashboard" },
  { title: "Orders", href: "/account/orders", icon: "ShoppingBag" },
  { title: "Track Orders", href: "/account/track", icon: "MapPin" },
  { title: "Wishlist", href: "/account/wishlist", icon: "Heart" },
  { title: "Addresses", href: "/account/addresses", icon: "MapPin" },
  { title: "Reviews", href: "/account/reviews", icon: "Star" },
  { title: "Returns", href: "/account/returns", icon: "RotateCcw" },
  { title: "Points", href: "/account/points", icon: "Award" },
  { title: "Vouchers", href: "/account/vouchers", icon: "Ticket" },
  { title: "Notifications", href: "/account/notifications", icon: "Bell" },
  { title: "Profile", href: "/account/profile", icon: "User" },
  { title: "Security", href: "/account/security", icon: "Lock" },
] as const;

// Cloudinary folder structure
export const cloudinaryFolders = {
  products: "ecommerce/products",
  categories: "ecommerce/categories",
  brands: "ecommerce/brands",
  banners: "ecommerce/banners",
  reviews: "ecommerce/reviews",
  users: "ecommerce/users",
  pages: "ecommerce/pages",
} as const;

// Cloudinary transformation presets
export const cloudinaryPresets = {
  thumbnail: { width: 150, height: 150, crop: "fill", quality: "auto", format: "auto" },
  productCard: { width: 400, height: 400, crop: "fill", quality: "auto", format: "auto" },
  productDetail: { width: 800, height: 800, crop: "fill", quality: "auto", format: "auto" },
  productZoom: { width: 1600, height: 1600, crop: "fill", quality: "auto", format: "auto" },
  mobileBanner: { width: 768, crop: "scale", quality: "auto", format: "auto" },
  desktopBanner: { width: 1440, crop: "scale", quality: "auto", format: "auto" },
} as const;

// Order status configuration
export const orderStatusConfig: Record<string, { label: string; color: string; nextStatuses: string[] }> = {
  pending: { label: "Pending", color: "yellow", nextStatuses: ["confirmed", "cancelled"] },
  confirmed: { label: "Confirmed", color: "blue", nextStatuses: ["processing", "cancelled"] },
  processing: { label: "Processing", color: "blue", nextStatuses: ["packed", "cancelled"] },
  packed: { label: "Packed", color: "indigo", nextStatuses: ["ready_for_pickup", "cancelled"] },
  ready_for_pickup: { label: "Ready for Pickup", color: "indigo", nextStatuses: ["shipped"] },
  shipped: { label: "Shipped", color: "purple", nextStatuses: ["in_transit"] },
  in_transit: { label: "In Transit", color: "purple", nextStatuses: ["out_for_delivery"] },
  out_for_delivery: { label: "Out for Delivery", color: "orange", nextStatuses: ["delivered", "failed"] },
  delivered: { label: "Delivered", color: "green", nextStatuses: ["return_requested"] },
  cancelled: { label: "Cancelled", color: "red", nextStatuses: [] },
  failed: { label: "Failed", color: "red", nextStatuses: ["confirmed"] },
  return_requested: { label: "Return Requested", color: "amber", nextStatuses: ["returned"] },
  returned: { label: "Returned", color: "gray", nextStatuses: ["refunded"] },
  refunded: { label: "Refunded", color: "gray", nextStatuses: [] },
};
