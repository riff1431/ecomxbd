"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-4">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <span className="text-text font-medium">My Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
            <Heart className="h-6 w-6 text-accent-500 fill-accent-500" />
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for later
          </p>
        </div>

        {wishlist.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-text">Your wishlist is empty</h2>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
            Save items you love by tapping the heart icon on any product card while browsing.
          </p>
          <Link href="/products" className="inline-block mt-6">
            <Button>
              Start Exploring Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:shadow-card-hover"
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
              <Link href={`/products/${item.slug}`} className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <ShoppingBag className="h-8 w-8 stroke-[1]" />
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                {item.brand_name && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {item.brand_name}
                  </span>
                )}
                <Link
                  href={`/products/${item.slug}`}
                  className="mt-1 line-clamp-2 text-xs sm:text-sm font-semibold text-text hover:text-primary-600"
                >
                  {item.name}
                </Link>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-text">
                      {formatPrice(item.sale_price ?? item.regular_price)}
                    </span>
                    {item.sale_price && (
                      <span className="text-xs text-text-muted line-through">
                        {formatPrice(item.regular_price)}
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${item.slug}`}>
                    <Button size="sm" className="h-7 text-xs px-2.5">
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
