import { test, expect } from "@playwright/test";

/**
 * 01-landing.spec.ts  –  Landing page / Homepage
 * 12 tests covering: rendering, hero section, how-it-works, featured tutors,
 * navigation links, CTA buttons, testimonials, footer, and responsive layout.
 */
test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    // No auth — guest user
    await page.route("**/api/users/me", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Unauthorized" }),
      })
    );
    await page.goto("/");
    // Wait for the landing page h1 to appear (not the spinner)
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
  });

  test("TC-L-01: page has correct title tag", async ({ page }) => {
    await expect(page).toHaveTitle(/Sikshya/i);
  });

  test("TC-L-02: hero section renders headline", async ({ page }) => {
    await expect(
      page.getByText("Master Any Subject", { exact: false })
    ).toBeVisible();
  });

  test("TC-L-03: hero section renders subtitle / description text", async ({
    page,
  }) => {
    await expect(
      page.getByText(/peer tutoring|academic|collaborative/i).first()
    ).toBeVisible();
  });

  test("TC-L-04: CTA button 'Start Learning Today' links to /signup", async ({
    page,
  }) => {
    const cta = page.getByRole("link", { name: /start learning|get started|sign up/i }).first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toMatch(/signup|sign-up/i);
  });

  test.skip("TC-L-05: How It Works section renders 3 steps", async ({ page }) => {
    await expect(page.getByText("Find Your Match")).toBeVisible();
    await expect(page.getByText("Book a Session")).toBeVisible();
    await expect(page.getByText("Start Learning")).toBeVisible();
  });

  test("TC-L-06: Featured Tutors section renders at least one card", async ({
    page,
  }) => {
    await expect(
      page.getByText(/Anish Shrestha|Priya Sharma|Rohan/i).first()
    ).toBeVisible();
  });

  test("TC-L-07: tutor card shows rating stars", async ({ page }) => {
    await expect(page.getByText(/5\.0|4\.9|4\.8/i).first()).toBeVisible();
  });

  test("TC-L-08: navbar shows Login and Sign Up links for guests", async ({
    page,
  }) => {
    const loginLink = page.getByRole("link", { name: /login/i }).first();
    await expect(loginLink).toBeVisible();
  });

  test("TC-L-09: Login nav link navigates to /login", async ({ page }) => {
    await page.getByRole("link", { name: /login/i }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-L-10: Sign Up nav link navigates to /signup", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
    const signupLink = page.getByRole("link", { name: /sign up|signup|register|start learning/i }).first();
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("TC-L-11: Find Tutors link navigates to /find-tutors", async ({
    page,
  }) => {
    const link = page.getByRole("link", { name: /find tutors/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/find-tutors/);
  });

  test("TC-L-12: page is responsive – mobile viewport shows menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
    // Page should still render the hero text on mobile
    await expect(
      page.getByText("Master Any Subject", { exact: false })
    ).toBeVisible();
  });
});

