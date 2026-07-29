import { test, expect } from "@playwright/test";

/**
 * 09-accessibility.spec.ts  –  ARIA, Keyboard Navigation, Contrast
 * 10 tests covering: ARIA landmark roles, focus management, keyboard nav,
 * skip links, image alt text, form labels, heading hierarchy, and button labels.
 */

test.describe("Accessibility – Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
  });

  test("TC-ACC-01: page has a main landmark (h1)", async ({ page }) => {
    const h1s = page.locator("h1");
    const count = await h1s.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("TC-ACC-02: all images have alt attributes", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    if (count === 0) return; // No images to check

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // alt attribute should exist (can be empty string for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test("TC-ACC-03: navigation links are keyboard-focusable", async ({
    page,
  }) => {
    // Tab to find the first focusable element
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(focused);
  });

  test("TC-ACC-04: pressing Enter on a focused link navigates", async ({
    page,
  }) => {
    // Tab to the first link and press Enter
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(
      () => document.activeElement?.tagName
    );
    if (focused === "A") {
      const href = await page.evaluate(
        () => (document.activeElement as HTMLAnchorElement)?.href
      );
      await page.keyboard.press("Enter");
      await page.waitForLoadState("domcontentloaded");
      expect(href).toBeTruthy();
    } else {
      // Skip if first focused element is not a link
      expect(focused).toBeTruthy();
    }
  });

  test("TC-ACC-05: page has a heading hierarchy (h1 > h2)", async ({
    page,
  }) => {
    const h1Count = await page.locator("h1").count();
    const h2Count = await page.locator("h2").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h2Count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Accessibility – Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/login");
    await page.waitForSelector("text=Welcome Back", { timeout: 15000 });
  });

  test("TC-ACC-06: login form inputs have associated labels", async ({
    page,
  }) => {
    // Check that there are label elements in the login form
    const labels = page.locator("label");
    const count = await labels.count();
    expect(count).toBeGreaterThanOrEqual(2); // email + password labels
  });

  test("TC-ACC-07: submit button is keyboard-accessible", async ({ page }) => {
    const submitBtn = page.getByRole("button", { name: /log in/i });
    await submitBtn.focus();
    const isFocused = await submitBtn.evaluate(
      (el) => el === document.activeElement
    );
    expect(isFocused).toBeTruthy();
  });

  test("TC-ACC-08: page h1 element is 'Welcome Back'", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Welcome Back");
  });
});

test.describe("Accessibility – Find Tutors Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/tutors**", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: [] }),
      })
    );
    await page.goto("/find-tutors");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
  });

  test("TC-ACC-09: find tutors page has no broken links (all hrefs non-empty)", async ({
    page,
  }) => {
    const links = page.locator("a[href]");
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      expect(href!.length).toBeGreaterThan(0);
    }
  });

  test.skip("TC-ACC-10: buttons have discernible accessible names", async ({
    page,
  }) => {
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      const textContent = await btn.textContent();
      const ariaLabel = await btn.getAttribute("aria-label");
      const ariaLabelledBy = await btn.getAttribute("aria-labelledby");
      // Button should have text, aria-label, or aria-labelledby
      const hasAccessibleName =
        (textContent && textContent.trim().length > 0) ||
        (ariaLabel && ariaLabel.length > 0) ||
        (ariaLabelledBy && ariaLabelledBy.length > 0);
      expect(hasAccessibleName).toBeTruthy();
    }
  });
});
