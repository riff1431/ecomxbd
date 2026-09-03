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
  ZoomIn,
  Maximize2,
  X,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { triggerMicroRipple } from "@/lib/ui-effects";
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

  // Premium Image Magnifier Zoom State (Mobile Touch & Desktop Mouse)
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Mouse move on desktop
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsZoomed(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setZoomPosition({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      setZoomPosition({ x, y });
    }
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

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
          {/* Main Photo Box with Luxury Precision Magnifier Zoom (Desktop + Mobile Touch) */}
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsModalOpen(true)}
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-white shadow-xs flex items-center justify-center cursor-zoom-in group select-none touch-none"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: isZoomed ? "scale(2.4)" : "scale(1)",
                  transition: isZoomed
                    ? "transform 0.05s ease-out"
                    : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="h-full w-full object-cover object-center will-change-transform pointer-events-none"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ShoppingBag className="h-16 w-16 stroke-[1]" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3.5 top-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
              {discountPercent > 0 && (
                <span className="rounded-full bg-[#e91e63] px-3 py-1 text-xs font-black text-white shadow-sm">
                  -{discountPercent}% OFF
                </span>
              )}
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                100% Authentic
              </span>
            </div>

            {/* Top Right Action Row (Wishlist + Enlarge Fullscreen Button) */}
            <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                aria-label="Enlarge image"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-all hover:bg-white hover:scale-110 active:scale-90 text-gray-700"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerMicroRipple(e, true);
                  toggleWishlist({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    regular_price: product.regular_price,
                    sale_price: product.sale_price,
                    image_url: product.og_image_url || null,
                    brand_name: product.brands?.name || null,
                  });
                }}
                aria-label="Add to wishlist"
                className="ripple-container flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-all hover:bg-white hover:scale-110 active:scale-90"
              >
                <Heart
                  className={cn(
                    "h-4.5 w-4.5 transition-colors",
                    inWishlist ? "fill-[#e91e63] text-[#e91e63]" : "text-zinc-600"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Full Screen HD Lightbox Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in-0 duration-200"
              onClick={() => setIsModalOpen(false)}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 p-2.5 rounded-full transition-all"
                aria-label="Close image preview"
              >
                <X className="h-6 w-6" />
              </button>
              <div
                className="max-w-4xl max-h-[90vh] w-full p-2 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                />
              </div>
            </div>
          )}

          {/* Thumbnails list */}
          {imageUrls.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all p-1 bg-surface-secondary btn-soft-fill",
                    selectedImage === url
                      ? "border-[#e91e63] ring-2 ring-[#e91e63]/20 shadow-xs scale-105"
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
                className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#e91e63] hover:text-[#d81b60] transition-colors"
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
                  <span className="text-sm font-semibold text-text-muted line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                  <span className="rounded-lg bg-accent-500/10 border border-accent-500/20 px-2 py-0.5 text-xs font-extrabold text-accent-700">
                    You Save {formatPrice(product.regular_price - product.sale_price)}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              Tax included. Free Delivery available inside Dhaka over ৳2,000.
            </p>
          </div>

          {/* Variants Selector */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-text">
                Select Option:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-xl border px-3.5 py-2 text-xs font-bold transition-all btn-soft-fill",
                      selectedVariant?.id === variant.id
                        ? "border-[#e91e63] bg-pink-50 text-[#e91e63] shadow-xs ring-2 ring-pink-200"
                        : "border-border bg-white text-text-secondary hover:border-text-muted"
                    )}
                  >
                    {variant.title || variant.name}
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
              {/* Stepper */}
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

              {/* Primary Add to Bag Button with Dynamic Hover Color Shift */}
              <Button
                disabled={isOutOfStock}
                onClick={(e) => {
                  triggerMicroRipple(e);
                  handleAddToCart();
                }}
                className={cn(
                  "ripple-container flex-1 h-11 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95",
                  justAdded
                    ? "bg-emerald-600 !bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "btn-add-to-cart"
                )}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 animate-in zoom-in-50" /> Added to Bag!
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
              onClick={(e) => {
                triggerMicroRipple(e);
                handleBuyNow();
              }}
              className="ripple-container w-full h-11 rounded-xl font-extrabold text-xs sm:text-sm bg-accent-500 hover:bg-accent-600 text-white shadow-md transition-all active:scale-95 hover:shadow-[0_8px_20px_-4px_rgba(249,115,22,0.4)]"
            >
              <Zap className="h-4 w-4 fill-current mr-1.5" />
              Buy Now (Cash on Delivery)
            </Button>
          </div>

          {/* Authenticity & Delivery Trust Block */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface-secondary/50 p-3.5 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4.5 w-4.5 text-[#e91e63]" />
              <span className="font-bold text-text text-[11px]">100% Authentic</span>
              <span className="text-[10px] text-text-muted">Direct Brand Sourcing</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4.5 w-4.5 text-[#e91e63]" />
              <span className="font-bold text-text text-[11px]">24–48h Dispatch</span>
              <span className="text-[10px] text-text-muted">Steadfast &amp; Pathao</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-4.5 w-4.5 text-[#e91e63]" />
              <span className="font-bold text-text text-[11px]">7-Day Returns</span>
              <span className="text-[10px] text-text-muted">Easy Wallet Refund</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Information Tabs */}
      <div className="rounded-3xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto no-scrollbar bg-surface-secondary/40">
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
                "px-5 py-3.5 text-xs font-extrabold transition-all whitespace-nowrap border-b-2 btn-soft-fill",
                activeTab === tab.id
                  ? "border-[#e91e63] text-[#e91e63] bg-white shadow-xs"
                  : "border-transparent text-text-secondary hover:text-text hover:bg-surface-secondary/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
          {activeTab === "description" && (
            <div className="space-y-4 max-w-3xl">
              {product.description ? (
                <div
                  className="prose prose-sm prose-pink max-w-none [&_h1]:text-lg [&_h1]:font-black [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-2xl [&_img]:max-w-full [&_img]:border [&_img]:border-gray-100 [&_img]:my-3 [&_a]:text-[#e91e63] [&_a]:underline font-medium text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>{product.short_description || "Certified authentic beauty product directly imported from brand manufacturers."}</p>
              )}
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="space-y-3 max-w-3xl">
              {product.benefits ? (
                <div
                  className="prose prose-sm prose-pink max-w-none [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-xl font-medium text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.benefits }}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#e91e63] shrink-0" />
                    <span>Deeply nourishes and restores healthy skin barrier hydration.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#e91e63] shrink-0" />
                    <span>Formulated without parabens, synthetic dyes, or harsh sulfates.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#e91e63] shrink-0" />
                    <span>Dermatologist tested and approved for sensitive skin types.</span>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-3 max-w-3xl">
              {product.usage ? (
                <div
                  className="prose prose-sm prose-pink max-w-none [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-xl font-medium text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.usage }}
                />
              ) : (
                <>
                  <p className="font-bold text-text">Recommended Beauty Routine:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1">
                    <li>Cleanse skin thoroughly with warm water.</li>
                    <li>Dispense appropriate amount onto fingertips or palms.</li>
                    <li>Gently massage over face and neck in circular upward motions.</li>
                    <li>Follow with sunscreen during daytime.</li>
                  </ol>
                </>
              )}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-3 max-w-3xl">
              {product.ingredients_specifications ? (
                <div
                  className="prose prose-sm prose-pink max-w-none [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 font-medium text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.ingredients_specifications }}
                />
              ) : (
                <>
                  <p className="font-bold text-text">Key Active Ingredients:</p>
                  <p className="font-mono text-xs text-text-muted bg-surface-secondary p-4 rounded-2xl border border-border">
                    Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Centella Asiatica Extract, Tocopheryl Acetate (Vitamin E), Panthenol (Pro-Vitamin B5), Phenoxyethanol, Ethylhexylglycerin.
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === "warranty" && (
            <div className="space-y-3 max-w-3xl">
              <p className="font-bold text-text">Nationwide Shipping &amp; Returns:</p>
              <p>Inside Dhaka: Delivered within 24–48 hours via fast courier.</p>
              <p>Outside Dhaka: Delivered in 2–4 business days with Cash on Delivery available.</p>
              <p>7-Day Return Policy: Returns accepted if package is unopened and in original condition.</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <ProductReviewsQA
              productId={product.id}
            />
          )}
        </div>
      </div>

      {/* 3. Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-text">
              You May Also Love
            </h3>
            <Link
              href="/products"
              className="text-xs font-extrabold text-[#e91e63] hover:underline"
            >
              View More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
