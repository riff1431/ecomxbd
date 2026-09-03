import type { Metadata } from "next";
import AccountLayoutClient from "@/components/account/account-layout-client";
import { WishlistProvider } from "@/context/wishlist-context";
import { CartProvider } from "@/context/cart-context";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { CartDrawer } from "@/components/storefront/cart-drawer";

export const metadata: Metadata = {
  title: {
    default: "My Account",
    template: "%s | My Account — Blush & Budget",
  },
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WishlistProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-white">
          <StorefrontHeader />
          <main className="flex-1 pb-16 lg:pb-0">
            <AccountLayoutClient>{children}</AccountLayoutClient>
          </main>
          <StorefrontFooter />
          <MobileBottomNav />
          <CartDrawer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}
