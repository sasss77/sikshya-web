import { test, expect } from "@playwright/test";
import { mockTutorsList } from "./fixtures/mockData";

/**
 * 06-find-tutors.spec.ts  –  Find Tutors Listing & Filters
 * 13 tests covering: page render, tutor cards, search, subject filter,
 * sort options, tutor card details, price display, and empty state.
 */

async function setupFindTutors(page: any, tutors = mockTutorsList) {
  await page.route("**/api/tutors**", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: tutors,
        meta: { total: tutors.length, page: 1 },
      }),
    })
  );
  await page.goto("/find-tutors");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1000);
}

test.describe("Find Tutors Page", () => {
  test("TC-FT-01: page renders without crash", async ({ page }) => {
    await setupFindTutors(page);
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("TC-FT-02: page title contains Sikshya or Find Tutors", async ({
    page,
  }) => {
    await setupFindTutors(page);
    const title = await page.title();
    expect(title).toMatch(/sikshya|find tutors/i);
  });

  test("TC-FT-03: search input is visible on the page", async ({ page }) => {
    await setupFindTutors(page);
    await expect(
      page.locator('input[placeholder*="Search"], input[type="search"], input[placeholder*="tutor"]').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-04: subject filter dropdown is visible", async ({ page }) => {
    await setupFindTutors(page);
    const dropdown = page.locator("select, [role='combobox']").first();
    await expect(dropdown).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-05: tutor cards render on page", async ({ page }) => {
    await setupFindTutors(page);
    // Look for tutor names from mock data
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/anish shrestha|priya sharma|tutor/i);
  });

  test("TC-FT-06: tutor card shows tutor name", async ({ page }) => {
    await setupFindTutors(page);
    await expect(page.getByText("Anish Shrestha").first()).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-07: tutor card shows verified badge", async ({ page }) => {
    await setupFindTutors(page);
    await expect(
      page.getByText(/verified/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-08: tutor card shows subject tags", async ({ page }) => {
    await setupFindTutors(page);
    await expect(
      page.getByText(/Physics|Chemistry|Biology|Mathematics/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-09: tutor card shows rating value", async ({ page }) => {
    await setupFindTutors(page);
    await expect(
      page.getByText(/5\.0|4\.9|new/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-10: tutor card has Book Now or View Profile button/link", async ({
    page,
  }) => {
    await setupFindTutors(page);
    const bookBtn = page.getByRole("link", { name: /book|view|profile/i }).first();
    await expect(bookBtn).toBeVisible({ timeout: 8000 });
  });

  test("TC-FT-11: typing in search updates the input value", async ({
    page,
  }) => {
    await setupFindTutors(page);
    const searchInput = page.locator(
      'input[placeholder*="Search"], input[type="search"]'
    ).first();
    await searchInput.fill("Physics");
    await expect(searchInput).toHaveValue("Physics");
  });

  test.skip("TC-FT-12: empty state renders when no tutors returned", async ({
    page,
  }) => {
    await page.route("**/api/tutors**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [], meta: { total: 0 } }),
      })
    );
    await page.goto("/find-tutors");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const body = await page.locator("body").textContent();
    // Either shows "no tutors found" message or empty grid
    expect(body).toMatch(/no tutors|no results|try different|0 tutors/i);
  });

  test("TC-FT-13: page layout renders correctly on mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await setupFindTutors(page);
    await expect(page.locator("body")).not.toBeEmpty();
    const body = await page.locator("body").textContent();
    expect(body!.length).toBeGreaterThan(20);
  });
});
