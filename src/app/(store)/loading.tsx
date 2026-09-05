import {
  HeroSkeleton,
  DealsGridSkeleton,
  CategoryPillsSkeleton,
  ProductGridSkeleton,
} from "@/components/shared/skeletons/storefront-skeletons";

export default function StorefrontLoading() {
  return (
    <div
      data-storefront-loading="true"
      className="min-h-screen space-y-8 pb-16 animate-fade-in"
    >
      {/* Hero Slider Skeleton */}
      <HeroSkeleton />

      {/* Slim Strip Banner Skeleton */}
      <div className="container-main">
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
      </div>

      {/* 2x2 Deals Grid Skeleton */}
      <DealsGridSkeleton />

      {/* Categories Skeleton */}
      <CategoryPillsSkeleton />

      {/* Trending Products Grid Skeleton */}
      <div className="container-main space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="h-4 w-36 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 rounded-md bg-gray-200 animate-pulse" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
