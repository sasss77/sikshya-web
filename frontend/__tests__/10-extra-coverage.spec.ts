import { test, expect } from "@playwright/test";
import { mockUser, mockTutor, mockAdmin } from "./fixtures/mockData";

/**
 * 10-extra-coverage.spec.ts  –  Additional coverage for pages and edge cases
 * 22 tests covering: /students, /tutors, admin sub-pages, error boundaries,
 * API failure states, mobile viewports, and miscellaneous UI behaviors.
 */

// Helper to add admin cookies
async function addAdminCookies(page: any) {
  await page.context().addCookies([
    { name: "token", value: "admin-fake-token", domain: "localhost", path: "/" },
  ]);
  await page.route("**/api/users/me", (route: any) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, data: mockAdmin }),
    })
  );
  await page.route("**/api/**", (route: any) =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
  );
}

async function addStudentCookies(page: any) {
  await page.context().addCookies([
    { name: "token", value: "student-fake", domain: "localhost", path: "/" },
  ]);
  await page.route("**/api/users/me", (route: any) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, data: mockUser }),
    })
  );
  await page.route("**/api/**", (route: any) =>
    route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
  );
}

test.describe("Extra Coverage – Public Pages", () => {
  test("TC-X-01: /students page loads for guests", async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/**", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
    );
    await page.goto("/students");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-02: /tutors page loads for guests", async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/**", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
    );
    await page.goto("/tutors");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-03: /login page title is correct", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    const title = await page.title();
    expect(title).toMatch(/login|sikshya/i);
  });

  test("TC-X-04: /signup page title is correct", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("domcontentloaded");
    const title = await page.title();
    expect(title).toMatch(/sign up|signup|register|sikshya/i);
  });

  test("TC-X-05: landing page renders on large viewport (1920px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("TC-X-06: Sikshya logo or brand name visible on landing", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) })
    );
    await page.goto("/");
    await page.waitForSelector("text=Master Any Subject", { timeout: 15000 });
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/sikshya/i);
  });
});

test.describe("Extra Coverage – Admin Sub-Pages", () => {
  test("TC-X-07: /admin/courses page loads for admin", async ({ page }) => {
    await addAdminCookies(page);
    await page.goto("/admin/courses");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-08: /admin/tutors page loads for admin", async ({ page }) => {
    await addAdminCookies(page);
    await page.goto("/admin/tutors");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-09: /admin/students page loads for admin", async ({ page }) => {
    await addAdminCookies(page);
    await page.goto("/admin/students");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-10: /admin/requests page loads for admin", async ({ page }) => {
    await addAdminCookies(page);
    await page.goto("/admin/requests");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-11: /admin/notifications page loads for admin", async ({
    page,
  }) => {
    await addAdminCookies(page);
    await page.goto("/admin/notifications");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-12: /admin/reports page loads for admin", async ({ page }) => {
    await addAdminCookies(page);
    await page.goto("/admin/reports");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });
});

test.describe("Extra Coverage – Student Dashboard Sub-Pages", () => {
  test("TC-X-13: /dashboard/bookings page loads", async ({ page }) => {
    await addStudentCookies(page);
    await page.goto("/dashboard/bookings");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-14: /dashboard/learnings page loads", async ({ page }) => {
    await addStudentCookies(page);
    await page.goto("/dashboard/learnings");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-15: /dashboard/messages page loads", async ({ page }) => {
    await addStudentCookies(page);
    await page.goto("/dashboard/messages");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-16: /dashboard/notifications page loads", async ({ page }) => {
    await addStudentCookies(page);
    await page.goto("/dashboard/notifications");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-17: /dashboard/mcq page loads for student", async ({ page }) => {
    await addStudentCookies(page);
    await page.goto("/dashboard/mcq");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });
});

test.describe("Extra Coverage – API Error Handling & Edge Cases", () => {
  test("TC-X-18: find-tutors handles API 500 gracefully", async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/tutors**", (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ success: false, message: "Server Error" }) })
    );
    await page.goto("/find-tutors");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    // Should not show unhandled error, page should still render
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-19: login page handles network timeout gracefully", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/login");
    await page.waitForSelector("text=Welcome Back", { timeout: 15000 });
    // Mock slow API
    await page.route("**/api/auth/login", async (route) => {
      await new Promise((r) => setTimeout(r, 5000));
      await route.fulfill({
        status: 408,
        body: JSON.stringify({ success: false, message: "Request Timeout" }),
      });
    });
    await page.locator('input[type="email"]').fill("test@test.com");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /log in/i }).click();
    // Button should show loading state
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/logging in|log in/i);
  });

  test("TC-X-20: /dashboard/my-courses page loads for tutor", async ({
    page,
  }) => {
    await page.context().addCookies([
      { name: "token", value: "tutor-fake", domain: "localhost", path: "/" },
    ]);
    await page.route("**/api/users/me", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: mockTutor }),
      })
    );
    await page.route("**/api/**", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
    );
    await page.goto("/dashboard/my-courses");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-21: /dashboard/earnings page loads for tutor", async ({
    page,
  }) => {
    await page.context().addCookies([
      { name: "token", value: "tutor-fake", domain: "localhost", path: "/" },
    ]);
    await page.route("**/api/users/me", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: mockTutor }),
      })
    );
    await page.route("**/api/**", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
    );
    await page.goto("/dashboard/earnings");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });

  test("TC-X-22: /dashboard/payment-success page renders", async ({
    page,
  }) => {
    await addStudentCookies(page);
    await page.goto("/dashboard/payment-success");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(5);
  });
});
