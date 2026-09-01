import { z } from "zod";

// --- Auth ---

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// --- Products ---

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  sku: z.string().max(100).optional().nullable(),
  barcode: z.string().max(100).optional().nullable(),
  product_type: z.enum(["simple", "variable"]),
  status: z.enum(["draft", "active", "archived"]),
  brand_id: z.string().uuid().optional().nullable(),
  supplier_id: z.string().uuid().optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  usage: z.string().optional().nullable(),
  ingredients_specifications: z.string().optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  warranty: z.string().max(255).optional().nullable(),
  cost_price: z.number().min(0).optional().nullable(),
  regular_price: z.number().min(0, "Regular price is required"),
  sale_price: z.number().min(0).optional().nullable(),
  sale_start: z.string().optional().nullable(),
  sale_end: z.string().optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  length: z.number().min(0).optional().nullable(),
  width: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  shipping_class: z.string().optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  is_featured: z.boolean().default(false),
  is_indexed: z.boolean().default(true),
  category_ids: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(),
});

export const productVariantSchema = z.object({
  sku: z.string().max(100).optional().nullable(),
  barcode: z.string().max(100).optional().nullable(),
  cost_price: z.number().min(0).optional().nullable(),
  regular_price: z.number().min(0).optional().nullable(),
  sale_price: z.number().min(0).optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  attribute_value_ids: z.array(z.string().uuid()),
});

// Helper to convert empty string inputs from HTML forms to null
const emptyToNull = (val: unknown) => (val === "" || val === undefined ? null : val);

// --- Categories ---

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  parent_id: z.preprocess(emptyToNull, z.string().uuid().optional().nullable()),
  description: z.preprocess(emptyToNull, z.string().optional().nullable()),
  image_url: z.preprocess(emptyToNull, z.string().url().optional().nullable()),
  seo_title: z.preprocess(emptyToNull, z.string().max(70).optional().nullable()),
  seo_description: z.preprocess(emptyToNull, z.string().max(160).optional().nullable()),
  sort_order: z.number().int().default(0),
  status: z.enum(["active", "inactive"]),
});

// --- Brands ---

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  logo_url: z.preprocess(emptyToNull, z.string().url().optional().nullable()),
  banner_url: z.preprocess(emptyToNull, z.string().url().optional().nullable()),
  description: z.preprocess(emptyToNull, z.string().optional().nullable()),
  seo_title: z.preprocess(emptyToNull, z.string().max(70).optional().nullable()),
  seo_description: z.preprocess(emptyToNull, z.string().max(160).optional().nullable()),
  status: z.enum(["active", "inactive"]),
});

// --- Coupons ---

export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(50).toUpperCase(),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().min(0, "Value must be positive"),
  max_discount: z.number().min(0).optional().nullable(),
  min_cart_amount: z.number().min(0).optional().nullable(),
  scope: z.enum(["all", "product", "category", "brand", "customer"]),
  scope_ids: z.array(z.string().uuid()).optional().nullable(),
  first_order_only: z.boolean().default(false),
  usage_limit: z.number().int().min(1).optional().nullable(),
  per_user_limit: z.number().int().min(1).optional().nullable(),
  starts_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  combinable: z.boolean().default(false),
  excluded_product_ids: z.array(z.string().uuid()).optional().nullable(),
});

// --- Orders ---

export const orderNoteSchema = z.object({
  note: z.string().min(1, "Note is required").max(1000),
  is_internal: z.boolean().default(true),
});

// --- Addresses ---

export const addressSchema = z.object({
  label: z.string().max(50).optional().nullable(),
  name: z.string().min(1, "Name is required").max(255),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid phone number"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  area: z.string().min(1, "Area is required"),
  address_line: z.string().min(1, "Address is required").max(500),
  postal_code: z.string().max(10).optional().nullable(),
  is_default: z.boolean().default(false),
});

// --- Inventory ---

export const inventoryAdjustmentSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional().nullable(),
  type: z.enum(["purchase", "adjustment", "damage", "return", "manual"]),
  quantity_change: z.number().int().refine((val) => val !== 0, "Quantity change cannot be 0"),
  notes: z.string().max(500).optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type BrandFormData = z.infer<typeof brandSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type InventoryAdjustmentData = z.infer<typeof inventoryAdjustmentSchema>;
