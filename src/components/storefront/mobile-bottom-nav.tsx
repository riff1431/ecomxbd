"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, Heart, ShoppingBag, User } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();
  const { itemCount, openCart } = useCart();

  // Don't show in admin dashboard or checkout
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Catalog", href: "/products", icon: Compass },
    { label: "Skin Quiz", href: "/quiz", icon: Sparkles, isSpecial: true },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      label: "Bag",
      action: openCart,
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : null,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-md px-2 py-1 lg:hidden shadow-sticky pb-safe"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) : false;

          const content = (
            <div className="relative flex flex-col items-center justify-center py-1 px-2 text-[10px] font-semibold transition-colors">
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "stroke-[2.5] text-primary-600 scale-105" : "text-text-muted hover:text-text",
                    item.isSpecial && !isActive && "text-accent-500"
                  )}
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-black text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-0.5 tracking-tight",
                  isActive ? "text-primary-600 font-bold" : "text-text-muted",
                  item.isSpecial && !isActive && "text-accent-600 font-bold"
                )}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="focus:outline-none"
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} href={item.href!} className="focus:outline-none" aria-label={item.label}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
