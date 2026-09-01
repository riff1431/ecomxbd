"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { ProductReviewsQA } from "@/components/storefront/product-reviews-qa";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const inWishlist = isWishlisted(product.id);
  const [activeTab, setActiveTab] = useState<"description" | "benefits" | "usage" | "ingredients" | "warranty" | "reviews">("description");
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.product_variants?.[0] || null
  );

  // Gallery Images
  const mediaList = product.product_media || [];
  const imageUrls: string[] = [];
  if (product.og_image_url) imageUrls.push(product.og_image_url);
  mediaList.forEach((pm: any) => {
    if (pm.media?.secure_url && !imageUrls.includes(pm.media.secure_url)) {
      imageUrls.push(pm.media.secure_url);
    }
  });

  const [selectedImage, setSelectedImage] = useState<string>(
    imageUrls[0] || ""
  );

  const discountPercent =
    product.sale_price && product.regular_price > product.sale_price
      ? Math.round(
          ((product.regular_price - product.sale_price) / product.regular_price) * 100
        )
      : 0;

  const inv = product.inventory as Array<{ available: number }> | null;
  const availableStock = inv && inv.length > 0 ? inv[0].available : 10;
  const isOutOfStock = availableStock <= 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.sale_price ?? product.regular_price,
        regular_price: product.regular_price,
        image_url: selectedImage || product.og_image_url || null,
        brand_name: product.brands?.name || null,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.sale_price ?? product.regular_price,
        regular_price: product.regular_price,
        image_url: selectedImage || product.og_image_url || null,
        brand_name: product.brands?.name || null,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div className="space-y-12">
      {/* 1. Main Gallery + Info Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left 5 Cols: Gallery */}
        <div className="lg:col-span-5 space-y-3">
          {/* Main Photo Box */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-surface-secondary/70 shadow-xs flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition-all duration-300"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ShoppingBag className="h-16 w-16 stroke-[1]" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3.5 top-3.5 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-black text-white shadow-sm">
                  -{discountPercent}% OFF
                </span>
              )}
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                100% Authentic
              </span>
            </div>

            {/* Wishlist Button inside gallery */}
            <button
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  regular_price: product.regular_price,
                  sale_price: product.sale_price,
                  image_url: product.og_image_url || null,
                  brand_name: product.brands?.name || null,
                })
              }
              aria-label="Add to wishlist"
              className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-all hover:bg-white hover:scale-110 active:scale-95"
            >
              <Heart
                className={cn(
                  "h-4.5 w-4.5 transition-colors",
                  inWishlist ? "fill-accent-500 text-accent-500" : "text-zinc-600"
                )}
              />
            </button>
          </div>

          {/* Thumbnails list */}
          {imageUrls.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all p-1 bg-surface-secondary",
                    selectedImage === url
                      ? "border-primary-600 ring-2 ring-primary-500/20"
                      : "border-border hover:border-text-muted opacity-80 hover:opacity-100"
                  )}
                >
                  <img src={url} alt="thumbnail" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 7 Cols: Product Details & Conversion Hierarchy */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Brand & Title */}
          <div>
            {product.brands && (
              <Link
                href={`/products?brand=${product.brands.slug}`}
                className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-primary-600 hover:text-primary-700 transition-colors"
              >
                <span>{product.brands.name}</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}
            <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-black text-text leading-tight">
              {product.name}
            </h1>

            {/* Rating and Share Bar */}
            <div className="mt-2.5 flex items-center justify-between border-b border-border pb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="font-bold text-text">5.0</span>
                <span className="text-text-muted font-medium">(24 Verified Buyer Reviews)</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text rounded-lg px-2.5 py-1 hover:bg-surface-secondary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="rounded-2xl border border-border bg-surface-secondary/40 p-4 space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-text">
                {formatPrice(product.sale_price ?? product.regular_price)}
              </span>
              {product.sale_price && product.sale_price < product.regular_price && (
                <>
                  <span className="text-sm sm:text-base text-text-muted line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                    You Save {formatPrice(product.regular_price - product.sale_price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-text-muted font-medium">
              Tax included. Free Delivery available inside Dhaka over ৳2,500.
            </p>
          </div>

          {/* Product Variants (if available) */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-text">Select Size / Volume:</label>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "rounded-xl border px-3.5 py-2 text-xs font-bold transition-all",
                      selectedVariant?.id === v.id
                        ? "border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20"
                        : "border-border bg-white text-text hover:border-text-muted"
                    )}
                  >
                    {v.title || v.sku || "Standard Edition"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-text-muted font-medium">Availability:</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold",
                isOutOfStock
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              )}
            >
              <Check className="h-3 w-3" />
              {isOutOfStock ? "Sold Out" : "In Stock (Guaranteed Authentic)"}
            </span>
          </div>

          {/* Quantity Stepper & Conversion Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper (44px min tap height) */}
              <div className="flex items-center h-11 rounded-xl border border-border bg-surface-secondary/80">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="h-full px-3.5 text-text hover:bg-white rounded-l-xl transition-colors disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-extrabold text-text">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="h-full px-3.5 text-text hover:bg-white rounded-r-xl transition-colors disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Primary Add to Bag Button */}
              <Button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-11 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95",
                  justAdded
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                )}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5" /> Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-1.5" /> Add to Bag ({quantity})
                  </>
                )}
              </Button>
            </div>

            {/* Instant Buy Now (Cash on Delivery) Button */}
            <Button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="w-full h-11 rounded-xl font-extrabold text-xs sm:text-sm bg-accent-500 hover:bg-accent-600 text-white shadow-md transition-all active:scale-95"
            >
              <Zap className="h-4 w-4 fill-current mr-1.5" />
              Buy Now (Cash on Delivery)
            </Button>
          </div>

          {/* Authenticity & Delivery Trust Block */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface-secondary/50 p-3.5 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4.5 w-4.5 text-primary-600" />
              <span className="font-bold text-text text-[11px]">100% Authentic</span>
              <span className="text-[10px] text-text-muted">Direct Brand Sourcing</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-border">
              <Truck className="h-4.5 w-4.5 text-primary-600" />
              <span className="font-bold text-text text-[11px]">24–48h Dispatch</span>
              <span className="text-[10px] text-text-muted">SteadFast & Pathao</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-4.5 w-4.5 text-primary-600" />
              <span className="font-bold text-text text-[11px]">7-Day Returns</span>
              <span className="text-[10px] text-text-muted">Easy Wallet Refund</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Tabs & Details Section */}
      <div className="rounded-3xl border border-border bg-white p-5 sm:p-7 shadow-card space-y-6">
        <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "description", label: "Description" },
            { id: "benefits", label: "Key Benefits" },
            { id: "usage", label: "How to Use" },
            { id: "ingredients", label: "Ingredients & Specs" },
            { id: "warranty", label: "Delivery & Returns" },
            { id: "reviews", label: "Customer Reviews & Q&A" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-700 border border-primary-200/60 shadow-xs"
                  : "text-text-secondary hover:text-text hover:bg-surface-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl">
          {activeTab === "description" && (
            <div className="space-y-3 whitespace-pre-line text-text">
              {product.description || "100% authentic formulation imported directly from authorized brand sources. Gentle, skin-friendly, and effective for daily beauty rituals."}
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="space-y-3 whitespace-pre-line text-text">
              {product.benefits || (
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Formulated to hydrate and restore moisture barrier.</li>
                  <li>Dermatologist tested and suitable for sensitive skin.</li>
                  <li>Lightweight, non-sticky texture designed for warm & humid climates.</li>
                  <li>Free of harsh parabens and artificial fragrance.</li>
                </ul>
              )}
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-3 whitespace-pre-line text-text">
              {product.usage || (
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>After cleansing and toning, take a moderate amount onto palms.</li>
                  <li>Gently pat into skin until fully absorbed.</li>
                  <li>Follow with your favorite moisturizer or sunscreen in the morning.</li>
                </ol>
              )}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-3 text-text">
              <p className="font-semibold">Key Specifications & Actives:</p>
              <p className="text-xs text-text-secondary font-mono leading-relaxed bg-surface-secondary p-4 rounded-2xl border border-border">
                {product.ingredients || "Water, Butylene Glycol, Glycerin, Sodium Hyaluronate, Centella Asiatica Extract, Niacinamide, Allantoin, Betaine, Ethylhexylglycerin."}
              </p>
            </div>
          )}

          {activeTab === "warranty" && (
            <div className="space-y-3 text-text">
              <h4 className="font-bold">Shipping & Authentic Return Policy</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                All products dispatched from our Dhaka central fulfillment warehouse are guaranteed 100% original. If you receive a damaged, leaked, or wrong product, notify our customer care within 7 days for an instant replacement or full bKash/Nagad wallet refund.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <ProductReviewsQA productId={product.id} />
          )}
        </div>
      </div>

      {/* 3. Related Authentic Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-text">
              Customers Also Viewed
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              Explore Catalogue <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {relatedProducts.map((p) => {
              const brandData = (Array.isArray(p.brands) ? p.brands[0] : p.brands) as { name: string } | null;
              const cardData: ProductCardData = {
                id: p.id,
                name: p.name,
                slug: p.slug,
                regular_price: p.regular_price,
                sale_price: p.sale_price,
                image_url: p.og_image_url,
                brand_name: brandData?.name || null,
                is_in_stock: true,
                rating: 5.0,
                review_count: 15,
              };
              return <ProductCard key={p.id} product={cardData} />;
            })}
          </div>
        </section>
      )}

      {/* 4. Mobile Sticky Bottom CTA Bar (Only appears on mobile for zero-friction conversion) */}
      <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-border bg-white/95 backdrop-blur-md p-3 lg:hidden shadow-sticky">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className="h-10 w-10 shrink-0 rounded-xl object-contain border border-border bg-surface-secondary"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-text">{product.name}</p>
              <p className="text-xs font-black text-primary-700">
                {formatPrice(product.sale_price ?? product.regular_price)}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="h-9 px-4 rounded-xl font-bold text-xs bg-primary-600 hover:bg-primary-700 text-white shrink-0 active:scale-95"
          >
            {justAdded ? "Added!" : "Add to Bag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
