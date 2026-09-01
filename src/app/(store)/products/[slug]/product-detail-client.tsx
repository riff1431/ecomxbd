"use client";

import { useState } from "react";
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
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);
  const inWishlist = isWishlisted(product.id);
  const [activeTab, setActiveTab] = useState<"description" | "benefits" | "usage" | "ingredients" | "warranty" | "reviews">("description");

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

  return (
    <div className="space-y-12">
      {/* Main Section: Gallery + Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-secondary">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ShoppingBag className="h-16 w-16 stroke-[1]" />
              </div>
            )}

            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-md bg-accent-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                    selectedImage === url
                      ? "border-primary-600 ring-2 ring-primary-600/20"
                      : "border-border hover:border-text-muted"
                  )}
                >
                  <img src={url} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col space-y-5">
          {/* Brand & Title */}
          <div>
            {product.brands && (
              <Link
                href={`/products?brand=${product.brands.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-primary-600 hover:underline"
              >
                {product.brands.name}
              </Link>
            )}
            <h1 className="mt-1 text-2xl font-bold text-text sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating & Actions */}
            <div className="mt-2 flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-xs font-semibold text-text">5.0</span>
                <span className="text-xs text-text-muted">(Verified Reviews)</span>
              </div>

              <div className="flex items-center gap-2">
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
                  className="rounded-full border border-border p-2 text-text-muted hover:text-accent-500 transition-colors"
                  title="Wishlist"
                >
                  <Heart className={cn("h-4 w-4", inWishlist && "fill-accent-500 text-accent-500")} />
                </button>
                <button
                  onClick={handleShare}
                  className="rounded-full border border-border p-2 text-text-muted hover:text-text transition-colors"
                  title="Share"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-text">
              {formatPrice(product.sale_price ?? product.regular_price)}
            </span>
            {product.sale_price && product.sale_price < product.regular_price && (
              <>
                <span className="text-base text-text-muted line-through">
                  {formatPrice(product.regular_price)}
                </span>
                <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 border border-green-200">
                  Save {formatPrice(product.regular_price - product.sale_price)}
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Availability & SKU */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Status:</span>
              <span className={cn("font-semibold", isOutOfStock ? "text-red-600" : "text-emerald-600")}>
                {isOutOfStock ? "Out of Stock" : "In Stock (Guaranteed Authentic)"}
              </span>
            </div>
            {product.sku && (
              <div className="flex items-center gap-1.5 border-l border-border pl-4">
                <span className="text-text-muted">SKU:</span>
                <span className="font-mono text-text">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border bg-surface-secondary">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-text hover:bg-white rounded-l-lg transition-colors disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-text">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  className="p-2.5 text-text hover:bg-white rounded-r-lg transition-colors disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <Button
                disabled={isOutOfStock}
                onClick={() => {
                  addItem({
                    id: product.id,
                    product_id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.sale_price ?? product.regular_price,
                    regular_price: product.regular_price,
                    image_url: product.og_image_url || null,
                    brand_name: product.brands?.name || null,
                  }, quantity);
                }}
                className="flex-1 py-6 text-sm font-semibold shadow-md"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart ({quantity})
              </Button>
            </div>

            <Button
              disabled={isOutOfStock}
              variant="secondary"
              onClick={() => {
                addItem({
                  id: product.id,
                  product_id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.sale_price ?? product.regular_price,
                  regular_price: product.regular_price,
                  image_url: product.og_image_url || null,
                  brand_name: product.brands?.name || null,
                }, quantity);
                router.push("/checkout");
              }}
              className="w-full py-6 text-sm font-semibold bg-accent-500 hover:bg-accent-600 text-white border-none shadow-md"
            >
              <Zap className="h-4 w-4 fill-current" />
              Order Now (Cash on Delivery)
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface-secondary/50 p-3.5 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-text">100% Authentic</span>
              <span className="text-[10px] text-text-muted">Direct from Brand</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-border">
              <Truck className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-text">Fast Delivery</span>
              <span className="text-[10px] text-text-muted">Inside & Outside Dhaka</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-text">7 Days Return</span>
              <span className="text-[10px] text-text-muted">Hassle-Free Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card space-y-6">
        <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
          {[
            { id: "description", label: "Description" },
            { id: "benefits", label: "Benefits" },
            { id: "usage", label: "How to Use" },
            { id: "ingredients", label: "Ingredients / Specs" },
            { id: "warranty", label: "Delivery & Warranty" },
            { id: "reviews", label: "Customer Reviews & Q&A" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-700"
                  : "text-text-secondary hover:text-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-sm text-text-secondary leading-relaxed">
          {activeTab === "description" && (
            <div className="space-y-3 whitespace-pre-line">
              {product.description || "No description provided for this product."}
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="space-y-3 whitespace-pre-line">
              {product.benefits || "Key benefits for this product will be listed here."}
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-3 whitespace-pre-line">
              {product.usage || "Apply a small amount to clean skin and gently massage in circular motions."}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-3 whitespace-pre-line">
              {product.ingredients_specifications || "Specifications and ingredient list available on packaging."}
            </div>
          )}

          {activeTab === "warranty" && (
            <div className="space-y-3">
              <p>
                <strong>Delivery Time:</strong> 24-48 hours inside Dhaka; 3-5 days across all other districts in Bangladesh.
              </p>
              <p>
                <strong>Warranty:</strong> {product.warranty || "Standard authentic manufacturer warranty."}
              </p>
              <p>
                <strong>Return Policy:</strong> You may return items within 7 days of receipt in original, unopened packaging.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <ProductReviewsQA productId={product.id} />
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-text">
              You Might Also Like
            </h2>
            <Link
              href="/products"
              className="text-xs font-semibold text-primary-600 hover:underline"
            >
              View All Products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  regular_price: p.regular_price,
                  sale_price: p.sale_price,
                  image_url: p.og_image_url || null,
                  brand_name: p.brands?.name || null,
                  rating: 5.0,
                  review_count: 0,
                  is_in_stock: true,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
