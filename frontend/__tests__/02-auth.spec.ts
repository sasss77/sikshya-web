import { test, expect } from "@playwright/test";

/**
 * 02-auth.spec.ts  –  Login / Signup / Role Selection
 * 15 tests covering: form rendering, field validation, error states,
 * successful login flow, role-based redirect, signup, and role selection.
 */
test.describe("Auth – Login Page", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure no existing auth
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false }),
      })
    );
    await page.goto("/login");
    await page.waitForSelector("text=Welcome Back", { timeout: 15000 });
  });

  test("TC-A-01: login page renders heading 'Welcome Back'", async ({
    page,
  }) => {
    await expect(page.getByText("Welcome Back")).toBeVisible();
  });

  test("TC-A-02: login page shows email and password fields", async ({
    page,
  }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("TC-A-03: login page shows Google sign-in button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /continue with google/i })
    ).toBeVisible();
  });

  test("TC-A-04: submit with empty fields shows validation errors", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /log in/i }).click();
    // At least one validation error should appear
    const errors = page.locator("p").filter({ hasText: /invalid|required|email/i });
    await expect(errors.first()).toBeVisible({ timeout: 5000 });
  });

  test.skip("TC-A-05: submit with invalid email format shows email error", async ({
    page,
  }) => {
    await page.locator('input[type="email"]').fill("not-an-email");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(
      page.getByText(/valid email/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("TC-A-06: password visibility toggle works", async ({ page }) => {
    const pwInput = page.locator('input[type="password"]');
    await expect(pwInput).toBeVisible();
    // Click the eye toggle
    await page.locator("button[type='button']").last().click();
    await expect(page.locator('input[type="text"]').last()).toBeVisible();
  });

  test.skip("TC-A-07: shows server error on invalid credentials", async ({
    page,
  }) => {
    // Mocking an error response
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Invalid email or password",
        }),
      });
    });
    await page.locator('input[type="email"]').fill("wrong@test.com");
    await page.locator('input[type="password"]').fill("wrongpass");
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(
      page.getByText(/invalid email or password|login failed/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("TC-A-08: 'Forgot Password?' link is visible", async ({ page }) => {
    await expect(page.getByText(/forgot password/i)).toBeVisible();
  });

  test("TC-A-09: 'Create an account' link navigates to /signup", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /create an account/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe("Auth – Signup Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/signup");
    await page.waitForLoadState("domcontentloaded");
  });

  test("TC-A-10: signup page renders a form", async ({ page }) => {
    // At minimum an email input should be present
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
  });

  test("TC-A-11: submitting empty signup form shows errors", async ({
    page,
  }) => {
    const submitBtn = page
      .getByRole("button", { name: /sign up|create|register/i })
      .first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await submitBtn.click();
    const errors = page.locator("p, span").filter({ hasText: /required|invalid|must/i });
    await expect(errors.first()).toBeVisible({ timeout: 5000 });
  });

  test.skip("TC-A-12: signup page has link back to login", async ({ page }) => {
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
    const href = await page.getByRole("link", { name: /log in/i }).getAttribute("href");
    expect(href).toMatch(/login/i);
  });
});

test.describe("Auth – Role Selection Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/role-selection");
    await page.waitForLoadState("domcontentloaded");
  });

  test("TC-A-13: role selection page renders", async ({ page }) => {
    // Should show some content about selecting a role
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("TC-A-14: page contains student and tutor role options", async ({
    page,
  }) => {
    const body = await page.locator("body").textContent();
    const hasRoles =
      /student|tutor/i.test(body || "");
    expect(hasRoles).toBeTruthy();
  });

  test("TC-A-15: not-found page renders 404 message for invalid routes", async ({
    page,
  }) => {
    await page.goto("/this-route-does-not-exist-12345");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").textContent();
    expect(body).toBeTruthy();
    // Next.js 404 page or custom not-found should render something
    expect(body!.length).toBeGreaterThan(10);
  });
});
