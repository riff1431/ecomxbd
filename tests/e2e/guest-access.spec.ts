import { test, expect } from "@playwright/test";

test.describe("Guest Access & Route Protection Suite", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  const publicRoutes = [
    { path: "/", titleRegex: /ecomXbangladesh|ecomX/i },
    { path: "/products", titleRegex: /All Products|Catalog|Products/i },
    { path: "/products/cosrx-advanced-snail-96-mucin-power-essence", titleRegex: /COSRX|Snail/i },
    { path: "/categories/skincare", titleRegex: /Skincare|Products/i },
    { path: "/brands", titleRegex: /Brands|Official/i },
    { path: "/brands/cosrx", titleRegex: /COSRX/i },
    { path: "/cart", titleRegex: /Shopping Cart|Cart/i },
    { path: "/track-order", titleRegex: /Track|Tracking/i },
    { path: "/quiz", titleRegex: /Routine Finder|Quiz/i },
    { path: "/page/about", titleRegex: /About/i },
    { path: "/page/authenticity", titleRegex: /Authenticity/i },
    { path: "/page/returns", titleRegex: /Return/i },
    { path: "/page/privacy", titleRegex: /Privacy/i },
    { path: "/page/terms", titleRegex: /Terms/i },
    { path: "/login", titleRegex: /Login|Sign in/i },
    { path: "/register", titleRegex: /Register|Sign up/i },
    { path: "/forgot-password", titleRegex: /Password/i },
  ];

  for (const route of publicRoutes) {
    test(`Guest CAN access public route: ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(route.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      await expect(page.locator("body")).toBeVisible();
    });
  }

  const protectedCustomerRoutes = [
    "/account",
    "/account/orders",
    "/account/addresses",
  ];

  for (const route of protectedCustomerRoutes) {
    test(`Guest CANNOT access customer route directly: ${route} (Redirects to /login)`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`/login\\?redirect=${encodeURIComponent(route)}`));
    });
  }

  const protectedAdminRoutes = [
    "/admin",
    "/admin/orders",
    "/admin/products",
    "/admin/products/create",
    "/admin/categories",
    "/admin/brands",
    "/admin/inventory",
    "/admin/media",
    "/admin/coupons",
    "/admin/shipping",
    "/admin/shipping/steadfast",
    "/admin/marketing/sms",
    "/admin/marketing/meta",
    "/admin/finance/sales",
    "/admin/finance/pnl",
    "/admin/finance/costs",
    "/admin/finance/accounting",
    "/admin/finance/dues",
    "/admin/finance/investors",
    "/admin/fraud",
    "/admin/settings/theme",
    "/admin/users",
    "/admin/activity",
  ];

  for (const route of protectedAdminRoutes) {
    test(`Guest CANNOT access admin route directly: ${route} (Redirects to /login)`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`/login\\?redirect=${encodeURIComponent(route)}`));
    });
  }
});
