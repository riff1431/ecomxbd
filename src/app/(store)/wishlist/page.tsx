"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="container-main py-4 sm:py-6 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-text transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3 text-zinc-400" />
        <span className="text-text font-bold">My Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text flex items-center gap-2">
            <Heart className="h-6 w-6 text-accent-500 fill-accent-500" />
            Saved Wishlist Items
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for your beauty routine.
          </p>
        </div>

        {wishlist.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 self-start sm:self-auto rounded-xl"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-16 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary text-text-muted">
            <Heart className="h-8 w-8 stroke-[1.2]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text">Your wishlist is empty</h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
              Save items you love by tapping the heart icon on any product card while exploring.
            </p>
          </div>
          <Link href="/products" className="inline-block pt-2">
            <Button className="rounded-xl text-xs font-bold px-6 h-11">
              Start Exploring Products
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-card-hover hover:border-primary-300"
            >
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow text-red-600 hover:bg-red-50 hover:scale-110 transition-all"
                title="Remove from wishlist"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {/* Image */}
              <Link href={`/products/${item.slug}`} className="relative aspect-square w-full overflow-hidden bg-surface-secondary/70">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <ShoppingBag className="h-8 w-8 stroke-[1]" />
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                {item.brand_name && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                    {item.brand_name}
                  </span>
                )}
                <Link
                  href={`/products/${item.slug}`}
                  className="mt-0.5 line-clamp-2 text-xs sm:text-sm font-bold text-text hover:text-primary-600 transition-colors"
                >
                  {item.name}
                </Link>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border/60">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-extrabold text-text">
                      {formatPrice(item.sale_price ?? item.regular_price)}
                    </span>
                    {item.sale_price && (
                      <span className="text-[11px] text-text-muted line-through">
                        {formatPrice(item.regular_price)}
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${item.slug}`}>
                    <Button size="sm" className="h-7.5 rounded-lg text-xs font-bold px-3">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
