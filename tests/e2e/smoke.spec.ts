import { expect, test } from "@playwright/test";

const demoEnabled = process.env.VITE_DEMO_ENABLED?.trim().toLowerCase() === "true";
const demoEmail = process.env.VITE_DEMO_EMAIL?.trim();
const demoPassword = process.env.VITE_DEMO_PASSWORD?.trim();
const hasDemoEnv = demoEnabled && Boolean(demoEmail) && Boolean(demoPassword);

test("guest app bootstrap redirects to login @smoke", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId("login-submit-button")).toBeVisible();

  await page.getByTestId("go-signup-link").click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByTestId("signup-page")).toBeVisible();
});

test("demo login reaches protected routes when demo env is configured @smoke", async ({
  page,
}) => {
  test.skip(!hasDemoEnv, "Demo env is not configured for this run.");

  await page.goto("/login");
  await expect(page.getByTestId("demo-login-button")).toBeVisible();

  await page.getByTestId("demo-login-button").click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/statistics");
  await expect(page).toHaveURL(/\/statistics$/);
});
