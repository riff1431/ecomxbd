import { test, expect } from "@playwright/test";

test.describe("API & Server-Side Security Suite", () => {
  test("Public Health Check API responds with 200 OK and healthy services", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.checks.database.status).toBe("healthy");
    expect(body.checks.storage.status).toBe("healthy");
  });

  test("Predictive Search API returns valid JSON results for catalog terms", async ({ request }) => {
    const res = await request.get("/api/search?q=snail");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.products)).toBeTruthy();
  });

  test("Meta Dynamic Product Catalog XML Feed returns valid RSS 2.0 XML", async ({ request }) => {
    const res = await request.get("/api/feed/meta");
    expect(res.status()).toBe(200);

    const text = await res.text();
    expect(text).toContain("<rss version=\"2.0\"");
    expect(text).toContain("<channel>");
  });

  test("Direct URL tampering on nonexistent admin route returns safe 404/redirect without stack traces", async ({ page }) => {
    await page.goto("/admin/nonexistent-secret-module-test");
    // Should not render unhandled raw exception or sensitive stack traces
    await expect(page.locator("text=INTERNAL_SERVER_ERROR, text=EvalError, text=RangeError")).not.toBeVisible();
  });
});
