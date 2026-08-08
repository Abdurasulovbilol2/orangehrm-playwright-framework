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
    firstName: "Bilol",
    middleName: "Abdurasul",
    lastName: "Abdurasul",
  };
  const updatedEmployeeId = "1011";

  await myInfoPage.fillPersonalNameDetails(updatedDetails);
  await myInfoPage.fillEmployeeId(updatedEmployeeId);
  await myInfoPage.savePersonalDetails();

  const employeeName = await myInfoPage.getEmployeeName();
  const employeeId = await myInfoPage.getEmployeeId();

  await expect(employeeName.firstName).toBe(updatedDetails.firstName);
  await expect(employeeName.middleName).toBe(updatedDetails.middleName);
  await expect(employeeName.lastName).toBe(updatedDetails.lastName);
  await expect(employeeId).toBe(updatedEmployeeId);
});
