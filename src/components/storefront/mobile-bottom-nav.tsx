"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Heart, ShoppingBag, User } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();

  // Don't show in admin dashboard
  if (pathname.startsWith("/admin")) return null;

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/products", icon: Sparkles },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      badge: null,
    },
    { label: "Account", href: "/account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-md px-2 py-1.5 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors",
                isActive ? "text-primary-600 font-bold" : "text-text-muted hover:text-text"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
