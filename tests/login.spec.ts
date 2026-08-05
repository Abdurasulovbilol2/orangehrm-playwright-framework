import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("successful login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login("Admin", "admin123");

  await expect(page).toHaveURL(/dashboard\/index/);
  await expect(
    page.locator("h6.oxd-topbar-header-breadcrumb-module"),
  ).toContainText("Dashboard");
});
