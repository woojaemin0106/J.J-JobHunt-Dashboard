import { expect, test } from "@playwright/test";

test("guest app bootstrap redirects to login @smoke", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId("guest-login-button")).toBeVisible();
  await expect(page.getByTestId("login-submit-button")).toBeVisible();
  await page.getByTestId("guest-login-button").click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/statistics");
  await expect(page).toHaveURL(/\/statistics$/);
});
