import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AdminPage } from "../pages/AdminPage";

test("open admin page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.login("Admin", "admin123");

  const adminPage = new AdminPage(page);
  await adminPage.openAdminPage();

  await expect(page).toHaveURL(/admin/);
});
