import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { PIMPage } from "../pages/PIMPage";

test("fill and save the PIM employee form", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginAndWaitForDashboard("Admin", "admin123");

  const pimPage = new PIMPage(page);
  await pimPage.openAddEmployeePage();

  const employee = {
    firstName: "Bilol",
    middleName: "Test",
    lastName: `Employee${Date.now()}`,
    employeeId: String(Date.now()).slice(-6),
  };

  await pimPage.fillEmployeeForm(employee);
  await pimPage.saveEmployee();
  await pimPage.assertEmployeeSaved(employee);
});
