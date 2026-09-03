import { cn } from "@/lib/utils";

/**
 * Base Shimmer Box
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gray-200/80 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
}

/**
 * Product Card Skeleton (Matching Shajgoj product card dimensions)
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 space-y-3">
      {/* Image Box */}
      <Skeleton className="aspect-square w-full rounded-xl bg-gray-100" />
      {/* Brand Tag */}
      <Skeleton className="h-3 w-1/3 rounded-md bg-gray-100" />
      {/* Title */}
      <Skeleton className="h-4 w-full rounded-md bg-gray-100" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-gray-100" />
      {/* Price & Button */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Skeleton className="h-5 w-1/2 rounded-md bg-gray-100" />
        <Skeleton className="h-8 w-8 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

/**
 * Product Grid Skeleton
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Hero Carousel Skeleton
 */
export function HeroSkeleton() {
  return (
    <div className="relative w-full aspect-[430/280] sm:aspect-[16/7] lg:aspect-[1920/490] bg-gray-100 animate-pulse overflow-hidden">
      <div className="container-main py-6 sm:py-12 space-y-3">
        <Skeleton className="h-4 w-24 rounded-full bg-gray-200" />
        <Skeleton className="h-8 sm:h-12 w-3/4 max-w-md rounded-xl bg-gray-200" />
        <Skeleton className="h-4 w-1/2 max-w-sm rounded-md bg-gray-200" />
        <Skeleton className="h-8 w-32 rounded-full bg-gray-200 mt-2" />
      </div>
    </div>
  );
}

/**
 * 2x2 Deals Grid Skeleton
 */
export function DealsGridSkeleton() {
  return (
    <div className="container-main space-y-3">
      <div className="flex justify-center">
        <Skeleton className="h-4 w-40 rounded-md bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

/**
 * Category Browse Pills Skeleton
 */
export function CategoryPillsSkeleton() {
  return (
    <div className="container-main space-y-3">
      <Skeleton className="h-4 w-32 rounded-md bg-gray-200" />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
