import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyInfoPage } from "../pages/MyInfoPage";

test("open my info and verify personal details", async ({ page }) => {
  test.setTimeout(60000);

  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const myInfoPage = new MyInfoPage(page);
  await myInfoPage.openMyInfoPage();
  await myInfoPage.assertPersonalDetailsLoaded();

  const updatedDetails = {
    firstName: "Paulo",
    middleName: "PedroQA",
    lastName: "PontesQA",
  };

  await myInfoPage.fillPersonalNameDetails(updatedDetails);
  await myInfoPage.savePersonalDetails();

  const employeeName = await myInfoPage.getEmployeeName();

  await expect(employeeName.firstName).toBe(updatedDetails.firstName);
  await expect(employeeName.middleName).toBe(updatedDetails.middleName);
  await expect(employeeName.lastName).toBe(updatedDetails.lastName);
});
