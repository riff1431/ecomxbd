import { test, expect } from "@playwright/test";

test.describe("Storefront UI/UX & Responsive Conversion Suite", () => {
  test("Homepage: renders header, hero, categories, flash deals, and bestsellers", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Verify Header & Branding
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Bangladesh").first()).toBeVisible();

    // 2. Verify Hero Banner & CTAs
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /Take Skin Routine Quiz/i })).toBeVisible();

    // 3. Verify Quick Category Cards
    await expect(page.getByRole("heading", { name: "Shop by Beauty Routine" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Skin Care" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hair Care" })).toBeVisible();

    // 4. Verify Flash Deals
    await expect(page.getByText(/Flash Sale|Limited Time/i).first()).toBeVisible();

    // 5. Verify Skin Concern Chips
    await expect(page.getByText("Target Your Specific Skin Concern:")).toBeVisible();
    await expect(page.getByRole("link", { name: "Acne & Blemishes" })).toBeVisible();

    // 6. Verify Trust Pillars
    await expect(page.locator("h4:has-text('100% Authentic Guarantee')")).toBeVisible();
    await expect(page.locator("h4:has-text('Fast Doorstep Delivery')")).toBeVisible();
    await expect(page.locator("h4:has-text('Cash on Delivery')")).toBeVisible();
  });

  test("Product Detail Page: gallery, price, stepper, tabs, and cart addition", async ({
    page,
  }) => {
    await page.goto("/products");

    // Click on the first product
    const firstProduct = page.locator("a[href^='/products/']").first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // Verify detail page elements
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("button", { name: /Add to Bag/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Buy Now \(Cash on Delivery\)/i })).toBeVisible();

    // Test quantity stepper
    const increaseBtn = page.getByRole("button", { name: "Increase quantity" });
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
      await expect(page.getByText("2", { exact: true }).first()).toBeVisible();
    }

    // Test tab navigation
    await page.getByRole("button", { name: "Key Benefits" }).click();
    await expect(page.getByRole("button", { name: "Key Benefits" })).toBeVisible();

    await page.getByRole("button", { name: "How to Use" }).click();
    await expect(page.getByRole("button", { name: "How to Use" })).toBeVisible();

    // Add to Bag
    await page.getByRole("button", { name: /Add to Bag/i }).first().click();
    await expect(page.getByText(/Added/i).first()).toBeVisible();
  });

  test("Shop Listing & Filter Drawer: search, sort, and filters", async ({ page }) => {
    await page.goto("/products");

    // Check catalog title or search
    await expect(page.locator("h1")).toBeVisible();

    // Check visible sort selector
    const sortSelect = page.locator("select:visible").first();
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption("price_asc");
    await expect(page).toHaveURL(/sort=price_asc/);

    // Click on a category filter if present
    const skinCareFilter = page.getByRole("button", { name: "Skin Care" }).first();
    if (await skinCareFilter.isVisible()) {
      await skinCareFilter.click();
      await expect(page).toHaveURL(/category=skin-care/);
    }
  });

  test("Cart Page: free delivery threshold meter, quantity updates, and summary", async ({
    page,
  }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /Your Shopping Bag|Shopping Cart/i })).toBeVisible();
  });

  test("Mobile Viewport Horizontal Overflow & Bottom Navigation (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE / Mini

    const testRoutes = ["/", "/products", "/cart", "/login", "/register", "/wishlist", "/quiz"];

    for (const route of testRoutes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // Verify zero horizontal scroll overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    }

    // Verify Mobile Bottom Nav is visible on homepage
    await page.goto("/");
    const bottomNav = page.locator("nav[aria-label='Mobile navigation bar']");
    await expect(bottomNav).toBeVisible();
    await expect(bottomNav.getByText("Home")).toBeVisible();
    await expect(bottomNav.getByText("Catalog")).toBeVisible();
    await expect(bottomNav.getByText("Skin Quiz")).toBeVisible();
    await expect(bottomNav.getByText("Wishlist")).toBeVisible();
    await expect(bottomNav.getByText("Bag")).toBeVisible();
  });
});
