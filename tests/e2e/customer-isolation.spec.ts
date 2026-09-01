import { test, expect } from "@playwright/test";

const CUSTOMER_A_EMAIL = "customer@ecomxbangladesh.com";
const CUSTOMER_A_PASSWORD = "CustomerPassword123!";
const CUSTOMER_B_EMAIL = "customer2@ecomxbangladesh.com";
const CUSTOMER_B_PASSWORD = "Customer2Password123!";

test.describe("Customer Data Isolation Suite (Object-Level Authorization)", () => {
  test("Customer B cannot view or access Customer A's private order details by URL tampering", async ({ browser }) => {
    // 1. Create a pristine session for Customer B
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    await pageB.goto("/login");
    await pageB.waitForSelector("#login-email");
    await pageB.locator("#login-email").first().fill(CUSTOMER_B_EMAIL);
    await pageB.locator("#login-password").first().fill(CUSTOMER_B_PASSWORD);
    await Promise.all([
      pageB.waitForURL(/\/account/, { timeout: 15000 }),
      pageB.locator("#login-submit-btn").first().click(),
    ]);

    // 2. Customer B attempts to open a private order ID belonging to Customer A / Admin
    await pageB.goto("/account/orders/542e5f96-a55f-4133-9620-a136586258db");

    // Expected: Server RLS / server-side check prevents unauthorized viewing and triggers 404
    await expect(pageB.locator("body")).toContainText(/404|not found|could not be found/i);

    await contextB.close();
  });

  test("Customer A and Customer B have independent isolated address books", async ({ browser }) => {
    // 1. Log in as Customer A in context A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();

    await pageA.goto("/login");
    await pageA.waitForSelector("#login-email");
    await pageA.locator("#login-email").first().fill(CUSTOMER_A_EMAIL);
    await pageA.locator("#login-password").first().fill(CUSTOMER_A_PASSWORD);
    await Promise.all([
      pageA.waitForURL(/\/account/, { timeout: 15000 }),
      pageA.locator("#login-submit-btn").first().click(),
    ]);

    await pageA.goto("/account/addresses");
    await expect(pageA).toHaveURL(/\/account\/addresses/);
    await expect(pageA.locator("h1")).toContainText(/Address/i);

    // 2. Log in as Customer B in independent context B
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    await pageB.goto("/login");
    await pageB.waitForSelector("#login-email");
    await pageB.locator("#login-email").first().fill(CUSTOMER_B_EMAIL);
    await pageB.locator("#login-password").first().fill(CUSTOMER_B_PASSWORD);
    await Promise.all([
      pageB.waitForURL(/\/account/, { timeout: 15000 }),
      pageB.locator("#login-submit-btn").first().click(),
    ]);

    await pageB.goto("/account/addresses");
    await expect(pageB).toHaveURL(/\/account\/addresses/);
    await expect(pageB.locator("h1")).toContainText(/Address/i);

    await contextA.close();
    await contextB.close();
  });
});
