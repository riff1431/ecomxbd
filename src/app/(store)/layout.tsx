import { LanguageProvider } from "@/context/language-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { CartProvider } from "@/context/cart-context";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { getLocalizationSettings } from "@/features/settings/actions";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localizationSettings = await getLocalizationSettings();

  return (
    <LanguageProvider initialConfig={localizationSettings}>
      <WishlistProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <StorefrontHeader />
            <main className="flex-1">{children}</main>
            <StorefrontFooter />
            <MobileBottomNav />
            <CartDrawer />
          </div>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
}
