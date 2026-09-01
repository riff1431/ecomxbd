import { test, expect, type Page } from "@playwright/test";

const CUSTOMER_EMAIL = "customer@ecomxbangladesh.com";
const CUSTOMER_PASSWORD = "CustomerPassword123!";
const MODERATOR_EMAIL = "moderator@ecomxbangladesh.com";
const MODERATOR_PASSWORD = "ModeratorPassword123!";
const ADMIN_EMAIL = "admin@ecomxbangladesh.com";
const ADMIN_PASSWORD = "AdminPassword123!";

async function loginUser(page: Page, email: string, pass: string, redirectParam = "", targetUrl: RegExp = /\/account/) {
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

test.describe("Role-Based Authorization & Cross-Role Security Suite", () => {
  test.describe("Customer Role Restrictions", () => {
    test.beforeEach(async ({ context, page }) => {
      await context.clearCookies();
      await loginUser(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, "", /\/account/);
      await expect(page).toHaveURL(/\/account/);
    });

    test("Customer CAN access all customer account subroutes", async ({ page }) => {
      await page.goto("/account/orders");
      await expect(page).toHaveURL(/\/account\/orders/);
      await expect(page.locator("h1")).toContainText(/Orders/i);

      await page.goto("/account/addresses");
      await expect(page).toHaveURL(/\/account\/addresses/);
      await expect(page.locator("h1")).toContainText(/Address/i);
    });

    const forbiddenAdminRoutes = [
      "/admin",
      "/admin/orders",
      "/admin/products",
      "/admin/products/create",
      "/admin/shipping",
      "/admin/finance/sales",
      "/admin/finance/pnl",
      "/admin/fraud",
      "/admin/users",
    ];

    for (const route of forbiddenAdminRoutes) {
      test(`Customer CANNOT access admin route: ${route} (Blocked & Redirected)`, async ({ page }) => {
        await page.goto(route);
        // Middleware checks profile role and redirects unauthorized non-admin/moderator users to /
        await expect(page).toHaveURL(new RegExp(`^(?!.*${route.replace(/\//g, "\\/")}).*$`));
        // Verify admin navigation layout is NOT rendered
        await expect(page.locator(".bg-admin-sidebar")).not.toBeVisible();
      });
    }
  });

  test.describe("Moderator Role Permissions", () => {
    test.beforeEach(async ({ context, page }) => {
      await context.clearCookies();
      await loginUser(page, MODERATOR_EMAIL, MODERATOR_PASSWORD, "/admin", /\/admin/);
      await expect(page).toHaveURL(/\/admin/);
    });

    test("Moderator CAN access allowed operations areas (Orders, Products, Reviews, QA)", async ({ page }) => {
      await page.goto("/admin/orders");
      await expect(page).toHaveURL(/\/admin\/orders/);
      await expect(page.locator("h1")).toContainText(/Orders/i);

      await page.goto("/admin/products");
      await expect(page).toHaveURL(/\/admin\/products/);
      await expect(page.locator("h1")).toContainText(/Products/i);

      await page.goto("/admin/reviews");
      await expect(page).toHaveURL(/\/admin\/reviews/);
      await expect(page.locator("h1")).toContainText(/Reviews/i);

      await page.goto("/admin/qa");
      await expect(page).toHaveURL(/\/admin\/qa/);
      await expect(page.locator("h1")).toContainText(/Q&A|Questions/i);
    });
  });

  test.describe("Admin Role Full Capabilities", () => {
    test.beforeEach(async ({ context, page }) => {
      await context.clearCookies();
      await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD, "/admin", /\/admin/);
      await expect(page).toHaveURL(/\/admin/);
    });

    const adminAreas = [
      { path: "/admin", headerText: /Dashboard|Store Analytics/i },
      { path: "/admin/orders", headerText: /Orders/i },
      { path: "/admin/products", headerText: /Products/i },
      { path: "/admin/shipping", headerText: /Delivery Partners|Shipping/i },
      { path: "/admin/marketing/sms", headerText: /SMS|Gateway/i },
      { path: "/admin/finance/sales", headerText: /Sales|Revenue/i },
      { path: "/admin/finance/pnl", headerText: /Profit & Loss|P&L/i },
      { path: "/admin/fraud", headerText: /Fraud|Risk/i },
      { path: "/admin/settings/theme", headerText: /Theme|Customizer/i },
      { path: "/admin/users", headerText: /Team|Permissions/i },
      { path: "/admin/activity", headerText: /Activity|Audit/i },
    ];

    for (const area of adminAreas) {
      test(`Admin CAN access full module: ${area.path}`, async ({ page }) => {
        if (!page.url().includes(area.path)) {
          await page.goto(area.path);
        }
        await expect(page).toHaveURL(new RegExp(area.path.replace(/\//g, "\\/")));
        await expect(page.locator("h1")).toContainText(area.headerText);
      });
    }
  });
});
