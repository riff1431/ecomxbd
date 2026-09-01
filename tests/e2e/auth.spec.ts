import { test, expect, type Page } from "@playwright/test";

const CUSTOMER_EMAIL = "customer@ecomxbangladesh.com";
const CUSTOMER_PASSWORD = "CustomerPassword123!";
const MODERATOR_EMAIL = "moderator@ecomxbangladesh.com";
const MODERATOR_PASSWORD = "ModeratorPassword123!";
const ADMIN_EMAIL = "admin@ecomxbangladesh.com";
const ADMIN_PASSWORD = "AdminPassword123!";

async function loginUser(page: Page, email: string, pass: string, targetUrl: RegExp = /\/account/) {
  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");
  await page.locator("#login-email").first().fill(email);
  await page.locator("#login-password").first().fill(pass);
  await Promise.all([
    page.waitForURL(targetUrl, { timeout: 15000 }),
    page.locator("#login-submit-btn").first().click(),
  ]);
}

test.describe("Authentication Suite (A01 - A15)", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("TEST A01: Login page loads with all required inputs and elements for guest", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("#login-email")).toBeVisible();
    await expect(page.locator("#login-password")).toBeVisible();
    await expect(page.locator("#login-submit-btn")).toBeVisible();
    await expect(page.locator("text=Sign in to your account").first()).toBeVisible();
  });

  test("TEST A02: Valid customer login succeeds, creates session, and redirects to /account", async ({ page }) => {
    await loginUser(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, /\/account/);
    await expect(page).toHaveURL(/\/account/);
    await expect(page.locator("h1")).toContainText(/Welcome back|Dashboard|Overview|Account/i);

    // Verify session persistence on page reload
    await page.reload();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.locator("h1")).toContainText(/Welcome back|Dashboard|Overview|Account/i);
  });

  test("TEST A03: Valid moderator login succeeds and preserves session", async ({ page }) => {
    await loginUser(page, MODERATOR_EMAIL, MODERATOR_PASSWORD, /\/account|\/admin/);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test("TEST A04: Valid admin login succeeds and can access /admin dashboard", async ({ page }) => {
    await page.goto("/login?redirect=/admin");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("#login-email").fill(ADMIN_EMAIL);
    await page.locator("#login-password").fill(ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(/\/admin/, { timeout: 15000 }),
      page.locator("#login-submit-btn").click(),
    ]);

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("h1")).toContainText(/Store Analytics|Dashboard/i);
  });

  test("TEST A05: Invalid password is rejected with a meaningful error message", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("#login-email").fill(CUSTOMER_EMAIL);
    await page.locator("#login-password").fill("WrongIncorrectPassword999!");
    await page.locator("#login-submit-btn").click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.getByText("Invalid login credentials")).toBeVisible();
  });

  test("TEST A06: Nonexistent user email is rejected safely without leaking details", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("#login-email").first().fill("nonexistent.user.99988@fakeemail.com");
    await page.locator("#login-password").first().fill("RandomPassword123!");
    await page.locator("#login-submit-btn").first().click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.getByText("Invalid login credentials")).toBeVisible();
  });

  test("TEST A07 & A08: Empty and malformed email inputs trigger browser/form validation", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    // Click submit with empty form
    await page.locator("#login-submit-btn").click();
    // HTML5 validation prevents submission, page stays on /login
    await expect(page).toHaveURL(/\/login/);

    // Test malformed email
    await page.locator("#login-email").fill("invalid-email-no-at-domain");
    await page.locator("#login-password").fill("SomePass123!");
    await page.locator("#login-submit-btn").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("TEST A09: Login session persistence across internal storefront navigation", async ({ page }) => {
    await loginUser(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, /\/account/);
    await expect(page).toHaveURL(/\/account/);

    // Navigate to homepage
    await page.goto("/");
    await expect(page.locator("h1, h2, a").first()).toBeVisible();

    // Navigate back to account without re-authenticating
    await page.goto("/account/orders");
    await expect(page).toHaveURL(/\/account\/orders/);
  });

  test("TEST A10 & A11: Logout invalidates session and blocks protected routes from re-opening", async ({ page }) => {
    // 1. Log in
    await loginUser(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, /\/account/);
    await expect(page).toHaveURL(/\/account/);

    // 2. Click Logout button in customer account layout
    const logoutBtn = page.locator('aside button:has-text("Logout"), button:has-text("Logout")').first();
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 3. User redirected to login
    await expect(page).toHaveURL(/\/login/);

    // 4. Directly attempting protected route /account must redirect back to /login
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?redirect=%2Faccount/);

    // 5. Back navigation must not grant protected access
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
  });

  test("TEST A14: Protected route deep link preserves return URL in redirect query parameter", async ({ page }) => {
    // Guest attempts to visit /account/orders
    await page.goto("/account/orders");
    await expect(page).toHaveURL(/\/login\?redirect=%2Faccount%2Forders/);

    // Enter credentials
    await page.locator("#login-email").fill(CUSTOMER_EMAIL);
    await page.locator("#login-password").fill(CUSTOMER_PASSWORD);
    await Promise.all([
      page.waitForURL(/\/account\/orders/, { timeout: 15000 }),
      page.locator("#login-submit-btn").click(),
    ]);

    // Should return to intended page
    await expect(page).toHaveURL(/\/account\/orders/);
  });

  test("TEST A15: Already authenticated customer visiting /login is redirected away to /account", async ({ page }) => {
    // 1. Log in
    await loginUser(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, /\/account/);
    await expect(page).toHaveURL(/\/account/);

    // 2. Try visiting /login while logged in
    await page.goto("/login");
    await expect(page).toHaveURL(/\/account/);
  });
});
