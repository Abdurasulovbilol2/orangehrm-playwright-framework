import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("verify all available job details fields", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.openJobDetails();
  await myInfoPage.assertJobDetailsLoaded();
  await myInfoPage.openEmploymentContractDetails();
});
