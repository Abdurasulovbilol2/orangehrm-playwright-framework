import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("successful login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");
});
