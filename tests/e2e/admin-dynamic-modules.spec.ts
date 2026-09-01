import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@ecomxbangladesh.com";
const ADMIN_PASSWORD = "AdminPassword123!";
const CUSTOMER_EMAIL = "customer@ecomxbangladesh.com";
const CUSTOMER_PASSWORD = "CustomerPassword123!";

async function loginUser(
  page: Page,
  email: string,
  pass: string,
  redirectParam = "",
  targetUrl: RegExp = /\/account/
) {
  const loginPath = redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : "/login";
  await page.goto(loginPath);
  await page.waitForLoadState("domcontentloaded");
  await page.locator("#login-email").first().fill(email);
  await page.locator("#login-password").first().fill(pass);
  await Promise.all([
    page.waitForURL(targetUrl, { timeout: 15000 }),
    page.locator("#login-submit-btn").first().click(),
  ]);
  await page.waitForLoadState("domcontentloaded");
}

test.describe("Dynamic Admin Modules & Settings Suite", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("Guest is redirected to /login when attempting to access /admin/settings/modules", async ({
    page,
  }) => {
    await page.goto("/admin/settings/modules");
    await expect(page).toHaveURL(/\/login\?redirect=%2Fadmin%2Fsettings%2Fmodules/);
  });

  test("Customer is blocked from accessing /admin/settings/modules (Bounced to Storefront)", async ({
    page,
  }) => {
    await loginUser(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, "", /\/account/);
    await page.goto("/admin/settings/modules");
    await expect(page).not.toHaveURL(/\/admin/);
  });

  test.describe("Admin Module Permissions", () => {
    test.beforeEach(async ({ context, page }) => {
      await context.clearCookies();
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, "/admin", /\/admin/);
      await expect(page).toHaveURL(/\/admin/);
    });

    test("Admin CAN access Global Feature Modules Hub (/admin/settings/modules)", async ({
      page,
    }) => {
      await page.goto("/admin/settings/modules");
      await expect(page).toHaveURL(/\/admin\/settings\/modules/);
      await expect(page.locator("h1")).toContainText(/Dynamic Feature Modules & Integrations/i);
      await expect(page.getByRole("heading", { name: "Cloudinary" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Cash on Delivery" })).toBeVisible();
    });

    test("Admin CAN access Feature Flags (/admin/settings/features)", async ({
      page,
    }) => {
      await page.goto("/admin/settings/features");
      await expect(page).toHaveURL(/\/admin\/settings\/features/);
      await expect(page.locator("h1")).toContainText(/Storefront Feature Flags/i);
      await expect(page.getByRole("heading", { name: "Product Reviews" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Wishlist" })).toBeVisible();
    });

    test("Admin CAN access System Health probe (/admin/settings/system-health)", async ({
      page,
    }) => {
      await page.goto("/admin/settings/system-health");
      await expect(page).toHaveURL(/\/admin\/settings\/system-health/);
      await expect(page.locator("h1")).toContainText(/System Health & Service Connectivity/i);
      await expect(page.getByText("PostgreSQL Database (Supabase)")).toBeVisible();
      await expect(page.getByText("Cloudinary CDN & Media Storage")).toBeVisible();
    });

    test("Admin CAN access Cloudinary Settings (/admin/media/cloudinary)", async ({
      page,
    }) => {
      await page.goto("/admin/media/cloudinary");
      await expect(page).toHaveURL(/\/admin\/media\/cloudinary/);
      await expect(page.locator("h1")).toContainText(/Cloudinary Media & CDN Module/i);
      await expect(page.getByRole("button", { name: /Test Connection/i })).toBeVisible();
    });

    test("Admin CAN access Payment Methods Directory (/admin/payments)", async ({
      page,
    }) => {
      await page.goto("/admin/payments");
      await expect(page).toHaveURL(/\/admin\/payments/);
      await expect(page.locator("h1")).toContainText(/Payment Methods & Gateway Hub/i);
      await expect(page.getByRole("heading", { name: /Cash on Delivery/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /bKash/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Nagad/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /SSLCommerz/i })).toBeVisible();
      await expect(page.getByRole("heading", { name: /Stripe/i })).toBeVisible();
    });

    test("Admin CAN access Shipping Zones (/admin/shipping/zones)", async ({
      page,
    }) => {
      await page.goto("/admin/shipping/zones");
      await expect(page).toHaveURL(/\/admin\/shipping\/zones/);
      await expect(page.locator("h1")).toContainText(/Geographic Shipping Zones & Delivery Rates/i);
      await expect(page.getByRole("heading", { name: "Inside Dhaka City (Express)" })).toBeVisible();
    });

    test("Admin CAN access SMS Gateway Provider Settings (/admin/communication/sms)", async ({
      page,
    }) => {
      await page.goto("/admin/communication/sms");
      await expect(page).toHaveURL(/\/admin\/communication\/sms/);
      await expect(page.locator("h1")).toContainText(/SMS Gateway & Bulk Dispatch Providers/i);
      await expect(page.getByRole("button", { name: /Send Test SMS Now/i })).toBeVisible();
    });

    test("Admin CAN access Store Settings (/admin/settings/store)", async ({
      page,
    }) => {
      await page.goto("/admin/settings/store");
      await expect(page).toHaveURL(/\/admin\/settings\/store/);
      await expect(page.locator("h1")).toContainText(/Store Identity & Contact Details/i);
    });

    test("Admin CAN access SEO Settings (/admin/settings/seo)", async ({
      page,
    }) => {
      await page.goto("/admin/settings/seo");
      await expect(page).toHaveURL(/\/admin\/settings\/seo/);
      await expect(page.locator("h1")).toContainText(/Search Engine Optimization/i);
    });

    test("Admin CAN access Checkout Settings (/admin/settings/checkout)", async ({
      page,
    }) => {
      await page.goto("/admin/settings/checkout");
      await expect(page).toHaveURL(/\/admin\/settings\/checkout/);
      await expect(page.locator("h1")).toContainText(/Storefront Checkout & Order Threshold Rules/i);
    });

    test("Admin CAN access Customer Returns & RMA (/admin/returns)", async ({
      page,
    }) => {
      await page.goto("/admin/returns");
      await expect(page).toHaveURL(/\/admin\/returns/);
      await expect(page.locator("h1")).toContainText(/Customer Returns & RMA Management/i);
      await expect(page.getByRole("table")).toBeVisible();
    });

    test("Admin CAN access Logistics & Order Tracking (/admin/orders/tracking)", async ({
      page,
    }) => {
      await page.goto("/admin/orders/tracking");
      await expect(page).toHaveURL(/\/admin\/orders\/tracking/);
      await expect(page.locator("h1")).toContainText(/Logistics & Order Tracking Hub/i);
      await expect(page.getByRole("button", { name: /Sync Couriers Now/i })).toBeVisible();
    });

    test("Admin CAN access CMS Static Content Pages (/admin/pages)", async ({
      page,
    }) => {
      await page.goto("/admin/pages");
      await expect(page).toHaveURL(/\/admin\/pages/);
      await expect(page.locator("h1")).toContainText(/CMS Static Content & Legal Pages/i);
      await expect(page.getByRole("button", { name: /Create New Page/i })).toBeVisible();
    });
  });
});
