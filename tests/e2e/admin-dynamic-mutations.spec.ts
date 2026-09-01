import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@ecomxbangladesh.com";
const ADMIN_PASSWORD = "AdminPassword123!";

async function loginAdmin(page: Page) {
  await page.goto("/login?redirect=%2Fadmin");
  await page.waitForLoadState("domcontentloaded");
  await page.locator("#login-email").first().fill(ADMIN_EMAIL);
  await page.locator("#login-password").first().fill(ADMIN_PASSWORD);
  await Promise.all([
    page.waitForURL(/\/admin/, { timeout: 15000 }),
    page.locator("#login-submit-btn").first().click(),
  ]);
  await page.waitForLoadState("domcontentloaded");
}

test.describe("Dynamic Admin Modules — Live Functional Mutations & Interactive Actions", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
    await loginAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
  });

  test("1. Module Hub — Toggle module status dynamically", async ({ page }) => {
    await page.goto("/admin/settings/modules");
    await page.waitForLoadState("domcontentloaded");

    // Check that module cards are loaded
    await expect(page.getByRole("heading", { name: "Cloudinary" })).toBeVisible();

    // Toggle a checkbox in one of the module cards
    const checkbox = page.locator("input[type='checkbox']").first();
    await expect(checkbox).toBeAttached();
    await checkbox.click({ force: true });

    // Verify page state remained intact without error alerts
    await expect(page.locator("h1")).toContainText(/Dynamic Feature Modules & Integrations/i);
  });

  test("2. Feature Flags — Toggle storefront feature flag dynamically", async ({ page }) => {
    await page.goto("/admin/settings/features");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { name: "Product Reviews" })).toBeVisible();

    const checkbox = page.locator("input[type='checkbox']").first();
    await expect(checkbox).toBeAttached();
    await checkbox.click({ force: true });

    // Verify header updates
    await expect(page.locator("h1")).toContainText(/Storefront Feature Flags/i);
  });

  test("3. Store Settings — Update store details & save configuration dynamically", async ({ page }) => {
    await page.goto("/admin/settings/store");
    await page.waitForLoadState("domcontentloaded");

    const storeNameInput = page.locator("input[type='text']").first();
    await expect(storeNameInput).toBeVisible();
    await storeNameInput.fill("ecomXbangladesh Official Store");

    const saveButton = page.getByRole("button", { name: /Save Store Settings/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verify success banner appears
    await expect(page.getByText(/Store settings have been updated and cached successfully!/i)).toBeVisible({
      timeout: 7000,
    });
  });

  test("4. Payment Settings — Update Cash on Delivery rules dynamically", async ({ page }) => {
    await page.goto("/admin/payments/cod");
    await page.waitForLoadState("domcontentloaded");

    const minAmountInput = page.locator("input[name='min_amount']");
    await expect(minAmountInput).toBeVisible();
    await minAmountInput.fill("100");

    const saveButton = page.getByRole("button", { name: /Save COD Settings/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Wait for form submission to complete
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("heading", { name: /Monetary Thresholds & Surcharges/i })).toBeVisible();
  });

  test("5. System Health — Run live connectivity diagnostic probe", async ({ page }) => {
    await page.goto("/admin/settings/system-health");
    await page.waitForLoadState("domcontentloaded");

    const probeButton = page.getByRole("button", { name: /Run Health Check/i });
    await expect(probeButton).toBeVisible();
    await probeButton.click();

    // Verify diagnostic probe completes and renders operational status badges
    await expect(page.getByText(/PostgreSQL Database \(Supabase\)/i)).toBeVisible();
    await expect(page.getByText(/Operating nominally/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("6. Customer Returns — Loads RMA table and inspect modal", async ({ page }) => {
    await page.goto("/admin/returns");
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/admin\/returns/);
    await expect(page.locator("h1")).toContainText(/Customer Returns & RMA Management/i);
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText("Total Requests")).toBeVisible();

    // Inspect first return request
    const inspectBtn = page.getByRole("button", { name: /Inspect/i }).first();
    await expect(inspectBtn).toBeVisible();
    await inspectBtn.click();
    await expect(page.getByText(/Return RMA Inspection/i)).toBeVisible();
  });

  test("7. Order Tracking Hub — Loads shipments and allows sync", async ({ page }) => {
    await page.goto("/admin/orders/tracking");
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/admin\/orders\/tracking/);
    await expect(page.locator("h1")).toContainText(/Logistics & Order Tracking Hub/i);
    const syncBtn = page.getByRole("button", { name: /Sync Couriers/i });
    await expect(syncBtn).toBeVisible();
    await syncBtn.click();
    await expect(page.getByText(/Milestone Telemetry/i).first()).toBeAttached();
  });

  test("8. CMS Static Pages — Displays pages directory and allows creating/editing", async ({ page }) => {
    await page.goto("/admin/pages");
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/admin\/pages/);
    await expect(page.locator("h1")).toContainText(/CMS Static Content & Legal Pages/i);
    const createBtn = page.getByRole("button", { name: /Create New Page/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    await expect(page.getByText(/Create New Static Page/i)).toBeVisible();
  });
});
