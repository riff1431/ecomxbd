"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Star, Eye, Check } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { QuickViewModal } from "./quick-view-modal";

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

export function ProductCard({ product }: { product: ProductCardData }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const inWishlist = isWishlisted(product.id);

  const discountPercent =
    product.sale_price && product.regular_price > product.sale_price
      ? Math.round(
          ((product.regular_price - product.sale_price) / product.regular_price) * 100
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: product.id,
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.sale_price ?? product.regular_price,
        regular_price: product.regular_price,
        image_url: product.image_url || null,
        brand_name: product.brand_name || null,
      },
      1
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:border-primary-300 hover:shadow-card-hover">
      {/* Floating Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
            -{discountPercent}%
          </span>
        )}
        {product.is_in_stock === false && (
          <span className="rounded-full bg-zinc-900/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            Sold Out
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:scale-110 active:scale-95"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            inWishlist ? "fill-accent-500 text-accent-500" : "text-zinc-600 hover:text-accent-500"
          )}
        />
      </button>

      {/* Product Image Area with Quick View Trigger */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary/70">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              <ShoppingBag className="h-10 w-10 stroke-[1.2]" />
            </div>
          )}
        </Link>

        {/* Quick View Hover Button (Desktop) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowQuickView(true);
          }}
          className="absolute bottom-2.5 left-2.5 right-2.5 hidden sm:flex items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2 text-xs font-bold text-text shadow-md backdrop-blur-xs opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-primary-600 hover:text-white"
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

      {/* Product Card Info Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        {/* Brand Tag */}
        {product.brand_name ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 truncate">
            {product.brand_name}
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Authentic
          </span>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-xs sm:text-sm font-semibold text-text leading-tight hover:text-primary-600 transition-colors"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex items-center text-amber-400">
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-[11px] font-bold text-text">
            {product.rating ? product.rating.toFixed(1) : "5.0"}
          </span>
          <span className="text-[10px] text-text-muted">
            ({product.review_count ?? 12})
          </span>
        </div>

        {/* Price & 1-Tap Add to Cart Row */}
        <div className="mt-auto pt-2.5 flex items-center justify-between gap-2 border-t border-border/60">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-text">
                {formatPrice(product.sale_price ?? product.regular_price)}
              </span>
              {product.sale_price && product.sale_price < product.regular_price && (
                <span className="text-[11px] text-text-muted line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.is_in_stock === false}
            aria-label={`Add ${product.name} to bag`}
            className={cn(
              "flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl transition-all active:scale-90",
              justAdded
                ? "bg-emerald-600 text-white shadow-xs"
                : product.is_in_stock === false
                ? "bg-surface-tertiary text-text-muted cursor-not-allowed"
                : "bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white border border-primary-100"
            )}
            title={product.is_in_stock === false ? "Out of Stock" : "Add to Bag"}
          >
            {justAdded ? (
              <Check className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="h-4 w-4 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
