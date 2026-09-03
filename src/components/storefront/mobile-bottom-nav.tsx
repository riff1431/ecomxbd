"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Tag,
  LayoutGrid,
  ShoppingBag,
  Heart,
  User,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  badge?: number;
  action?: () => void;
  external?: boolean;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  // Don't show in admin dashboard or checkout
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const navItems: NavItem[] = [
    {
      label: "HOME",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "CATEGORIES",
      href: "/products",
      icon: LayoutGrid,
      isActive: pathname === "/categories" || pathname.startsWith("/products"),
    },
    {
      label: "WISHLIST",
      href: "/account/wishlist",
      icon: Heart,
      badge: wishlistCount,
      isActive: pathname === "/account/wishlist",
    },
    {
      label: "CART",
      action: openCart,
      icon: ShoppingBag,
      badge: itemCount,
      isActive: false,
    },
    {
      label: "ACCOUNT",
      href: "/account",
      icon: User,
      isActive: pathname.startsWith("/account") && pathname !== "/account/wishlist",
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-1 py-1.5 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe"
    >
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;

          const buttonContent = (
            <div className="flex flex-col items-center justify-center py-1 text-center group">
              <div className="relative inline-flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150 group-active:scale-90",
                    item.isActive ? "text-[#e91e63] stroke-[2.4]" : "text-gray-600 stroke-[1.8]"
                  )}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e91e63] px-1 text-[9px] font-black text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-1 text-[9px] tracking-wider uppercase font-semibold transition-colors",
                  item.isActive ? "text-[#e91e63] font-bold" : "text-gray-600"
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
                type="button"
                onClick={item.action}
                className="w-full focus:outline-none"
                aria-label={`Open ${item.label}`}
              >
                {buttonContent}
              </button>
            );
          }

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full focus:outline-none"
                aria-label={item.label}
              >
                {buttonContent}
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className="w-full focus:outline-none"
              aria-label={item.label}
            >
              {buttonContent}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
