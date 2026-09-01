"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  regular_price: number;
  sale_price: number | null;
  image_url?: string | null;
  brand_name?: string | null;
  rating?: number;
  review_count?: number;
  is_in_stock?: boolean;
}

import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { QuickViewModal } from "./quick-view-modal";

export function ProductCard({ product }: { product: ProductCardData }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const inWishlist = isWishlisted(product.id);

  const discountPercent =
    product.sale_price && product.regular_price > product.sale_price
      ? Math.round(
          ((product.regular_price - product.sale_price) / product.regular_price) * 100
        )
      : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:shadow-card-hover hover:border-primary-300">
      {/* Badges */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="rounded-md bg-accent-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.is_in_stock === false && (
          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist({
            id: product.id,
            name: product.name,
            slug: product.slug,
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            image_url: product.image_url || null,
            brand_name: product.brand_name || null,
          });
        }}
        aria-label="Add to wishlist"
        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            inWishlist ? "fill-accent-500 text-accent-500" : "text-zinc-600"
          )}
        />
      </button>

      {/* Product Image with Quick View Trigger */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              <ShoppingBag className="h-10 w-10 stroke-[1.2]" />
            </div>
          )}
        </Link>

        {/* Quick View Hover Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowQuickView(true);
          }}
          className="absolute bottom-2 left-2 right-2 hidden sm:flex items-center justify-center gap-1.5 rounded-lg bg-white/95 py-2 text-xs font-bold text-text shadow-md backdrop-blur-xs opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-primary-600 hover:text-white"
        >
          <Eye className="h-3.5 w-3.5" />
          Quick View
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {product.brand_name && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            {product.brand_name}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 text-xs sm:text-sm font-medium text-text transition-colors hover:text-primary-600"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex items-center text-amber-400">
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-[11px] font-medium text-text">
            {product.rating ? product.rating.toFixed(1) : "5.0"}
          </span>
          <span className="text-[11px] text-text-muted">
            ({product.review_count ?? 0})
          </span>
        </div>

        {/* Price and Cart Button */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-text">
                {formatPrice(product.sale_price ?? product.regular_price)}
              </span>
              {product.sale_price && product.sale_price < product.regular_price && (
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id: product.id,
                product_id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.sale_price ?? product.regular_price,
                regular_price: product.regular_price,
                image_url: product.image_url || null,
                brand_name: product.brand_name || null,
              }, 1);
            }}
            className="h-8 w-8 rounded-lg hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors"
            title="Add to Cart"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
