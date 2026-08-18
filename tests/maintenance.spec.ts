import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MaintenancePage } from "../pages/MaintenancePage";

test("open maintenance page with password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const maintenancePage = new MaintenancePage(page);
  await maintenancePage.openMaintenancePage("admin123");

  await expect(page).toHaveURL(
    /maintenance\/(viewMaintenanceModule|purgeEmployee)/,
  );
});
