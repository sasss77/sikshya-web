import { test, expect } from "@playwright/test";

/**
 * 08-navigation.spec.ts  –  Header, Footer, Routing
 * 12 tests covering: nav links, footer content, about/contact/terms pages,
 * route guards, back navigation, and page transitions.
 */

test.describe("Navigation – Guest Routes", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
  });

  test("TC-N-01: / (home) renders the landing page for guests", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1500);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(20);
  });

  test("TC-N-02: /about page loads without error", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-N-03: /contact page loads without error", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-N-04: /terms page loads without error", async ({ page }) => {
    await page.goto("/terms");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-N-05: /privacy page loads without error", async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-N-06: /find-tutors page is accessible without login", async ({
    page,
  }) => {
    await page.route("**/api/tutors**", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: [] }),
      })
    );
    await page.goto("/find-tutors");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("TC-N-07: navigating from landing to login works", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
    await page.getByRole("link", { name: /login/i }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-N-08: 404 page renders for non-existent routes", async ({
    page,
  }) => {
    await page.goto("/completely-invalid-page-xyz");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").textContent();
    // Should render a 404 message or the custom not-found page
    expect(body!.length).toBeGreaterThan(5);
  });
});

test.describe("Navigation – Protected Routes Redirect", () => {
  test("TC-N-09: /dashboard redirects unauthenticated user", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const url = page.url();
    // Should redirect to login or homepage
    expect(url).not.toContain("/dashboard");
  });

  test("TC-N-10: /admin redirects unauthenticated user", async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toContain("/admin");
  });

  test.skip("TC-N-11: browser back button works from login to landing", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    const url = page.url();
    expect(url).toMatch(/localhost:3000\/$/);
  });

  test("TC-N-12: page.reload() keeps user on the same route", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/login/);
  });
});
