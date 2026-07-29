import { Page } from "@playwright/test";
import { mockUser, mockAdmin, mockTutor } from "./mockData";

/**
 * Sets an auth cookie so that UserContext resolves to the given user.
 * We intercept the /api/users/me endpoint so Next.js server actions
 * that call getTokenCookie() + getUserAction() return the mock user.
 */
export async function loginAs(
  page: Page,
  role: "student" | "tutor" | "admin" = "student"
) {
  const userMap = {
    student: mockUser,
    tutor: mockTutor,
    admin: mockAdmin,
  };
  const user = userMap[role];

  // Set a fake auth token cookie
  await page.context().addCookies([
    {
      name: "access_token",
      value: `fake-jwt-token-${role}`,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
    },
  ]);

  // Intercept the /api/users/me backend call
  await page.route("**/api/users/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: user,
      }),
    });
  });

  // Intercept Next.js server action calls for user data
  await page.route("**/api/users/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: user }),
    });
  });

  return user;
}

/**
 * Clears auth state (logout scenario).
 */
export async function clearAuth(page: Page) {
  await page.context().clearCookies();
}

/**
 * Intercepts an API endpoint with a mock response.
 */
export async function mockApiRoute(
  page: Page,
  urlPattern: string,
  responseBody: unknown,
  status = 200
) {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(responseBody),
    });
  });
}

/**
 * Intercept all backend API calls with a generic success response.
 * Useful as a catch-all before specific mocks.
 */
export async function mockAllApiCalls(page: Page) {
  await page.route("**/api/**", async (route) => {
    // Let already-matched routes pass through
    await route.continue();
  });
}
