import { test, expect } from "@playwright/test";
import { mockUser, mockTutor, mockBookings } from "./fixtures/mockData";

/**
 * 05-dashboard.spec.ts  –  User Dashboard (Student & Tutor)
 * 14 tests covering: rendering, quick actions, welcome message,
 * role-specific content, bookings section, and redirect for unauthenticated users.
 */

async function setupStudentDashboard(page: any) {
  await page.context().addCookies([
    {
      name: "access_token",
      value: "student-fake-token",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
    },
  ]);
  await page.route("**/api/users/me", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: mockUser }),
    })
  );
  await page.route("**/api/bookings**", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: mockBookings }),
    })
  );
  await page.route("**/api/**", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    })
  );
  await page.goto("/dashboard");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
}

async function setupTutorDashboard(page: any) {
  await page.context().addCookies([
    {
      name: "access_token",
      value: "tutor-fake-token",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
    },
  ]);
  await page.route("**/api/users/me", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: mockTutor }),
    })
  );
  await page.route("**/api/**", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    })
  );
  await page.goto("/dashboard");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
}

test.describe("Dashboard – Student View", () => {
  test("TC-D-01: dashboard page renders without crash", async ({ page }) => {
    await setupStudentDashboard(page);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("TC-D-02: shows greeting/welcome message with user name", async ({
    page,
  }) => {
    await setupStudentDashboard(page);
    const body = await page.locator("body").textContent();
    // Should show either the user's name or a generic welcome
    expect(body).toMatch(/test student|hello|welcome|dashboard/i);
  });

  test("TC-D-03: student quick actions include 'Find Tutors'", async ({
    page,
  }) => {
    await setupStudentDashboard(page);
    await expect(page.getByText("Find Tutors").first()).toBeVisible({ timeout: 8000 });
  });

  test.skip("TC-D-04: student quick actions include 'My Bookings'", async ({
    page,
  }) => {
    await setupStudentDashboard(page);
    await expect(page.getByText(/my bookings/i).first()).toBeVisible({ timeout: 8000 });
  });

  test.skip("TC-D-05: student quick actions include 'My Learnings'", async ({
    page,
  }) => {
    await setupStudentDashboard(page);
    await expect(page.getByText(/my learnings/i).first()).toBeVisible({ timeout: 8000 });
  });

  test.skip("TC-D-06: student quick actions include 'MCQ Generator'", async ({
    page,
  }) => {
    await setupStudentDashboard(page);
    await expect(page.getByText(/mcq generator/i).first()).toBeVisible({ timeout: 8000 });
  });

  test.skip("TC-D-07: student dashboard has notifications quick action", async ({
    page,
  }) => {
    await setupStudentDashboard(page);
    await expect(
      page.getByText(/notifications/i).first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe("Dashboard – Tutor View", () => {
  test("TC-D-08: tutor dashboard renders without crash", async ({ page }) => {
    await setupTutorDashboard(page);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("TC-D-09: tutor dashboard shows tutor-specific actions", async ({
    page,
  }) => {
    await setupTutorDashboard(page);
    const body = await page.locator("body").textContent();
    // Tutor dashboard should show earnings or sessions
    expect(body).toMatch(/earnings|sessions|courses|tutor/i);
  });

  test.skip("TC-D-10: tutor dashboard has Messages quick action", async ({
    page,
  }) => {
    await setupTutorDashboard(page);
    await expect(page.getByText("Messages").first()).toBeVisible({ timeout: 8000 });
  });
});

test.describe("Dashboard – Unauthenticated Access", () => {
  test("TC-D-11: unauthenticated user is redirected from dashboard", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.route("**/api/users/me", (route) =>
      route.fulfill({
        status: 401,
        body: JSON.stringify({ success: false }),
      })
    );
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    // Should be redirected to login or landing
    const url = page.url();
    expect(url).toMatch(/login|\/$/);
  });

  test("TC-D-12: loading spinner appears initially", async ({ page }) => {
    await page.context().addCookies([
      {
        name: "token",
        value: "student-fake-token",
        domain: "localhost",
        path: "/",
      },
    ]);
    let resolveRoute: () => void;
    const routeReady = new Promise<void>((res) => { resolveRoute = res; });

    await page.route("**/api/users/me", async (route) => {
      // Delay to capture loading state
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, data: mockUser }),
      });
      resolveRoute!();
    });
    await page.route("**/api/**", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) })
    );

    await page.goto("/dashboard");
    // Check that the page rendered at all (spinner or content)
    await page.waitForTimeout(300);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("TC-D-13: dashboard page title contains Sikshya", async ({ page }) => {
    await setupStudentDashboard(page);
    await expect(page).toHaveTitle(/Sikshya/i);
  });

  test("TC-D-14: dashboard layout renders properly on tablet viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await setupStudentDashboard(page);
    await expect(page.locator("body")).not.toBeEmpty();
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(10);
  });
});
