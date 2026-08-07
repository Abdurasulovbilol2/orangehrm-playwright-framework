import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AdminPage } from "../pages/AdminPage";

test("open admin page", async ({ page }) => {
  test.setTimeout(60000);

  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const adminPage = new AdminPage(page);
  await adminPage.openAdminPage();

  await expect(page).toHaveURL(/admin/);
});

test("click Add and select user role", async ({ page }) => {
  test.setTimeout(60000);

  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const adminPage = new AdminPage(page);
  await adminPage.openAdminPage();
  await adminPage.clickAddButton();
  await adminPage.selectUserRole("Admin");
  await adminPage.fillEmployeeName("charifa bel belgueroua");
  await adminPage.selectstatus("Enabled");
  await adminPage.fillUsername("Bilol.test111");
  await adminPage.Choosepassword("Bilolafghan1@");

  await expect(
    page.locator(".oxd-form .oxd-select-text").first(),
  ).toContainText("Admin");
});
